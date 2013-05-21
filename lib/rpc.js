module.exports = function(cointainer){

  this.balance = function(){
    args = parse_args(arguments, [{name:'username',type:'string'}])

    if(args) {
      response = { now: Date.now() }
      response.username = args.username
      var account = cointainer.username_to_account(args.username)
      response.balance= cointainer.balance(account)
      args.cb(null, response)
    }
  }

  this.add_user = function(){
    args = parse_args(arguments, [{name:'username',type:'string'}])

    if(args) {
      response = { now: Date.now() }
      response.username = args.username
      cointainer.add_user(args.username, function(address){
        if(address){
          response.receiving_addresss = address
          args.cb(null, response)
        } else {
          args.cb({msg: "bzz"})
        }
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