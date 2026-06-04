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

import { PeBhpComponent} from './bhp/pe-bhp.component';
import { PeBhpListComponent} from './bhp/pe-bhp-list.component';
import { PeBhpDeleteDialogComponent } from './bhp/pe-bhp-list.component';
import { PeBhpAddComponent } from './bhp/pe-bhp-add.component';

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
import { PeDailyZoneChartDeleteDialogComponent, PeDailyZonechartListComponent } from './daily/pe-daily-zonechart-list.component';
import { PeDailySemilogChartComponent } from './daily/pe-daily-semilog-chart.component';
import { PeDailyAreaChartComponent } from './daily/pe-daily-area-chart.component';
import { PeSonologChartComponent } from './sonolog/pe-sonolog-chart.component';
import { PeDailyPerAreaChartComponent } from './daily/pe-daily-per-area-chart.component';
import { PeProductionAddComponent } from './daily/pe-production-add.component';
import { IprComponent } from './daily/ipr/pe-ipr.component';
import { PeSumurCurrentComponent } from './current/pe-sumur-current.component';
import { PeSumurCurrentListComponent, PeSumurDeleteDialogComponent } from './current/pe-sumur-current-list.component';
import { PeSumurCurrentAddComponent } from './current/pe-sumur-current-add.component';
import { PeDailyGasDeleteDialogComponent, PeDailyGasListComponent } from './daily/pe-daily-gas-list.component';
import { PeDailyChanPlotListComponent, PeDailyChanPlotDeleteDialogComponent } from './daily/pe-daily-chan-plot-list.component';
import { PeDailyGasChartComponent } from './daily/pe-daily-gaschart.component';
import { PeDailyChanPlotChartComponent } from './daily/pe-daily-chan-plot-chart.component';
import { PeDailyChanPlotComponent } from './daily/pe-daily-chan-plot.component';
import { PeBhpChartComponent } from './bhp/pe-bhp-chart.component';
import { PeDailyManajemenChartComponent } from './daily/pe-daily-manajemen-chart.component';
import { PeDailyAggregateComponent } from './daily/pe-daily-aggregate.component';
import { PeDailyAggregateDeleteDialogComponent, PeDailyAggregateListComponent } from './daily/pe-daily-aggregate-list.component';
import { OneSlideComponent } from './daily/oneslide/pe-one-slide.component';
import { RouterModule } from '@angular/router';

import { BarchartComponent } from './barchart/barchart.component';
import { BarchartListComponent, BarchartDeleteDialogComponent } from './barchart/barchart-list.component';
import { BarchartAddComponent } from './barchart/barchart-add.component';
import { BarchartChartComponent } from './barchart/barchart-chart.component';
import { PeLabAddComponent } from './lab/pe-lab-add.component';
import { PeLabDeleteDialogComponent, PeLabListComponent } from './lab/pe-lab-list.component';
import { PeLabChartComponent } from './lab/pe-lab-chart.component';
import { PeLabComponent } from './lab/pe-lab.component';
import { PeDailyOptimasiDeleteDialogComponent, PeOptimasiListComponent } from './optimasi/pe-optimasi-list.component';
import { PeOptimasiAddComponent } from './optimasi/pe-optimasi-add.component';
import { PeOptimasiChartComponent } from './optimasi/pe-optimasi-chart.component';
import { PeOptimasiComponent } from './optimasi/pe-optimasi.component';
import { MatButtonToggleModule, MatCheckboxModule, MatSliderModule } from '@angular/material';
import { PeLaporanLabDeleteDialogComponent, PeLaporanLabListComponent } from './laporan/pe-laporan-lab-list.component';
import { PeLaporanLabAddComponent } from './laporan/pe-laporan-lab-add.component';
import { PeLaporanLabChartComponent } from './laporan/pe-laporan-lab-chart.component';
import { PeLaporanLabComponent } from './laporan/pe-laporan-lab.component';
// import { PeMapSumurService } from './map/pe-map-sumur.service';
import { MapSumurComponent, PeMapDeleteDialogComponent } from './map/pe-map-sumur.component';
import { PeMapAddComponent } from './map/pe-map-add.component';
import { PeMapComponent } from './map/pe-map.component';
import { PePumpingUnitAddComponent } from './pump/pe-pumping-unit-add.component';
import { PePumpingUnitComponent } from './pump/pe-pumping-unit.component';
import { PePumpingUnitDeleteDialogComponent, PePumpingUnitListComponent } from './pump/pe-pumping-unit-list.component';
import { PeWellDatabaseComponent } from './well-database/pe-well-database.component';
import { PeWellDatabaseDeleteDialogComponent, PeWellDatabaseListComponent } from './well-database/pe-well-database-list.component';
import { PeWellDatabaseAddComponent } from './well-database/pe-well-database-add.component';
import { PeActualComponent } from './actual/pe-actual.component';
import { PeActualListComponent } from './actual/pe-actual-list.component';
import { PeActualAddOprComponent } from './actual/pe-actual-add-opr.component';
import { PeActualDeleteDialogComponent } from './actual/pe-actual-list.component';
import { PeActualAddComponent } from './actual/pe-actual-add.component';
import { PeActualChartComponent } from './actual/pe-actual-chart.component';
// import { PeGrafikComponent } from './grafik/pe-grafik.component';



