module.exports = new (function(){
  var db_filename, db
  var that = this

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
                                ["value","text"]
                               ],
                 'accounts': [["id", "integer PRIMARY KEY"],
                              ["name", "text UNIQUE"],
                              ["username", "text UNIQUE"],
                              ["receiving_address", "text UNIQUE"]
                             ]
                }
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
                  if(err){console.error('table create failed '+err)}
                  if(cb){cb()}
                })
  }

  this.transaction = function(cb){
    db.serialize(function(){
      db.run("begin")
      cb()
      db.run("commit")
    })
  }

  this.singleton_get = function(key, cb){
    db.get("SELECT value FROM singletons where key = ?", key,
          function(err, row) {
            if(err) {
              console.error(err)
            }
            if(row) {
              cb(row.value)
            } else {
              cb()
            }
        });
  }

  this.singleton_set = function(key, value, cb){
    db.run("INSERT OR REPLACE INTO singletons (key, value) VALUES (?,?)",
           [key, value], cb);
  }

  this.load_block_hash = function(cb){
    this.singleton_get('block_hash', cb)
  }

  this.save_block_hash = function(value, cb){
    this.singleton_set('block_hash', value, cb)
  }

  this.insert = function(table_name, values, cb){
    var column_names = tables[table_name].map(function(col){return col[0]})
    column_names.shift() // skip 'id'
    var column_holders = column_names.map(function(name){return "$"+name})
    var sql = "INSERT INTO "+table_name+" ("+column_names.join(',')+") "+
              "VALUES ("+column_holders.join(',')+")"
    db.run(sql, values, cb)
  }

  this.add_bitcoin_tx = function(tx){
    this.account(tx.account, function(account){
      tx.account_id = account.id
      this.insert('tx', tx_values(tx))
    })
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

  this.account = function(account, cb){
    console.log('account '+account)

    var sql = "SELECT * FROM accounts where name = $name"
    db.run(sql, {$name: account}, function(row){
      if(row){
        cb(row)
      }else{
        // Error handling
      }
    })
  }

  this.add_account = function(account, username, address, cb){
    var record = {$name: account,
                  $username: username,
                  $receiving_address: address}
    that.insert('accounts', record, function(err){
      if(err){
    console.log(record)
        console.log(err)
        cb()
      } else {
        cb(this)
      }
    })
  }
})()
