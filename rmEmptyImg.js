var fs = require('fs'),
  fileList = [];


function walk(path) {
  var dirList = fs.readdirSync(path);

  dirList.forEach(function(item) {
    if (fs.statSync(path + '/' + item).isFile()) {
      fileList.push(path + '/' + item);
    }
  });

  dirList.forEach(function(item) {
    if (fs.statSync(path + '/' + item).isDirectory()) {
      walk(path + '/' + item);
    }
  });
}

function rmEmpty(path) {
  var dirList = fs.readdirSync(path);
  dirList.forEach(function(item) {
    if (fs.statSync(path + '/' + item).isFile()) {
      // fileList.push(path + '/' + item);
      fs.stat(path + '/' + item, statCallback(path + '/' + item));
    }
  });
}

function statCallback(filename){
  return function(err, stat){
    var size = stat['size'];
        if(!size){
          fs.unlink(filename,function(){
            console.log('rm file '+filename);
          });
        }
  }
}

function getFilesizeInBytes(filename) {
 var stats = fs.statSync(filename)
 var fileSizeInBytes = stats["size"]
 return fileSizeInBytes
}
// walk('./img');

rmEmpty('./img');

// console.log(fileList);
