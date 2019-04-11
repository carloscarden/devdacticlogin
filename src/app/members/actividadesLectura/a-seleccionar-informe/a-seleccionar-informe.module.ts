import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ASeleccionarInformePage } from './a-seleccionar-informe.page';

const routes: Routes = [
  {
    path: '',
    component: ASeleccionarInformePage,
    children:[
      { path: 'listarConvocatoria', loadChildren: '../listar-convocatoria/listar-convocatoria.module#ListarConvocatoriaPageModule' },
      { path: 'listarTrabajoAdmin', loadChildren: '../listar-trabajo-admin/listar-trabajo-admin.module#ListarTrabajoAdminPageModule' },
      { path: 'listarVisita', loadChildren: '../listar-visita-escuela/listar-visita-escuela.module#ListarVisitaEscuelaPageModule' },
      { path: 'listarLicencia', loadChildren: '../listar-licencia/listar-licencia.module#ListarLicenciaPageModule' },
  
    
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ASeleccionarInformePage]
})
export class ASeleccionarInformePageModule {}
