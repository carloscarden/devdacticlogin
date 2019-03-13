import { Component, OnInit, Input  } from '@angular/core';
import {  NavController,  ModalController } from '@ionic/angular';
import { NavParams } from '@ionic/angular';
import * as moment from 'moment';


@Component({
  selector: 'app-event-modal',
  templateUrl: './event-modal.page.html',
  styleUrls: ['./event-modal.page.scss'],
})
export class EventModalPage implements OnInit {

  event = { startTime: new Date().toISOString(), endTime: new Date().toISOString(), allDay: false };
  minDate = new Date().toISOString();
  selectedDay:any;
  constructor(private nav:NavController, private modalCtrl:ModalController, navParams: NavParams) { }

  ngOnInit() {
    let preselectedDate = moment(this.selectedDay).format();
    
    this.event.startTime = preselectedDate;
    this.event.endTime = preselectedDate;

  }

  async cancel()
  {
    
    this.modalCtrl.dismiss();
  }

  async save() {
    await this.modalCtrl.dismiss(this.event);
  }

}
