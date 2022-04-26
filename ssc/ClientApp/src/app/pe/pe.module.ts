import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule }    from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule }   from '@angular/common';
//import { MatFileUploadModule } from 'angular-material-fileupload';
import { MatGridListModule } from '@angular/material/grid-list'

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

import { PeSonologComponent } from './sonolog/pe-sonolog.component';
import { PeSonologListComponent } from './sonolog/pe-sonolog-list.component';
import { PeSonologDeleteDialogComponent } from './sonolog/pe-sonolog-list.component';
import { PeSonologAddComponent } from './sonolog/pe-sonolog-add.component';

import { PeSensorComponent } from './sensor/pe-sensor.component';
import { PeSensorListComponent } from './sensor/pe-sensor-list.component';
import { PeSensorDeleteDialogComponent } from './sensor/pe-sensor-list.component';
import { PeSensorAddComponent } from './sensor/pe-sensor-add.component';

import { Panel } from '../navigation/panel/panel';
import { PanelItem } from '../navigation/panel/panel';
import { PanelService } from '../navigation/panel/panel.service';
import { xFilterDialogComponent } from '../xfilter/xfilter.component';
import { xFilterDialogNumberComponent } from '../xfilter/xfilter.component';
import { xFilterDialogDateComponent } from '../xfilter/xfilter.component';
import { xFilterDialogTextComponent } from '../xfilter/xfilter.component';
import { PePermissionService } from './pe-permission.service';

import { ChartModule } from 'angular-highcharts';

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

  PeSonologComponent,
  PeSonologListComponent,
  PeSonologAddComponent,
  PeSonologDeleteDialogComponent,

  PeSensorComponent,
  PeSensorListComponent,
  PeSensorAddComponent,
  PeSensorDeleteDialogComponent,
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
        new PanelItem("Active Wells", "pe/activewells", "dashboard", this.pePermission.passPermission("pe/activewells")),
        new PanelItem("Daily", "pe/daily", "list", this.pePermission.passPermission("pe/daily")),
        //new PanelItem("Daily Add", "pe/daily/add", "playlist_add", this.pePermission.passPermission("pe/daily/add")),
        new PanelItem("Sonolog", "pe/sonolog", "list", this.pePermission.passPermission("pe/sonolog")),
        //new PanelItem("Sonolog Add", "pe/sonolog/add", "playlist_add", this.pePermission.passPermission("pe/sonolog/add")),
        new PanelItem("Downhole Sensor", "pe/sensor", "list", this.pePermission.passPermission("pe/sensor")),
        //new PanelItem("Sensor Add", "pe/sensor/add", "playlist_add", this.pePermission.passPermission("pe/sensor/add")),
        new PanelItem("Well Performance", "pe/wellperformance", "dashboard", this.pePermission.passPermission("pe/wellperformance")),
        new PanelItem("IPR", "pe/ipr", "dashboard", this.pePermission.passPermission("pe/ipr")),
        ]));
    });

    
  }
}
