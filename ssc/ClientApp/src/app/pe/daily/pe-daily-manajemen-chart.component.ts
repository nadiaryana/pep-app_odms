import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpEventType, HttpParams, HttpResponse, HttpHeaders } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { MatDatepicker } from '@angular/material';
import { FormControl } from '@angular/forms';
import { merge, Observable, of as observableOf, forkJoin } from 'rxjs';
import { catchError, map, startWith, switchMap, debounceTime, take, mergeAll } from 'rxjs/operators';
import { Chart } from 'angular-highcharts';
import * as Highcharts from 'highcharts';
import * as indicators from 'highcharts/indicators/indicators';
import * as trendline from 'highcharts/indicators/trendline';
// import { indicators } from "https://code.highcharts.com/stock/indicators/indicators.js";
// import { trendline } from "https://code.highcharts.com/stock/indicators/trendline.js";

// import { Trendline } from 'highcharts';
// import { Indicators } from 'highcharts';
// import * as Regression from 'highcharts-regression';

import { MatSnackBar } from '@angular/material';
import { SnackbarService } from '../../snackbar.service';
import { SnackbarApi } from '../../snackbar.service';

import { TitleService } from '../../navigation/title/title.service';
import { xFilterService } from '../../xfilter/xfilter.component';

@Component({
  selector: 'pe-daily-manajemen-chart',
  templateUrl: './pe-daily-manajemen-chart.component.html',
  styleUrls: ['./pe-daily.scss']
})

export class PeDailyManajemenChartComponent {

  @ViewChild('manajemen_chart_el', {static:true}) public manajemen_chart_el: ElementRef;

  areaControl = new FormControl(''); 
  metricControl = new FormControl('opr'); // opr | sot | fig
  dateControl = new FormControl(new Date());
  date_xSelected = [];
  well_xSelected = [];
  area_xSelected = [];

  isLoadingResults: boolean = false;

  valueOperation = 0;
  valueSOT = 0;
  valueFigure = 0;

    manajemen_chart_options:any = {
	
    chart: {
        type: 'line',
        zoomType: 'x',
        style: {
          fontFamily: 'Roboto, Helvetica Neue, sans-serif'
        }
    },
    title: {
       text: "Oil Production  : " + (this.area_xSelected.length > 0 ? this.area_xSelected[0] : ""),
    },
    subtitle: {         
    text: ''
  },
    caption: {
        text: null,
        align: 'center',
        verticalAlign: 'top'
    },
    xAxis: {
      categories: [],
      crosshair: true,
      labels: {
        rotation: -45
      }
    },
    yAxis: {
      title: {
        text: 'BOPD'
      },
      min: 0,
      plotLines: [
        {
          value: 0,
          color: '#000',
          width: 0,
          zIndex: 5
        }
      ]
    },
	
    tooltip: {
		// headerFormat: '<b>{series.name}</b><br />',
		// pointFormat: 'Days = {point.x}, {series.name} = {point.y}',
		shared: true
    },
    legend: {
        // layout: 'horizontal',
        align: 'center',
        verticalAlign: 'bottom',
        // backgroundColor:
        //     Highcharts.defaultOptions.legend.backgroundColor || // theme
        //     'rgba(255,255,255,0.25)'
    },
	plotOptions: {
        series: {
            label: {
                // connectorAllowed: false
            },
            pointStart: 1
        }
    },
    series: [
    {
      name: 'SGT',
      type: 'line',
      data: [],
      color: '#4dabf7'
    },
    {
      name: 'SBR',
      type: 'line',
      data: [],
      color: '#ff7f0e'
    },
    {
      name: 'BD',
      type: 'line',
      data: [],
      color: '#8bc34a'
    },
    {
      name: 'RKAP',
      type: 'line',
      data: [],
      dashStyle: 'ShortDash',
      color: '#000000',
      marker: { enabled: false }
    },
    {
      name: 'WPNB',
      type: 'line',
      data: [],
      dashStyle: 'ShortDash',
      color: '#ff0000',
      marker: { enabled: false }
    }
    ]
};

