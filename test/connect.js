var EventEmitter = require('events').EventEmitter;
var vows = require('vows'),
    assert = require('assert'),
    nodemock = require('nodemock');

var cointainer = require('../index.js')

var mockio = new EventEmitter()

vows.describe('cointainer').addBatch({
  'connect to bitcoind': {
    topic: function(){
      var that = this
      cointainer.on('connect', function(payload){
        // vowjs insists on first param error
        that.callback(null, payload)
      })
      cointainer.attach(mockio, 'usd')
      mockio.emit('connect')
    },
    'connection succeeds': function () {
      assert.isTrue(false);
    },
  }
}).export(module)
