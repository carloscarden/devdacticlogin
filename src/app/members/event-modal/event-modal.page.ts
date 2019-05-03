import { Component, OnInit, Input  } from '@angular/core';
import {  NavController,  ModalController, AlertController } from '@ionic/angular';
import { NavParams } from '@ionic/angular';
import * as moment from 'moment';
import { Actividad } from 'src/app/_models/actividad';
import { Evento } from 'src/app/_models/evento';
import { Tarea } from 'src/app/_models/tarea';
import { AgendaServiceService } from 'src/app/_services/agenda-service.service';

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
  constructor(private nav:NavController,
              private modalCtrl:ModalController, 
              navParams: NavParams,
              private agendaService: AgendaServiceService,
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
    console.log(preselectedDate);
    this.evento.inicio = preselectedDate;
    this.evento.fin = preselectedDate;

  }

  

  
  filterPorts(tipos: Actividad[], text: string) {
    console.log(tipos);
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
      console.log(tareas);
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

    let init=new Date(this.evento.inicio);
    this.evento.idInspector=1;
    this.evento.inicio=(init.getMonth()+1).toString()+"-"+init.getDate()+"-"+init.getFullYear()+" "+init.getHours()+":"+init.getMinutes();
    console.log(this.evento);
    let end= new Date(this.evento.fin);
    this.evento.fin=(end.getMonth()+1).toString()+"-"+end.getDate()+"-"+end.getFullYear()+" "+end.getHours()+":"+end.getMinutes();
    console.log(this.evento.inicio);
    this.loading = true;
    this.agendaService.addTarea(this.evento).subscribe(
        data => {
          console.log(data);
           this.loading=false;
           this.evento = new Tarea();
           this.error = '';
           this.presentAlert("La tarea ha sido creada exitosamente. ");
        },
        error => {
          console.log('error en el add',error);
            this.error = error;
            this.loading = false;
        });;
    await this.modalCtrl.dismiss(this.evento);
  }



}
