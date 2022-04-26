import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './auth.guard';
import { LoginComponent } from './account/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SelectivePreloadingStrategyService } from './selective-preloading-strategy.service';
import { LogoutComponent } from './account/logout.component';
import { LocationComponent } from './location/location.component';
import { LocationListComponent } from './location/location-list.component';
import { LocationAddComponent } from './location/location-add.component';
import { PermissionGuard } from './permission.guard';

const appRoutes: Routes = [
{ path: 'login', component: LoginComponent },
{ path: 'dashboard', component: DashboardComponent, canActivate: [PermissionGuard] },
{ path: 'ssc', loadChildren: './ssc/ssc.module#SscModule', data: { preload: true, label: "SSC" }},
{ path: 'pe', loadChildren: './pe/pe.module#PeModule', data: { preload: true, label: "PE" }},
{ path: 'logout', component: LogoutComponent, canActivate: [AuthGuard], outlet: "overlay" },
{ path: 'location', component: LocationComponent, children: [
  { path: 'list', component: LocationListComponent, canActivate: [PermissionGuard] },
  { path: 'add', component: LocationAddComponent, canActivate: [PermissionGuard] },
  { path: '', redirectTo: 'list', pathMatch:"full" },
] },
{ path: '', redirectTo: '/dashboard', pathMatch: 'full' },

];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes,
  	{
    	enableTracing: false, // <-- debugging purposes only_
    	preloadingStrategy: SelectivePreloadingStrategyService,
  	})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
