storageEngine = function() {
	var initialized = false;
	return {
		init : function(successCallback, errorCallback) {
			initialized = true;
			successCallback(null);
		},
		save : function(type, obj, successCallback, errorCallback) {
			console.log(obj);
			$.ajax({
				method: "post", 
				url: window.urlPath + "task/save", 
				data: obj
			})
			.done(function( msg ){
				successCallback(obj);
			});
		},
		
		complete : function(type, obj, successCallback, errorCallback){
			$.ajax({method: "POST", url: window.urlPath + "task/complete/"+obj.id}).done(function(msg){successCallback(obj)});	
		},
		findAll : function(type, successCallback, errorCallback) {
				var aTasks = [];
			$.ajax({method: 'GET', dataType: "JSON", url: window.urlPath + "task/list", 
					success: function (data) {
						var tasks = [];
						$.each(data, function(k, v){
							tasks.push(v);
						});
						successCallback(tasks);
					}
				});
		},
		delete : function(type, id, successCallback, errorCallback) {
			$.ajax({method: 'DELETE', dataType: 'JSON', url: window.urlPath + 'task/delete/'+id});
			successCallback(id);
		},
		findByProperty : function(type, propertyName, propertyValue, successCallback, errorCallback) {
			$.ajax({
				method: 'GET', 
				dataType: 'JSON', 
				url: 'task/countTasks/'+propertyName+'/'+propertyValue, 
				success: function(data){
				var tasks = [];
				$.each(data, function(k, v){
					tasks.push(v);
				});
				successCallback(tasks);
			}})
		},
		countTasks : function (successCallback, errorCallback){
			$.ajax({method: 'GET', dataType: 'JSON', url: window.urlPath + 'task/countTasks', success: function(data){
				successCallback(data);
			}});
		},
		findById : function (type, id, successCallback, errorCallback) {
			$.ajax({method: 'GET', dataType: 'JSON', url: window.urlPath + 'task/getById/'+id, success: function(task){
				console.log(task);
				successCallback(task);
			}});
		}
	}
}();

