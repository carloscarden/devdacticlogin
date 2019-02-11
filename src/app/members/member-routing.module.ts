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
