var assert = require('assert')

module.exports = new (function(){
  var db,
      btcd,
      syncing = null,
      tenant_name,
      seperator = ':'
  var that = this

  this.setup = function(_db, _btcd, _tenant) {
    db = _db
    btcd = _btcd
    set_tenant_name(_tenant.name)
    assert(tenant_name, "Bad or missing tenant name")
  }

  function set_tenant_name(name){
    if(name) {
      if(name.indexOf(seperator) == -1) {
        tenant_name = name
      }
    }
  }

  this.sync_mutex = function(){
    if(!syncing){
      that.sync()
    } else {
      console.error("!! Sync already started at "+syncing)
    }
  }

  this.sync = function(){
    syncing = new Date()
    db.load_block_hash(function(block_hash){
      btcd.unprocessed_transactions_since(block_hash, function(bitcoin){
        db.transaction(function(){
          var total = 0
          bitcoin.transactions.forEach(function(tx){
            if(that.is_tenant_account(tx.account)){
              var username = that.account_to_username(tx.account)
              that.add_user(username, function(){
                db.tx(tx.txid, function(_tx){
                  if(!_tx){
                    db.add_bitcoin_tx(tx)
                    total = total + 1                                  
                  }
                })
              })
            } else {
              console.error("Warning: Ignoring non-tenant account transaction for "+tx.account+" "+tx.amount+"BTC "+new Date(tx.time*1000))
            }
          })
          that.transaction_report(total, bitcoin.transactions-total)
          var lastblock = bitcoin.lastblock
          db.save_block_hash(lastblock, function(){
            that.block_report(lastblock)
            syncing = null
          })
        })
      })
    })
  }

  this.account_sync = function(){
    btcd.list_accounts(function(account){
      var username = that.account_to_username(account)
      if(username){
        db.transaction(function(){
          that.add_user(username,function(username){
            console.log('checked '+username)
          })
        })
      }
    })
  }

  this.block_report = function(block_hash){
    btcd.block(block_hash, function(block){
      console.log("Synced with block #"+block.height+" "+(new Date(block.time*1000)))
    })
  }

  this.transaction_report = function(txs, total){
    var count = txs.length
    if(count > 0){
      console.log("Committed "+txs+" bitcoin transactions to sql. ("+total+" total)")
    }
  }

  this.username_to_account = function(username){
    var account_name = tenant_name + seperator + username
    return account_name
  }

  this.account_to_username = function(account){
    if(this.is_tenant_account(account)){
      var tenant = account.split(seperator)[0]
      var username = account.substr(tenant.length+seperator.length)
      return username
    }
  }

  this.is_tenant_account = function(account){
    if(account.indexOf(seperator) > -1) {
      var _tenant_name = account.split(seperator)[0]
      return _tenant_name == tenant_name
    }
  }

  this.add_user = function(username, cb){
    console.log('checking '+username)
    var account = that.username_to_account(username)
    db.account(account, function(row){
      btcd.account_address(account, function(address){
        if(!row){
          db.add_account(account, username, address, function(row){
            console.log('Account create '+account+' '+address)
            cb(address)
          })
        } else {
          cb(address)
        }
      })
    })
  }

  this.balance = function(username, cb){
    var account = that.username_to_account(username)
    var total = 0;
    db.transactions(account, function(err, txs){
      txs.forEach(function(tx){
        total = total + tx.amount
      })
    })
    cb({balance: total})
  }
})()
