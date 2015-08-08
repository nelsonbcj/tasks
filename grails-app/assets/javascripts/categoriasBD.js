storageEngine = function() {
	var initialized = false;
	return {
		init : function(successCallback, errorCallback) {
			initialized = true;
			successCallback(null);
		},
		save : function(type, obj, successCallback, errorCallback) {
			$.ajax({
				method: "post", 
				url: window.urlPath + "categoria/save", 
				data: obj
			})
			.done(function( msg ){
				successCallback(obj);
			});
		},
		findAll : function(type, successCallback, errorCallback) {
			var aCategorias = [];
			$.ajax({method: 'GET', dataType: "JSON", url: window.urlPath + "categoria/list", 
					success: function (data) {
						var categorias = [];
						$.each(data, function(k, v){
							categorias.push(v);
						});
						successCallback(categorias);
					}
				});
		},
		delete : function(type, id, successCallback, errorCallback) {
			$.ajax({method: 'DELETE', dataType: 'JSON', url: window.urlPath + 'categoria/delete/'+id});
			successCallback(id);
		},
		countCategorias : function (successCallback, errorCallback){
			$.ajax({method: 'GET', dataType: 'JSON', url: window.urlPath + 'categoria/countCategorias', success: function(data){
				successCallback(data);
			}});
		},
		findById : function (type, id, successCallback, errorCallback) {
			$.ajax({method: 'GET', dataType: 'JSON', url: window.urlPath + 'categoria/getById/'+id, success: function(categoria){
				successCallback(categoria);
			}});
		}
	}
}();

