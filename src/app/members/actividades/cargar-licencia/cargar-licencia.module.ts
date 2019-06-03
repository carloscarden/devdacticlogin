import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CargarLicenciaPage } from './cargar-licencia.page';
import { Ionic4DatepickerModule } from '@logisticinfotech/ionic4-datepicker';
import { IonicSelectableModule } from 'ionic-selectable';
 


const routes: Routes = [
  {
    path: '',
    component: CargarLicenciaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    Ionic4DatepickerModule,
    IonicSelectableModule
  ],
  declarations: [CargarLicenciaPage]
})
export class CargarLicenciaPageModule {}
