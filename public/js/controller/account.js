
app.controller('account', function($scope , OAuth , $state , $timeout, $http) {
	$timeout(function() { 
		$('#datatables').DataTable({
			dom: 'Bfrtip',
		    buttons: [
		        'colvis','copy', 'csv' , 'excel' , 'pdf' 
		    ],
		    serverSide: true,
		    fnServerData:  function(sSource, aoData, fnCallback, oSettings) {

	            //All the parameters you need is in the aoData variable
	            console.log(aoData);
	            var draw = aoData[0].value;
	            var columns = aoData[1].value;
	            var order = aoData[2].value;
	            var start = aoData[3].value;
	            var length = aoData[4].value;
	            var search = aoData[5].value;
				var req = {
	    			method: 'GET',
	    			url:  "/api/account",
	    			params : {
	    				start:start, 
	    				columns : columns,
	    				length:length, 
	    				order:order,
	    				search:search,
	    				draw:draw,
	    				"_" : ""
	    			}
	    		};
	            //Then just call your service to get the records from server side
	            $http(req)
	            .then(function(result){
	
	                var records = {
	                        'draw': draw,
	                        'recordsTotal': result.total,
	                        'recordsFiltered': result.filtered,
	                        'data': result.records  
	                    };
	                fnCallback(records);
	            });
	        }
		});
	});
});