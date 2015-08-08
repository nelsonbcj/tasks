package tasks



import static org.springframework.http.HttpStatus.*
import grails.transaction.Transactional

@Transactional(readOnly = true)
class CategoriaController {

    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE", get: "countCategorias"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond Categoria.list(params)
    }

    def countCategorias(){
        render(contentType: "text/json"){
            [count: 0]
        }
    }

    def list(){
        def map = [:]
        Categoria.list(sort: "nome", order: "asc").each(){
            map.put(it.id, it.toArray())
        }
        render(contentType: "text/json") { map }
    }

    def getById(){
        def categoria = Categoria.get(params.id)
        render(contentType: "text/json"){
            categoria.toArray()
        }
    }

    def create(){
        respond new Categoria(params)
    }

    @Transactional
    def save() {
        def categoria
        if (params?.id){
            categoria = Categoria.get(params.id)
        } else {
            categoria = new Categoria()
        }
        categoria.nome = params.nome

        categoria.save flush:true

        render(contentType: "text/json"){
            json
        }
    }

    @Transactional
    def delete() {
        def categoria
        if (params?.id){
            categoria = Categoria.get(params.id)
            println categoria
            categoria.delete (flush: true, failOnError: true)
            if (categoria.hasErrors()){
                println categoria.errors
            }
            flash.message = message(code: 'default.deleted.message', args: [message(code: 'Categoria.label', default: 'Categoria'), categoria.id])
        }
        render(contentType: "text/json"){
            json
        }
    }

    protected void notFound() {
        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.not.found.message', args: [message(code: 'categoria.label', default: 'Categoria'), params.id])
                redirect action: "index", method: "GET"
            }
            '*'{ render status: NOT_FOUND }
        }
    }
}
