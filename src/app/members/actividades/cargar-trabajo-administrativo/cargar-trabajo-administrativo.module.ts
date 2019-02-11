import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CargarTrabajoAdministrativoPage } from './cargar-trabajo-administrativo.page';

const routes: Routes = [
  {
    path: '',
    component: CargarTrabajoAdministrativoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CargarTrabajoAdministrativoPage]
})
export class CargarTrabajoAdministrativoPageModule {}
