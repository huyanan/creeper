var bypy = require('./src/bypy');
console.log(bypy);
var callback = function(error,stdout,stderr){
  console.log('call bypy api');
  console.log('error------'+error);
  console.log('stderr------'+stderr);
}
bypy.list(callback);
