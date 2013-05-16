var fs = require('fs'),
    timers = require('timers')

var ApiServer = require('apiserver')
var sqlite3 = require('sqlite3').verbose();

var db = require('./lib/db')
var btcd = require('./lib/bitcoind')
var config = JSON.parse(fs.readFileSync('config.json'))

// set bitcoid location
btcd.setup(config.bitcoind.uri)

// connect to the database
db.setup(sqlite3, 'db/transactions.db')

console.log("Begin sync every "+config.sync_rate+" sec.")
db.load_block_hash(function(block_hash){
  if(block_hash){
    block_report(block_hash)
  }
})

// startup synchronization
timers.setInterval(sync, config.sync_rate*1000)

function sync(){
  db.load_block_hash(function(block_hash){
    btcd.unprocessed_transactions_since(block_hash, function(bitcoin){
      db.transaction(function(){
        bitcoin.transactions.forEach(function(tx){
          db.add_bitcoin_tx(tx)
        })
        lastblock = bitcoin.lastblock
        db.save_block_hash(lastblock)
        block_report(lastblock)
      })
    })
  })
  block_report()
}

function block_report(block_hash){
   btcd.block(block_hash, function(block){
    console.log("Synced up to block #"+block.height+" "+(new Date(block.time*1000)))
  })
}
