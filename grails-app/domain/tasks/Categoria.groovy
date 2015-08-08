package tasks

class Categoria {
	String nome

	static hasMany = [tasks:Task]

	String toString(){
		this.nome
	}

	def toArray(){
		[id: this.id, nome: this.nome]
	}
	
    static constraints = {
    }
}
