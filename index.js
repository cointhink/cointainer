var fs = require('fs')

var ApiServer = require('apiserver')
var sqlite3 = require('sqlite3').verbose();

var db = require('./lib/db')
var btcd = require('./lib/bitcoind')
var config = JSON.parse(fs.readFileSync('config.json'))

// connect to the database
db.setup(sqlite3)
// connect to bitcoind
btcd.setup(config.bitcoind.uri)

// startup synchronization
db.sync(btcd, function(err, count){
	if(err) {
		console.log('err  '+err)
	} else {
		console.log('block count '+JSON.stringify(count.body))
	}
})