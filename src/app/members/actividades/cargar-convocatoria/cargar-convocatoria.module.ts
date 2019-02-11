import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CargarConvocatoriaPage } from './cargar-convocatoria.page';

const routes: Routes = [
  {
    path: '',
    component: CargarConvocatoriaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CargarConvocatoriaPage]
})
export class CargarConvocatoriaPageModule {}
