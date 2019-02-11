import { Component, OnInit } from '@angular/core';
import { Todo, TodoService } from './../../services/todo.service';
import { Inspeccion } from './../../_models/inspeccion';

@Component({
  selector: 'app-informes',
  templateUrl: './informes.page.html',
  styleUrls: ['./informes.page.scss'],
})
export class InformesPage implements OnInit {
  inspecciones: Inspeccion[];

  constructor( private todoService: TodoService,) { }

  ngOnInit() {
    this.todoService.getInspecciones()
      .subscribe(inspecciones => this.inspecciones = inspecciones);
  }

}
