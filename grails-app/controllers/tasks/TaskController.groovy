package tasks



import static org.springframework.http.HttpStatus.*
import grails.transaction.Transactional

@Transactional(readOnly = true)
class TaskController {

    static allowedMethods = [save: "POST", complete: "POST", update: "PUT", delete: "DELETE", get: "countTasks"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond Task.list(params), model:[taskInstance: new Task(), taskInstanceCount: Task]
    }

    def countTasks(){
        def tasks = Task.where{( complete == '' )}
        def count = tasks.count()
        render(contentType: "text/json"){
            [count: count]
        }
    }

    def listByProperty(){
        if (propertyName) {
            println propertyName 
        }
        if (propertyValue) {
            println propertyValue 
        }
        def map = [:]
        Task.list(sort: "requiredBy", order: "desc").each(){
            map.put(it.id, it.toArray());
        }
        render(contentType: "text/json"){ map }

    }

    def list(String propertyName, String propertyValue){
        def map = [:]
        Task.list(sort: "requiredBy", order: "desc").each(){
            map.put(it.id, it.toArray());
        }
        render(contentType: "text/json"){ map }
    }

    def getById(){
        def task = Task.get(params.id)     
        render(contentType: "text/json") {
            task.toArray()
        }         
    }

    def create() {
        respond new Task(params)
    }

    @Transactional
    def save(){
        def task
        if (params?.id){
            task = Task.get(params.id) 
        } else{
            task = new Task()
        }
        def categoria = Categoria.get(params.categoria)
        task.task = params.task
        task.complete = params.complete
        task.categoria = categoria
        task.requiredBy = new Date().parse('yyyy-MM-dd', params.requiredBy)
        task.save flsuh: true
        render(contentType: "text/json"){
            json
        }
    }
    @Transactional
    def complete(){
        def task
        if(params?.id){
            task = Task.get(params.id)
            task.complete = "Ok"
            task.save( flush: true, failOnError: true )
            if (task.hasErrors()) {
                println task.errors
            }
        } 
        render (contentType: "text/json"){
            json
        }
    }

    @Transactional
    def delete() {
        def task
        if(params?.id){
            task = Task.get(params.id)
            task.delete( flush: true, failOnError: true)
            if (task.hasErrors()){
                println task.errors
            }
            flash.message = message(code: 'default.deleted.message', args: [message(code: 'Task.label', default: 'Task'), task.id])
        }
        render(contentType: "text/json"){
            json
        }
    }

    protected void notFound() {
        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.not.found.message', args: [message(code: 'task.label', default: 'Task'), params.id])
                redirect action: "index", method: "GET"
            }
            '*'{ render status: NOT_FOUND }
        }
    }
}
