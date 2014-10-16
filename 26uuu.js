var sys = require("system"),
	fs = require("fs"),
	utils = require('utils'),
	urlJson = 'url.json',
	casper = require('casper').create({
		pageSettings: {
        	webSecurityEnabled: false
    	}
	}),
	nextPageUrl = '';
//var spawn = require('child_process').spawn;
var baseUrl = "http://www.26rd.com/html/part/16.html";
var imgUrls = [];
var linksUrls = [];
var time = 0;

nextPageUrl = baseUrl;
casper.onConsoleMessage = function(msg) {
	console.log('casper title is ' + msg);
};

var download = function(path) {
	casper.download(path,Math.random()+'.jpg');
	console.log(path);
}

var recordUrl = function(path){
	casper.then(function(){
		var urls = imgUrls;
		var content = '';
		//var content = "var urls = ["
		for (var i = 0; i < urls.length; i++) {
			content +=	"\""+urls[i]+"\",\n"
		}
		//content = content + "];"

		var oldcontent = fs.read(path);

		fs.write(path, content + oldcontent, 'w');
	});
}

var getImgUrls = function(path) {
	console.log(path + 'asdf');
	casper.thenOpen(path, function(status) {
			var imgUrlsTmp = this.evaluate(function() {
				var imgUrls = [];
				var list = document.getElementById('ks_xp');
				console.log(list);
				var links = list.querySelectorAll('img');
				var linksLength = links.length;
				console.log(linksLength);
				for (var i = 0; i < linksLength; i++) {
					__utils__.echo(links.item(i).src);
					imgUrls.push(links.item(i).src);

				}
				return imgUrls;
			});
			console.log(imgUrls);
			console.log('------------------------------------------------');
			for (var i = 0; i < imgUrlsTmp.length; i++) {
				console.log(imgUrlsTmp[i]);
				imgUrls.push(imgUrlsTmp[i]);
			}
			console.log('-------------------------------------------------');

			/*for (var i = 0; i < imgUrls.length; i++) {
				download(imgUrls[i]);
			}*/
	});
}
var nextPage = function(curtPage){
	casper.thenOpen(curtPage,function(){
		nextPageUrl = this.evaluate(function(){
			var nextPageUrl = '';
			var pageNodeList = document.querySelectorAll('.page strong+a');
			__utils__.echo('--------------'+pageNodeList+'----------------');
			if (pageNodeList.length) {
				var page = pageNodeList.item(0);
				__utils__.echo('--------------'+page+'----------------');
				nextPageUrl = page.href;
				return nextPageUrl;
			}
			return '';
		});
		console.log('-----------------------nextPageUrl---------------------------');
		console.log('-----------------------'+nextPageUrl+'---------------------------');
		casper.thenOpen(nextPageUrl,detectLink);
	});
	
}
var detectLink = function(){
	linksUrls = [];
	imgUrls = [];
	console.log('--------------beforeEvaluate----------------');
	var linksUrlsTmp = this.evaluate(function() {
		__utils__.echo('--------------startDetectLink----------------');
		var linksUrls = [];
		var list = document.getElementById('ks_xp');
		var links = list.querySelectorAll('a[title]');
		var linksLength = links.length;
		for (var i = 0; i < linksLength; i++) {
			__utils__.echo(links.item(i));
			linksUrls.push(links.item(i).href);
		}
		__utils__.echo('--------------linksUrls----------------');
		return linksUrls;
	});
	console.log('--------------afterEvaluate---------------');
	for (var i = 0; i < linksUrlsTmp.length; i++) {
		console.log(linksUrlsTmp[i]);
		linksUrls.push(linksUrlsTmp[i]);
	}
	for (var i = 0; i < linksUrls.length; i++) {
		getImgUrls(linksUrls[i]);
	}

	recordUrl(urlJson,imgUrls);

	nextPage(nextPageUrl);
}
	casper.start(baseUrl, detectLink);


casper.run();
// getUrls(baseUrl);