  @ViewChild('start_datePicker', {static: true}) start_datePicker: MatDatepicker<any>;
  start_dateControl = new FormControl(new Date(new Date().setDate(new Date().getDate()-4)));
  start_dateInput = this.start_dateControl.value.toLocaleDateString("en-US", { month:"short", year:"numeric", day:"numeric" });

  @ViewChild('end_datePicker', {static: true}) end_datePicker: MatDatepicker<any>;
  end_dateControl = new FormControl(new Date(new Date().setDate(new Date().getDate()-1)));
  end_dateInput = this.end_dateControl.value.toLocaleDateString("en-US", { month:"short", year:"numeric", day:"numeric" });

  exampleDatabase: ExampleHttpDao | null;
 

  // isLoadingResults:boolean = false;

  chart: Highcharts.Chart;

  
  constructor(
	private http: HttpClient,
    private titleService: TitleService,
    private xfilterService: xFilterService,
    private snackbarService: SnackbarService,
  ) { }

  ngOnInit() {
	this.exampleDatabase = new ExampleHttpDao(this.http);
	
	this.titleService.titleSource.next({
      title: "Chart",
      icon: "show_chart",
      breadcrumbs: [
        { label: 'Petroleum Engineering', routerLink: '' },
        { label: 'Manajemen', routerLink: '' },
		{ label: 'Chart', routerLink: '' }
      ]
    }
    );
    this.areaControl.valueChanges.subscribe(() => this.refresh_Production());
    this.metricControl.valueChanges.subscribe(() => this.refresh_Production());
    this.dateControl.valueChanges.subscribe(() => this.refresh_Production());

    this.refresh_Production();
	
    this.xfilterService.filter.subscribe(res => {
        this.getColumnValues(res);
      })  
      
    // on xFilter selection change
    this.xfilterService.selected.subscribe((res) => {
      if (res.column === 'area') {
        // limit only 1 area selection
        if (res.selected && res.selected.length > 1) {
          this.area_xSelected = [];
          // notif snackbar
          this.snackbarService.status.next(new SnackbarApi(true, "Only one area can be selected at a time."));
        } else { 
          this.area_xSelected = res.selected || [];
          console.log('AREA SELECTED:', this.area_xSelected);
          this.refresh_Production();
        }
      }
    });
    this.start_dateControl.valueChanges.subscribe(r => {
      this.refresh_Production();
    })
    this.end_dateControl.valueChanges.subscribe(r => {
      this.refresh_Production();
    })
  }

  // Method untuk convert metric code ke label
  getMetricLabel(metric: string): string {
    const metricMap = {
      'opr': 'Operation',
      'sot': 'SOT',
      'fig': 'Figure'
    };
    return metricMap[metric] || metric.toUpperCase();
  }
  
  getColumnValues(param: any) {

  const column   = param.column;
  const filter   = param.filter;
  const selected = param.selected;
  const clear    = param.clear;

  /** =========================
   *  BUILD COLUMN FILTER
   *  ========================= */
  let columnfilter: any = {};
  if (column === 'area' && selected && selected.length > 0) { this.areaControl.setValue(selected[0].toLowerCase());
    this.refresh_Production();
  }


  /** filter well sebelumnya (cascade filter) */
  // if (this.well_xSelected && this.well_xSelected.length > 0) {
  //   columnfilter["well"] = this.well_xSelected.map(w => "^" + w + "$");
  // }
  if (this.area_xSelected && this.area_xSelected.length > 0) {
    columnfilter["area"] = this.area_xSelected.map(w => "^" + w + "$");
  }
  console.log('areaControl:', this.areaControl.value);
  console.log('area_xSelected:', this.area_xSelected);


  /** filter by current column */
  if (filter) {
    columnfilter[column] = [filter];
  }

  if (selected && selected.length > 0) {
    columnfilter[column] = selected.map(s => "^" + s + "$");
  }

  /** clear column filter */
  if (clear) {
    delete columnfilter[column];
  }

  /** =========================
   *  API CALL
   *  ========================= */
  // this.exampleDatabase!
  //   .getRepoIssues(
  //     column,        // distinct column
  //     "asc",
  //     0,
  //     0,
  //     "",
  //     columnfilter,
  //     column         // group by
  //   )
  //   .subscribe(res => {

  //     /** update dropdown / filter list */
  //     this.xfilterService.updateItems({
  //       column: column,
  //       items: res.items
  //     });

  //   }, err => {
  //     console.error("getColumnValues error", err);
  //   });

    // get data from backend for area filter
    this.http.get<any>('/api/pe/production/GetAreaList').subscribe(res => {
      // this.area_xSelected = res.items || [];
      this.xfilterService.updateItems({
        column: 'area',
        items: res.items
      });
    });
}


