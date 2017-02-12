var db = require('../lib/db.js');

var model = {
	getAccessToken: function (accessToken) {
		var sql = `
			select * from oauth_tokens where accessToken = ?
		`;
        var stmt = [accessToken];
       
        return db.sql.query(sql , stmt)
        .spread(function (rtn) {
       
			if(rtn.length < 1) return false;
			return rtn[0];
		});
	},
	getAuthorizationCode:  function() {
		return 'not support';
	},
	getClient: function(client_id, client_secret) {
		var sql = `
	    	select * from oauth_clients where client_id = ? and client_secret = ?
	    `;
		var stmt = [
		    client_id , 
		    client_secret
		];
		
		return db.sql.query(sql , stmt)
		.spread(function (rtn) {
	   		
			if(rtn.length < 1) return false;
			var rtndata  = {
				clientId : rtn[0].client_id, 
				clientSecret : rtn[0].client_secret,
				redirectUris : rtn[0].redirect_uri,
				grants : rtn[0].grants.split(',')
			};
			
			return rtndata;
		});
	},
	getUser: function(username, password) {
		var sql = `
			select * from \`users\` where username = ? and password = ?
		`;
		var stmt = [
		    username ,
			password
		];
		return db.sql.query(sql , stmt)
		.spread(function (rtn) {
		    if(rtn.length < 1) return false;
			return rtn[0].username;
		});
	},
	saveToken: function(accessToken , client , user) {
		var sql = `
        	INSERT INTO oauth_tokens SET ?
		`;
		
		var stmt = {
		    accessToken : accessToken.accessToken,
			accessTokenExpiresAt : accessToken.accessTokenExpiresAt,
			refreshToken : accessToken.refreshToken,
			refreshTokenExpiresAt : accessToken.refreshTokenExpiresAt,
			client : client.clientId,
			user : user
		}
		
		return db.sql.query(sql , stmt)
		.then(function (rtn) {
		 
			return stmt;
		});
	},
	validateScope: function(user , client,scope) {
		return new Promise(function(resolve, reject){
			resolve(true);
		});
	},
	getRefreshToken: function(refreshToken) {
		var sql = `
			select * from oauth_tokens where refreshToken = ?
		`;
        var stmt = [refreshToken];
      
        return db.sql.query(sql , stmt)
        .spread(function (rtn) {
      
			if(rtn.length < 1) return false;
			return rtn[0];
		});
	},
	revokeToken: function(accessToken) {
	 
		var sql = `
			update oauth_tokens set refreshTokenExpiresAt = now() where refreshToken = ?
		`;
		var stmt = [accessToken.refreshToken];
		
		return db.sql.query(sql , stmt);
	} 
};
module.exports = model;