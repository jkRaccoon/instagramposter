
app.controller('login', function($scope , OAuth , $state) {
	$scope.login = function(){
		var user = {
			username : $scope.inputEmail,
			password : $scope.inputPassword
		};
		
		OAuth.getAccessToken(user).then(function(rtn){
			$state.go('main');
		});
	}
});