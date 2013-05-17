module.exports = new (function(){
  var db, btcd, syncing = null
  var that = this

  this.setup = function(_db, _btcd) {
    db = _db
    btcd = _btcd
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
          lastblock = bitcoin.lastblock
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

  this.username_to_account = function(username){

  }

  this.balance = function(account){
    return  {amount: 3, currency: 'btc'}
  }
})
