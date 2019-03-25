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
      { path: 'agenda', loadChildren: '../agenda/agenda.module#AgendaPageModule' },
      { path: 'informes', loadChildren: '../informes/informes.module#InformesPageModule' },
      
      { path: 'actividad', loadChildren: '../actividades/actividades-routing.module#ActividadesRoutingModule' },
      { path: 'listar-convocatoria', loadChildren: './actividadesLectura/listar-convocatoria/listar-convocatoria.module#ListarConvocatoriaPageModule' },
      { path: 'listar-trabajo-admin', loadChildren: './actividadesLectura/listar-trabajo-admin/listar-trabajo-admin.module#ListarTrabajoAdminPageModule' },
      { path: 'listar-licencia', loadChildren: './actividadesLectura/listar-licencia/listar-licencia.module#ListarLicenciaPageModule' },
      { path: 'listar-visita-escuela', loadChildren: './actividadesLectura/listar-visita-escuela/listar-visita-escuela.module#ListarVisitaEscuelaPageModule' },
      { path: 'seleccionar-informe', loadChildren: './actividadesLectura/seleccionar-informe/seleccionar-informe.module#SeleccionarInformePageModule' },
    
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
