import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MenuPage } from './menu.page';

const routes: Routes = [
  {
    path: '',
    component: MenuPage,
    children:[
      { path: 'principal', loadChildren: '../principal/principal.module#PrincipalPageModule' },
      { path: 'agenda', loadChildren: '../agenda/agenda.module#AgendaPageModule' },
      { path: 'informes', loadChildren: '../informes/informes.module#InformesPageModule' },
      { path: 'actividad', loadChildren: '../actividades/actividades-routing.module#ActividadesRoutingModule' }
    ]
  },

];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MenuPage]
})
export class MenuPageModule {}
