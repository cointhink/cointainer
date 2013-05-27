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
    db.serialize()
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
      if(account){
        tx.account_id = account.id
        that.insert('tx', that.tx_values(tx))
      } else {
        console.error("!! tx has no user "+JSON.stringify(tx))
      }
    })
  }

  this.tx_values = function(tx){
    return { $account_id   : tx.account_id,
             $address      : tx.address,
             $category     : tx.category,
             $amount       : tx.amount,
             $confirmations: tx.confirmations,
             $txid         : tx.txid,
             $time         : tx.time,
             $time_received: tx.timereceived}
  }

  this.account = function(account, cb){
    var sql = "SELECT * FROM accounts where name = $name"
    var qdat = {$name: account}
    db.get(sql, qdat, function(err, row){
      console.log(sql+" "+JSON.stringify(qdat)+" => "+JSON.stringify(row))
      if(err){
        cb()
      }else{
        cb(row)
      }
    })
  }

  this.add_account = function(account, username, address, cb){
    var record = {$name: account,
                  $username: username,
                  $receiving_address: address}
    that.insert('accounts', record, function(err){
      if(err){
        cb()
      } else {
        cb(this)
      }
    })
  }

  this.tx = function(tx_id, cb){
    var sql = "SELECT * FROM tx where txid = $txid"
    var qdat = {$txid: tx_id}
    console.log(sql+" "+JSON.stringify(qdat))
    db.get(sql, qdat, function(err, row){
      if(err){
        cb()
      }else{
        cb(row)
      }
    })
  }

  this.transactions = function(account, cb){
    that.account(account,function(row){
      if(row){
        var sql = "SELECT * from tx where account_id = $account_id"
        var qdat = {$account_id: row.id}
        console.log(sql+" "+JSON.stringify(qdat))
        //db.each segfaults
        db.all(sql, qdat, cb)
      } else {
        cb("account not found")
      }
    })
  }
})()
