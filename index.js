// nodejs libs
var fs     = require('fs'),
    timers = require('timers')

// npm libs
var ApiServer = require('apiserver'),
    sqlite3   = require('sqlite3').verbose();

// local libs
var db         = require('./lib/db'),
    btcd       = require('./lib/bitcoind'),
    cointainer = require('./lib/cointainer')

// config file
var config = JSON.parse(fs.readFileSync('config.json'))

// setup bitcoind
btcd.setup(config.bitcoind)

// setup the database
db.setup(sqlite3, config.db.file)

// setup the manager
cointainer.setup(db, btcd)

console.log("Sync bitcoind <=> "+config.db.file+" every "+config.sync_rate+" sec.")

// first sync
cointainer.sync()

// timer sync
timers.setInterval(cointainer.sync, config.sync_rate*1000)

// API
api = new ApiServer(config.api)
api.listen()
