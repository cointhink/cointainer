module.exports = new (function(){
  var db_filename, db

  var tables = {'tx': [["id", "INTEGER PRIMARY KEY ASC"],
                       ["account_id","integer"],
                       ["address","text"],
                       ["category","text"],
                       ["amount","text"],
                       ["confirmations","integer"],
                       ["txid","text"],
                       ["time","integer"],
                       ["time_received","integer"],
                       ],
                 'singletons': [["key","text PRIMARY KEY"],
                                ["value","text"],
                 ]}
  this.setup = function(db_engine, filename){
    db_filename = filename
    db = new db_engine.Database(db_filename)
    for(var table in tables) {
      this.table_create(table, tables[table])
    }
    this.connected = true
  }

  this.table_create = function(name, columns){
    var schema = columns.map(function(col_def){return col_def.join(' ')}).join(', ')
    var sql = 'create table if not exists '+name+' ('+schema+')'
    console.log(sql)
    db.run(sql, function(err){
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

  this.add_transaction = function(tx){
    console.log(JSON.stringify(tx))
    //db.run("INSERT INTO tx () values ()")
  }
})
