import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ConvocatoriaDetailsPage } from './convocatoria-details.page';

const routes: Routes = [
  {
    path: '',
    component: ConvocatoriaDetailsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ConvocatoriaDetailsPage]
})
export class ConvocatoriaDetailsPageModule {}
