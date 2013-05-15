var request = require('request')

module.exports = new (function(){
  this.setup = function(uri){
    this.uri = uri
  }
  this.block_count = function(cb){
  	this.rpc('getblockcount', [], cb)
  }
  this.block = function(hash, cb){
    this.rpc('getblock', [hash], cb)
  }
  this.unprocessed_transactions_since = function(block_height,cb){
    if(!block_height) { block_height = 0}
    this.rpc('listsinceblock', [block_height.toString()], cb)
  }
  this.rpc = function(method_name, opts, cb){
  	json_rpc = {id: 1,
  		          method: method_name,
  	            params: opts}
    console.log(JSON.stringify(json_rpc))
  	request({ method: 'post',
              uri: this.uri,
              json: json_rpc
            }, function(err, resp){
                  if(err){
                    console.error(err)
                  } else {
                    if(resp.body.error){
                      console.error(resp.body.error)
                    } else {
                      cb(resp.body.result)
                    }
                  }
                })
  }
})
