
app.controller('account', function($scope , OAuth , $state , $timeout, $http , $compile) {
	$timeout(function() { 
		$('#datatables').DataTable({
			dom: 'Bfrtip',
		    buttons: [
		        'colvis','copy', 'csv' , 'excel' , 'pdf' 
		    ],
		    "processing": true,
		    serverSide: true,
		    "columns": [
		            { 
			            "data": "idx",
			        },
			        { 
			            "data": "username",
			        },
			        { 
			            "data": "instaid"
			        },
		            { 
			            "data": "reg_date"
					},
					{ 
			            "render": function ( data, type, full, meta ) {
							return "<button class='btn btn-danger' ng-click=\"deleteaccount("+full.idx+")\">삭제</a>";
					    }
					},
		        ],
		    "createdRow": function( row, data, dataIndex ) {
				    $compile(angular.element(row).contents())($scope);
			},
		    fnServerData:  function(sSource, aoData, fnCallback, oSettings) {

	            //All the parameters you need is in the aoData variable
	           
	            var draw = aoData[0].value;
	            var columns = aoData[1].value;
	            var order = aoData[2].value;
	            var start = aoData[3].value;
	            var length = aoData[4].value;
				var search = aoData[5];
	            var params={_:1};
	            
	           
	            for (var i in aoData){
	            	params[aoData[i].name] = aoData[i].value
	            }

	           
	           
	            
				var req = {
	    			method: 'GET',
	    			url:  "/api/account",
	    			params : params
	    		};
	            //Then just call your service to get the records from server side
	            $http(req)
	            .then(function(result){
	
	                fnCallback(result.data);
	            });
	        }
		});
	});
});