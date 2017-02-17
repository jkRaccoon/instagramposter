
app.controller('post', function($scope , OAuth , $state , Upload) {
	$scope.isupload = false;
	$scope.submit = function () {
		if($scope.isupload) return;
		$scope.isupload = true;
        Upload.upload({
            url: '/api/post',
            data: {file: $scope.file, 'caption': $scope.caption}
        }).then(function (resp) {        
            console.log(resp.data);
            $scope.isupload = false;
            alert('완료!');
            $state.reload();
        }, function (resp) {
            console.log('Error status: ' + resp.status);
            $scope.isupload = false;
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ');
        });
    };
});