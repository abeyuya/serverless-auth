'use strict';

var Apps = require('../apps.js');
var OAuth = require('oauth');
var qs = require('qs');

module.exports.handler = function(event, context) {
  
  if (!event.app_id) return context.done('no app_id');
  if (!event.host)   return context.done('no host');
  if (!event.stage)  return context.done('no stage');
  
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
    if (error) context.done(JSON.stringify(error));
    
    return context.done(null, {
      redirectUrl: 'https://twitter.com/oauth/authenticate?oauth_token=' + oauth_token,
      setCookie: qs.stringify({ // NOTE: Api Gateway does not support multiple Set-Cookie
        app_id: event.app_id,
        oauth_token_secret: oauth_token_secret
      })
    });
  });
};
