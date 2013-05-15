var fs = require('fs')

var ApiServer = require('apiserver')
var sqlite3 = require('sqlite3').verbose();

var db = require('./lib/db')
var btcd = require('./lib/bitcoind')
var config = JSON.parse(fs.readFileSync('config.json'))

// set bitcoid location
btcd.setup(config.bitcoind.uri)

// connect to the database
db.setup(sqlite3, 'db/transactions.db')

// startup synchronization
db.load_block_hash(function(block_hash){
  btcd.unprocessed_transactions_since(block_hash, function(result){
    db.transaction(function(){
      result.transactions.forEach(function(tx){
        db.add_bitcoin_tx(tx)
      })
      db.save_block_hash(result.lastblock)
    })
  })
})
