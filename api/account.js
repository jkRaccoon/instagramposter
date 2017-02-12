var express = require('express');
var router = express.Router();
var db = require('../lib/db.js');
var querybuilder = require('../lib/datatable')
var fs = require('fs');

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
		return db.sql.query(sql , stmt);
	})
	.then(function (rtn) {	
   		return [rtn[0].insertId ,fs.writeFile('./cookies/'+rtn[0].insertId+'.json', ' ')];
	})
	.then(function (rtn) {
		var Client = require('instagram-private-api').V1;
		var device = new Client.Device(body.instaid);
		var storage = new Client.CookieMemoryStorage();		
		return Client.Session.create(device, storage, body.instaid, body.instapass);
	})
	.then(function(session) {
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
	querybuilder(db.sql ,  req.query , 'insta_account' ).then(function(rtn) {
		res.send(rtn);
	})
});

	


module.exports = router;
