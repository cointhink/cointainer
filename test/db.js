var fs = require('fs'),
    vows = require('vows'),
    assert = require('assert'),
    nodemock = require('nodemock'),
    sqlite3 = require('sqlite3');

var db = require('../lib/db.js')

function db_file_setup(){
  var test_db_filename = 'db/test.db'
  if(fs.existsSync(test_db_filename)){
    fs.unlinkSync(test_db_filename)
  }
  db.setup(sqlite3, test_db_filename)
}

db_file_setup()

vows.describe('db').addBatch({
  'sqlite3': {
    topic: db,
    'setup': function(db){
      assert(db.connected)
    }
  },
  'missing load_block_hash': {
    topic: function(){
      db.load_block_hash(this.callback)
    },
    'no hash': function(hash){
      assert.isUndefined(hash)
    }
  },
  'existing load_block_hash': {
    topic: function(){
      db.save_block_hash(1, function(){
        db.load_block_hash(this.callback)
      })
    },
    'existing hash': function(hash){
      assert.equal(hash, 1)
    }
  },
  'save_block_hash': {
    topic: function(){
      db.save_block_hash(1, this.callback)
    },
    'saved': function(hash){
      assert(true)
    },
  }

}).export(module)
