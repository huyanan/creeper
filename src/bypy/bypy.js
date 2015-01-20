module.exports = (function(){
  var bypy = {};
  var exec = require('child_process').exec;
  var arg1 = 'hello';
  var list = 'list';

  bypy.list = function(callback){
    exec('bypy.py '+ list,function(error,stdout,stderr){
        if(stdout.length >1){
            console.log('you offer args:',stdout);
        } else {
            console.log('you don\'t offer args');
        }
        if(error) {
            console.info('stderr : '+stderr);
        }
        callback(error,stdout,stderr);
    });
  }
  return bypy;
})();

