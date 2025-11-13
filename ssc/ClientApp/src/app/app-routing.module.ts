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
import { PeDashboardComponent } from './pe/dashboard/pe-dashboard.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { SumurComponent } from './pe/sumur/pe-sumur.component';
import { PeGrafikComponent } from './pe/grafik/pe-grafik.component';
// import { PeSumurCurrentComponent } from './pe/current/pe-sumur-current.component';

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', redirectTo: 'pe/dashboard', pathMatch: 'full' },
  { path: 'pe', loadChildren: './pe/pe.module#PeModule', data: { preload: true, label: "PE" } },
  { path: 'logout', component: LogoutComponent, canActivate: [AuthGuard], outlet: "overlay" },
  { path: 'location', component: LocationComponent, children: [
  { path: 'list', component: LocationListComponent, canActivate: [PermissionGuard] },
  { path: 'add', component: LocationAddComponent, canActivate: [PermissionGuard] },
  { path: '', redirectTo: 'list', pathMatch:"full" },
] },
{ path: '', redirectTo: 'pe/dashboard', pathMatch: 'full' },
{ path: 'pe/sumur', component: SumurComponent },
{ path: 'pe/grafik', component: PeGrafikComponent },
// { path: 'pe/grafik', component: PeSumurCurrentComponent },


];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes,
  	{
    	enableTracing: false, // <-- debugging purposes only_
    	preloadingStrategy: SelectivePreloadingStrategyService,
      // HighchartsChartModule,
  	})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
