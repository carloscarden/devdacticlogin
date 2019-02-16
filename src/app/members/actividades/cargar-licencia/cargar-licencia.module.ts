import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CargarLicenciaPage } from './cargar-licencia.page';

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
    RouterModule.forChild(routes)
  ],
  declarations: [CargarLicenciaPage]
})
export class CargarLicenciaPageModule {}
