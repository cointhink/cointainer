// nodejs libs
var fs     = require('fs'),
    timers = require('timers')

// npm libs
var jayson  = require('jayson'),
    sqlite3 = require('sqlite3').verbose(),
    request = require('request')

// local libs
var db         = require('./lib/db'),
    btcd       = require('./lib/bitcoind'),
    cointainer = require('./lib/cointainer'),
    rpc        = require('./lib/rpc')

// config file
var config = JSON.parse(fs.readFileSync('config.json'))

// setup bitcoind
btcd.setup(config.bitcoind, request)

// setup the database
db.setup(sqlite3, config.db.file)

// setup the manager
cointainer.setup(db, btcd, config.tenant)

// Account/user sync
console.log('Account <=> Username sync')
cointainer.account_sync()

console.log("Sync bitcoin transactions <=> "+config.db.file+" every "+config.sync_rate+" sec.")
// first sync
cointainer.sync_mutex()

// timer sync
timers.setInterval(cointainer.sync_mutex, config.sync_rate*1000)

// API
jayson.server(new rpc(cointainer)).http().listen(config.api.port)
