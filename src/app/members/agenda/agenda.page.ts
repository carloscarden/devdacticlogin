import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

// Modal
import { ModalController, AlertController } from '@ionic/angular';
import { EventModalPage } from '../event-modal/event-modal.page';

// Services
import { AgendaServiceService } from 'src/app/_services/agenda-service.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';


// Plugin
import { CalendarComponent } from 'ionic2-calendar/calendar';



// Setear en la zona horaria local
import { registerLocaleData } from '@angular/common';
import localeZh from '@angular/common/locales/zh';
registerLocaleData(localeZh);

import * as moment from 'moment';


@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.page.html',
  styleUrls: ['./agenda.page.scss'],
})
export class AgendaPage implements OnInit {
  @ViewChild(CalendarComponent) myCalendar: CalendarComponent;

  template;
  eventSource = [];
  data;
  viewTitle;
  isToday: boolean;
  selectedDay = new Date();
  currentMonth = this.selectedDay.getMonth();
  currentYear = this.selectedDay.getFullYear();
  inspectorId = 1;

  calendar = {
    mode: 'month',
    currentDate: new Date()
  }; // these are the variable used by the calendar.

  constructor(
    protected agendaService: AgendaServiceService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService) {
  }

  ngOnInit() {
    console.log('entra aca');
  }

  ionViewWillEnter() {
    // your code;
    console.log('ion view will enter');
    this.calendar.mode = this.route.snapshot.paramMap.get('id');
    console.log('calendar mode', this.calendar.mode);
    this.cargarEvents(this.currentMonth + 1, this.currentYear);
  }

  onViewTitleChanged(title) {
    this.viewTitle = title.replace('Week', 'Semana');
  }

  async onEventSelected(event) {


    const start = moment(event.startTime).format('lll');
    const end = moment(event.endTime).format('lll');
    const alert = await this.alertCtrl.create({
      header: '' + event.title,
      subHeader: event.descripcion,
      message: 'Desde:<br> ' + start + '<br><br>Hasta: <br>' + end,
      buttons: ['OK']
    });
    await alert.present();
  }

  async addEvent() {
    const modal = await this.modalCtrl.create({
      component: EventModalPage,
      componentProps: { selectedDay: this.selectedDay }
    });

    modal.onDidDismiss().then((data) => {
      if (data) {

        const eventData = data.data;

        let inicio;
        let fin;
        if (navigator.userAgent.indexOf('Chrome') !== -1) {
          inicio = new Date(data.data.inicio);
          fin = new Date(data.data.fin);
        }
        if (navigator.userAgent.indexOf('Firefox') !== -1) {
          const txtInicio = data.data.inicio.replace(/-/g, '/');
          const txtFin = data.data.fin.replace(/-/g, '/');
          inicio = new Date(txtInicio);
          fin = new Date(txtFin);
        }


        if (data.data.actividad != null) {

          eventData.title = data.data.actividad.descripcion;
          eventData.descripcion = data.data.detalle;


          eventData.startTime = new Date(inicio);
          eventData.endTime = new Date(fin);



          this.eventSource.push(eventData);
          console.log(this.eventSource);
          this.myCalendar.loadEvents();
        }
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



  onCurrentDateChanged(event: Date) {
    if (event.getMonth() !== this.currentMonth || event.getFullYear() !== this.currentYear) {
      this.currentMonth = event.getMonth();
      this.currentYear = event.getFullYear();
      this.cargarEvents(this.currentMonth + 1, this.currentYear);




    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    event.setHours(0, 0, 0, 0);
    this.isToday = today.getTime() === event.getTime();
  }

  cargarEvents(month, year) {
    console.log('entra aca');
    this.eventSource = [];
    const currentUser = this.authenticationService.currentUserValue;
    this.inspectorId = currentUser.id;
    this.agendaService.getEvents(month, year, this.inspectorId).subscribe(
      // Subscription will be closed when unsubscribed manually.
      (data: any) => {
        this.data = data;
        if (this.data != null) {
          for (const entry of this.data) {




            // conversion de iso a gmt sumandole 3 horas
            // inicio.setSeconds(3*60*60);
            // fin.setSeconds(3*60*60);
            let inicio;
            let fin;
            if (navigator.userAgent.indexOf('Chrome') !== -1) {
              inicio = new Date(entry.inicio);
              fin = new Date(entry.fin);
            }
            if (navigator.userAgent.indexOf('Firefox') !== -1) {
              const txtInicio = entry.inicio.replace(/-/g, '/');
              const txtFin = entry.fin.replace(/-/g, '/');
              inicio = new Date(txtInicio);
              fin = new Date(txtFin);
            }

            this.eventSource.push({
              title: entry.actividad.descripcion,
              descripcion: entry.detalle,
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
  }

  markDisabled = (date: Date) => {
    const current = new Date();
    current.setHours(0, 0, 0);
    return date < current;
  }


  cargarCalendario() {

    this.router.navigate(['/members/menu/calendario']);
  }




}
