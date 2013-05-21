module.exports = new (function(){
  var request
  this.setup = function(config, _request){
    this.uri = "http://"+config.user+":"+config.pass+"@"+config.host+":"+config.port
    request = _request
  }
  this.block_count = function(cb){
    this.rpc('getblockcount', [], cb)
  }
  this.block = function(hash, cb){
    this.rpc('getblock', [hash], cb)
  }
  this.unprocessed_transactions_since = function(block_hash,cb){
    opts = []
    if(block_hash) { opts.push(block_hash) }
    this.rpc('listsinceblock', opts, cb)
  }
  this.account_address = function(account,cb){
    opts = [account]
    this.rpc('getaccountaddress',opts,cb)
  }
  this.list_accounts = function(cb){
    opts = []
    this.rpc('listaccounts',opts,function(accounts){
      for(var account in accounts) {
        cb(account)
      }
    })
  }

  this.rpc = function(method_name, opts, cb){
    json_rpc = {method: method_name,
                params: opts}
    request({ method: 'post',
              uri: this.uri,
              json: json_rpc
            }, function(err, resp){
                  if(err){
                    console.error(err)
                  } else {
                    if(resp.body.error){
                      out = resp.body.error
                    } else {
                      out = resp.body.result
                      cb(out)
                    }
                  }
                  //console.log(JSON.stringify(json_rpc)+" => "+
                  //            JSON.stringify(out).substring(0,120))
                })
  }
})()
