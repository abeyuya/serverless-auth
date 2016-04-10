'use strict';

var Apps = require('../apps.js');
var OAuth = require('oauth');
var qs = require('qs');

module.exports.handler = function(event, context) {
  
  if (!event.cookie)         return context.done('no cookie');
  if (!event.oauth_token)    return context.done('no oauth_token');
  if (!event.oauth_verifier) return context.done('no oauth_verifier');
  
  var cookie = qs.parse(event.cookie);
  
  var oauth = new OAuth.OAuth(
    'https://api.twitter.com/oauth/request_token',
    'https://api.twitter.com/oauth/access_token',
    Apps[cookie.app_id].consumerKey,
    Apps[cookie.app_id].consumerSecret,
    '1.0A',
    null,
    'HMAC-SHA1'
  );
  
  oauth.getOAuthAccessToken(
    event.oauth_token,
    cookie.token_secret,
    event.oauth_verifier,
    function(error, access_token, access_token_secret, results){
      if (error) return context.done(JSON.stringify(error));
      
      // save access_token, access_token_secret, or do something
      
      return context.done(null, {
        redirectUrl: Apps[cookie.app_id].callbackUrl
      });
    }
  );
};
