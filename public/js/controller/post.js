
app.controller('post', function($scope , OAuth , $state , Upload) {
	$scope.submit = function () {
        Upload.upload({
            url: '/api/post',
            data: {file: $scope.file, 'caption': $scope.caption}
        }).then(function (resp) {
        console.log( resp.config.data.file)
            console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
        }, function (resp) {
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ');
        });
    };
});