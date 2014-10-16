var page = require('webpage').create();
page.onConsoleMessage = function(msg) {
	console.log('Page title is ' + msg);
};
var url = 'http://www.26rd.com/html/article/84672.html';
var urls = ['http://www.26rd.com/html/article/84672.html', 'http://www.26rd.com/html/article/84673.html'];

var listUrls = function() {
	for (var i = 0; i < urls.length; i++) {
		setTimeout(function(){
			page.open(urls[i], function(status) {
				console.log(status);
				page.evaluate(function() {
					console.log(document.title);
				});
			});
		},i*1000);
	}
}
listUrls();
/*
page.open(url, function(status) {
	page.evaluate(function() {
		console.log(document.title);
	});
});*/