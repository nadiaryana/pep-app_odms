import { NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule }    from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule }   from '@angular/common';
//import { MatFileUploadModule } from 'angular-material-fileupload';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatSortModule } from '@angular/material/sort';
import { PeRoutingModule } from './pe-routing.module';
import { MaterialModule } from '../material/material.module';
import { xFilterModule } from '../xfilter/xfilter.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PeComponent } from './pe.component';

import { AuthService } from '../auth.service';
import { AuthInterceptor } from '../auth.interceptor'

import { PeDashboardComponent } from './dashboard/pe-dashboard.component';

import { PeDailyComponent } from './daily/pe-daily.component';
import { PeDailyManajemenComponent } from './daily/pe-daily-manajemen.component';
import { PeDailyListComponent } from './daily/pe-daily-list.component';
import { PeDailyDeleteDialogComponent } from './daily/pe-daily-list.component';
import { PeDailyAddComponent } from './daily/pe-daily-add.component';
import { PeDailyAddOsgComponent } from './daily/pe-daily-add-osg.component';
import { PeDailyEditOsgComponent } from './daily/pe-daily-edit-osg.component';
import { PeDailyChartComponent } from './daily/pe-daily-chart.component';

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
import { PeDailyZonechartComponent } from './daily/pe-daily-zonechart.component';
import { PeDailyZonechartListComponent } from './daily/pe-daily-zonechart-list.component';
import { PeDailySemilogChartComponent } from './daily/pe-daily-semilog-chart.component';
import { PeDailyAreaChartComponent } from './daily/pe-daily-area-chart.component';
import { PeSonologChartComponent } from './sonolog/pe-sonolog-chart.component';
import { PeDailyPerAreaChartComponent } from './daily/pe-daily-per-area-chart.component';
import { PeProductionAddComponent } from './daily/pe-production-add.component';
import { IprComponent } from './daily/ipr/pe-ipr.component';
import { PeSumurCurrentComponent } from './current/pe-sumur-current-list.component';
import { PeSumurCurrentAddComponent } from './current/pe-sumur-current-add.component';
// import { PeGrafikComponent } from './grafik/pe-grafik.component';



@NgModule({
  declarations: [
  PeComponent,
  PeDashboardComponent,

  PeDailyComponent,
  PeDailyManajemenComponent,
  PeDailyListComponent,
  PeDailyAddComponent,
  PeDailyChartComponent,
  PeDailyDeleteDialogComponent,
  PeDailyAddOsgComponent,
  PeDailyEditOsgComponent,
  
  PeProductionAddComponent,

  PeSonologComponent,
  PeSonologListComponent,
  PeSonologAddComponent,
  PeSonologDeleteDialogComponent,

  PeSensorComponent,
  PeSensorListComponent,
  PeSensorAddComponent,
  PeSensorDeleteDialogComponent,
  PeDailyZonechartComponent,
  PeDailyZonechartListComponent,
  PeDailySemilogChartComponent,
  PeSonologChartComponent,
  PeDailyAreaChartComponent,
  PeDailyPerAreaChartComponent,
  IprComponent,
  PeSumurCurrentComponent,
  PeSumurCurrentAddComponent,
  // PeGrafikComponent,
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
    MatSlideToggleModule,
    MatSortModule,
    MatChipsModule,
  // NgChartsModule,

  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    // PeWellMonitoringService,
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
		    new PanelItem("Man. Operation, SOT & Gas", "pe/daily/manajemen", "add", this.pePermission.passPermission("pe/daily/manajemen")),
        new PanelItem("Oil Production", "", "water_drop", this.pePermission.passPermission("pe/dasboard"), true, [
            new PanelSubItem("Daily Production", "pe/daily", "list", this.pePermission.passPermission("pe/daily")),
            new PanelSubItem("Sonolog", "pe/sonolog", "graphic_eq", this.pePermission.passPermission("pe/sonolog")),
            //new PanelSubItem("Sonolog Add", "pe/sonolog/add", "playlist_add", this.pePermission.passPermission("pe/sonolog/add")),
			      new PanelSubItem("BHP", "pe/sensor", "sensors", this.pePermission.passPermission("pe/sensor")),
            new PanelSubItem("IPR", "pe/ipr", "show_chart"),
            //new PanelSubItem("Sensor Add", "pe/sensor/add", "playlist_add", this.pePermission.passPermission("pe/sensor/add")),
            ]),
        new PanelItem("iSRP PCM", "", "waves", this.pePermission.passPermission("pe/dashboard"), true, [
          new PanelSubItem("iSRP", "pe/sumur", "waves", this.pePermission.passPermission("pe/sumur")),
          new PanelSubItem("Daily Current", "pe/current", "table_chart"),
        ]),
        new PanelItem("Diagnostic Chart", "pe/grafik", "assessment", this.pePermission.passPermission("pe/grafik")),
        
      
        ]));
    });

  }
}
