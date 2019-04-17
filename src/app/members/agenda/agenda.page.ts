import { Component, OnInit,ViewChild  } from '@angular/core';
import { AgendaServiceService } from 'src/app/_services/agenda-service.service';
import { ModalController, AlertController  } from '@ionic/angular';
import { EventModalPage } from '../event-modal/event-modal.page'
import { CalendarComponent } from "ionic2-calendar/calendar";


import { Router, RouterEvent, ActivatedRoute } from '@angular/router';

import { registerLocaleData } from '@angular/common';
import localeZh from '@angular/common/locales/zh';
registerLocaleData(localeZh);

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
     currentDate: new Date()
  }; // these are the variable used by the calendar.

  constructor(protected agendaService: AgendaServiceService,private modalCtrl: ModalController, private alertCtrl: AlertController,private router:Router, private route: ActivatedRoute ) { 
  }

  ngOnInit() {
    
    

  }

  onViewTitleChanged(title) {
        this.viewTitle = title.replace("Week", "Semana");
        console.log(title);
  }

  async onEventSelected(event) {
      console.log(event);
      console.log(event.descripcion);

      let start = moment(event.startTime).format('lll');
      let end = moment(event.endTime).format('lll');
      let alert = await this.alertCtrl.create({
           header: '' + event.title,
           message: 'Desde:<br> ' + start + '<br><br>Hasta: <br>' + end,
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
        console.log("data");
        console.log(data);
        let eventData = data.data;

        let inicio;
        let fin
        if(navigator.userAgent.indexOf("Chrome") != -1 )
        {
                  inicio= new Date(data.data.inicio);
                  fin= new Date(data.data.fin);
        }
        if(navigator.userAgent.indexOf("Firefox") != -1 ) 
        {
          let txtInicio= data.data.inicio.replace(/-/g,"/");
          let txtFin= data.data.fin.replace(/-/g,"/");
          inicio= new Date(txtInicio);
          fin= new Date(txtFin);
        }

        eventData.title=data.data.actividad.descripcion;
        eventData.startTime = new Date(inicio);
        eventData.endTime = new Date(fin);



        this.eventSource.push(eventData);
        console.log(this.eventSource);
        this.myCalendar.loadEvents();
        /*
        let events = this.eventSource;
        events.push(eventData);
        this.eventSource = [];
        setTimeout(() => {
          this.eventSource = events;
          this.myCalendar.loadEvents();

        });*/
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
    if(event.getMonth()!=this.currentMonth || event.getFullYear() != this.currentYear)
    {
       this.currentMonth=event.getMonth();
       this.currentYear = event.getFullYear();
       this.cargarEvents(this.currentMonth+1,this.currentYear);
      
       
       

    }
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    event.setHours(0, 0, 0, 0);
    this.isToday = today.getTime() === event.getTime();
  }

  cargarEvents(month, year){
      this.eventSource = [];
      this.agendaService.getEvents(month,year).subscribe(
        // Subscription will be closed when unsubscribed manually.
      (data: any)=>{
          this.data=data;
          if(this.data!= null){
            for (let entry of this.data) {

                

                 // conversion de iso a gmt sumandole 3 horas
                //inicio.setSeconds(3*60*60);
                //fin.setSeconds(3*60*60);
                let inicio;
                let fin
                if(navigator.userAgent.indexOf("Chrome") != -1 )
                {
                  inicio= new Date(entry.inicio);
                  fin= new Date(entry.fin);
                }
                if(navigator.userAgent.indexOf("Firefox") != -1 ) 
                {
                  let txtInicio= entry.inicio.replace(/-/g,"/");
                  let txtFin= entry.fin.replace(/-/g,"/");
                  inicio= new Date(txtInicio);
                  fin= new Date(txtFin);
                }
                
                this.eventSource.push({
                      title: entry.actividad.descripcion,
                      startTime: inicio,
                      endTime: fin,
                      allDay: false
                    });
                this.myCalendar.loadEvents();
          
                    
             }
          }
  
          
          
        }
        
      );

     
      this.myCalendar.loadEvents();

  
    }


  onRangeChanged(ev) {
    console.log('range changed: startTime: ' + ev.startTime + ', endTime: ' + ev.endTime);
  }

  markDisabled = (date:Date) => {
    var current = new Date();
    current.setHours(0, 0, 0);
    return date < current;
  }


  cargarCalendario(){

    this.router.navigate(["/members/menu/calendario"]);
  }

  ionViewWillEnter(){
    //your code;
    console.log("id");
    this.calendar.mode=this.route.snapshot.paramMap.get('id');

    this.cargarEvents(this.currentMonth+1, this.currentYear);
  }


}
