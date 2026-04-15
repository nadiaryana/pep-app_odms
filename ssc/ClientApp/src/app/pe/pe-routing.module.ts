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

import { PeBhpComponent} from './bhp/pe-bhp.component';
import { PeBhpListComponent} from './bhp/pe-bhp-list.component';
import { PeBhpDeleteDialogComponent } from './bhp/pe-bhp-list.component';
import { PeBhpAddComponent} from './bhp/pe-bhp-add.component';
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
import { PeSumurCurrentListComponent } from './current/pe-sumur-current-list.component';
import { SumurComponent } from './sumur/pe-sumur.component';
import { PeSumurCurrentAddComponent } from './current/pe-sumur-current-add.component';
import { PeSumurCurrentComponent } from './current/pe-sumur-current.component';
import { PeDailyChanPlotListComponent } from './daily/pe-daily-chan-plot-list.component';
import { PeDailyChanPlotChartComponent } from './daily/pe-daily-chan-plot-chart.component';
import { PeDailyChanPlotComponent } from './daily/pe-daily-chan-plot.component';
import { PeBhpChartComponent } from './bhp/pe-bhp-chart.component';
import { PeDailyManajemenChartComponent } from './daily/pe-daily-manajemen-chart.component';

import { PeDailyAggregateComponent } from './daily/pe-daily-aggregate.component';
import { PeDailyAggregateListComponent } from './daily/pe-daily-aggregate-list.component';
import { OneSlideComponent } from './daily/oneslide/pe-one-slide.component';

import { BarchartComponent } from './barchart/barchart.component';
import { BarchartListComponent } from './barchart/barchart-list.component';
import { BarchartAddComponent } from './barchart/barchart-add.component';
import { BarchartChartComponent } from './barchart/barchart-chart.component';

import { PeLabComponent } from './lab/pe-lab.component';
import { PeLabListComponent } from './lab/pe-lab-list.component';
import { PeLabAddComponent } from './lab/pe-lab-add.component';
import { PeLabChartComponent } from './lab/pe-lab-chart.component';
import { PeOptimasiListComponent } from './optimasi/pe-optimasi-list.component';
import { PeOptimasiComponent } from './optimasi/pe-optimasi.component';
import { PeOptimasiChartComponent } from './optimasi/pe-optimasi-chart.component';
import { PeLaporanLabComponent } from './laporan/pe-laporan-lab.component';
import { PeLaporanLabListComponent } from './laporan/pe-laporan-lab-list.component';
import { PeLaporanLabChartComponent } from './laporan/pe-laporan-lab-chart.component';
import { PeLaporanLabAddComponent } from './laporan/pe-laporan-lab-add.component';
import { MapSumurComponent } from './map/pe-map-sumur.component';
import { PeMapAddComponent } from './map/pe-map-add.component';
import { PeMapComponent } from './map/pe-map.component';
import { PePumpingUnitComponent } from './pump/pe-pumping-unit.component';
import { PePumpingUnitListComponent } from './suspended/pe-pumping-unit-list.component';
import { PePumpingUnitAddComponent } from './pump/pe-pumping-unit-add.component';

