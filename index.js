var ApiServer = require('apiserver')
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('transactions.db');

