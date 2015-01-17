// console.log("hello");
var baseUrl = "http://www.bao388.com";
var imgDir = 'img/'
  // console.log("url is "+url);
var request = require('superagent');
var cheerio = require('cheerio');
var url = require('url');
var http = require('http');
var fs = require('fs');

var loadCfg = {
  ignoreWhitespace: true,
  xmlMode: true
};

// console.log("request "+request);
// console.log("cheerio "+$);
// console.log("fs "+fs);
//

function main() {
  request(url, function(res) {
    console.log("status " + res.status);
    // console.log("body " + res.text);
    if (res.status == 200) {

      var $ = cheerio.load(res.text, loadCfg);
      /**
       * 获取li
       */
      var $li = $('ul li');
      // console.log($li);

      var arr = [];
      $li.each(function(index, ele) {
        // console.log(ele);
        var a = $(this).children()[0];
        var href = $(a).attr('href');
        var title = $(a).attr('title');

        if (href != undefined) {
          var category = {
            href: baseUrl + href,
            title: title
          };
          arr.push(category);
          console.log('href', href);
          console.log('title', title);
        }
      });
      console.log("arr:", arr);
      findImage(arr[0]['href']);
    }
  });
}

/**
 * 抓图片类网页
 */
function findImagePage(url,dir) {
  if (!url) {
    return;
  }
  request(url, function(res) {
    if (res.status == 200) {
      var $ = cheerio.load(res.text, loadCfg);
      /**
       * 获取li
       */
      var $a = $('a');
      // console.log($li);

      var arr = [];
      $a.each(function(index, ele) {
        // console.log(ele);
        var href = $(this).attr('href');
        var title = $(this).attr('title');

        var article = href.indexOf('article');
        // console.log(href);
        if (href != undefined && article != -1) {
          var imgPage = {
            href: baseUrl + href,
            title: title
          };
          arr.push(imgPage);
          console.log('href', href);
          console.log('title', title);
        }
      });
      console.log("arr:", arr);
      for (var i = 0; i < arr.length; i++) {
        var href = arr[i]['href'];
        findImage(href,dir);
      }
    }
  });
}

/**
 * 抓图片类网页
 */
function findImage(url,dir) {
  if (!url) {
    return;
  }
  console.log("findImage " +url);
  console.log("dir " +dir);
  request(url, function(res) {
    if (res.status == 200) {
      var $ = cheerio.load(res.text, loadCfg);
      /**
       * 获取li
       */
      var $li = $('img');
      // console.log($li);

      var arr = [];
      $li.each(function(index, ele) {

        var src = $(this).attr('src');

        var jpg = src.indexOf('.jpg');
        if (src != undefined && jpg != -1) {
          var img = {
            src: src
          };
          arr.push(img);
          // console.log('src', src);
        }
      });
      console.log("arr:", arr);
      downloadFiles(arr,dir);
    }
  });
}

function downloadFiles(file_urls, DOWNLOAD_DIR) {
  for (var i = 0; i < file_urls.length; i++) {
    downloadFile(file_urls[i]['src'], DOWNLOAD_DIR);
  };
}

function downloadFile(file_url, DOWNLOAD_DIR) {
  var options = {
    host: url.parse(file_url).host,
    port: 80,
    path: url.parse(file_url).pathname
  };

  var file_name = url.parse(file_url).pathname.split('/').pop();
  var file = fs.createWriteStream(DOWNLOAD_DIR + file_name);
  http.get(options, function(res) {
    res.on('data', function(data) {
      file.write(data);
    }).on('end', function() {
      file.end();
      console.log(file_name + 'download to ' + DOWNLOAD_DIR);
    });
  });
}


/**
 * 测试
 */
var imgListPageUrl = "http://www.bao388.com/html/part/16.html";
findImagePage(imgListPageUrl,imgDir);

var imgPageUrl = "http://www.bao388.com/html/article/115088.html";
// findImage(imgPageUrl,imgDir);
