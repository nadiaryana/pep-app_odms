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

import { TitleService } from '../../navigation/title/title.service';
import { xFilterService } from '../../xfilter/xfilter.component';

@Component({
  selector: 'pe-daily-manajemen-chart',
  templateUrl: './pe-daily-manajemen-chart.component.html',
  styleUrls: ['./pe-daily.scss']
})

export class PeDailyManajemenChartComponent {

  @ViewChild('manajemen_chart_el', {static:true}) public manajemen_chart_el: ElementRef;

  areaControl = new FormControl('sgt'); // default
  dateControl = new FormControl(new Date());
  date_xSelected = [];

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
        text: 'Oil Production',
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
        name: 'Operation',
        type: 'line',
        data: [],
        color: '#4dabf7'
      },
      {
        name: 'SOT',
        type: 'line',
        data: [],
        color: '#ff7f0e'
      },
      {
        name: 'Figure',
        type: 'line',
        data: [],
        color: '#8bc34a'
      },
      {
        name: 'RKAP Oil',
        type: 'line',
        data: [],
        dashStyle: 'ShortDash',
        color: '#000000',
        marker: { enabled: false }
      },
      {
        name: 'WP&B Oil',
        type: 'line',
        data: [],
        dashStyle: 'ShortDash',
        color: '#ff0000',
        marker: { enabled: false }
      }
    ],
};

  @ViewChild('start_datePicker', {static: true}) start_datePicker: MatDatepicker<any>;
  start_dateControl = new FormControl(new Date(new Date().setDate(new Date().getDate()-4)));
  start_dateInput = this.start_dateControl.value.toLocaleDateString("en-US", { month:"short", year:"numeric", day:"numeric" });

  @ViewChild('end_datePicker', {static: true}) end_datePicker: MatDatepicker<any>;
  end_dateControl = new FormControl(new Date(new Date().setDate(new Date().getDate()-1)));
  end_dateInput = this.end_dateControl.value.toLocaleDateString("en-US", { month:"short", year:"numeric", day:"numeric" });

  exampleDatabase: ExampleHttpDao | null;
  well_xSelected = [];
  area_xSelected = [];

  // isLoadingResults:boolean = false;
  
  constructor(
	private http: HttpClient,
    private titleService: TitleService,
    private xfilterService: xFilterService,
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
    this.dateControl.valueChanges.subscribe(() => this.refresh_Production());

    this.refresh_Production();
	
    this.xfilterService.filter.subscribe(res => {
        this.getColumnValues(res);
      })    
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

  /** filter well sebelumnya (cascade filter) */
  // if (this.well_xSelected && this.well_xSelected.length > 0) {
  //   columnfilter["well"] = this.well_xSelected.map(w => "^" + w + "$");
  // }
  if (this.area_xSelected && this.area_xSelected.length > 0) {
    columnfilter["area"] = this.area_xSelected.map(w => "^" + w + "$");
  }

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
      this.area_xSelected = res.items || [];
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

//  refreshChart() {

//     this.isLoadingResults = true;

//     let params = new HttpParams()
//       .append('sort', 'date')
//       .append('order', 'asc')
//       .append('page', '0')
//       .append('pagesize', '200');

//     if (this.date_xSelected.length) {
//       params = params.append(
//         'columnfilter',
//         JSON.stringify({ date: this.date_xSelected })
//       );
//     }

//     this.http.get<any>('/api/pe/production', { params })
//       .subscribe(res => {

//         const data = res.items || [];
//         const area = this.areaControl.value;

//         /** X AXIS */
//         this.manajemen_chart_options.xAxis.categories =
//           data.map(d => formatDate(d.date, 'dd MMM yy', 'en-US'));

//         /** SERIES */
//         this.manajemen_chart_options.series[0].data =
//           data.map(d => Number(d[`${area}_opr`] || 0));

//         this.manajemen_chart_options.series[1].data =
//           data.map(d => Number(d[`${area}_sot`] || 0));

//         this.manajemen_chart_optionss.series[2].data =
//           data.map(d => Number(d[`${area}_fig`] || 0));

//         /** RKAP & WP&B dibuat flat line */
//         const rkap = data.map(d => Number(d.rkap_oil || 0));
//         const wpnb = data.map(d => Number(d.wpnb_oil || 0));

//         this.manajemen_chart_options.series[3].data = rkap;
//         this.manajemen_chart_optionss.series[4].data = wpnb;

//         /** TITLE & SUBTITLE */
//         this.manajemen_chart_options.title.text =
//           `Oil Production - ${area.toUpperCase()}`;

//         if (data.length) {
//           this.manajemen_chart_options.subtitle.text =
//             `${formatDate(data[0].date,'dd MMM yyyy','en-US')} - ` +
//             `${formatDate(data[data.length-1].date,'dd MMM yyyy','en-US')}`;
//         }

//         Highcharts.chart(
//           this.area_chart_el.nativeElement,
//           this.area_chart_options
//         );

//         this.isLoadingResults = false;

//       }, err => {
//         this.isLoadingResults = false;
//         console.error(err);
//       });
//   }

// refresh_Production_Area() {

//   this.isLoadingProduction = true;

//   const area = this.areaControl.value; // 'sgt' | 'sbr' | 'bd'

//   const end_date = this.dateControl.value;
//   const start_date = new Date(
//     end_date.getFullYear(),
//     end_date.getMonth() - 1,
//     end_date.getDate()
//   );

//   this.http.get('/api/pe/production', {
//     params: {
//       sort: 'date',
//       order: 'asc',
//       pagesize: '10000',
//       columnfilter:
//         '{"date":[{"opr":"gte","val":"' + start_date.toISOString() +
//         '","log":"and"},{"opr":"lte","val":"' + end_date.toISOString() +
//         '","log":"and"}]}'
//     }
//   }).subscribe(res => {

//     var categories = [];

//     var series_operation = [];
//     var series_sot = [];
//     var series_figure = [];
//     var series_rkap_oil = [];
//     var series_wpnb_oil = [];

//     res["items"].map(d => {

//       var xdt = new Date(d.date);
//       var dt = [
//         xdt.getDate(),
//         xdt.toLocaleString('en', { month: 'short' }),
//         xdt.getFullYear().toString().substr(-2)
//       ].join("-");

//       categories.push(dt);

//       /** 🔑 AREA BASED MAPPING */
//       series_operation.push({ name: dt, y: d[`${area}_opr`] });
//       series_sot.push({ name: dt, y: d[`${area}_sot`] });
//       series_figure.push({ name: dt, y: d[`${area}_fig`] });

//       /** target line */
//       series_rkap_oil.push({ name: dt, y: d.rkap_oil });
//       series_wpnb_oil.push({ name: dt, y: d.wpnb_oil });

//       /** Daily value (optional, sama seperti code lama) */
//       if (
//         this.dateControl.value.toLocaleDateString("id-ID") ===
//         new Date(d.date).toLocaleDateString("id-ID")
//       ) {
//         this.valueOperation = d[`${area}_opr`];
//         this.valueSOT = d[`${area}_sot`];
//         this.valueFigure = d[`${area}_fig`];
//       }

//     });

//     /** =========================
//      *  UPDATE CHART
//      *  ========================= */
//     this.oil_chart_options["title"]["text"] =
//       "Oil Production - " + area.toUpperCase();

//     this.oil_chart_options["subtitle"]["text"] =
//       "( " +
//       start_date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) +
//       " - " +
//       end_date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) +
//       " )";

//     this.oil_chart_options["xAxis"]["categories"] = categories;

//     this.oil_chart_options["series"][0]["data"] = series_operation;
//     this.oil_chart_options["series"][1]["data"] = series_sot;
//     this.oil_chart_options["series"][2]["data"] = series_figure;
//     this.oil_chart_options["series"][3]["data"] = series_rkap_oil;
//     this.oil_chart_options["series"][4]["data"] = series_wpnb_oil;

//     Highcharts.chart(
//       this.oil_chart_el.nativeElement,
//       this.oil_chart_options
//     );

//     this.isLoadingProduction = false;

//   }, error => {
//     this.isLoadingProduction = false;
//   });
// }

refresh_Production() {

    this.isLoadingResults = true;

    const area = this.areaControl.value; // sgt | sbr | bd

    const end_date = this.dateControl.value;
    const start_date = new Date(
      end_date.getFullYear(),
      end_date.getMonth() - 1,
      end_date.getDate()
    );

    this.http.get('/api/pe/production', {
      params: {
        sort: 'date',
        order: 'asc',
        pagesize: '10000',
        columnfilter:
          '{"date":[{"opr":"gte","val":"' + start_date.toISOString() +
          '","log":"and"},{"opr":"lte","val":"' + end_date.toISOString() +
          '","log":"and"}]}'
      }
    }).subscribe((res: any) => {

      var categories = [];

      var series_operation = [];
      var series_sot = [];
      var series_figure = [];
      var series_rkap_oil = [];
      var series_wpnb_oil = [];

      res.items.map(d => {

        var xdt = new Date(d.date);
        var dt = [
          xdt.getDate(),
          xdt.toLocaleString('en', { month: 'short' }),
          xdt.getFullYear().toString().substr(-2)
        ].join('-');

        categories.push(dt);

        /** 🔑 AREA BASED */
        series_operation.push({ name: dt, y: d[`${area}_opr`] });
        series_sot.push({ name: dt, y: d[`${area}_sot`] });
        series_figure.push({ name: dt, y: d[`${area}_fig`] });

        /** TARGET LINE */
        series_rkap_oil.push({ name: dt, y: d.rkap_oil });
        series_wpnb_oil.push({ name: dt, y: d.wpnb_oil });

        /** DAILY VALUE */
        if (
          this.dateControl.value.toLocaleDateString("id-ID") ===
          new Date(d.date).toLocaleDateString("id-ID")
        ) {
          this.valueOperation = d[`${area}_opr`];
          this.valueSOT = d[`${area}_sot`];
          this.valueFigure = d[`${area}_fig`];
        }
      });

      /** UPDATE CHART */
      this.manajemen_chart_options.title.text =
        'Oil Production - ' + area.toUpperCase();

      this.manajemen_chart_options.subtitle.text =
        '( ' +
        start_date.toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' }) +
        ' - ' +
        end_date.toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' }) +
        ' )';

      this.manajemen_chart_options.xAxis.categories = categories;

      this.manajemen_chart_options.series[0].data = series_operation;
      this.manajemen_chart_options.series[1].data = series_sot;
      this.manajemen_chart_options.series[2].data = series_figure;
      this.manajemen_chart_options.series[3].data = series_rkap_oil;
      this.manajemen_chart_options.series[4].data = series_wpnb_oil;

      Highcharts.chart(
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



// const [x, y] = [i+1, data[i]];
			
// sumX += x;
// sumY += y;
// sumXY += x * y;
// sumX2 += x ** 2;



// const intercept = (( sumY / n ) - slope * ( sumX / n ));

// const minX = 1;
// const maxX = data.length;


// var MIN = minX * slope + intercept;
// var MAX = maxX * slope + intercept;


// if (MIN < 0.0001){
			// MIN = 0.0001;
		// }
		// else{
			// MIN = MIN;
		// }
		
		// if (MAX < 0.0001){
			// MAX = 0.0001;
		// }
		// else{
			// MAX = MAX;
		// }


// trendline.push([minX, MIN]);
// trendline.push([maxX, MAX]);