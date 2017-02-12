var app = angular.module('monsterraccoon', [
	'ngRoute',
	'ngAnimate',
	'ui.router',
	'ui.bootstrap',
	'ui.navbar',
	'angular-oauth2'
]);


app.config(function($locationProvider, $urlRouterProvider , $stateProvider , OAuthProvider , OAuthTokenProvider){
	$locationProvider.hashPrefix('!');
	$urlRouterProvider.otherwise('/');
//	$urlRouterProvider.when('/accomodation', '/accomodation/beach');
	
    OAuthTokenProvider.configure({
		name: 'accessToken',
		options: {
			secure: false
		}
	});
    OAuthProvider.configure({
		baseUrl: '/api',
		grantPath: '/oauth2/token',
		clientId: 'insta',
		clientSecret: 'sjrnfldlstmxkrmfoa', // optional
    });
    
	$stateProvider
		.state('main', {
			url : "/",
			controller : 'mainpage',
			templateUrl : 'html/main.html'
		})
		.state('account', {
			url : "/account",
			controller : 'account',
			templateUrl : 'html/account.html'
		})
		.state('account_new', {
			url : "/account/new",
			controller : 'account_new',
			templateUrl : 'html/account/new.html'
		})
		.state('post', {
			url : "/post",
			controller : 'post',
			templateUrl : 'html/post.html'
		})		
		.state('login', {
			url : "/login",
			controller : 'login',
			templateUrl : 'html/login.html'
		})

})
.run(function($rootScope, $state, OAuth) {
	$rootScope.$on('oauth:error', function(event, rejection) {
	
		// Ignore `invalid_grant` error - should be catched on `LoginController`.
		if ('invalid_grant' === rejection.data.error) {
			return;
		}
	
		// Refresh token when a `invalid_token` error occurs.
		if ('invalid_token' === rejection.data.error) {
			return OAuth.getRefreshToken();
		}
	
		// Redirect to `/login` with the `error_reason`.
		return $state.go('login');
	});
});