var page = require('webpage').create();
console.log(page);
page.open('http://www.26rd.com/html/article/84664.html', function() {
  page.render('github.png');
  phantom.exit();
});