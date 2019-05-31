import { Component, OnInit } from '@angular/core';
import { Licencia } from './../../../_models/licencia';

import { AuthenticationService } from './../../../_services/authentication.service';
import { LicenciaServiceService } from './../../../_services/licencia-service.service';

import { AlertController } from '@ionic/angular';




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
  tipoLicencia=false;
  fechasNoValidas=false;



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
    monthsList: ["En", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
    weeksList: ["D", "L", "M", "M", "J", "V", "S"],
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
  constructor(
    private licenciaService: LicenciaServiceService,
    private authenticationService: AuthenticationService,
    private alertCtrl: AlertController) { }

  ngOnInit() {
    this.licencia.medica="F";
    this.licencia.codigo="";
  }

  async presentAlert(msj) {
    const alert = await this.alertCtrl.create({
      header: msj,
      buttons: ['OK']
    });

    await alert.present();
  }

  validarFechas(){

     if(this.licencia.inicio!=null){
        if(this.licencia.fin!=null){

            var a = this.licencia.inicio.split("-");
            var inicioSinHoras= new Date( parseInt(a[2]) ,parseInt(a[1]), parseInt(a[0]) );

            var b = this.licencia.fin.split("-");
            var finSinHoras= new Date( parseInt(b[2]), parseInt(b[1]), parseInt(b[0]));
             if(finSinHoras<inicioSinHoras){
               this.fechasNoValidas=true;
             }
             else{
               this.fechasNoValidas=false;
             }
        }
     }

  }

  onSubmit() { 
    console.log("cargar");
    this.loading = true;

    /* convertir la fecha de inicio al formato que acepta el backend*/
    let inicio= this.licencia.inicio.split("-");
    let formatoCorrectoInicio=inicio[1]+"-"+inicio[0]+"-"+inicio[3];
    this.licencia.inicio=formatoCorrectoInicio;


    /* convertir la fecha de fin al formato correcto el backend*/
    let fin= this.licencia.fin.split("-");
    let formatoCorrectoFin=fin[1]+"-"+fin[0]+"-"+fin[3];
    this.licencia.fin=formatoCorrectoFin;

    let currentUser = this.authenticationService.currentUserValue;
    this.licencia.inspectorId=currentUser.id;

    if(this.tipoLicencia){
      this.licencia.medica="T"
    }
    else{
      this.licencia.medica="F"
    }

    console.log(this.licencia);


    this.licenciaService.addLicencia(this.licencia).subscribe(
        data => {
          this.loading=false;
          this.licencia = new Licencia();
          this.error = '';
          this.licencia.medica="F";
          this.licencia.codigo="";
          this.presentAlert("Enviado con éxito.  ");

        },
        error => {
          console.log(error);
          this.licencia = new Licencia();
          this.error = '';
          this.licencia.medica="F";
          this.licencia.codigo="";
          this.presentAlert("Hubo un error, intente nuevamente. ");
          this.error = error;
          this.loading = false;
        });;
  
  }

  // TODO: Remove this when we're done
  get diagnostic() { return JSON.stringify(this.licencia); }

}
