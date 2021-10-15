import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Professor } from './professor';
import { tap, delay } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class ProfessorService {

	readonly url = 'http://localhost:3000/professores';

	private professorSubject$: BehaviorSubject<Professor[]> = new BehaviorSubject<Professor[]>(null);

	private loaded: boolean = false;

	constructor(private http: HttpClient) { }

	get(): Observable<Professor[]> {
		if (!this.loaded) {
			this.http.get<Professor[]>(this.url)
				.pipe(
					tap((profs) => console.log(profs)), // gerar efeito colateral - uma espécie de notificação/msg par quando quiser mudar 
					delay(1000) // gerar atraso
				)
				.subscribe(this.professorSubject$);// se insceve pra ouvir o observable
			this.loaded = true;
		}
		return this.professorSubject$.asObservable(); // responsável por fazer a busca na api para conseguir listar no caso os departamentos que la contém 
	}
	// método add
	add(p: Professor): Observable<Professor> { // <> é do tipo department
		return this.http.post<Professor>(this.url, p)
			.pipe(
				tap((prof: Professor) => this.professorSubject$.getValue().push(prof))
			)
	}

	// método de deletar
	del(prof: Professor): Observable<any> { // <> é do tipo any
		return this.http.delete(`${this.url}/${prof._id}`)
		.pipe(
			tap(() => {
				let professores = this.professorSubject$.getValue();
				let i = professores.findIndex(p => p._id === prof._id);// compara o q tem guardado com o q está tentando excluir
				// vai retornar a posição do elemento que será deletado
				if (i >= 0) {
					// se for maior ou igual a 0 é pq existe na array
					professores.splice(i, 1); // vai alterar o conteúdo, remove o do id e coloca o 1 no lugar para n ter buracos, da pra ver o q for diferente de 1 no caso
				}
			})
		)
	}

	// método de alterar
	update(prof: Professor): Observable<Professor>{
		return this.http.patch<Professor>(`${this.url}/${prof._id}`, prof)// segundo paramanetro é o q vai alterar
		.pipe( // pipe pq serve como filtro
			tap((p)=>{ //tap causa uma ação no observable
				let professores = this.professorSubject$.getValue();
				let i = professores.findIndex(p => p._id === prof._id);
				if (i>=0){
					professores[i].name = p.name;
					professores[i].cpf = p.cpf
					professores[i].disciplina = p.disciplina;

				}
			})
		)
	}
}
