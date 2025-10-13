import { NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule }    from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule }   from '@angular/common';
//import { MatFileUploadModule } from 'angular-material-fileupload';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { PeRoutingModule } from './pe-routing.module';
import { MaterialModule } from '../material/material.module';
import { xFilterModule } from '../xfilter/xfilter.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PeComponent } from './pe.component';

import { AuthService } from '../auth.service';
import { AuthInterceptor } from '../auth.interceptor'

import { PeDashboardComponent } from './dashboard/pe-dashboard.component';
import { PeActiveWellsComponent } from './activewells/pe-activewells.component';
import { PeWellPerformanceComponent } from './wellperformance/pe-wellperformance.component';
import { PeWellPerformanceChartComponent } from './wellperformance/pe-wellperformance.component';
import { PeIPRComponent } from './ipr/pe-ipr.component';

import { PeDailyComponent } from './daily/pe-daily.component';
import { PeDailyListComponent } from './daily/pe-daily-list.component';
import { PeDailyDeleteDialogComponent } from './daily/pe-daily-list.component';
import { PeDailyAddComponent } from './daily/pe-daily-add.component';
import { PeDailyChartComponent } from './daily/pe-daily-chart.component';

import { PeLabComponent } from './lab/pe-lab.component';
import { PeLabListComponent } from './lab/pe-lab-list.component';
import { PeLabDeleteDialogComponent } from './lab/pe-lab-edit-reports.component';
import { PeLabAddComponent } from './lab/pe-lab-add.component';
import { PeLabManualAddComponent } from './lab/pe-lab-manual-add.component';
import { PeLabChartComponent } from './lab/pe-lab-chart.component';
import { PeLabReportsComponent } from './lab/pe-lab-reports.component';
import { PeLabAddReportsComponent } from './lab/pe-lab-add-reports.component';
import { PeLabEditReportsComponent } from './lab/pe-lab-edit-reports.component';

import { PeSonologComponent } from './sonolog/pe-sonolog.component';
import { PeSonologListComponent } from './sonolog/pe-sonolog-list.component';
import { PeSonologDeleteDialogComponent } from './sonolog/pe-sonolog-list.component';
import { PeSonologAddComponent } from './sonolog/pe-sonolog-add.component';

import { PeSensorComponent } from './sensor/pe-sensor.component';
import { PeSensorListComponent } from './sensor/pe-sensor-list.component';
import { PeSensorDeleteDialogComponent } from './sensor/pe-sensor-list.component';
import { PeSensorAddComponent } from './sensor/pe-sensor-add.component';

import { Panel, PanelSubItem } from '../navigation/panel/panel';
import { PanelItem } from '../navigation/panel/panel';
import { PanelService } from '../navigation/panel/panel.service';
import { xFilterDialogComponent } from '../xfilter/xfilter.component';
import { xFilterDialogNumberComponent } from '../xfilter/xfilter.component';
import { xFilterDialogDateComponent } from '../xfilter/xfilter.component';
import { xFilterDialogTextComponent } from '../xfilter/xfilter.component';
import { PePermissionService } from './pe-permission.service';

import { ChartModule } from 'angular-highcharts';
import { DynagraphComponent } from './dynagraph/dynagraph.component';
import { AddDynagraphComponent } from './dynagraph/add-dynagraph.component';
import { ActivityComponent } from './activity/activity.component';
/*import { AddActivityComponent } from './activity/add-activity.component';*/

import { PeDailyZonechartComponent } from './daily/pe-daily-zonechart.component';
import { PeDailyZonechartListComponent } from './daily/pe-daily-zonechart-list.component';

