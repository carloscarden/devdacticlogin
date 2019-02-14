import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
      { path: 'cargarConvocatoria', loadChildren: './cargar-convocatoria/cargar-convocatoria.module#CargarConvocatoriaPageModule' },
      { path: 'cargarTrabajoAdmin', loadChildren: './cargar-trabajo-administrativo/cargar-trabajo-administrativo.module#CargarTrabajoAdministrativoPageModule' },
      { path: 'cargarVisita', loadChildren: './cargar-visita-escuela/cargar-visita-escuela.module#CargarVisitaEscuelaPageModule' },
      { path: 'seleccionarActividad', loadChildren: './seleccionar-actividad/seleccionar-actividad.module#SeleccionarActividadPageModule' },
     { path: 'cargar-licencia', loadChildren: './cargar-licencia/cargar-licencia.module#CargarLicenciaPageModule' }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActividadesRoutingModule { }
