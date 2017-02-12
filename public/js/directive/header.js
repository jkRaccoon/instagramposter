
app.directive('adminHeader', function() {
	return {
		restrict: 'E',
		templateUrl: 'html/directive/header.html',
		scope : {},
		link: function(scope) {
			scope.allmenus = [
				{
			        name: "계정관리",
			        link: "account",
			        subtree: [
			        	{
				            name: "계정목록",
				            link: "account",
			        	},
			        	{
				            name: "계정추가",
				            link: "account_new",
			        	}
			        ]
		    	},
		    	{
			        name: "포스팅",
			        link: "post",
			        subtree: [
			        	{
				            name: "새포스팅",
				            link: "post",
			        	}
			        ]
		    	},
		    	{
			        name: "로그인",
			        link: "login",
			        subtree: [
			        	{
				            name: "로그인",
				            link: "login",
			        	}
			        ]
		    	}
		    ]
	    }
	};
});