'use strict';

var Apps = require('../apps.js');
var OAuth = require('oauth');
var ErrorResponse = require('../lib/error_response.js');

module.exports.handler = function(event, context) {
  
  if (!event.app_id) return ErrorResponse.back(Apps[event.app_id].callbackUrl, context, 'no app_id');
  if (!event.host)   return ErrorResponse.back(Apps[event.app_id].callbackUrl, context, 'no host');
  if (!event.stage)  return ErrorResponse.back(Apps[event.app_id].callbackUrl, context, 'no stage');
  
  var callbackUrl = [
    'https://', event.host, '/', event.stage, '/twitter/callback'
  ].join('');
  
  var oauth = new OAuth.OAuth(
    'https://api.twitter.com/oauth/request_token',
    'https://api.twitter.com/oauth/access_token',
    Apps[event.app_id].consumerKey,
    Apps[event.app_id].consumerSecret,
    '1.0A',
    callbackUrl,
    'HMAC-SHA1'
  );
  
  oauth.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results){
    if (error) return ErrorResponse.back(Apps[event.app_id].callbackUrl, context, JSON.stringify(error));
    
    return context.done(null, {
      redirectUrl: 'https://twitter.com/oauth/authenticate?oauth_token=' + oauth_token,
      setCookie: 'auth_value=' + JSON.stringify({ // NOTE: Api Gateway does not support multiple Set-Cookie
        app_id: event.app_id,
        oauth_token_secret: oauth_token_secret
      })
    });
  });
};
