import { Component, OnInit } from '@angular/core';


import { first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { IonicSelectableComponent } from 'ionic-selectable';
import { Subscription } from 'rxjs';

/*  SERVICES */
import { ActividadesService } from './../../../_services/actividades.service';

/*  MODELOS */
import { Convocatoria } from './../../../_models/convocatoria';
import { TipoConvocatoria } from './../../../_models/tipo-convocatoria';




@Component({
  selector: 'app-cargar-convocatoria',
  templateUrl: './cargar-convocatoria.page.html',
  styleUrls: ['./cargar-convocatoria.page.scss'],
})
export class CargarConvocatoriaPage implements OnInit {
  convocatoria = new Convocatoria();
  tiposConvocatorias: TipoConvocatoria[];
  actividadesSubscription: Subscription;
  cargaCorrecta = false;
  loading = false;
  error= '';
  constructor(private convocatoriaService: ActividadesService,) { }

  ngOnInit() {
  }

  onSubmit() {
    this.loading = true;

    this.convocatoriaService.addConvocatoria(this.convocatoria).pipe(first())
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

   // TODO: Remove this when we're done
  get diagnostic() { return JSON.stringify(this.convocatoria); }


  filterPorts(tipos: TipoConvocatoria[], text: string) {
    return tipos.filter(t => {
      return t.descripcion.toLowerCase().indexOf(text) !== -1 ;
    });
  }

  searchPorts(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    let text = event.text.trim().toLowerCase();
    event.component.startSearch();

    // Close any running subscription.
    if (this.actividadesSubscription) {
      this.actividadesSubscription.unsubscribe();
    }
    this.convocatoriaService.getTipoConvocatorias();

    this.actividadesSubscription = this.convocatoriaService.getTipoConvocatorias().subscribe(tipos => {
      // Subscription will be closed when unsubscribed manually.
     if (this.actividadesSubscription.closed) {
        return;
      }

      event.component.items = this.filterPorts(tipos, text);
      event.component.endSearch();
    });
  }





}
