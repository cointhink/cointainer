module.exports = new (function(){
  var db_filename = 'transactions.db',
      db

  this.setup = function(db_engine){
    db = new db_engine.Database(db_filename);
    this.table_create('tx',
    	      'id INTEGER PRIMARY KEY ASC,'+
    	      'account_id integer,'+
    	      'address text,'+
    	      'category text,'+
    	      'amount text,'+
    	      'confirmations integer,'+
    	      'txid text,'+
    	      'time integer,'+
    	      'time_received integer')
    this.table_create('singletons',
    	      'key text PRIMARY KEY,'+
    	      'value text')
    this.connected = true
  }

  this.table_create = function(name, schema){
  	db.run('create table if not exists '+name+' ('+schema+')',
  		        function(err){
  		        	if(err){console.log('table create failed '+err)}
  		        })
  }

  this.singleton_get = function(key, cb){
  	console.log('getting '+key)
  	db.get("SELECT value FROM singletons where key = ?", key, 
  		    function(err, row) {
  		      if(err) {
  		      	console.log(err)
  		      }
  		      if(row) {
  		      	console.log('got '+row.value)
  		      	cb(row.value)
  		      }
		  	});
  }

  this.singleton_set = function(key, value){
  	console.log('setting '+key+' to '+value)
  	db.get("INSERT OR REPLACE INTO singletons (key, value) values (?,?)", key, value, 
  		    function(err, row) {
  		      if(row) {
  		      	return row.value
  		      }
		  	});
  }

  this.sync = function(btcd, cb){
  	var that = this
  	this.singleton_get('block_count', function(existing_count){
  		console.log('bc '+block_count)
	  	btcd.block_count(function(count){
	  		console.log('count '+count+' existing_count '+existing_count)
	  		if(count > existing_count) {
				that.singleton_set('block_count', count)
				cb(count)
			}
	  	})
  	})
  }
})
