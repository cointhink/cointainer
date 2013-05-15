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
  'missing load_block_height': {
    topic: function(){
      db.load_block_height(this.callback)
    },
    'no height': function(height){
      assert.isUndefined(height)
    }
  },
  'existing load_block_height': {
    topic: function(){
      db.save_block_height(1, function(){
        console.log("saveback!")
        db.load_block_height(this.callback)
      })
    },
    'existing height': function(height){
      assert.equal(height, 1)
    },
  }

}).export(module)
