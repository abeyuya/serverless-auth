var ghpages = require('gh-pages');
ghpages.publish('./gh-pages', function(err) {
  console.log('error: ' + JSON.stringify(err));
});
