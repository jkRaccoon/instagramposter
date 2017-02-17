var express = require('express');
var router = express.Router();
var db = require('../lib/db.js');
var querybuilder = require('../lib/datatable')
var fs = require('fs');
var multipart = require('connect-multiparty');

router.post('/',  express.oauth.authenticate(),multipart({uploadDir: './upload'}) , function(req, res, next) {
	var username = res.locals.oauth.token.user;
	var caption = req.body.caption;

	var sql = `
		select * from insta_account where  username = ?
	`;
	var stmt = [username];
	
	db.sql.query(sql,stmt)
	.then(function(rtn){
		//console.log(rtn[0] , caption)
		var plist = []
		for (var i in rtn[0]){
			plist.push(instapost(rtn[0][i].instaid , rtn[0][i].instapass ,  req.files.file.path , caption));
		}
		return Promise.all(plist);
	})	
	.then(function(rtn){
		res.send({rtn : rtn})
	}) 
	.catch(next)
	
	
});

function instapost(instaid , instapass , path , caption){
	
	var Client = require('instagram-private-api').V1;
	var device = new Client.Device(instaid);
	var storage = new Client.CookieMemoryStorage();	
		
	return Client.Session.create(device, storage, instaid, instapass)
	.then(function(session) {
	    // Now you have a session, we can follow / unfollow, anything...
	    // And we want to follow Instagram official profile
	    //return [session, Client.Account.searchForUser(session, 'instagram')]  
	    
	    // JPEG is the only supported format now, pull request for any other format welcomed!
		
		return Client.Upload.photo(session, path)
		    .then(function(upload) {
		        // upload instanceof Client.Upload
		        // nothing more than just keeping upload id
		        
		        return [Client.Media.configurePhoto(session, upload.params.uploadId, caption),upload.params.uploadId];
		    }).spread(function(rtn, uploadId){
	        	return uploadId;
	        });
	})
}


module.exports = router;
