
app.controller('mainpage', function($scope, OAuth , $state) {

	if(!OAuth.isAuthenticated()) $state.go('login');
});