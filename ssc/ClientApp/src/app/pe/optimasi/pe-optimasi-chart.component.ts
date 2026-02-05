import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpEventType, HttpParams, HttpResponse, HttpHeaders } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { MatDatepicker } from '@angular/material';
import { FormControl } from '@angular/forms';
import { merge, Observable, of as observableOf, forkJoin } from 'rxjs';
import { catchError, map, startWith, switchMap, debounceTime, take, mergeAll } from 'rxjs/operators';
import { Chart } from 'angular-highcharts';
import * as Highcharts from 'highcharts';

// import { annotations } from 'highcharts/modules/annotations';

import { MatSnackBar } from '@angular/material';

import { TitleService } from '../../navigation/title/title.service';
import { xFilterService } from '../../xfilter/xfilter.component';

import { Export } from '../exporting.js';
import { OfflineExport } from '../offline-exporting.js';
import { ExampleHttpDao } from './pe-optimasi-list.component';

@Component({
  selector: 'app-pe-optimasi-chart',
  templateUrl: './pe-optimasi-chart.component.html',
  styleUrls: ['./pe-optimasi.scss']
})
export class PeOptimasiChartComponent implements OnInit {
  
  @ViewChild('quadrant_chart_el', { static: true }) public quadrant_chart_el: ElementRef;
  quadrant_table_data = [];
  quadrant_table_columns: string[] = ["status", "count"];

  
  // quadrant_chart_options:
  isLoadingResults: boolean = false;

  xAxisMax: number = 200;
  yAxisMax: number = 200;
  chart: Highcharts.Chart;
  public quadrantX: number = 50;
  public quadrantY: number = 25;


  quadrant_chart_options: any = {
    chart: {
      type: 'scatter',
      zoomType: 'xy',
      style: {
        fontFamily: 'Roboto, Helvetica Neue, sans-serif'
      }
    },

    title: { text: 'Quadrant – SM vs Efficiency' },

    xAxis: {
      title: { text: 'Avg Submergence' },
      plotLines: []   
    },

    yAxis: {
      title: { text: 'Avg Pump Efficiency (%)' },
      min: 0,
      max: this.yAxisMax,
      plotLines: []   
    },

    tooltip: {
      formatter: function () {
        return `
          <b>${this.point.name}</b><br/>
          SM: ${this.x}<br/>
          Efficiency: ${this.y.toFixed(2)} %
        `;
      }
    },

    legend: {
      align: 'center',
      verticalAlign: 'top'
    },

    plotOptions: {
      scatter: {
        dataLabels: {
          enabled: true,
          formatter: function () {
            return this.point.name;
          },
        marker: {
          radius: 6,
          symbol: 'circle',
        } 
        }
      }
    },

    series: [{
      name: 'Well',
      data: []
    }]
  };

  @ViewChild('start_datePicker', { static: true }) start_datePicker: MatDatepicker<any>;
    start_dateControl = new FormControl();
    start_dateInput = this.start_dateControl.value
      ? this.start_dateControl.value.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
          day: "numeric",
        })
      : "";  

  @ViewChild('end_datePicker', { static: true }) end_datePicker: MatDatepicker<any>;
  end_dateControl = new FormControl();
  end_dateInput = this.end_dateControl.value
    ? this.end_dateControl.value.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
        day: "numeric",
      })
    : "";

  exampleDatabase: ExampleHttpDao | null;
  well_xSelected = [];



  constructor(
        private http: HttpClient,
        private titleService: TitleService,
        private xfilterService: xFilterService,
  ) { }

  ngOnInit() {
    this.titleService.titleSource.next({
    title: 'Quadrant Chart',
    icon: 'auto_graph',
    breadcrumbs: [
      { label: 'Petroleum Engineering', routerLink: '' },
      { label: 'Daily', routerLink: 'pe/daily' },
      { label: 'Quadrant', routerLink: '' }
    ]
  });

  // this.refreshQuadrant();

  this.start_dateControl.valueChanges.subscribe(() => this.refreshQuadrant());
  this.end_dateControl.valueChanges.subscribe(() => this.refreshQuadrant());
  }
  
  formatDate(date: Date): string {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
      day: 'numeric'
    });
  }
  start_dateChange(event: any) {
  if (!event.value) return;

  this.start_dateControl.setValue(event.value);
  this.start_dateInput = this.formatDate(event.value);

  // this.refreshQuadrant();
  }

  end_dateChange(event: any) {
    if (!event.value) return;

    this.end_dateControl.setValue(event.value);
    this.end_dateInput = this.formatDate(event.value);

    // this.refreshQuadrant();
  }

  refreshQuadrant() {
    
    // if start date or end date empty show warning
    if (!this.start_dateControl.value || !this.end_dateControl.value) {
      return;
    }
    this.isLoadingResults = true;

  const params = new HttpParams()
    .append('startDate', this.start_dateControl.value.toISOString())
    .append('endDate', this.end_dateControl.value.toISOString())
    .append('mode', 'optimasi_chart');

  this.http.get('/api/pe/daily/optimasi', { params })
    .subscribe((res: any) => {

      const items = res.items || [];

      const points = items.map(x => ({
        name: x.well,
        x: x.avg_sm,
        y: x.avg_ds_efficiency
      }));

      // === hitung garis kuadran ===
      // const avgX = items.reduce((s, d) => s + d.avg_sm, 0) / items.length;
      // const avgY = items.reduce((s, d) => s + d.avg_ds_efficiency, 0) / items.length;

      const thresholdX = 50;  // 50%
      const thresholdY = 25;  // 25%

      // update series
      this.quadrant_chart_options.series[0].data = points;

      // update plotLines
      this.quadrant_chart_options.xAxis.plotLines = [{
        value: thresholdX,
        color: 'red',
        dashStyle: 'Dash',
        width: 2,
        // label: { text: 'AVG SM' }
      }];

      this.quadrant_chart_options.yAxis.plotLines = [{
        value: thresholdY,
        color: 'red',
        dashStyle: 'Dash',
        width: 2,
        // label: { text: 'AVG Efficiency' }
      }];

      this.chart = Highcharts.chart(
        this.quadrant_chart_el.nativeElement,
        this.quadrant_chart_options
      );

      this.isLoadingResults = false;
    }, _ => this.isLoadingResults = false);

    
}

updateXAxis() {
  if (!this.chart) return;

  this.chart.xAxis[0].update({
    min: 0,
    max: this.xAxisMax
  });
}


updateYAxis() {
  if (!this.chart) return;

  this.chart.yAxis[0].update({
    min: 0,
    max: this.yAxisMax
  }, true);
}
  updateQuadrantLines() {
    if (!this.chart) return;

    // Hapus dan tambah garis X
    this.chart.xAxis[0].removePlotLine('quadrant-x');
    this.chart.xAxis[0].addPlotLine({
      id: 'quadrant-x',
      value: this.quadrantX,
      color: '#FF0000',
      width: 2,
      dashStyle: 'Dash',
      label: {
        text: `X = ${this.quadrantX}`,
        align: 'right'
      }
    });

    // Hapus dan tambah garis Y
    this.chart.yAxis[0].removePlotLine('quadrant-y');
    this.chart.yAxis[0].addPlotLine({
      id: 'quadrant-y',
      value: this.quadrantY,
      color: '#0000FF',
      width: 2,
      dashStyle: 'Dash',
      label: {
        text: `Y = ${this.quadrantY}%`,
        align: 'right'
      }
    });
  }

}


