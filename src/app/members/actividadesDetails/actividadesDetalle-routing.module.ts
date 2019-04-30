import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: 'convocatoriaDetalles/:id', loadChildren: './convocatoria-details/convocatoria-details.module#ConvocatoriaDetailsPageModule' },
  { path: 'licenciaDetalles/:id', loadChildren: './licencia-details/licencia-details.module#LicenciaDetailsPageModule' },
  { path: 'visitaDetalles/:id', loadChildren: './visita-details/visita-details.module#VisitaDetailsPageModule' },
  { path: 'trabajoAdminDetalles/:id', loadChildren: './trabajo-admin-details/trabajo-admin-details.module#TrabajoAdminDetailsPageModule' },

];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActividadesDetalleRoutingModule { }
