import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../auth.guard';
import { CanDeactivateGuard } from '../can-deactivate.guard';
import { PeComponent } from './pe.component';
import { PePermissionGuard } from './pe-permission.guard';

import { PeDashboardComponent } from './dashboard/pe-dashboard.component';
import { PeActiveWellsComponent } from './activewells/pe-activewells.component';
import { PeWellPerformanceComponent } from './wellperformance/pe-wellperformance.component';
import { PeIPRComponent } from './ipr/pe-ipr.component';

import { PeDailyComponent } from './daily/pe-daily.component';
import { PeDailyListComponent } from './daily/pe-daily-list.component';
import { PeDailyAddComponent } from './daily/pe-daily-add.component';
import { PeDailyChartComponent } from './daily/pe-daily-chart.component';

import { PeLabComponent } from './lab/pe-lab.component';
import { PeLabListComponent } from './lab/pe-lab-list.component';
import { PeLabAddComponent } from './lab/pe-lab-add.component';
import { PeLabManualAddComponent } from './lab/pe-lab-manual-add.component';
import { PeLabChartComponent } from './lab/pe-lab-chart.component';

import { PeSonologComponent } from './sonolog/pe-sonolog.component';
import { PeSonologListComponent } from './sonolog/pe-sonolog-list.component';
import { PeSonologDeleteDialogComponent } from './sonolog/pe-sonolog-list.component';
import { PeSonologAddComponent } from './sonolog/pe-sonolog-add.component';

import { DynagraphComponent } from './dynagraph/dynagraph.component';
import { AddDynagraphComponent } from './dynagraph/add-dynagraph.component';

import { PeSensorComponent } from './sensor/pe-sensor.component';
import { PeSensorListComponent } from './sensor/pe-sensor-list.component';
import { PeSensorDeleteDialogComponent } from './sensor/pe-sensor-list.component';
import { PeSensorAddComponent } from './sensor/pe-sensor-add.component';
import { PeLabReportsComponent } from './lab/pe-lab-reports.component';
import { PeLabAddReportsComponent } from './lab/pe-lab-add-reports.component';
import { PeLabEditReportsComponent } from './lab/pe-lab-edit-reports.component';

import { PeDailyZonechartComponent } from './daily/pe-daily-zonechart.component';
import { PeDailyZonechartListComponent } from './daily/pe-daily-zonechart-list.component';

const peRoutes: Routes = [
  { path: '', component: PeComponent, children: [
    { path: 'dashboard', component: PeDashboardComponent, canActivate: [PePermissionGuard] },
    { path: 'activewells', component: PeActiveWellsComponent, canActivate: [PePermissionGuard] },
    { path: 'daily', component: PeDailyComponent, children: [
      { path: 'list', component: PeDailyListComponent, canActivate: [PePermissionGuard] },
      { path: 'zonechart-list', component: PeDailyZonechartListComponent, canActivate: [PePermissionGuard] },
      { path: 'add', component: PeDailyAddComponent, canActivate: [PePermissionGuard] },
      { path: 'chart', component: PeDailyChartComponent, canActivate: [PePermissionGuard] },
      { path: 'zonechart', component: PeDailyZonechartComponent, canActivate: [PePermissionGuard] },
      { path: '', redirectTo: 'list', pathMatch:"full" },
    ]
    },
    {
      path: 'lab', component: PeLabComponent, children: [
        { path: 'list', component: PeLabListComponent, canActivate: [PePermissionGuard] },
        { path: 'reports', component: PeLabReportsComponent, canActivate: [PePermissionGuard] },
        { path: 'add', component: PeLabAddReportsComponent, canActivate: [PePermissionGuard] },
        { path: 'edit/:id', component: PeLabEditReportsComponent, canActivate: [PePermissionGuard] },
        { path: 'chart', component: PeLabChartComponent, canActivate: [PePermissionGuard] },
        { path: '', redirectTo: 'list', pathMatch: "full" },
      ]
    },
    { path: 'sonolog', component: PeSonologComponent, children: [
      { path: 'list', component: PeSonologListComponent, canActivate: [PePermissionGuard] },
      { path: 'add', component: PeSonologAddComponent, canActivate: [PePermissionGuard] },
      { path: '', redirectTo: 'list', pathMatch:"full" },
    ]},
    { path: 'dynagraph', component: DynagraphComponent, canActivate: [PePermissionGuard] },
    //{ path: 'dynagraph', component: DynagraphComponent, canActivate: [PePermissionGuard], children: [
    //    { path: 'add', component: AddDynagraphComponent, canActivate: [PePermissionGuard] },
    //    { path: '', redirectTo: 'dynagraph', pathMatch: "full" },
    //]},
    { path: 'sensor', component: PeSensorComponent, children: [
      { path: 'list', component: PeSensorListComponent, canActivate: [PePermissionGuard] },
      { path: 'add', component: PeSensorAddComponent, canActivate: [PePermissionGuard] },
      { path: '', redirectTo: 'list', pathMatch:"full" },
    ]},
    { path: 'wellperformance', component: PeWellPerformanceComponent, canActivate: [PePermissionGuard] },
    { path: 'ipr', component: PeIPRComponent, canActivate: [PePermissionGuard] },
    { path: '', redirectTo: 'dashboard', pathMatch:"full" },
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
