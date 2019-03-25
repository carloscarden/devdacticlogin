import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ListarLicenciaPage } from './listar-licencia.page';

const routes: Routes = [
  {
    path: '',
    component: ListarLicenciaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ListarLicenciaPage]
})
export class ListarLicenciaPageModule {}