  start_dateChange(evt) {
    this.start_dateInput = evt.value.toLocaleDateString("en-US", { month:"short", year:"numeric", day:"numeric" });
  }

  end_dateChange(evt) {
    this.end_dateInput = evt.value.toLocaleDateString("en-US", { month:"short", year:"numeric", day:"numeric" });
  }

// refresh_Production() {

//     this.isLoadingResults = false;

//     // const area = this.areaControl.value.toLowerCase(); // sgt | sbr | bd

//     const start_date = this.start_dateControl.value;
//     const end_date   = this.end_dateControl.value;
//     const area =
//     this.areaControl.value ||
//     (this.area_xSelected && this.area_xSelected.length > 0
//       ? this.area_xSelected[0].toLowerCase()
//       : 'sgt');

//     console.log('areaControl:', this.areaControl.value);
//     console.log('area_xSelected:', this.area_xSelected);

//     let columnfilter: any = {
//       date: [
//         { opr: 'gte', val: start_date.toISOString(), log: 'and' },
//         { opr: 'lte', val: end_date.toISOString(), log: 'and' }
//       ]
//     };

//     // if (area) {
//     //   columnfilter['area'] = [
//     //     { opr: 'eq', val: area }
//     //   ];
//     // }

//     this.http.get('/api/pe/production', {
//       params: {
//         sort: 'date',
//         order: 'asc',
//         pagesize: '10000',
//         columnfilter: JSON.stringify(columnfilter)
//       }
//     }).subscribe((res: any) => {

//       var categories = [];

//       var series_operation = [];
//       var series_sot = [];
//       var series_figure = [];
//       var series_rkap_oil = [];
//       var series_wpnb_oil = [];

//       this.manajemen_chart_options.series.forEach(s => s.data = []);

//       res.items.map(d => {

//         var xdt = new Date(d.date);
//         var dt = [
//           xdt.getDate(),
//           xdt.toLocaleString('en', { month: 'short' }),
//           xdt.getFullYear().toString().substr(-2)
//         ].join('-');

//         categories.push(dt);

//         /** 🔑 AREA BASED */
//         series_operation.push({ name: dt, y: d[`${area}_opr`] || 0});
//         series_sot.push({ name: dt, y: d[`${area}_sot`] || 0});
//         series_figure.push({ name: dt, y: d[`${area}_fig`] || 0});

//         /** TARGET LINE */
//         series_rkap_oil.push({ name: dt, y: d.rkap_oil });
//         series_wpnb_oil.push({ name: dt, y: d.wpnb_oil });

//         /** DAILY VALUE */
//         if (
//           this.dateControl.value.toLocaleDateString("id-ID") ===
//           new Date(d.date).toLocaleDateString("id-ID")
//         ) {
//           this.valueOperation = d[`${area}_opr`];
//           this.valueSOT = d[`${area}_sot`];
//           this.valueFigure = d[`${area}_fig`];
//         }
//       });

//       console.log('AREA:', area);
//       console.log('Sample row:', res.items[0]);


//       /** UPDATE CHART */
//       this.manajemen_chart_options.title.text =
//         'Oil Production - ' + area.toUpperCase(), 

//       this.manajemen_chart_options.subtitle.text =
//       `( ${start_date.toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' })}` +
//       ` - ${end_date.toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' })} )`;


//       this.manajemen_chart_options.xAxis.categories = categories;

//       this.manajemen_chart_options.series[0].data = series_operation;
//       this.manajemen_chart_options.series[1].data = series_sot;
//       this.manajemen_chart_options.series[2].data = series_figure;
//       this.manajemen_chart_options.series[3].data = series_rkap_oil;
//       this.manajemen_chart_options.series[4].data = series_wpnb_oil;

//       this.chart = Highcharts.chart(
//         this.manajemen_chart_el.nativeElement,
//         this.manajemen_chart_options
//       );

//       this.isLoadingResults = false;


//     }, error => {
//       this.isLoadingResults = false;
//       console.error(error);
//     });

//   }
refresh_Production() {

    this.isLoadingResults = true;

    const start_date = this.start_dateControl.value;
    const end_date   = this.end_dateControl.value;

    const metric = this.metricControl.value || 'opr'; // opr | sot | fig

    let columnfilter: any = {
      date: [
        { opr: 'gte', val: start_date.toISOString(), log: 'and' },
        { opr: 'lte', val: end_date.toISOString(), log: 'and' }
      ]
    };

    this.http.get('/api/pe/production', {
      params: {
        sort: 'date',
        order: 'asc',
        pagesize: '10000',
        columnfilter: JSON.stringify(columnfilter)
      }
    }).subscribe((res: any) => {

      var categories = [];

      var series_sgt = [];
      var series_sbr = [];
      var series_bd = [];
      var series_rkap = [];
      var series_wpnb = [];

      res.items.map(d => {

        var xdt = new Date(d.date);

        var dt = [
          xdt.getDate(),
          xdt.toLocaleString('en', { month: 'short' }),
          xdt.getFullYear().toString().substr(-2)
        ].join('-');

        categories.push(dt);

        /** AREA SERIES */
        series_sgt.push({ name: dt, y: d[`sgt_${metric}`] || 0 });
        series_sbr.push({ name: dt, y: d[`sbr_${metric}`] || 0 });
        series_bd.push({ name: dt, y: d[`bd_${metric}`] || 0 });

        /** TARGET */
        series_rkap.push({ name: dt, y: d.rkap_oil || 0 });
        series_wpnb.push({ name: dt, y: d.wpnb_oil || 0 });

      });

      /** UPDATE TITLE */

      this.manajemen_chart_options.title.text =
        'Oil Production - ' + this.getMetricLabel(metric);

      this.manajemen_chart_options.subtitle.text =
        `( ${start_date.toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' })}` +
        ` - ${end_date.toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' })} )`;

      /** UPDATE AXIS */

      this.manajemen_chart_options.xAxis.categories = categories;

      /** UPDATE SERIES */

      this.manajemen_chart_options.series[0].data = series_sgt;
      this.manajemen_chart_options.series[1].data = series_sbr;
      this.manajemen_chart_options.series[2].data = series_bd;
      this.manajemen_chart_options.series[3].data = series_rkap;
      this.manajemen_chart_options.series[4].data = series_wpnb;

      /** RENDER CHART */

      this.chart = Highcharts.chart(
        this.manajemen_chart_el.nativeElement,
        this.manajemen_chart_options
      );

      this.isLoadingResults = false;

    }, error => {

      this.isLoadingResults = false;
      console.error(error);

    });

  }
}

export interface PeWellApi {
  items: any[];
  total_count: number;
}

export class ExampleHttpDao {
  constructor(private http: HttpClient) {}

  getRepoIssues(sort: string, order: string, page: number, pagesize: number = 50, filter: string, columnfilter: object, mode: string = "", httpOption: object = {}): Observable<PeWellApi> {

    var params = {};
    if(sort!=null) params["sort"] = sort;
    if(order!=null) params["order"] = order;
    if(page!=null) params["page"] = page.toString();
    if(pagesize!=null) params["pagesize"] = pagesize.toString();
    if(filter!=null) params["filter"] = filter;
    if(Object.keys(columnfilter).length > 0) params["columnfilter"] = JSON.stringify(columnfilter);
    if(mode != null) params["mode"] = mode;

    httpOption["params"] = params;

    return this.http.get<PeWellApi>('/api/pe/daily', httpOption);
  }
}
