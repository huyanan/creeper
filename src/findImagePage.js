// console.log("hello");
var baseUrl = "http://www.bao388.com";
var imgDir = 'img/'
var charset = 'UTF-8';
// console.log("url is "+url);
var request = require('superagent');
var cheerio = require('cheerio');
var url = require('url');
var http = require('http');
var fs = require('fs');

/**
 * 解决中文乱码
 */
var iconv = require('iconv-lite');
var BufferHelper = require('bufferhelper');

/**
 * 抓图片类网页
 */
function findImagePage(url, dir) {
  if (!url) {
    return;
  }
  request
    .get(url)
    .end(function(res) {


      if (res.status == 200) {
        console.log("res type:"+res.type);
        console.log("res charset:"+res.charset);
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
        // console.log("arr:", arr);
        for (var i = 0; i < arr.length; i++) {
          var href = arr[i]['href'],
              title = arr[i]['title'];
          var imgDir = dir + '/' +title;
          // console.log(imgDir+'-------------------------------------------------------------');
          findImage(href,imgDir);
        }
      }



    });
}