const peRoutes: Routes = [
  { path: '', component: PeComponent, children: [
    { path: 'dashboard', component: PeDashboardComponent, canActivate: [PePermissionGuard] },
    { path: 'production/add', component: PeProductionAddComponent},
    { path: 'daily', component: PeDailyComponent, children: [
      { path: 'list', component: PeDailyListComponent, canActivate: [PePermissionGuard] },
	  { path: 'add', component: PeDailyAddComponent, canActivate: [PePermissionGuard] },
	  { path: 'manajemen', component: PeDailyManajemenComponent, canActivate: [PePermissionGuard] },
	  { path: 'manajemen-chart', component: PeDailyManajemenChartComponent, canActivate: [PePermissionGuard] },
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
    { path: 'bhp', component: PeBhpComponent, children: [
      { path: 'list', component: PeBhpListComponent, canActivate: [PePermissionGuard] },
      { path: 'add', component: PeBhpAddComponent, canActivate: [PePermissionGuard] },
      { path: 'bhp-chart', component: PeBhpChartComponent, canActivate: [PePermissionGuard] },
      { path: '', redirectTo: 'list', pathMatch:"full" },
    ]},
    { path: 'ipr', component: IprComponent},
    // { path: 'sumur', component: SumurComponent},
    { path: 'current', component: PeSumurCurrentComponent, children: [
      { path: 'list', component: PeSumurCurrentListComponent, canActivate: [PePermissionGuard] },
      { path: 'add', component: PeSumurCurrentAddComponent, canActivate: [PePermissionGuard] },
      { path: '', redirectTo: 'list', pathMatch:"full" },
    ]},
    { path: 'chan-plot', component: PeDailyChanPlotComponent, children: [
      { path: 'list', component: PeDailyChanPlotListComponent, canActivate: [PePermissionGuard] },
      { path: 'chart', component: PeDailyChanPlotChartComponent, canActivate: [PePermissionGuard] },
      { path: '', redirectTo: 'list', pathMatch:"full" },
    ]},
    { path: 'aggregate', component: PeDailyAggregateComponent, children:[
      { path: 'list', component: PeDailyAggregateListComponent, canActivate: [PePermissionGuard]},
      { path: '', redirectTo: 'list', pathMatch:"full"},
    ]},
    { path: 'one-slide', component: OneSlideComponent},
    { path: 'barchart', component: BarchartComponent, children: [
      { path: 'list', component: BarchartListComponent, canActivate: [PePermissionGuard] },
      { path: 'add', component: BarchartAddComponent, canActivate: [PePermissionGuard] },
      { path: 'chart', component: BarchartChartComponent, canActivate: [PePermissionGuard] },
      { path: '', redirectTo: 'list', pathMatch:"full" },
    ]},
    { path: 'lab', component: PeLabComponent, children: [
      { path: 'list', component: PeLabListComponent, canActivate: [PePermissionGuard] },
      { path: 'reports', component: PeLabComponent},
      { path: 'add', component: PeLabAddComponent, canActivate: [PePermissionGuard] },
      { path: 'chart', component: PeLabChartComponent, canActivate: [PePermissionGuard] },
      { path: '', redirectTo: 'list', pathMatch:"full" },
    ]},
    { path: 'optimasi', component: PeOptimasiComponent, children:[
      { path: 'list', component: PeOptimasiListComponent, canActivate: [PePermissionGuard]},
      { path: 'chart', component: PeOptimasiChartComponent, canActivate: [PePermissionGuard] },
      { path: '', redirectTo: 'list', pathMatch:"full"},
    ]},
    { path: 'laporan', component: PeLaporanLabComponent, children:[
      { path: 'list', component: PeLaporanLabListComponent, canActivate: [PePermissionGuard]},
      { path: 'add', component: PeLaporanLabAddComponent, canActivate: [PePermissionGuard] },
      { path: 'chart', component: PeLaporanLabChartComponent, canActivate: [PePermissionGuard] },
      { path: '', redirectTo: 'list', pathMatch:"full"},
    ]},

    { path: 'map', component: PeMapComponent, children:[
      { path: '', component: MapSumurComponent, canActivate: [PePermissionGuard]},
      { path: 'add', component: PeMapAddComponent, canActivate: [PePermissionGuard] },
      // { path: 'chart', component: PeLaporanLabChartComponent, canActivate: [PePermissionGuard] },
      { path: '', redirectTo: '', pathMatch:"full"},
    ]},

     { path: 'pump', component: PePumpingUnitComponent, children:[
      { path: 'list', component: PePumpingUnitListComponent, canActivate: [PePermissionGuard]},
      { path: 'add', component: PePumpingUnitAddComponent, canActivate: [PePermissionGuard] },
      { path: '', redirectTo: 'list', pathMatch:"full"},
    ]},

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
