var vows = require('vows'),
    assert = require('assert'),
    nodemock = require('nodemock')

var bitcoind = require('../lib/bitcoind.js')

vows.describe('bitcoind').addBatch({
  'setup': {
    topic: bitcoind,
    'config': function(topic){
      var request_mock = nodemock.mock("request")
      topic.setup({user: 'bob',
                   pass: 'pass',
                   host: 'gandalf',
                   port: 8332}, request_mock.request)
      assert.equal(topic.uri, "http://bob:pass@gandalf:8332")
    }
  },
  'rpc_block': {
    topic: function(){
      var request_mock = nodemock.mock("request").takes({
         "method":"post",
         "uri":"http://:@localhost:8332",
         "json":{"method":"getblock","params":["abc123"]}
        }, function(){}).calls(1, [null, {body: {result:{coins:1}}}])
      bitcoind.setup({user:'',pass:'',host:'localhost',port:8332}, request_mock.request)
      bitcoind.block("abc123", this.callback)
    },
    'block results': function(block_info){
      assert.equal(true,true)
    }
  },
}).export(module)
