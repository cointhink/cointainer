var request = require('request')

module.exports = new (function(){
  this.setup = function(uri){
    this.uri = uri
  }
  this.block_count = function(cb){
  	this.rpc('getblockcount', [], cb)
  }
  this.rpc = function(method_name, opts, cb){
  	json_rpc = {id: 1,
  		        method: method_name,
  	            params: opts}
  	request({ method: 'post',
              uri: this.uri,
              json: json_rpc
            }, function(err, resp){
                  if(err){
                    console.log(err)
                  } else {
                    if(resp.body.error){
                      console.log(resp.body.error)
                    } else {
                      cb(resp.body.result)
                    }
                  }
                }
    )
  }
})
