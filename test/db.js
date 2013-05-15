var vows = require('vows'),
    assert = require('assert'),
    nodemock = require('nodemock'),
    sqlite3 = require('sqlite3');

var db = require('../lib/db.js')

vows.describe('db').addBatch({
  'sqlite3': {
    topic: db,
    'setup': function(db){
      db.setup(sqlite3)
      assert(db.connected)
    }
  }
}).export(module)
