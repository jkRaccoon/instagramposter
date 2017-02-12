var express = require('express');
var router = express.Router();
var OAuthServer = require('express-oauth-server');
express.oauth = new OAuthServer({
	model: require("../lib/oauth_model.js"), // See https://github.com/thomseddon/node-oauth2-server for specification 
});

router.all('/token', express.oauth.token());

module.exports = router;


