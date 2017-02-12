var parser = require('datatable-parser');

module.exports = function(db , DT_data , tablename){
	var parsedData = parser(DT_data);
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
		return columns.join(",");
	}
	function limit(start , length){
		return " limit "+start+","+length;
	}
	function where(search){
		
		var where = " ";
		var searcharr = [];
		for(var i in search){			
			console.log()
			
			if(typeof search[i][Object.keys(search[i])] == "object" ){
				//regexp search
				searcharr.push(" "+Object.keys(search[i])+" REGEXP "+ search[i][Object.keys(search[i])].toString().replace("/","'").replace("/","'") )	
			}else{
				searcharr.push(" "+Object.keys(search[i])+" = ? ")
				stmt.push( search[i][Object.keys(search[i])]);	
			}
		}
		if(search.length > 0) where += " AND ("+searcharr.join(" OR ")+") ";

		
		return where;
	}
	function orderby(order){
		var orderby = "";
		var orderbyArr=[];
		for(var i in order){
			orderbyArr.push(order[i][0]+" "+order[i][1]);
		}
		if(order.length > 0) orderby += " ORDER BY "+orderbyArr.join(",");
		
		return orderby;
	}
	
	function querybuilder(){
		
		var columnsQuery = columns(parsedData.columns);
		var limitQuery = limit(parsedData.start , parsedData.length);
		var whereQuery = where(parsedData.search);
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