import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

import { IonicSelectableComponent } from 'ionic-selectable';
import { Subscription } from 'rxjs';


/*  MODELO  */
import { Encuadre } from 'src/app/_models/encuadre';
import { Licencia } from './../../../_models/licencia';

/* SERVICES */
import { AuthenticationService } from './../../../_services/authentication.service';
import { LicenciaServiceService } from './../../../_services/licencia-service.service';




@Component({
  selector: 'app-cargar-licencia',
  templateUrl: './cargar-licencia.page.html',
  styleUrls: ['./cargar-licencia.page.scss'],
})
export class CargarLicenciaPage implements OnInit {

  licencia = new Licencia();
  cargaCorrecta = false;
  loading = false;
  error = '';
  tipoLicencia = false;
  fechasNoValidas = false;



  datePickerObj: any = {
    showTodayButton: false, // default true
    fromDate: new Date('2016-12-08'), // default null
    toDate: new Date('2100-12-28'),
    closeOnSelect: true, // default false
    setLabel: 'Aceptar',  // default 'Set'
    todayLabel: 'Hoy', // default 'Today'
    closeLabel: 'Cancelar', // default 'Close'
    dateFormat: 'DD-MM-YYYY',
    titleLabel: 'Seleccione una fecha', // default null
    monthsList: ['En', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    weeksList: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
    momentLocale: 'es-AR', // Default 'en-US'
    btnProperties: {
      expand: 'block', // Default 'block'
      fill: '', // Default 'solid'
      size: '10px', // Default 'default'
      disabled: '', // Default false
      strong: '', // Default false
      color: '' // Default ''
    },
    arrowNextPrev: {
      nextArrowSrc: 'assets/images/arrow_right.svg',
      prevArrowSrc: 'assets/images/arrow_left.svg'
    } // This object supports only SVG files.
  };


  encuadres: Encuadre[] = [];
  pageEncuadres = 0;
  maximumPages;
  articuloAfiltrar = '';
  size = 15;
  encuadresSubscription: Subscription;

  constructor(
    private licenciaService: LicenciaServiceService,
    private authenticationService: AuthenticationService,
    private alertCtrl: AlertController) {
    this.licenciaService.getEncuadres(this.size, this.pageEncuadres, this.articuloAfiltrar).subscribe(
      resEncuadres => {
        console.log('resEncuadres content', resEncuadres['content']);
        this.encuadres = this.encuadres.concat(resEncuadres['content']);
        this.pageEncuadres++;
        this.maximumPages = resEncuadres.totalPages - 1;
      }
    );
  }

  ngOnInit() {
    this.licencia.medica = 'F';
    this.licencia.codigo = '';
    this.licencia.encuadre = new Encuadre();
  }

  async presentAlert(msj) {
    const alert = await this.alertCtrl.create({
      header: msj,
      buttons: ['OK']
    });

    await alert.present();
  }

  searchPorts(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    this.articuloAfiltrar = event.text;
    event.component.startSearch();
    console.log('texto a filtrar', this.articuloAfiltrar);


    // Close any running subscription.
    if (this.encuadresSubscription) {
      this.encuadresSubscription.unsubscribe();
    }

    this.pageEncuadres = 0;
    this.licenciaService.getEncuadres(this.size, this.pageEncuadres, this.articuloAfiltrar).subscribe(
      resEncuadres => {
        if (resEncuadres != null) {
          console.log('resEncuadres a filtrar', resEncuadres);
          event.component.items = resEncuadres['content'];
          this.maximumPages = resEncuadres.totalPages - 1;
          this.pageEncuadres++;
          event.component.endSearch();
          event.component.enableInfiniteScroll();

        } else {
          console.log('no hay encuadres');
          event.component.items = [];
          this.maximumPages = -1;
          this.pageEncuadres++;
          event.component.endSearch();
          event.component.endInfiniteScroll();
        }

      });

  }

  getMorePorts(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    // There're no more ports - disable infinite scroll.
    if (this.pageEncuadres > this.maximumPages) {
      event.component.disableInfiniteScroll();
      return;
    }

    this.licenciaService.getEncuadres(this.size, this.pageEncuadres, this.articuloAfiltrar).subscribe(
      resEncuadres => {
        console.log('resEncuadres', resEncuadres);
        resEncuadres = event.component.items.concat(resEncuadres['content']);



        event.component.items = resEncuadres;
        event.component.endInfiniteScroll();
        this.pageEncuadres++;
      });
  }


  onSubmit() {
    console.log('cargar');
    this.loading = true;

    /* convertir la fecha de inicio al formato que acepta el backend*/
    const inicio = this.licencia.inicio.split('-');
    const formatoCorrectoInicio = inicio[1] + '-' + inicio[0] + '-' + inicio[2];
    this.licencia.inicio = formatoCorrectoInicio;


    /* convertir la fecha de fin al formato correcto el backend*/
    const fin = this.licencia.fin.split('-');
    const formatoCorrectoFin = fin[1] + '-' + fin[0] + '-' + fin[2];
    this.licencia.fin = formatoCorrectoFin;

    const currentUser = this.authenticationService.currentUserValue;
    this.licencia.inspectorId = currentUser.id;

    if (this.tipoLicencia) {
      this.licencia.medica = 'T';
    } else {
      this.licencia.medica = 'F';
    }

    console.log(this.licencia);


    this.licenciaService.addLicencia(this.licencia).subscribe(
      data => {
        this.loading = false;
        this.licencia = new Licencia();
        this.error = '';
        this.licencia.medica = 'F';
        this.licencia.codigo = '';
        this.licencia.encuadre = new Encuadre();
        this.presentAlert('Enviado con éxito.  ');

      },
      error => {
        console.log(error);
        this.licencia = new Licencia();
        this.error = '';
        this.licencia.medica = 'F';
        this.licencia.codigo = '';
        this.licencia.encuadre = new Encuadre();
        this.presentAlert('Hubo un error, intente nuevamente. ');
        this.error = error;
        this.loading = false;
      });

  }

  // TODO: Remove this when we're done
  get diagnostic() { return JSON.stringify(this.licencia); }


  validarFechas() {

    if (this.licencia.inicio != null) {
      if (this.licencia.fin != null) {

        const a = this.licencia.inicio.split('-');
        const inicioSinHoras = new Date(parseInt(a[2], 10), parseInt(a[1], 10), parseInt(a[0], 10));

        const b = this.licencia.fin.split('-');
        const finSinHoras = new Date(parseInt(b[2], 10), parseInt(b[1], 10), parseInt(b[0], 10));
        if (finSinHoras < inicioSinHoras) {
          this.fechasNoValidas = true;
        } else {
          this.fechasNoValidas = false;
        }
      }
    }

  }


}
