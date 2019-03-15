import { Component, OnInit, Input  } from '@angular/core';
import {  NavController,  ModalController } from '@ionic/angular';
import { NavParams } from '@ionic/angular';
import * as moment from 'moment';
import { Actividad } from 'src/app/_models/actividad';
import { AgendaServiceService } from 'src/app/_services/agenda-service.service';


@Component({
  selector: 'app-event-modal',
  templateUrl: './event-modal.page.html',
  styleUrls: ['./event-modal.page.scss'],
})
export class EventModalPage implements OnInit {
  actividades=[];
  event = { actividad: Actividad,
            startTime: new Date().toISOString(),
            endTime: new Date().toISOString(),
            allDay: false };
  selectedDay:any;
  constructor(private nav:NavController,
              private modalCtrl:ModalController, 
              navParams: NavParams,
              private agendaService: AgendaServiceService) { }

  ngOnInit() {
    this.agendaService.getTipoActividades().subscribe(tipoActividades => {this.actividades = tipoActividades; console.log(tipoActividades)});
    let preselectedDate = moment(this.selectedDay).format();
    
    this.event.startTime = preselectedDate;
    this.event.endTime = preselectedDate;

  }

  public selectObjectById(list: any[], id: string, property: string) {
    console.log(list);
    var item = list.find(item => item._id === id);
    console.log("item");
    console.log(item);
    var prop = eval('this.' + property);
    prop = property;
  }


  get diagnostic() { 
    console.log(this.event.actividad);
    return JSON.stringify(this.event); }

  async cancel()
  {
    
    this.modalCtrl.dismiss();
  }

  async save() {
    await this.modalCtrl.dismiss(this.event);
  }



}
