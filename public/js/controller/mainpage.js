
app.controller('mainpage', function($scope, OAuth) {
	console.log(OAuth.isAuthenticated())
});