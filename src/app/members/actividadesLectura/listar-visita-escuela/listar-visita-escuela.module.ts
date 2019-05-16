import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ListarVisitaEscuelaPage } from './listar-visita-escuela.page';
import { IonicSelectableModule } from 'ionic-selectable';


const routes: Routes = [
  {
    path: '',
    component: ListarVisitaEscuelaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    IonicSelectableModule
  ],
  declarations: [ListarVisitaEscuelaPage]
})
export class ListarVisitaEscuelaPageModule {}
