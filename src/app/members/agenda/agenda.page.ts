import { Component, OnInit,ViewChild  } from '@angular/core';
import { AgendaServiceService } from 'src/app/_services/agenda-service.service';
import { ModalController, AlertController  } from '@ionic/angular';
import { EventModalPage } from '../event-modal/event-modal.page'
import { CalendarComponent } from "ionic2-calendar/calendar";

import { Tarea } from './../../_models/tarea';
import * as moment from 'moment';


@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.page.html',
  styleUrls: ['./agenda.page.scss'],
})
export class AgendaPage implements OnInit {
  @ViewChild(CalendarComponent) myCalendar:CalendarComponent;
  
  eventSource = [];
  data;
  viewTitle;
  isToday: boolean;
  selectedDay = new Date();
  currentMonth = this.selectedDay.getMonth();
  currentYear = this.selectedDay.getFullYear();

  calendar = {
     mode: 'month',
     currentDate: new Date(),
     locale: 'en-GB'
  }; // these are the variable used by the calendar.

  constructor(protected agendaService: AgendaServiceService,private modalCtrl: ModalController, private alertCtrl: AlertController) { 
    this.loadEvents();
  }

  ngOnInit() {
    console.log("ngOnInit()");
    let diaActual= new Date();
   

    setTimeout(() => { 
      this.cargarEvents(this.currentMonth+1, this.currentYear).then(
        (data:any)=>
        {
          console.log("data desde el cargar eventos");
          this.eventSource=data;
        }
  
      );
   }, 2000);
    
   
    console.log(this.eventSource);
    

  }

  loadEvents() {
    
    this.cargarEvents(this.currentMonth+1, this.currentYear).then(
      (data:any)=>
      {
        console.log("data desde el load events");
        this.eventSource=data;
      }

    );
    console.log("data load")
    console.log(this.eventSource);
    //this.myCalendar.loadEvents();
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
        console.log(data);
        let eventData = data.data;

        eventData.title=data.data.tipo.descripcion;
        eventData.startTime = new Date(data.data.inicio);
        eventData.endTime = new Date(data.data.fin);

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
    this.myCalendar.currentDate = new Date();
  }

 

  onCurrentDateChanged(event:Date) {
    /*console.log(event)
    console.log(event.getMonth());*/
    this.currentMonth=event.getMonth();
    this.currentYear = event.getFullYear();
    if(event.getMonth()!=this.currentMonth || event.getFullYear() != this.currentYear)
    {
       this.currentMonth=event.getMonth();
       this.currentYear = event.getFullYear();
      
       
       

    }
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    event.setHours(0, 0, 0, 0);
    this.isToday = today.getTime() === event.getTime();
  }

 async cargarEvents(month, year){
  console.log("cargar eventos");
    var events = [];
    this.agendaService.getEvents(month,year).subscribe(
      // Subscription will be closed when unsubscribed manually.
      (data: any)=>{
        this.data=data;
        console.log("data");
        console.log(this.data);

        
        
      }
      
    );
    console.log(this.data);

    if(this.data!= null){
        for (let entry of this.data) {
            // conversion de iso a gmt sumandole 3 horas
            let inicio= new Date(entry.inicio);
            inicio.setSeconds(3*60*60);
            let fin= new Date(entry.fin);
            fin.setSeconds(3*60*60);
            events.push({
                  title: "entry.actividad.descripcion",
                  startTime: inicio,
                  endTime: fin,
                  allDay: false
                });
      
                
              }
    }

    console.log(events);
    this.eventSource=events;
    return await events;

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
