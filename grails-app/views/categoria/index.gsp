<%@ page import="tasks.Categoria" %>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
	<title>Tarefas</title>
	<link rel="stylesheet" href="/tasks/assets/tasks.css?compile=false"  /><!--css-->
	<meta name="layout" content="main-categoria">
	<g:set var="entityName" value="${message(code: 'categoria.label', default: 'Categoria')}" />
	<title><g:message code="default.list.label" args="[entityName]" /></title>
</head>
<body>
	<main id="categoriaPage">
		<section id="categoriaCreation" class="not">
			<form id="categoriaForm">
				<input type="hidden" name="id" />
				<div>
					<label>Nome</label> 
					<input type="text" required="required" name="nome" maxlength="200" class="large" placeholder="Nome da categoria" />
				</div>
				<nav>
					<a href="#" id="saveCategoria">Salvar Categoria</a> <a href="#" id="clearCategoria">Limpar Categoria</a>
				</nav>
			</form>
		</section>
		<section>
			<table id="tblCategorias">
					<colgroup>
						<col width="15%">
						<col width="50%">
						<col width="35%">
					</colgroup>
				<thead>
					<tr>
						<th>Código</th>
						<th>Nome</th>
						<th>Ações</th>
					</tr>
				</thead>
				<tbody>
				</tbody>
			</table>
			<nav class="bottom">
				<a href="#" id="btnAddCategoria">Adicionar Categoria</a>
				<g:link controller="task" action="index">Voltar</g:link>
			</nav>
		</section>
	</main>
	<footer>Direitos reservados</footer>
<script id="categoriaRow" type="text/x-jQuery-tmpl">
<tr row-categoria-id="{{= id }}">
	<td>{{= id }}</td>
	<td>{{= nome }}</td>
	<td>
		<nav>
			<a href="#" class="editRow" data-categoria-id="{{= id }}">Editar</a>
			<a href="#" class="deleteRow" data-categoria-id="{{= id }}">Deletar</a>
		</nav>
	</td>
</tr>
</script>

<script>
	$(document).ready(function() {
		categoriasController.init($('#categoriaPage'));
	});
</script>


</body>

</html>
