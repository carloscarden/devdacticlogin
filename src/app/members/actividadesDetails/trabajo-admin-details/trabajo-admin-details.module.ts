import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TrabajoAdminDetailsPage } from './trabajo-admin-details.page';

const routes: Routes = [
  {
    path: '',
    component: TrabajoAdminDetailsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TrabajoAdminDetailsPage]
})
export class TrabajoAdminDetailsPageModule {}
