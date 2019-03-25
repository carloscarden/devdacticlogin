import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterEvent } from '@angular/router';

/*  SERVICES */
import { ActividadesService } from './../../../_services/actividades.service';
import { Todo, TodoService } from './../../../_services/todo.service';


/*  MODELOS */
import { Convocatoria } from './../../../_models/convocatoria';
import { TipoConvocatoria } from './../../../_models/tipo-convocatoria';
import { Imagen } from './../../../_models/imagen';
import { Inspeccion } from './../../../_models/inspeccion';


@Component({
  selector: 'app-listar-convocatoria',
  templateUrl: './listar-convocatoria.page.html',
  styleUrls: ['./listar-convocatoria.page.scss'],
})
export class ListarConvocatoriaPage implements OnInit {
  inspecciones: Inspeccion[];
  url="";

  constructor(private convocatoriaService: ActividadesService,
              private router:Router,
              private todoService: TodoService) { }

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
