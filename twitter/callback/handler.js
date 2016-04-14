'use strict';

var Apps = require('../apps.js');
var OAuth = require('oauth');
var qs = require('qs');
var Cookie = require('cookie');
var ErrorResponse = require('../lib/error_response.js');

module.exports.handler = function(event, context) {
  
  var cookie = JSON.parse(Cookie.parse(event.cookie).auth_value);
  
  if (!cookie)               return ErrorResponse.back(Apps[cookie.app_id].callbackUrl, context, 'no cookie');
  if (!event.oauth_token)    return ErrorResponse.back(Apps[cookie.app_id].callbackUrl, context, 'no oauth_token');
  if (!event.oauth_verifier) return ErrorResponse.back(Apps[cookie.app_id].callbackUrl, context, 'no oauth_verifier');
  
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
      if (error) return ErrorResponse.back(Apps[cookie.app_id].callbackUrl, context, JSON.stringify(error));
      
      // save access_token, access_token_secret, or do something
      
      var redirectUrl = [
        Apps[cookie.app_id].callbackUrl,
        '?',
        qs.stringify({
          twitter_auth: 1,
          access_token: access_token,
          access_token_secret: access_token_secret
        })
      ].join('')
      
      return context.done(null, {
        redirectUrl: redirectUrl
      });
    }
  );
};
