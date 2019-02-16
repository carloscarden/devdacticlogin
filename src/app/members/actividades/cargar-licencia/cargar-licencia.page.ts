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
  }

  onSubmit() { 
    
    
    this.loading = true;
    this.licenciaService.addLicencia(this.licencia).pipe(first())
    .subscribe(
        data => {
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
