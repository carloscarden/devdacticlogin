import { Component, OnInit  } from '@angular/core';
import {  ModalController, AlertController } from '@ionic/angular';
import * as moment from 'moment';
import { Actividad } from 'src/app/_models/actividad';
import { Tarea } from 'src/app/_models/tarea';
import { AgendaServiceService } from 'src/app/_services/agenda-service.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';


import { IonicSelectableComponent } from 'ionic-selectable';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-event-modal',
  templateUrl: './event-modal.page.html',
  styleUrls: ['./event-modal.page.scss'],
})
export class EventModalPage implements OnInit {
  actividadesSubscription: Subscription;

  evento = new Tarea();
  selectedDay:any;


  quisoAgendarSinActividad=false;
  fechasNoValidas=false;
  noSonLicencias=false;
  esLicencia=false;


   //para las licencias
   inicio;
   fin;


   diaPermitido=false;
   diaCorrecto=true;
 
 
   // para las otras actividades
   fecha;
   horaInicio;
   horaFin;
   horasNoValidas=false;
   fechaNull=false;


   myDate;

   datePickerObj: any = {
     showTodayButton: false, // default true
     fromDate: new Date('2016-12-08'), // default null
     toDate: new Date('2100-12-28'),
     closeOnSelect: true, // default false
     setLabel: 'Aceptar',  // default 'Set'
     todayLabel: 'Hoy', // default 'Today'
     closeLabel: 'Cancelar', // default 'Close'
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
              private modalCtrl:ModalController, 
              private agendaService: AgendaServiceService,
              private authenticationService: AuthenticationService,
              private alertCtrl: AlertController) { }

              async presentAlert(msj) {
                const alert = await this.alertCtrl.create({
                  header: msj,
                  buttons: ['OK']
                });
            
                await alert.present();
              }

  ngOnInit() {
    //this.agendaService.getTipoActividades().subscribe(tipoActividades => {this.actividades = tipoActividades; console.log(tipoActividades)});
    let preselectedDate = moment(this.selectedDay).format();
    this.inicio = preselectedDate;
    this.fin = preselectedDate;
    this.fecha= preselectedDate;
    this.horaInicio= preselectedDate;
    this.horaFin = preselectedDate;

    var d= new Date();
    var dias=["dom", "lun", "mar", "mie", "jue", "vie", "sab"];
    var diaDeLaSemana=dias[d.getUTCDay()];

    if(diaDeLaSemana==="vie"){
      this.diaPermitido=true;
    }



  }


  
 

  

  
  filterPorts(tipos: Actividad[], text: string) {
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
    this.agendaService.getTipoActividades();

    this.actividadesSubscription = this.agendaService.getTipoActividades().subscribe(tipos => {
      // Subscription will be closed when unsubscribed manually.
      var tareas=tipos;
     if (this.actividadesSubscription.closed) {
        return;
      }

      event.component.items = this.filterPorts(tareas, text);
      event.component.endSearch();
    });
  }
  
  
  


  get diagnostic() { 
    return JSON.stringify(this.evento); }

  async cancel()
  {
    
    this.modalCtrl.dismiss();
  }

  async save() {
    if(this.evento.actividad!=null){
      let errores=this.puedoCargar();
      if(!errores){
        
        // setear el id del inspector
        let currentUser = this.authenticationService.currentUserValue;
        this.evento.idInspector=currentUser.id;
        console.log("tarea nueva",this.evento);
        this.agendaService.addTarea(this.evento).subscribe(
          data => {
            this.evento = new Tarea();
            this.presentAlert("La tarea ha sido creada exitosamente. ");
          },
          error => {
              console.log(error);
          });;
          await this.modalCtrl.dismiss(this.evento);
      }

      

    }
    else{
      this.quisoAgendarSinActividad=true;
         
    }
   
  }




  puedoCargar(){
    let errores=false;
    if(this.esLicencia){
      errores=this.comprobarFechaParaLicencia();
    }
    else{
      errores=this.comprobarFechaParaOtraActividad();
    }
    return errores;

  }


