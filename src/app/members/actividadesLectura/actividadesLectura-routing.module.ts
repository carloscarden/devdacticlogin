import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
      { path: 'listarConvocatoria', loadChildren: './listar-convocatoria/listar-convocatoria.module#ListarConvocatoriaPageModule' },
      { path: 'listarTrabajoAdmin/:id', loadChildren: './listar-trabajo-admin/listar-trabajo-admin.module#ListarTrabajoAdminPageModule' },
      { path: 'listarVisita/:id', loadChildren: './listar-visita-escuela/listar-visita-escuela.module#ListarVisitaEscuelaPageModule' },
      { path: 'listarLicencia', loadChildren: './listar-licencia/listar-licencia.module#ListarLicenciaPageModule' },
      { path: 'seleccionarInforme', loadChildren: './seleccionar-informe/seleccionar-informe.module#SeleccionarInformePageModule' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActividadesLecturaRoutingModule { }
