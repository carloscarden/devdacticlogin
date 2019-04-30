import { Component, OnInit } from '@angular/core';
import { Licencia } from './../../../_models/licencia';
import { ActividadesService } from './../../../_services/actividades.service';
import { Router, ActivatedRoute } from '@angular/router';
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
  constructor(
    private licenciaService: ActividadesService,
    private route: ActivatedRoute,
    private router: Router,
    private alertCtrl: AlertController) { }

  ngOnInit() {
    this.licencia.medica="F";

  }

  async presentAlert(msj) {
    const alert = await this.alertCtrl.create({
      header: msj,
      buttons: ['OK']
    });

    await alert.present();
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

    this.licencia.idInspector=2;

    if(this.tipoLicencia){
      this.licencia.medica="T"
    }
    else{
      this.licencia.medica="F"
    }


    this.licenciaService.addLicencia(this.licencia).subscribe(
        data => {
          console.log(data);
          this.loading=false;
          this.licencia = new Licencia();
          this.error = '';
          this.presentAlert("Enviado con éxito.  ");
        },
        error => {
          this.presentAlert("Hubo un error, intente nuevamente. ");
          this.error = error;
          this.loading = false;
        });;
  
  }

  // TODO: Remove this when we're done
  get diagnostic() { return JSON.stringify(this.licencia); }

}
