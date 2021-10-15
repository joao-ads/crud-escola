import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Professor } from '../professor';
import { ProfessorService } from '../professor.service';

@Component({
	selector: 'app-professor',
	templateUrl: './professor.component.html',
	styleUrls: ['./professor.component.css']
})
export class ProfessorComponent implements OnInit {
	// iniciando as variáveis
	profName: string = '';
	profCpf: string = '';
	profDisciplina: string = '';
	professores: Professor[] = []; // tipo array
	profEdit: Professor = null; // nulo


	private unsubscribe$: Subject<any> = new Subject();

	constructor(
		private professorService: ProfessorService,
		private snackbar: MatSnackBar) { }

	// ngOnInit aparece logo que a pagina é criada
	ngOnInit() {
		this.professorService.get() //get para trazer as infos do BD
			.pipe(takeUntil(this.unsubscribe$)) // takeuntil leva alguns segundos - monitoria
			.subscribe((profs) => this.professores = profs) // preenche o array q ta vazio
	}

	// método save - para salvar quando criar e quando alterar
	save() {
		if (this.profEdit) {
			this.professorService.update(
				{ name: this.profName, _id: this.profEdit._id, cpf: this.profCpf, disciplina: this.profDisciplina  }
			).subscribe(
				(prof) => {
					this.notify('Alterado!')
				},
				(err) => {
					this.notify('Erro!');
					console.log(err)
				}
			)
		} else {
			this.professorService.add({ name: this.profName, cpf: this.profCpf, disciplina: this.profDisciplina })
			.subscribe(
				(prof) => {
					console.log(prof);
					this.notify('Inserido!')
				},
				(err) => {
					console.error(err);
				}
			)
		}
		this.clearFields();
	}

	// método de editar
	edit(prof: Professor){
		this.profName = prof.name;
		this.profCpf = prof.cpf;
		this.profDisciplina = prof.disciplina;
		this.profEdit = prof;
	}

	delete(prof:Professor){
		this.professorService.del(prof)
		.subscribe(
			() => this.notify('Removido!'),
			(err) => this.notify(err.error.msg)
		)
	}

	// limpa o formulário
	clearFields() {
		this.profName = '';
		this.profCpf = '';
		this.profDisciplina = '';
		this.profEdit = null;
	}

	// vai ser chamado para cancelar (limpar)
	cancel() {
		this.clearFields();
	}

	//emite notificação
	notify(msg: string) {
		this.snackbar.open(msg, 'OK', { duration: 3000 });
	}

	//para destruir
	ngOnDestroy() {
		this.unsubscribe$.next();
	}


}
