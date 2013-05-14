module.exports = new (function(){
  var db_filename = 'transactions.db',
      db

  this.setup = function(db_engine){
    db = new db_engine.Database(db_filename);
  }

  this.sync = function(btcd, cb){
  	var block_count = btcd.block_count(cb)
  }
})
