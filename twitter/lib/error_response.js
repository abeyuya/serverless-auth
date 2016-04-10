'use strict';

var qs = require('qs');

module.exports.back = function(callbackUrl, context, message) {
  console.log('error:' + message);
  
  var param = qs.stringify({
    twitter_auth: 0,
    message: message
  });
  
  return context.done(null, {
    redirectUrl: callbackUrl + '?' + param
  });
}
