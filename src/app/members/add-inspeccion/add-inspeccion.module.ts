import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AddInspeccionPage } from './add-inspeccion.page';

const routes: Routes = [
  {
    path: '',
    component: AddInspeccionPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AddInspeccionPage]
})
export class AddInspeccionPageModule {}
