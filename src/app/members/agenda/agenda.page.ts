import { Component, OnInit,ViewChild  } from '@angular/core';
import { AgendaServiceService } from 'src/app/_services/agenda-service.service';
import { ModalController, AlertController  } from '@ionic/angular';
import { EventModalPage } from '../event-modal/event-modal.page'
import { Tarea } from './../../_models/tarea';
import * as moment from 'moment';


@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.page.html',
  styleUrls: ['./agenda.page.scss'],
})
export class AgendaPage implements OnInit {
  eventSource = [];

  viewTitle;
  isToday: boolean;
  selectedDay = new Date();

  calendar = {
     mode: 'month',
     currentDate: new Date()
  }; // these are the variable used by the calendar.

  constructor(protected agendaService: AgendaServiceService,private modalCtrl: ModalController, private alertCtrl: AlertController) { }

  ngOnInit() {

  }

  loadEvents() {
    this.eventSource = this.createRandomEvents();
  }
  
  onViewTitleChanged(title) {
        this.viewTitle = title;
        console.log(title);
  }

  async onEventSelected(event) {

      let start = moment(event.startTime).format('LLLL');
      let end = moment(event.endTime).format('LLLL');
      let alert = await this.alertCtrl.create({
           header: '' + event.title,
           subHeader:  'From: ' + start + '<br>To: ' + end,
           buttons: ['OK']
      });
      await  alert.present();
  }

  async addEvent(){
   let modal = await this.modalCtrl.create({
      component: EventModalPage,
      componentProps: { selectedDay: this.selectedDay }
      });
    
   modal.onDidDismiss().then((data) => {
      if (data) {
        let eventData = data.data;
        eventData.startTime = new Date(data.data.startTime);
        eventData.endTime = new Date(data.data.endTime);

        let events = this.eventSource;
        events.push(eventData);
        this.eventSource = [];
        setTimeout(() => {
          this.eventSource = events;
        });
      }

   });
   return await modal.present();
    
  }

  changeMode(mode) {
    this.calendar.mode = mode;
  }

  today() {
    this.calendar.currentDate = new Date();
  }

 

  onCurrentDateChanged(event:Date) {
    console.log(event)
    console.log(event.getMonth());
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    event.setHours(0, 0, 0, 0);
    this.isToday = today.getTime() === event.getTime();
  }

  createRandomEvents() {
    var events = [];
    this.agendaService.getEvents().subscribe(
      // Subscription will be closed when unsubscribed manually.
      (data: any)=>{
        var tareas=JSON.parse(data._body);
        for (let entry of tareas) {

          events.push({
            title: entry.actividad.descripcion,
            startTime: new Date(entry.inicio),
            endTime: new Date(entry.fin),
            allDay: false
          });

          
        }
      }
      
    );
    console.log(events);
    return events;
   }

   onRangeChanged(ev) {
    console.log('range changed: startTime: ' + ev.startTime + ', endTime: ' + ev.endTime);
   }

   markDisabled = (date:Date) => {
    var current = new Date();
    current.setHours(0, 0, 0);
    return date < current;
  }

}
