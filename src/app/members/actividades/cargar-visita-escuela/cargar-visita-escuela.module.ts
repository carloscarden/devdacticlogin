import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CargarVisitaEscuelaPage } from './cargar-visita-escuela.page';

const routes: Routes = [
  {
    path: '',
    component: CargarVisitaEscuelaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CargarVisitaEscuelaPage]
})
export class CargarVisitaEscuelaPageModule {}
