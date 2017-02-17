
app.controller('login', function($scope , OAuth , $state) {
	$scope.login = function(){
		var user = {
			username : $scope.inputEmail,
			password : $scope.inputPassword
		};
		
		OAuth.getAccessToken(user).then(function(rtn){
			$state.go('main');
		}).catch(function(){
			alert('잘못된계정입니다');
		});
	}
});