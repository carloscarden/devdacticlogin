import { Component, OnInit, Input  } from '@angular/core';
import {  NavController,  ModalController } from '@ionic/angular';
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
  constructor(private nav:NavController, private modalCtrl:ModalController) { }

  ngOnInit() {
    let preselectedDate = moment(this.selectedDay).format();
    this.event.startTime = preselectedDate;
    this.event.endTime = preselectedDate;

  }

  async closeModal()
  {
    await this.modalCtrl.dismiss();
  }

  async save() {
    await this.modalCtrl.dismiss(this.event);
  }

}
