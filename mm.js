// console.log("hello");
var baseUrl = "http://www.bao388.com";
var imgDir = 'img/'
var charset = 'UTF-8';
var startPage = 40;
var limit = 800;
var firstTime = true;

/**
 * 过滤条件
 */
var filters = [
  "国模",
  "模特",
  "國模",
  "美体",
  "国产",
  "国内",
  "熟女",
  "玉体",
  "东方"
]

var imgUrls = [];
var urlJson = 'url.json';
// console.log("url is "+url);
var request = require('superagent');
var cheerio = require('cheerio');
var url = require('url');
var http = require('http');
// var fs = require('fs');
var fs = require('graceful-fs');

/**
 * 解决中文乱码
 */
var parse = require('superagentparse');
var iconv = require('iconv-lite');
var BufferHelper = require('bufferhelper');

/**
 * 解决路径非法问题
 */
var path = require('path');

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



// var bufferHelper = new BufferHelper();
// res.on('data', function(chunk) {
//   bufferHelper.concat(chunk);
// });
// res.on('end', function() {
//   console.log(iconv.decode(bufferHelper.toBuffer(), 'GBK'));
// });


// var stream = new EventEmitter();

// stream.buf = '';
// stream.writeable = true;

// stream.write = function(chunk) {
//   this.buf += chunk;
// };

// stream.end = function() {
//   // this.buf.should.equal('{}');
//   done();
// };



/**
 * 抓图片类网页
 */
function findImagePage(url, dir) {
  if (!url) {
    return;
  }
  request
    .get(url)
    // .timeout(5000)
    .parse(parse('gbk'))
    .end(function(res) {


      if (res.status == 200) {
        console.log("res type:" + res.type);
        console.log("res charset:" + res.charset);
        var $ = cheerio.load(res.text, loadCfg);
        /**
         * 获取li
         */
        var $a = $('a');
        // console.log($li);

        var arr = [];
        var pageArr = [];
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
            var filteRes = true;
            for (var i = 0; i < filters.length; i++) {
              if(title.indexOf(filters[i])!=-1)
                filteRes = false;
            }
            if (filteRes) {
              arr.push(imgPage);
              console.log('href', href);
              console.log('title', title);
            }
          }
        });

        /**
         * 获取页数
         */
        var $page = $('.page');
        var $pageItems = $page.children();
        var $curtPage;
        console.log("____________startPage___________"+startPage);
        var curtPage = startPage;
        console.log("____________curtPage___________"+curtPage);
        if (firstTime) {

          curtPage = startPage;
        }

        var totalPage = 0;
        var $lastPage;
        var lastPageUrl;
        var pageMatch;
        if ($page.length) {
          $lastPage = $pageItems.last();
          $curtPage = $pageItems.filter('strong');
          if (!firstTime) {
            curtPage = $curtPage.text();
          }
          firstTime = false;
          // console.log($lastPage);
          lastPageUrl = $lastPage.attr('href');
          // console.log('href:' + href);
          pageMatch = lastPageUrl.match(/_\d+\./);
          if (pageMatch.length) {
            pageMatch = pageMatch[0].match(/\d+/);
            if (pageMatch.length) {
              totalPage = pageMatch[0];
              console.log("-------------totalPage:" + totalPage);
              console.log("-------------curtPage:" + curtPage);
            }
          }
        }

        if (startPage <= curtPage && curtPage < startPage + limit) {
          // console.log("arr:", arr);
          for (var i = 0; i < arr.length; i++) {
            var href = arr[i]['href'],
              title = arr[i]['title'];
            var imgDir = dir + '/' + title;
            // console.log(imgDir+'-------------------------------------------------------------');
            findImage(href, imgDir);
          }
          console.log("nextPage");
          console.log("lastPageUrl:" + lastPageUrl);

        }
        if (curtPage < (startPage + limit)) {
          nextPage(curtPage, totalPage, lastPageUrl, dir);
        }
        // done();
      }


    });
}

/**
 * 获取页的url
 */
function getPageUrl(page, url) {
  var pageUrl = "";
  if (!page || !url) {
    return;
  }
  var fullUrl = baseUrl + url;
  console.log('--------------page:' + page);
  console.log('--------------fullUrl:' + fullUrl);
  pageUrl = fullUrl.replace(/_\d+\./, '_' + page + '.');
  console.log('---------------pageUrl:' + pageUrl);
  return pageUrl;
}

/**
 * 换页
 */
function nextPage(curtPage, totalPage, href, dir) {
  if (!curtPage || !totalPage || !href || !dir) {
    return;
  }
  var ntPage = curtPage * 1 + 1;
  var pageUrl = "";
  console.log('-----------ntPage:' + ntPage);
  console.log('-----------totalPage:' + totalPage);
  if (ntPage > totalPage) {
    return;
  }
  pageUrl = getPageUrl(ntPage, href);
  findImagePage(pageUrl, dir);
}

/**
 * 抓图片类网页
 */
function findImage(url, dir) {
  if (!url) {
    return;
  }
  console.log("findImage " + url);
  console.log("dir " + dir);
  request
    .get(url)
    .parse(parse('gbk'))
    // .timeout(5000)
    .end(function(res) {
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
            imgUrls.push(src);
            // console.log('src', src);
          }
        });
        // console.log('下载目录:' + dir);
        downloadFiles(arr, dir);
        // console.log("imgUrls---------"+imgUrls);
        // recordUrl(urlJson,imgUrls);
      }
      // done();
    });
}

function downloadFiles(file_urls, DOWNLOAD_DIR) {
  for (var i = 0; i < file_urls.length; i++) {
    downloadFile(file_urls[i]['src'], DOWNLOAD_DIR);
  };
}


var count = 0;

function downloadFile(file_url, DOWNLOAD_DIR) {
  // file_url = path.normalize(file_url);
  var options = {
    host: url.parse(file_url).host,
    port: 80,
    path: url.parse(file_url).pathname,
    method: 'GET'
      /*,
          agent: false*/
  };
  try{
    var file_name = url.parse(file_url).pathname.split('/').pop();
    fs.exists(file_name,function(exists){
      // console.log('-----------------exists------------------'+exists);
      if (!exists) {
        var file = fs.createWriteStream(DOWNLOAD_DIR + file_name);
        // console.log(options);
        var req = http.get(options, function(res) {
          res.on('data', function(data) {
            file.write(data);
          }).on('end', function() {
            count++;
            file.end();
            console.log(file_name + 'download to ' + DOWNLOAD_DIR);
          });
        });
        req.on('error', function(e) {
          console.log('problem with request: ' + e.message);
          console.log('Last successful request count = ' + count);
        });
      }
    })
  }catch(e){
    console.log(e.stack);
  }
}

process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err);
});

function recordUrl(urlJson,imgUrls) {
  // console.log('urlJson----------------'+urlJson);
  // console.log('imgUrls----------------'+imgUrls);
  var urls = imgUrls;
  var content = '';
  //var content = "var urls = ["
  for (var i = 0; i < urls.length; i++) {
    content += "\"" + urls[i] + "\",\n"
  }
  //content = content + "];"

  var oldcontent = fs.readFileSync(urlJson);

  // console.log('content---------------'+content);
  // console.log('oldcontent---------------'+oldcontent);
  // console.log('content+oldcontent----------'+content + oldcontent);
  fs.writeFileSync(urlJson, content);
}


/**
 * 测试
 */
var imgListPageUrl = "http://www.bao388.com/html/part/16.html";
findImagePage(imgListPageUrl, imgDir);

var imgPageUrl = "http://www.bao388.com/html/article/115088.html";
// findImage(imgPageUrl,imgDir);
