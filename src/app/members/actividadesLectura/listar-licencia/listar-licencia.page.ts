import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';

/* SERVICES */
import { Todo, TodoService } from './../../../_services/todo.service';
import { ActividadesService } from './../../../_services/actividades.service';

/* MODELS */
import { Inspeccion } from './../../../_models/inspeccion';
import { Licencia } from './../../../_models/licencia';
import { Pagina } from './../../../_models/pagina';

@Component({
  selector: 'app-listar-licencia',
  templateUrl: './listar-licencia.page.html',
  styleUrls: ['./listar-licencia.page.scss'],
})
export class ListarLicenciaPage implements OnInit {
  url;
  constructor( private router:Router,
    private todoService: TodoService,
    private licenciaService:ActividadesService ) { }

    inspecciones: Inspeccion[];
    licencias: Pagina;


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
