module.exports = function(cointainer){

  this.balance = function(){
    args = parse_args(arguments, [{name:'username',type:'string'}])

    if(args) {
      args.cb(null, cointainer.balance(args.username))
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