module.exports = new (function(){
  var db, btcd

  this.setup = function(_db, _btcd) {
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
          this.block_report(lastblock)
        })
      })
    })
  }

  this.block_report = function(block_hash){
    btcd.block(block_hash, function(block){
      console.log("Synced up to block #"+block.height+" "+(new Date(block.time*1000)))
    })
  }

})