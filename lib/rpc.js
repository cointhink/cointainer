module.exports = function(cointainer, db){

  this.user = function(){
    args = parse_args(arguments, [{name:'username',type:'string'}])

    if(args) {
      response = { now: Date.now() }
      var username = args.username
      response.username = username
      cointainer.balance(username, function(total){
        response.balance = total
        cointainer.user(username,function(user){
          response.receiving_address = user.receiving_address
          args.cb(null, response)
        })
      })
    }
  }

  this.transactions = function(){
    args = parse_args(arguments, [{name:'username',type:'string'}])

    if(args) {
      response = { now: Date.now() }
      var username = args.username
      response.username = username
      cointainer.transactions(username, function(txs){
        response.transactions = txs
        args.cb(null, response)
      })
    }
  }

  this.add_user = function(){
    args = parse_args(arguments, [{name:'username',type:'string'}])

    if(args) {
      response = { now: Date.now() }
      response.username = args.username
      db.transaction(function(){
        cointainer.add_user(args.username, function(address){
          if(address){
            response.receiving_addresss = address
            args.cb(null, response)
          } else {
            args.cb({msg: "bzz"})
          }
        })
      })
    }
  }

  function parse_args(args, signature){
    var params = {}
    params.cb = args[args.length-1]
    if(signature.length == args.length-1){
      signature.forEach(function(sig, idx){
        var type = typeof(args[idx])
        if(type == sig.type){
          params[sig.name] = args[idx]
        } else {
          params.error = "Wrong type "+type+" for "+sig.name
        }
      })
    } else {
      params.error = "Wrong number of arugemnts"
    }

    if(params.error) {
      params.cb(params.error)
    } else {
      return params
    }
  }
}