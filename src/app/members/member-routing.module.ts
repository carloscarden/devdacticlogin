import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
/*
We’ve created this additional file with the Angular CLI and inside we only need to 
reference the Dashboard
*/
const routes: Routes = [
  { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardPageModule' }
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