@NgModule({
  declarations: [
  PeComponent,
  PeDashboardComponent,

  PeDailyComponent,
  PeDailyManajemenComponent,
  PeDailyManajemenChartComponent,
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

  PeDailyGasListComponent,
  PeDailyGasDeleteDialogComponent,
  PeDailyGasChartComponent,

  PeDailyChanPlotChartComponent,
  PeDailyChanPlotListComponent,
  PeDailyChanPlotDeleteDialogComponent,
  
  PeBhpComponent,
  PeBhpAddComponent,
  PeBhpListComponent,
  PeBhpDeleteDialogComponent,
  PeBhpChartComponent,

  PeDailyZonechartComponent,
  PeDailyZonechartListComponent,
  PeDailyZoneChartDeleteDialogComponent,

  PeDailySemilogChartComponent,
  PeSonologChartComponent,
  PeDailyAreaChartComponent,
  PeDailyPerAreaChartComponent,
  IprComponent,
  PeSumurCurrentComponent,
  PeSumurCurrentListComponent,
  PeSumurCurrentAddComponent,
  PeSumurDeleteDialogComponent,

  PeDailyChanPlotComponent,
  PeDailyAggregateComponent,
  PeDailyAggregateListComponent,
  PeDailyAggregateDeleteDialogComponent,
  OneSlideComponent,
  BarchartComponent,
  BarchartListComponent,
  BarchartDeleteDialogComponent,
  BarchartAddComponent,
  BarchartChartComponent,

  PeLabComponent,
  PeLabAddComponent,
  PeLabListComponent,
  PeLabDeleteDialogComponent,
  PeLabChartComponent,
  PeOptimasiListComponent,
  PeOptimasiAddComponent,
  PeOptimasiChartComponent,
  PeOptimasiComponent,
  PeDailyOptimasiDeleteDialogComponent,
  
  PeLaporanLabListComponent,
  PeLaporanLabAddComponent,
  PeLaporanLabChartComponent,
  PeLaporanLabComponent,
  PeLaporanLabDeleteDialogComponent,
  PeMapComponent,
  MapSumurComponent,
  PeMapAddComponent,
  PeMapDeleteDialogComponent,

  PePumpingUnitComponent,
  PePumpingUnitAddComponent,
  PePumpingUnitListComponent,
  PePumpingUnitDeleteDialogComponent,

  PeWellDatabaseComponent,
  PeWellDatabaseListComponent,
  PeWellDatabaseAddComponent,
  PeWellDatabaseDeleteDialogComponent,

  PeActualComponent,
  PeActualListComponent,
  PeActualAddComponent,
  PeActualAddOprComponent,
  PeActualDeleteDialogComponent,
  PeActualChartComponent,
  // PeActualEditOprComponent,

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
  MatButtonToggleModule,
  MatCheckboxModule,
  ChartModule,
  MatSliderModule,
  MatGridListModule,
  xFilterModule,
    MatSlideToggleModule,
    MatSortModule,
    MatChipsModule,
  
    RouterModule,

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
  PeBhpDeleteDialogComponent,
  BarchartDeleteDialogComponent,
  PeLabDeleteDialogComponent,
  PeLaporanLabDeleteDialogComponent,
  PePumpingUnitDeleteDialogComponent,
  PeWellDatabaseDeleteDialogComponent,
  PeActualDeleteDialogComponent,
  
  // PeSumurDeleteDialogComponent,
  // PeDailyZoneChartDeleteDialogComponent,
  // PeDailyGasDeleteDialogComponent,
  // PeDailyChanPlotDeleteDialogComponent,
  // PeDailyAggregateDeleteDialogComponent,
  ],
})

export class PeModule { 

  private readonly actualAdminUsername = 'pe.admin';
  
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
			      new PanelSubItem("BHP", "pe/bhp", "sensors", this.pePermission.passPermission("pe/bhp")),
            new PanelSubItem("IPR", "pe/ipr", "data_thresholding"),
            new PanelSubItem("One Slide", "pe/one-slide", "camera"),
            new PanelSubItem("Chan Plot", "pe/chan-plot", "scatter_plot"),
            new PanelSubItem("Aggregate", "pe/aggregate", "change_history"),
            new PanelSubItem("Barchart", "pe/barchart", "bar_chart", this.pePermission.passPermission("pe/barchart")),
            new PanelSubItem("Optimasi", "pe/optimasi", "analytics"),
            ...(this.isActualAdmin(res) ? [new PanelSubItem("Actual", "pe/actual", "data_usage")] : []),
            
            //new PanelSubItem("Bhp Add", "pe/bhp/add", "playlist_add", this.pePermission.passPermission("pe/bhp/add")),
            ]),
        new PanelItem("iSRP PCM", "", "waves", this.pePermission.passPermission("pe/dashboard"), true, [
          new PanelSubItem("iSRP", "pe/sumur", "waves", this.pePermission.passPermission("pe/sumur")),
          new PanelSubItem("Daily Current", "pe/current", "table_chart"),
        ]),
        new PanelItem("Diagnostic Chart", "pe/grafik", "assessment", this.pePermission.passPermission("pe/grafik")),
        new PanelItem("Laboratorium", "", "science", this.pePermission.passPermission("pe/dasboard"), true, [
          // new PanelSubItem("Analysis", "pe/lab", "analytics", this.pePermission.passPermission("pe/lab")),
          new PanelSubItem("Assets", "pe/lab", "summarize", this.pePermission.passPermission("pe/lab")),
          new PanelSubItem("Measurement Result", "pe/laporan", "data_exploration", this.pePermission.passPermission("pe/laporan")),
          // new PanelSubItem("Performance & Inventory", "pe/lab", "trending_up", this.pePermission.passPermission("pe/lab")),
          
        ]),
        new PanelItem("Map", "pe/map", "map", this.pePermission.passPermission("pe/map")),
        new PanelItem("Pumping Unit", "pe/pump", "precision_manufacturing", this.pePermission.passPermission("pe/pumping-unit")),
        new PanelItem("Well Database", "pe/well-database", "storage", this.pePermission.passPermission("pe/well-database")),
      
        ]));
    });

  }

  private isActualAdmin(user: any): boolean {
    return user != null && user.Name === this.actualAdminUsername;
  }
}
