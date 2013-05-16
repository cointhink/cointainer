module.exports = function(cointainer){

  this.balance = function(){
    args = parse_args(arguments, [{name:'username',type:'string'}])

    if(args.error) {
      args.cb(args.error)
    } else {
      args.cb(null, args.username+" has 3 "+cointainer.hello())
    }
  }

  function parse_args(args, signature){
    params = {}
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
    return params
  }
}