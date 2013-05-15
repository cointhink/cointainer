module.exports = new (function(){
  var db_filename, db

  var tables = {'tx': [["id", "integer PRIMARY KEY"],
                       ["account_id","integer"],
                       ["address","text"],
                       ["category","text"],
                       ["amount","text"],
                       ["confirmations","integer"],
                       ["txid","text UNIQUE"],
                       ["time","integer"],
                       ["time_received","integer"],
                       ],
                 'singletons': [["key","text PRIMARY KEY"],
                                ["value","text"],
                 ]}
  this.setup = function(db_engine, filename){
    db_filename = filename
    db = new db_engine.Database(db_filename)
    this.create_tables()
    this.connected = true
  }

  this.create_tables = function(){
    var that=this
    db.serialize(function(){
      for(var table in tables){
        that.table_create(table, tables[table])
      }
    })
  }

  this.table_create = function(name, columns, cb){
    var schema = columns.map(function(col_def){return col_def.join(' ')}).join(', ')
    var sql = 'create table if not exists '+name+' ('+schema+')'
    db.run(sql, function(err){
                  if(err){console.log('table create failed '+err)}
                  if(cb){cb()}
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
    //console.log(JSON.stringify(tx))
    var column_names = tables.tx.map(function(col){return col[0]})
    column_names.shift() // skip 'id'
    var column_holders = column_names.map(function(name){return "$"+name})
    var sql = "INSERT INTO tx ("+column_names.join(',')+") "+
              "values ("+column_holders.join(',')+")"
    console.log(sql)
    db.run(sql, this.tx_values(tx))
  }

  this.tx_values = function(tx){
    var account_id=0
    return { $account_id   : account_id,
             $address      : tx.address,
             $category     : tx.category,
             $amount       : tx.amount,
             $confirmations: tx.confirmations,
             $txid         : tx.txid,
             $time         : tx.time,
             $time_received: tx.timereceived}
  }
})
