import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
/*
We’ve created this additional file with the Angular CLI and inside we only need to 
reference the Dashboard
*/
const routes: Routes = [
  { path: 'details/:id', loadChildren: './details/details.module#DetailsPageModule' },
  { path: 'addInspeccion', loadChildren: './add-inspeccion/add-inspeccion.module#AddInspeccionPageModule' },
  { path: 'menu', loadChildren: './menu/menu.module#MenuPageModule' },
  { path: 'agenda', loadChildren: './agenda/agenda.module#AgendaPageModule' },
  { path: 'informes', loadChildren: './informes/informes.module#InformesPageModule' },
  { path: 'event-modal', loadChildren: './event-modal/event-modal.module#EventModalPageModule' },
  { path: 'listar-licencia', loadChildren: './actividadesLectura/listar-licencia/listar-licencia.module#ListarLicenciaPageModule' },
  { path: 'listar-convocatoria', loadChildren: './actividadesLectura/listar-convocatoria/listar-convocatoria.module#ListarConvocatoriaPageModule' },
  { path: 'listar-trabajo-admin', loadChildren: './actividadesLectura/listar-trabajo-admin/listar-trabajo-admin.module#ListarTrabajoAdminPageModule' },
  { path: 'listar-visita-escuela', loadChildren: './actividadesLectura/listar-visita-escuela/listar-visita-escuela.module#ListarVisitaEscuelaPageModule' },
  { path: 'seleccionar-informe', loadChildren: './actividadesLectura/seleccionar-informe/seleccionar-informe.module#SeleccionarInformePageModule' },


];
/*
Notice that this is a child routing and therefore the routes are added to the router 
with forChild()!
*/
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MemberRoutingModule { }
