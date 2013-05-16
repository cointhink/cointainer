module.exports = new (function(){
  var db, btcd
  var that = this

  this.setup = function(_db, _btcd, _rpc_server) {
    db = _db
    btcd = _btcd
  }

  this.sync = function(){
    db.load_block_hash(function(block_hash){
      btcd.unprocessed_transactions_since(block_hash, function(bitcoin){
        db.transaction(function(){
          bitcoin.transactions.forEach(function(tx){
            db.add_bitcoin_tx(tx)
          })
          lastblock = bitcoin.lastblock
          db.save_block_hash(lastblock)
          that.block_report(lastblock)
        })
      })
    })
  }

  this.block_report = function(block_hash){
    btcd.block(block_hash, function(block){
      console.log("Synced up to block #"+block.height+" "+(new Date(block.time*1000)))
    })
  }

  this.balance = function(username){
    return username+" has 3"
  }
})
