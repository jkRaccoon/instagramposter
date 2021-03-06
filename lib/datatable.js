var parser = require('datatable-parser');

module.exports = function(db , DT_data , tablename , extraquery = []){

	for (var i in DT_data.columns) DT_data.columns[i] = JSON.parse( DT_data.columns[i]);
	DT_data.search = JSON.parse( DT_data.search);
	DT_data.order = JSON.parse( DT_data.order);
		
	var parsedData = DT_data;
		stmt = [];
				
	var return_obj = {
		"draw": 0,
		"recordsTotal": 10,
		"recordsFiltered": 10,
		"data" : []
	}
			
	function recordsQuery(tablename , columnsQuery , whereQuery , orderbyQuery , limitQuery){
		var sql= "select "+columnsQuery+" from "+tablename+" WHERE 1=1 "+whereQuery+orderbyQuery+limitQuery;
		
		return db.query(sql ,stmt);
	}
	function recordsTotalQuery(tablename , columnsQuery , whereQuery , orderbyQuery , limitQuery){
		var sql= "select count(*) as cnt from "+tablename;
		
		return db.query(sql ,stmt);
	}
	function recordsFilteredQuery(tablename , columnsQuery , whereQuery , orderbyQuery , limitQuery){
		var sql= "select count(*) as cnt from  "+tablename+" WHERE 1=1 "+whereQuery;
		
		return db.query(sql ,stmt);
	}
	
	function columns(columns){
		var columnname = [];
		for(var i in columns){
			columnname.push(columns[i].data);
			
		}
		return columnname.join(",");
	}
	function limit(start , length){
		return " limit "+start+","+length;
	}
	
	function where(columns , search){
		
		var where = " ";
		var searcharr = [];
		var objname;
		
		for(var i in columns){
		
			if(columns[i].search.value){
				
				where += " AND "+columns[i].data+" = ? ";
				
				stmt.push( columns[i].search.value );
			}
		}
		 
		
		if(extraquery) {
			for(var i in extraquery){
				where += " AND ? ";
				stmt.push( extraquery );	
			}
		}
		
		return where;
	}
	function orderby(order){
	
		var orderby = "";
		var orderbyArr=[];
		
		if(order) orderby += " ORDER BY "+parsedData.columns[order.column].data+" "+order.dir;
		
		return orderby;
	}
	
	function querybuilder(){
		
		var columnsQuery = columns(parsedData.columns);
		var limitQuery = limit(parsedData.start , parsedData.length);
		var whereQuery = where(parsedData.columns , parsedData.search);
		var orderbyQuery = orderby(parsedData.order);
		
		return Promise.all([
	    	recordsQuery(tablename , columnsQuery , whereQuery , orderbyQuery , limitQuery),
	    	recordsTotalQuery(tablename , columnsQuery , whereQuery , orderbyQuery , limitQuery),
	    	recordsFilteredQuery(tablename , columnsQuery , whereQuery , orderbyQuery , limitQuery)   
        ])
        .then(function(rtn){
	        
	        return_obj.draw = parsedData.draw;
	        return_obj.data = rtn[0][0];
	        return_obj.recordsTotal = rtn[1][0][0].cnt;
	        return_obj.recordsFiltered = rtn[2][0][0].cnt;
	        
	        
	        return return_obj;
        })

		
	}
	function mysqlResultObjIntoArray(obj){
		var rtn = [];
		var tmp_arr = [];
		
		for(var i in obj[0]){
			tmp_arr = [];
			for(var j in obj[0][i]){
				tmp_arr.push(obj[0][i][j]);
			}
			rtn.push(tmp_arr);
		}
		return rtn;
	}
	
	return querybuilder();
};