  comprobarFechaParaLicencia(){
    let errores=true;
    if(!this.fechasNoValidas && this.diaCorrecto){
          //setear el inicio de la actividad
          let init=new Date(this.inicio);
          this.evento.inicio=(init.getMonth()+1).toString()+"-"+init.getDate()+"-"+init.getFullYear()+" "+init.getHours()+":"+init.getMinutes();
  
  
          //setear el fin de la actividad
          let end= new Date(this.fin);
          this.evento.fin=(end.getMonth()+1).toString()+"-"+end.getDate()+"-"+end.getFullYear()+" "+end.getHours()+":"+end.getMinutes();


          errores=false;
    }
    return errores;
  }


  comprobarFechaParaOtraActividad(){

    let errores = true;
    if(!this.horasNoValidas && this.diaCorrecto){

        /* formato correcto del dia mes y año */
        let init= new Date(this.fecha);
        let fechaFormat=(init.getMonth()+1).toString()+"-"+init.getDate()+"-"+init.getFullYear(); 
        
        /* convertir la fecha de inicio al formato que acepta el backend*/
        let hi= new Date(this.horaInicio);
        let formatoCorrectoInicio=fechaFormat+" "+hi.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});;
        this.evento.inicio=formatoCorrectoInicio;


        /* convertir la fecha de fin al formato correcto el backend*/
        let hf= new Date(this.horaFin);
        let formatoCorrectoFin=fechaFormat+" "+hf.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        this.evento.fin=formatoCorrectoFin;


        errores=false;
    }
    return errores;
  }


  verActividad(){
    console.log("actividad");
    console.log(this.evento.actividad);
    if(this.evento.actividad.descripcion== "Licencia."){
      this.esLicencia=true;
      this.noSonLicencias=false;
    }
    else{
      this.esLicencia=false;
      this.noSonLicencias=true;
    }
  }

   // validar si la hora de inicio es menor a la hora de fin
   validarHoras(){

    if(this.horaInicio!=null){
      if(this.horaFin!=null){
           if(this.horaFin<this.horaInicio){
             this.horasNoValidas=true;
           }
           else{
             this.horasNoValidas=false;
           }
      }
    }

  }

  // validar si la fecha de inicio es menor a la fecha de fin
  validarFechas(){
    if(this.inicio!=null){
       this.validarDiaCorrectoDeLasLicencias();

       if(this.fin!=null){

        var a = new Date(this.inicio);
        var inicioSinHoras= new Date(a.getFullYear(),a.getMonth(),a.getDate());

        var b = new Date(this.fin);
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

 validarDiaCorrectoDeLasLicencias(){
   console.log("entra a validar");
   let d1= new Date();
   let diaDeHoy=new Date(d1.getFullYear(),d1.getMonth(),d1.getDate());


   let d2= new Date(this.inicio);
   let diaPosible= new Date(d2.getFullYear(),d2.getMonth(),d2.getDate());

   let diasPermitidos= new Date();
   diasPermitidos.setDate(diasPermitidos.getDate()+7);

   if(diaPosible>=diaDeHoy && diaPosible<=diasPermitidos){
      this.diaCorrecto=true;
   }
   else{
     this.diaCorrecto=false;
   }

   console.log("diaCorrecto", this.diaCorrecto);
 }


 validarDiaCorrectoDeLasOtrasActividades(){
      console.log("entra a validar");
      let d1= new Date();
      let diaDeHoy=new Date(d1.getFullYear(),d1.getMonth(),d1.getDate());

      let d2= new Date(this.fecha);
      let diaPosible= new Date(d2.getFullYear(),d2.getMonth(),d2.getDate());


      let diasPermitidos= new Date();
      diasPermitidos.setDate(diasPermitidos.getDate()+7);

      if(diaPosible>=diaDeHoy && diaPosible<=diasPermitidos){
        this.diaCorrecto=true;
      }
      else{
        this.diaCorrecto=false;
      }

 }



}
