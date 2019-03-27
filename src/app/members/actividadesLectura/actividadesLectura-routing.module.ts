import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
      { path: 'listarConvocatoria', loadChildren: './listar-convocatoria/listar-convocatoria.module#ListarConvocatoriaPageModule' },
      { path: 'listarTrabajoAdmin', loadChildren: './listar-trabajo-admin/listar-trabajo-admin.module#ListarTrabajoAdminPageModule' },
      { path: 'listarVisita', loadChildren: './listar-visita-escuela/listar-visita-escuela.module#ListarVisitaEscuelaPageModule' },
      { path: 'listarLicencia', loadChildren: './listar-licencia/listar-licencia.module#ListarLicenciaPageModule' }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActividadesLecturaRoutingModule { }