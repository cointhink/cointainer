module.exports = new (function(){
  var db_filename, db

  this.setup = function(db_engine, filename){
    db_filename = filename
    db = new db_engine.Database(db_filename)
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
  		    	console.log('inside get cb'+row)
  		      if(err) {
  		      	console.log(err)
  		      }
  		      if(row) {
  		      	console.log('got '+row.value)
  		      	cb(row.value)
  		      } else {
  		      	cb()
  		      }
		  	});
  }

  this.singleton_set = function(key, value, cb){
  	console.log('setting '+key+' to '+value)
  	db.run("INSERT OR REPLACE INTO singletons (key, value) values (?,?)", 
  		     [key, value], cb);
  }

  this.load_block_height = function(cb){
  	this.singleton_get('block_count', cb)
  }

  this.save_block_height = function(value, cb){
  	this.singleton_set('block_count', value, cb)
  }

  this.sync = function(btcd, cb){
  	var that = this
  	this.singleton_get('block_count', function(existing_count){
  		console.log('bc '+existing_count)
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