@NgModule({
  declarations: [
  PeComponent,
  PeDashboardComponent,
  PeActiveWellsComponent,
  PeWellPerformanceComponent,
  PeWellPerformanceChartComponent,
  PeIPRComponent,

  PeDailyComponent,
  PeDailyListComponent,
  PeDailyAddComponent,
  PeDailyChartComponent,
  PeDailyDeleteDialogComponent,

  PeLabComponent,
  PeLabListComponent,
  PeLabAddComponent,
  PeLabManualAddComponent,
  PeLabChartComponent,
  PeLabDeleteDialogComponent,
  PeLabReportsComponent,
  PeLabAddReportsComponent,
  PeLabEditReportsComponent,

  PeSonologComponent,
  PeSonologListComponent,
  PeSonologAddComponent,
  PeSonologDeleteDialogComponent,

  PeSensorComponent,
  PeSensorListComponent,
  PeSensorAddComponent,
  PeSensorDeleteDialogComponent,
  // PeWellMonitoringComponent,
  DynagraphComponent,
  AddDynagraphComponent,
  ActivityComponent,
  /*AddActivityComponent,*/
  PeDailyZonechartComponent,
  PeDailyZonechartListComponent,
  ],
  imports: [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  HttpClientModule,
  PeRoutingModule,
  MaterialModule,
  FlexLayoutModule,
  //MatFileUploadModule,
  ChartModule,
  MatGridListModule,
  xFilterModule,
  // NgChartsModule,
  MatSlideToggleModule,
    MatChipsModule,

  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [],
  entryComponents: [
  xFilterDialogComponent,
  xFilterDialogNumberComponent,
  xFilterDialogDateComponent,
  xFilterDialogTextComponent,
  PeDailyDeleteDialogComponent,
  PeSonologDeleteDialogComponent,
  PeSensorDeleteDialogComponent,
  PeWellPerformanceChartComponent,
  PeLabDeleteDialogComponent,
  ],
})

export class PeModule { 
  
  constructor (
    private panelService: PanelService,
    private pePermission: PePermissionService,
    private authService: AuthService,
    ) {

    this.authService.currentUser.subscribe(res => {
      this.panelService.messageSource.next(new Panel(
        "Petroleum Engineering", 2, [
        new PanelItem("Dashboard", "pe/dashboard", "dashboard", this.pePermission.passPermission("pe/dashboard")),
        new PanelItem("Production Overview", "pe/activewells", "insights", this.pePermission.passPermission("pe/activewells")),
        new PanelItem("Oil Production", "", "water_drop", this.pePermission.passPermission("pe/dasboard"), true, [
            new PanelSubItem("Daily Production", "pe/daily", "list", this.pePermission.passPermission("pe/daily")),
            //new PanelSubItem("Daily Add", "pe/daily/add", "playlist_add", this.pePermission.passPermission("pe/daily/add")),
            new PanelSubItem("Sonolog", "pe/sonolog", "graphic_eq", this.pePermission.passPermission("pe/sonolog")),
            //new PanelSubItem("Sonolog Add", "pe/sonolog/add", "playlist_add", this.pePermission.passPermission("pe/sonolog/add")),
            new PanelSubItem("Dynagraph", "pe/dynagraph", "insights", this.pePermission.passPermission("pe/dynagraph")),
            new PanelSubItem("Downhole Sensor", "pe/sensor", "sensors", this.pePermission.passPermission("pe/sensor")),
            //new PanelSubItem("Sensor Add", "pe/sensor/add", "playlist_add", this.pePermission.passPermission("pe/sensor/add")),
            new PanelSubItem("Well Performance", "pe/wellperformance", "insights", this.pePermission.passPermission("pe/wellperformance")),
            new PanelSubItem("IPR", "pe/ipr", "data_thresholding", this.pePermission.passPermission("pe/ipr")),
            new PanelSubItem("Zone", "pe/daily/zonechart-list", "place", this.pePermission.passPermission("pe/daily/zonechart-list")),
          ]),
          new PanelItem("Gas Production", "", "propane_tank", this.pePermission.passPermission("pe/dasboard"), true, [
            new PanelSubItem("Daily Production", "pe/daily", "list", this.pePermission.passPermission("pe/daily")),
            new PanelSubItem("Gas Sales", "pe/sonolog", "gas_meter", this.pePermission.passPermission("pe/sonolog")),
            new PanelSubItem("Gas Balance", "pe/sensor", "screen_rotation_alt", this.pePermission.passPermission("pe/sensor")),
          ]),
          new PanelItem("Water Manajemen", "", "water", this.pePermission.passPermission("pe/dasboard"), true, [
            new PanelSubItem("Daily Production", "pe/daily", "list", this.pePermission.passPermission("pe/daily")),
            new PanelSubItem("Gas Sales", "pe/sonolog", "gas_meter", this.pePermission.passPermission("pe/sonolog")),
            new PanelSubItem("Gas Balance", "pe/sensor", "screen_rotation_alt", this.pePermission.passPermission("pe/sensor")),
          ]),
          new PanelItem("Laboratorium", "", "science", this.pePermission.passPermission("pe/dasboard"), true, [
            new PanelSubItem("Analysis", "pe/lab", "analytics", this.pePermission.passPermission("pe/lab")),
            new PanelSubItem("Report", "pe/lab/reports", "summarize", this.pePermission.passPermission("pe/lab/reports")),
            new PanelSubItem("Measurement Result", "pe/lab", "data_exploration", this.pePermission.passPermission("pe/lab")),
            new PanelSubItem("Performance & Inventory", "pe/lab", "trending_up", this.pePermission.passPermission("pe/lab")),

          ]),
       
        ]));
    });

  }
}
