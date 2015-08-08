if ($(location).attr('hostname') == "localhost"){
	window.urlPath = "http://" + $(location).attr('host') + "/tasks/";
} else {
	window.urlPath = "http://" + $(location).attr('host') + "/";
}

(function($) {
  $.fn.extend({
    toObject: function() {
      var result = {}
      $.each(this.serializeArray(), function(i, v) {
        result[v.name] = v.value;
      });
      return result;
      },
    fromObject: function(obj) {
      $.each(this.find(':input'), function(i,v) {
        var name = $(v).attr('name');
        if (obj[name]) {
          $(v).val(obj[name]);
        } else {
          $(v).val('');
        }
      });
    }
  });
})(jQuery);

categoriasController = function() {
	function errorLogger(errorCode, ErrorMessage){
		console.log(errorCode+':'+errorMessage);
	}
	var categoriaPage;
	var initialised = false;
	var type = "categoria";
	return {
		init : function(page) {
			if (!initialised) {
				storageEngine.init( function() { categoriasController.loadCategorias(); }, errorLogger );
				categoriaPage = page;
				$(categoriaPage).find('[required="required"]').prev('label').append('<span>*</span>').children( 'span').addClass('required');
				$(categoriaPage).find('tbody tr:even').addClass('even');
				$(categoriaPage).find( '#btnAddCategoria' ).click( function(evt) {
					evt.preventDefault();
					$(categoriaPage ).find('#categoriaCreation').removeClass('not');
				});
				$(categoriaPage).find( '#clearCategoria' ).click( function(evt) {
					evt.preventDefault();
					$(categoriaPage).find('#categoriaForm').trigger('reset');
				});
				$(categoriaPage).find('tbody').click(function(evt) {
					$(evt.target ).closest('td').siblings( ).andSelf( ':not(nav)' ).toggleClass( 'rowHighlight');
				});
				$(categoriaPage).find('#tblCategorias tbody').on('click', '.deleteRow', 
					function(evt) { 					
						storageEngine.delete(type, $(evt.target).data().categoriaId, 
							function() {
								$(evt.target).parents('tr').remove(); 
							}, errorLogger);
						categoriasController.countCategorias();
					}
				);
				$(categoriaPage).find('#saveCategoria').click(function(evt) {
					evt.preventDefault();
					if ($(categoriaPage).find('form').valid()) {
						var categoria = $(categoriaPage).find('form').toObject();
						storageEngine.save(type, categoria, function() {
							$(categoriaPage).find('#tblCategorias tbody').empty();
							categoriasController.loadCategorias();
							$(':input:not(select)').val('');
							$(categoriaPage).find('#categoriaCreation').addClass('not');
						}, errorLogger);
					}
				});
				$(categoriaPage).find('#tblCategorias tbody').on('click', '.editRow', 
					function(evt) { 
						$(categoriaPage).find('#categoriaCreation').removeClass('not');
						storageEngine.findById(type, $(evt.target).data().categoriaId, function(categoria) {
							$(categoriaPage).find('form').fromObject(categoria);
						}, errorLogger);
					}
				);				
				initialised = true;
			}
    	},
		loadCategorias : function() {
			storageEngine.findAll(type, 
				function(categorias) {
					$.each(categorias, function(index, categoria) {
						$('#categoriaRow').tmpl(categoria).appendTo($(categoriaPage).find('#tblCategorias tbody'));
					});
					categoriasController.countCategorias();
				}, 
				errorLogger);
		},
		countCategorias : function() {
			storageEngine.countCategorias(function(data){
				$('#categoriaCount').text(data.count);
			}, errorLogger);
		}	
	}
}();

