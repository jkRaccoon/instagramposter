app.controller('account_new', function($scope , OAuth , $state , $http) {
	$scope.newaccount = function(){
		
		var req = {
    			method: 'POST',
    			url:  "/api/account",
    			data : {
	    			instaid : $scope.instaid,
	    			instapass : $scope.instapass
    			}
    		};
    	return $http(req)
    	.then(function(){
    		$state.go('account');
    	})
    	.catch(function(){
    		alert('아이디나 패스워드가 틀렸거나 이미 등록된 아이디입니다.');
    	});
	}
});