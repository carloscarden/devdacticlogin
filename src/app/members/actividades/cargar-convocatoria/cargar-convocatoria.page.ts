import { Component, OnInit } from '@angular/core';
import { Convocatoria } from './../../../_models/convocatoria';
import { ActividadesService } from './../../../_services/actividades.service';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cargar-convocatoria',
  templateUrl: './cargar-convocatoria.page.html',
  styleUrls: ['./cargar-convocatoria.page.scss'],
})
export class CargarConvocatoriaPage implements OnInit {
  tipos = [
    'Plenario', 'Concurso', 'Prueba Seleccion', 
    'Capacitacion','Citacion de Autoridad Competente', 'Otro'
  ];

  convocatoria = new Convocatoria();
  loading = false;
  error= '';
  constructor(private licenciaService: ActividadesService,) { }

  ngOnInit() {
  }

  onSubmit() {
    this.loading = true;

    this.licenciaService.addConvocatoria(this.convocatoria).pipe(first())
    .subscribe(
        data => {
           this.loading=false;
           this.convocatoria = new Convocatoria();
           this.error = '';
           alert(data);
        },
        error => {
            this.error = error;
            this.loading = false;
        });;

   }
}
