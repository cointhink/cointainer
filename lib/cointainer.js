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
          bitcoin.transactions.forEach(function(tx){
            db.add_bitcoin_tx(tx)
          })
          that.transaction_report(bitcoin.transactions)
          var lastblock = bitcoin.lastblock
          db.save_block_hash(lastblock, function(){
            that.block_report(lastblock)
            syncing = null
          })
        })
      })
    })
  }

  this.block_report = function(block_hash){
    btcd.block(block_hash, function(block){
      console.log("Synced with block #"+block.height+" "+(new Date(block.time*1000)))
    })
  }

  this.transaction_report = function(txs){
    var count = txs.length
    if(count > 0){
      console.log("Committed "+txs.length+" transactions to sql.")
    }
  }

  this.username_to_account = function(username){
    var account_name = tenant_name + seperator + username
    console.log(account_name)
    return account_name
  }

  this.balance = function(account){
    return  {amount: 3, currency: 'btc'}
  }
})()
