import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../auth.guard';
import { CanDeactivateGuard } from '../can-deactivate.guard';
import { PeComponent } from './pe.component';
import { PePermissionGuard } from './pe-permission.guard';

import { PeDashboardComponent } from './dashboard/pe-dashboard.component';

import { PeDailyComponent } from './daily/pe-daily.component';
import { PeDailyListComponent } from './daily/pe-daily-list.component';
import { PeDailyAddComponent } from './daily/pe-daily-add.component';
import { PeDailyAddOsgComponent } from './daily/pe-daily-add-osg.component';
import { PeDailyEditOsgComponent } from './daily/pe-daily-edit-osg.component';
import { PeDailyChartComponent } from './daily/pe-daily-chart.component';

import { PeProductionAddComponent } from './daily/pe-production-add.component';

import { PeSonologComponent } from './sonolog/pe-sonolog.component';
import { PeSonologListComponent } from './sonolog/pe-sonolog-list.component';
import { PeSonologDeleteDialogComponent } from './sonolog/pe-sonolog-list.component';
import { PeSonologAddComponent } from './sonolog/pe-sonolog-add.component';
import { PeSonologChartComponent } from './sonolog/pe-sonolog-chart.component';

import { PeSensorComponent } from './sensor/pe-sensor.component';
import { PeSensorListComponent } from './sensor/pe-sensor-list.component';
import { PeSensorDeleteDialogComponent } from './sensor/pe-sensor-list.component';
import { PeSensorAddComponent } from './sensor/pe-sensor-add.component';
import { PeDailyManajemenComponent } from './daily/pe-daily-manajemen.component';

// import { PeWellMonitoringComponent } from './well/pe-well-monitoring.component';

// const routes: Routes = [
//   { path: 'well-monitoring', component: PeWellMonitoringComponent },
//   ...
// ];


import { PeDailyZonechartComponent } from './daily/pe-daily-zonechart.component';
import { PeDailyZonechartListComponent } from './daily/pe-daily-zonechart-list.component';

import { PeDailySemilogChartComponent } from './daily/pe-daily-semilog-chart.component';
import { PeDailyAreaChartComponent } from './daily/pe-daily-area-chart.component';
import { PeDailyPerAreaChartComponent } from './daily/pe-daily-per-area-chart.component';
import { IprComponent } from './daily/ipr/pe-ipr.component';

const peRoutes: Routes = [
  { path: '', component: PeComponent, children: [
    { path: 'dashboard', component: PeDashboardComponent, canActivate: [PePermissionGuard] },
    { path: 'production/add', component: PeProductionAddComponent},
    { path: 'daily', component: PeDailyComponent, children: [
      { path: 'list', component: PeDailyListComponent, canActivate: [PePermissionGuard] },
	  { path: 'add', component: PeDailyAddComponent, canActivate: [PePermissionGuard] },
	  { path: 'manajemen', component: PeDailyManajemenComponent, canActivate: [PePermissionGuard] },
	  { path: 'add-osg', component: PeDailyAddOsgComponent, canActivate: [PePermissionGuard] },
      { path: 'edit-osg/:id', component: PeDailyEditOsgComponent, canActivate: [PePermissionGuard] },
	  { path: 'zonechart-list', component: PeDailyZonechartListComponent, canActivate: [PePermissionGuard] },
      { path: 'chart', component: PeDailyChartComponent, canActivate: [PePermissionGuard] },
	  { path: 'semilog-chart', component: PeDailySemilogChartComponent, canActivate: [PePermissionGuard] },
	  { path: 'area-chart', component: PeDailyAreaChartComponent, canActivate: [PePermissionGuard] },
	  { path: 'per-area-chart', component: PeDailyPerAreaChartComponent, canActivate: [PePermissionGuard] },
	  { path: 'zonechart', component: PeDailyZonechartComponent, canActivate: [PePermissionGuard] },
    
      { path: '', redirectTo: 'list', pathMatch:"full" },
    ]
    },
    { path: 'sonolog', component: PeSonologComponent, children: [
      { path: 'list', component: PeSonologListComponent, canActivate: [PePermissionGuard] },
      { path: 'add', component: PeSonologAddComponent, canActivate: [PePermissionGuard] },
	  { path: 'sonolog-chart', component: PeSonologChartComponent, canActivate: [PePermissionGuard] },
      { path: '', redirectTo: 'list', pathMatch:"full" },
    ]},
    { path: 'sensor', component: PeSensorComponent, children: [
      { path: 'list', component: PeSensorListComponent, canActivate: [PePermissionGuard] },
      { path: 'add', component: PeSensorAddComponent, canActivate: [PePermissionGuard] },
      { path: '', redirectTo: 'list', pathMatch:"full" },
    ]},
    { path: 'ipr', component: IprComponent},
  ]},
]; 

@NgModule({
  imports: [
  RouterModule.forChild(peRoutes)
  ],
  exports: [
  RouterModule
  ],
  declarations: []
})

export class PeRoutingModule { 
  
}
