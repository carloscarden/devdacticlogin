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
  loading;
  error;
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
    this.evento.inicio = preselectedDate;
    this.evento.fin = preselectedDate;

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

    // setear el id del inspector
    let currentUser = this.authenticationService.currentUserValue;
    this.evento.idInspector=currentUser.id;

    //setear el inicio de la actividad
    let init=new Date(this.evento.inicio);
    this.evento.inicio=(init.getMonth()+1).toString()+"-"+init.getDate()+"-"+init.getFullYear()+" "+init.getHours()+":"+init.getMinutes();


    //setear el fin de la actividad
    let end= new Date(this.evento.fin);
    this.evento.fin=(end.getMonth()+1).toString()+"-"+end.getDate()+"-"+end.getFullYear()+" "+end.getHours()+":"+end.getMinutes();

    this.loading = true;
    this.agendaService.addTarea(this.evento).subscribe(
        data => {
           this.loading=false;
           this.evento = new Tarea();
           this.error = '';
           this.presentAlert("La tarea ha sido creada exitosamente. ");
        },
        error => {
            this.error = error;
            this.loading = false;
        });;
    await this.modalCtrl.dismiss(this.evento);
  }



}
