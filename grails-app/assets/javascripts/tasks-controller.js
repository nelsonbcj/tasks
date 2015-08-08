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

tasksController = function() {
	function errorLogger(errorCode, ErrorMessage){
		console.log(errorCode+':'+errorMessage);
	}
	var taskPage;
	var initialised = false;
	var type = "task";
	return {
		init : function(page) {
			if (!initialised) {
				storageEngine.init( function() { tasksController.loadTasks(); }, errorLogger );
				taskPage = page;
				$(taskPage).find('[required="required"]').prev('label').append('<span>*</span>').children( 'span').addClass('required');
				$(taskPage).find('tbody tr:even').addClass('even');
				
				$(taskPage).find( '#btnAddTask' ).click( function(evt) {
					evt.preventDefault();
					$(taskPage ).find('#taskCreation').removeClass('not');
				});
				
				//Função para limpar o formulario (Questão 2)
				$(taskPage).find( '#clearTask' ).click( function(evt) {
					evt.preventDefault();
					$(taskPage).find('#taskForm').trigger('reset');
				});

				// Função/Listener para destacar a linha clicada
				$(taskPage).find('tbody').click(function(evt) {
					$(evt.target ).closest('td').siblings( ).andSelf( ':not(nav)' ).toggleClass( 'rowHighlight');
				});

				// Função/Listener para apagar uma tarefa
				$(taskPage).find('#tblTasks tbody').on('click', '.deleteRow', 
					function(evt) { 					
						storageEngine.delete(type, $(evt.target).data().taskId, 
							function() {
								$(evt.target).parents('tr').remove(); 
							}, errorLogger);
						tasksController.countTasks();
					}
				);

				//Metodo que completa umam tarefa (Questão 4)
				$(taskPage).find('#tblTasks tbody').on('click', '.completeRow', 
					function(evt) { 
						storageEngine.findById(type, $(evt.target).data().taskId, function(task) {							
							storageEngine.complete(type, task, function(){								
								$(evt.target).parents().eq(1).siblings().addClass('taskCompleted');								
								$(evt.target).fadeOut(1000);								
								$(evt.target).parent().find(".editRow").fadeOut(1000);								
								tasksController.countTasks();
							}, errorLogger);
						}, errorLogger);
					});	
				
				$(taskPage).find('#saveTask').click(function(evt) {
					evt.preventDefault();
					if ($(taskPage).find('form').valid()) {
						var task = $(taskPage).find('form').toObject();
						storageEngine.save(type, task, function() {
							$(taskPage).find('#tblTasks tbody').empty();
							tasksController.loadTasks();
							$(':input:not(select)').val('');
							$(taskPage).find('#taskCreation').addClass('not');
						}, errorLogger);
					}
				});

				$(taskPage).find('#tblTasks tbody').on('click', '.editRow', 
					function(evt) { 
						$(taskPage).find('#taskCreation').removeClass('not');
						storageEngine.findById(type, $(evt.target).data().taskId, function(task) {
							$(taskPage).find('form').fromObject(task);
						}, errorLogger);
					}
				);				
				initialised = true;
			}
    	},
		
		loadTasks : function() {			
			storageEngine.findAll(type, 
				function(tasks) {
					$.each(tasks, function(index, task) { //Percorre todos os dados da tabela
						$('#taskRow').tmpl(task).appendTo($(taskPage).find('#tblTasks tbody'));						
						if ((Date.today().compareTo(Date.parse(task.requiredBy))) == 1){ //Pinta a lina da dabela com a cor avermelhada se requiredBy) comparado com a data atual der um numero menor que 0 (ou seja a data da tarefa é menor que a data atual tarefa em atrazo)
						 	$('tr[row-task-id="'+task.id+'"]').addClass('overdue');
						// Caso falso, testa novamente se a tarefa irá vencer nos próximos 3 dias, caso verdade atribui a classe CSS "warning"
						} else if (Date.parse(task.requiredBy).between(Date.today(), Date.today().add({ days: 3 }))){
							$('tr[row-task-id="'+task.id+'"]').addClass('warning'); //Pinta de amarela a linha caso a data da tarefa (day) em comparação com o intrvalo da data atual e mais dois dias retornar um valor menor ou igual 0 (ou seja comparará a data da tarefa com o intervalo de data atual mais dois dias implicando que a data do Deadline da tarefa esta proximo ou é o dia)
						}
						//Metodo que completa umam tarefa (Questão 4)
						if (task.complete == 'Ok'){
							$('tr[row-task-id="'+task.id+'"]').addClass('taskCompleted');
							$('a[data-task-id="'+task.id+'"]').first().next().hide();
							$('a[data-task-id="'+task.id+'"]').first().hide();
						}
					});
					
					tasksController.countTasks();// Atualiza a informçã de quantidade de tarefas no rodapé.
				}, 
				errorLogger);
		},
		
		countTasks : function() {
			storageEngine.countTasks(function(data){
				$('#taskCount').text(data.count);
			}, errorLogger);

		}	

	}
}();

