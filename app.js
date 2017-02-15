'use strict';
var express = require('express');
var compression = require('compression');
const fs = require('fs');
var spdy = require('spdy');

var bodyParser = require('body-parser');

var oauth2 = require('./api/oauth2.js');
var account = require('./api/account.js');
var post = require('./api/post.js');

var app = express();
var router = express.Router();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(compression());
app.use("/bower_components",express.static('bower_components'));
app.use("/" ,express.static('public'));
app.use("/api/oauth2" , oauth2);
app.use("/api/account" , account);
app.use("/api/post" , post);


app.use(logErrors)
app.use(clientErrorHandler)
app.use(errorHandler)

app.listen(5000);
/*
// And go for login
Client.Session.create(device, storage, 'jk@codecraft.co.kr', 'zktmxpfk0207')
.then(function(session) {
    // Now you have a session, we can follow / unfollow, anything...
    // And we want to follow Instagram official profile
    //return [session, Client.Account.searchForUser(session, 'instagram')]  
    
    // JPEG is the only supported format now, pull request for any other format welcomed!
	/*
	return Client.Upload.photo(session, 'img.jpg')
	    .then(function(upload) {
	        // upload instanceof Client.Upload
	        // nothing more than just keeping upload id
	        console.log(upload.params.uploadId);
	        return Client.Media.configurePhoto(session, upload.params.uploadId, 'akward caption 한글 #test');
	    })
	
	
	
})

.spread(function(session, account) {
    return Client.Relationship.create(session, account.id);
})
.then(function(rtn) {
    console.log(rtn)
    // {followedBy: ... , following: ... }
    // Yey, you just followed @instagram
})
*/

    
    
    
    
function logErrors (err, req, res, next) {
	//에러 로깅... 필요하나?
	console.error(err.stack)
	next(err)
}
function clientErrorHandler (err, req, res, next) {
	if (req.xhr) {
		res.status((!err.output)?500:err.output.statusCode).send({ error: err.message ,  data : err.data})
	} else {
		next(err)
	}
}

function errorHandler (err, req, res, next) {
	if (res.headersSent) {
		return next(err)
	}
	res.status((!err.output)?500:err.output.statusCode)
	res.send( { message : err.message ,  data : err.data  })
}