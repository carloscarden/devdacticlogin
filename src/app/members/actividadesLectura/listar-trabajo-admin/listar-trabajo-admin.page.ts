import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';


import { Todo, TodoService } from './../../../_services/todo.service';


import { Inspeccion } from './../../../_models/inspeccion';

@Component({
  selector: 'app-listar-trabajo-admin',
  templateUrl: './listar-trabajo-admin.page.html',
  styleUrls: ['./listar-trabajo-admin.page.scss'],
})
export class ListarTrabajoAdminPage implements OnInit {
  url;
  inspecciones: Inspeccion[];
  constructor( private router:Router, private todoService: TodoService) { }

  ngOnInit() {
    this.todoService.getInspecciones()
    .subscribe(inspecciones => this.inspecciones = inspecciones);
  }

  onChange(newValue) {
    console.log("onChange");
    console.log(this.url);

    this.router.navigateByUrl(this.url);
  
  
  }

}
