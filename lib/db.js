module.exports = new (function(){
  var db_filename = 'transactions.db',
      db

  this.setup = function(db_engine){
    db = new db_engine.Database(db_filename);
    db.run('create table if not exists tx ('+
    	      'id INTEGER PRIMARY KEY ASC,'+
    	      'account_id integer,'+
    	      'address text,'+
    	      'category text,'+
    	      'amount text,'+
    	      'confirmations integer,'+
    	      'txid text,'+
    	      'time integer,'+
    	      'time_received integer'+
    	    ')')
  }

  this.sync = function(btcd, cb){
  	var block_count = btcd.block_count(cb)
  }
})
