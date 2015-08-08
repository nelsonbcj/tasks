
<%@ page import="tasks.Categoria" %>
<!DOCTYPE html>
<html>
	<head>
		<meta name="layout" content="main">
		<g:set var="entityName" value="${message(code: 'categoria.label', default: 'Categoria')}" />
		<title><g:message code="default.list.label" args="[entityName]" /></title>
	</head>
	<body>
		<div id="list-categoria" class="content scaffold-list" role="main">
			<h1 class="capa"><g:message code="default.list.label" args="[entityName]" /></h1>
			<g:if test="${flash.message}">
				<div class="message" role="status">${flash.message}</div>
			</g:if>
			<table id="tblCategorias">
			<thead>
					<tr>
						<g:sortableColumn property="nome" title="${message(code: 'categoria.nome.label', default: 'Nome')}" />
						<th></th>
					</tr>
				</thead>
				<tbody>
				<g:each in="${categoriaInstanceList}" status="i" var="categoriaInstance">
					<tr class="${(i % 2) == 0 ? 'even' : 'odd'}">
					
						<td><g:link action="show" id="${categoriaInstance.id}">${fieldValue(bean: categoriaInstance, field: "nome")}</g:link></td>
						<td>
							<nav>
							<g:link action="edit" id="${categoriaInstance.id}">Editar</g:link>
							<a href="#" class="deleteRow" data-categoria-id="${categoriaInstance.id}">Deletar</a>
							</nav>
						</td>
					
					</tr>
				</g:each>
				</tbody>
			</table>
			<div class="pagination">
				<g:paginate total="${categoriaInstanceCount ?: 0}" />
			</div>
		</div>
		<div class="nav" role="navigation">
			<nav>
				<a class="home" href="${createLink(uri: '/')}"><g:message code="default.home.label"/></a></li>
				<g:link class="create" action="create"><g:message code="default.new.label" args="[entityName]" /></g:link></li>
			</nav>
		</div>
<script type='text/javascript'>
	$('#tblCategorias tbody').on('click', '.deleteRow', 
		function(evt) { 					
			deleteCategoria($(evt.target).data().categoriaId);
		}
	);	

	function deleteCategoria(id){
		$.ajax({method: "POST", url: "/tasks/categoria/delete/"+id}).done(
			function(id){
				$('#list-categoria').append("<div class='message' role='status'>Item removido com sucesso: " + id + "</div>");
			});	
	}

</script>		
	</body>
</html>
