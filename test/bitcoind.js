var vows = require('vows'),
    assert = require('assert'),
    nodemock = require('nodemock')

var bitcoind = require('../lib/bitcoind.js')

vows.describe('bitcoind').addBatch({
  'setup': {
    topic: bitcoind,
    'setup': function(topic){
      topic.setup({user: 'bob',
                   pass: 'pass',
                   host: 'gandalf',
                   port: 8332})
      assert.equal(topic.uri, "http://bob:pass@gandalf:8332")
    }
  },
}).export(module)
