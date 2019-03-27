import { Component, OnInit } from '@angular/core';
import { Licencia } from './../../../_models/licencia';
import { ActividadesService } from './../../../_services/actividades.service';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-cargar-licencia',
  templateUrl: './cargar-licencia.page.html',
  styleUrls: ['./cargar-licencia.page.scss'],
})
export class CargarLicenciaPage implements OnInit {
 
  licencia = new Licencia();
  cargaCorrecta = false;
  loading = false;
  error= '';
  constructor(
    private licenciaService: ActividadesService,
    private route: ActivatedRoute,
    private router: Router,) { }

  ngOnInit() {
    this.licencia.idInspector=2;
    this.licencia.medica="T";

  }

  onSubmit() { 
    console.log("cargar");
    this.loading = true;

    /* convertir la fecha de inicio al formato que acepta el backend*/
    let inicio= new Date(this.licencia.inicio);
    inicio.setSeconds(3*60*60);
    let formatoCorrectoInicio=(inicio.getMonth()+1).toString()+"-"+inicio.getDate()+"-"+inicio.getFullYear();
    this.licencia.inicio=formatoCorrectoInicio;


    /* convertir la fecha de fin al formato correcto el backend*/
    let fin= new Date(this.licencia.fin);
    fin.setSeconds(3*60*60);
    let formatoCorrectoFin=(fin.getMonth()+1).toString()+"-"+fin.getDate()+"-"+fin.getFullYear();
    this.licencia.fin=formatoCorrectoFin;


    this.licenciaService.addLicencia(this.licencia).subscribe(
        data => {
          console.log(data);
           this.loading=false;
           this.licencia = new Licencia();
           this.error = '';
           alert(data);
        },
        error => {
            this.error = error;
            this.loading = false;
        });;
  
  }

  // TODO: Remove this when we're done
  get diagnostic() { return JSON.stringify(this.licencia); }

}
