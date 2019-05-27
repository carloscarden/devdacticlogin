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

            var a = new Date(this.licencia.inicio);
            var inicioSinHoras= new Date(a.getFullYear(),a.getMonth(),a.getDate());

            var b = new Date(this.licencia.fin);
            var finSinHoras= new Date( b.getFullYear(), b.getMonth(), b.getDate());
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
    let inicio= new Date(this.licencia.inicio);
    inicio.setSeconds(3*60*60);
    let month= inicio.getMonth()+1;
    let formatoCorrectoInicio=(inicio.getMonth()+1).toString()+"-"+inicio.getDate()+"-"+inicio.getFullYear();
    this.licencia.inicio=formatoCorrectoInicio;


    /* convertir la fecha de fin al formato correcto el backend*/
    let fin= new Date(this.licencia.fin);
    fin.setSeconds(3*60*60);
    let formatoCorrectoFin=(fin.getMonth()+1).toString()+"-"+fin.getDate()+"-"+fin.getFullYear();
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
