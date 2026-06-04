import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { MatDatepicker } from '@angular/material';
import { FormControl } from '@angular/forms';
import * as Highcharts from 'highcharts';
import exporting from 'highcharts/modules/exporting';
import offline from 'highcharts/modules/offline-exporting';

exporting(Highcharts);
offline(Highcharts);

import { TitleService } from '../../navigation/title/title.service';

@Component({
  selector: 'app-pe-actual-chart',
  templateUrl: './pe-actual-chart.component.html',
  styleUrls: ['./pe-actual.scss']
})
export class PeActualChartComponent implements OnInit {

  @ViewChild('actual_chart_el', { static: true }) public actual_chart_el: ElementRef;

  actual_chart_options: any = {
    chart: {
      zoomType: 'x',
      style: {
        fontFamily: 'Roboto, Helvetica Neue, sans-serif'
      }
    },
    exporting: {
      fallbackToExportServer: false
    },
    title: {
      text: null
    },
    caption: {
      text: null,
      align: 'center',
      verticalAlign: 'top'
    },
    xAxis: [{
      categories: [],
      crosshair: true,
      autoRotation: true,
      labels: {}
    }],
    yAxis: [{
      title: {
        text: 'bopd',
        style: { color: '#666666' }
      },
      labels: {
        format: '{value}',
        style: { color: '#999999' }
      }
    }],
    tooltip: {
      shared: true
    },
    legend: {
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'top',
      backgroundColor:
        Highcharts.defaultOptions.legend && Highcharts.defaultOptions.legend.backgroundColor || 'rgba(255,255,255,0.25)'
    },
    series: [
      {
        name: 'Total Operation',
        type: 'line',
        yAxis: 0,
        data: [],
        color: '#000000',
        zIndex: 4,
        marker: { enabled: false },
        tooltip: { valueSuffix: ' bopd', valueDecimals: 2 }
      },
      {
        name: 'SGT MGS',
        type: 'line',
        yAxis: 0,
        data: [],
        color: '#00B050',
        zIndex: 3,
        marker: { enabled: false },
        tooltip: { valueSuffix: ' bopd', valueDecimals: 2 }
      },
      {
        name: 'SBR NSOP',
        type: 'line',
        yAxis: 0,
        data: [],
        color: '#C00000',
        zIndex: 2,
        marker: { enabled: false },
        tooltip: { valueSuffix: ' bopd', valueDecimals: 2 }
      },
      {
        name: 'BD',
        type: 'line',
        yAxis: 0,
        data: [],
        color: '#0070C0',
        zIndex: 1,
        marker: { enabled: false },
        tooltip: { valueSuffix: ' bopd', valueDecimals: 2 }
      }
    ],
    responsive: {
      rules: [{
        condition: { maxWidth: 500 },
        chartOptions: {
          legend: {
            floating: false,
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom',
            x: 0,
            y: 0
          }
        }
      }]
    }
  };

  @ViewChild('start_datePicker', { static: true }) start_datePicker: MatDatepicker<any>;
  start_dateControl = new FormControl(new Date(new Date().setDate(new Date().getDate() - 30)));
  start_dateInput = this.start_dateControl.value.toLocaleDateString('en-US', { month: 'short', year: 'numeric', day: 'numeric' });

  @ViewChild('end_datePicker', { static: true }) end_datePicker: MatDatepicker<any>;
  end_dateControl = new FormControl(new Date(new Date().setDate(new Date().getDate() - 1)));
  end_dateInput = this.end_dateControl.value.toLocaleDateString('en-US', { month: 'short', year: 'numeric', day: 'numeric' });

  isLoadingResults: boolean = false;

  constructor(
    private http: HttpClient,
    private titleService: TitleService
  ) { }

  ngOnInit() {
    this.titleService.titleSource.next({
      title: 'Actual Chart',
      icon: 'bar_chart',
      breadcrumbs: [
        { label: 'Petroleum Engineering', routerLink: '' },
        { label: 'Actual', routerLink: 'pe/actual' },
        { label: 'Chart', routerLink: '' }
      ]
    });

    this.start_dateControl.valueChanges.subscribe(() => {
      this.refresh_Actual();
    });
    this.end_dateControl.valueChanges.subscribe(() => {
      this.refresh_Actual();
    });

    this.refresh_Actual();
  }

  start_dateChange(event: any) {
    this.start_dateInput = event.value
      ? event.value.toLocaleDateString('en-US', { month: 'short', year: 'numeric', day: 'numeric' })
      : '';
  }

  end_dateChange(event: any) {
    this.end_dateInput = event.value
      ? event.value.toLocaleDateString('en-US', { month: 'short', year: 'numeric', day: 'numeric' })
      : '';
  }

  refresh_Actual() {
    if (!this.start_dateControl.value || !this.end_dateControl.value) return;

    let params = new HttpParams()
      .set('type', 'actual_operation')
      .set('date', this.start_dateControl.value.toISOString())
      .set('end_date', this.end_dateControl.value.toISOString());

    this.isLoadingResults = true;

    this.http.get('/api/pe/actual/GetActualChart', { params }).subscribe((res: any) => {
      const data: any[] = res['data'];

      this.actual_chart_options["title"]["text"] = "Actual Operation";
      this.actual_chart_options['xAxis'][0]['categories'] =
        data.map(d => formatDate(d['date'], 'dd-MMM-yy', 'en-US'));

      this.actual_chart_options['series'][0]['data'] = data.map(d => d['total_operation']);
      this.actual_chart_options['series'][1]['data'] = data.map(d => d['sgt']);
      this.actual_chart_options['series'][2]['data'] = data.map(d => d['sbr']);
      this.actual_chart_options['series'][3]['data'] = data.map(d => d['bd']);

      Highcharts.chart(this.actual_chart_el.nativeElement, this.actual_chart_options as any);

      this.isLoadingResults = false;
    }, () => {
      this.isLoadingResults = false;
    });
  }
}
