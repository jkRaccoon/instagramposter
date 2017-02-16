var express = require('express');
var router = express.Router();
var db = require('../lib/db.js');
var querybuilder = require('../lib/datatable')
var fs = require('fs');
var Client = require('instagram-private-api').V1;
router.post('/', express.oauth.authenticate() , function(req, res, next) {
	
	var body = req.body;
	var username = res.locals.oauth.token.user;
	

	var sql = `
		insert into insta_account set ?
	`;
    var stmt = {
    	username : username , 
    	instaid : body.instaid,
    	instapass : body.instapass
    };
    
	return db.sql.query('START TRANSACTION') 	
	.then(function (rtn) {		
		var device = new Client.Device(body.instaid);
		var storage = new Client.CookieMemoryStorage();		
		return Client.Session.create(device, storage, body.instaid, body.instapass);
	})
	.then(function (rtn) {
		return db.sql.query(sql , stmt);
	})
	.then(function(session) {
	
		if(!session) throw Error();
		return db.sql.query('COMMIT');
	})
	.then(function(session) {
		res.send({status : 'ok'});
	})	
	.catch(function(session) {
		return db.sql.query('ROLLBACK').then(next);
		
	});
});

router.get('/', express.oauth.authenticate() , function(req, res, next) {


	var username = res.locals.oauth.token.user;
	
	querybuilder(db.sql ,  req.query , 'insta_account' , {username : username} ).then(function(rtn) {
		res.send(rtn);
	})
});

	


module.exports = router;
