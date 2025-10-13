import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpEventType, HttpParams, HttpResponse, HttpHeaders } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { MatDatepicker } from '@angular/material';
import { FormControl } from '@angular/forms';
import { merge, Observable, of as observableOf, forkJoin } from 'rxjs';
import { catchError, map, startWith, switchMap, debounceTime, take, mergeAll } from 'rxjs/operators';
import { Chart } from 'angular-highcharts';
import * as Highcharts from 'highcharts';

import { MatSnackBar } from '@angular/material';

import { TitleService } from '../../navigation/title/title.service';
import { xFilterService } from '../../xfilter/xfilter.component';

@Component({
  selector: 'app-pe-daily-semilog-chart',
  templateUrl: './pe-daily-semilog-chart.component.html',
  styleUrls: ['./pe-daily.scss']
})

export class PeDailySemilogChartComponent{

  @ViewChild('daily_chart_el', {static:true}) public daily_chart_el: ElementRef;
    daily_table_data = [];
    daily_table_columns:string[] = ["status", "count"];

    daily_chart_options:object = {
    chart: {
        zoomType: 'xy',
		// events: {
            // click: function (e) {
                
                // const x = Math.round(e.xAxis[0].value),
                    // y = Math.round(e.yAxis[0].value),
                    // series = this.series[2];

                
                // series.addPoint([x, y-4.89]);
				// const q = e.xAxis[0].axis.categories[x];
				// console.log('Clicked X Value:', q);
				// console.log('titik:', e.yAxis[0].axis.data[y]);
            // }
        // },
        style: {
          fontFamily: 'Roboto, Helvetica Neue, sans-serif'
        }
    },
    title: {
        text: null,
    },
    caption: {
        text: null,
        align: 'center',
        verticalAlign: 'top'
    },
    xAxis: [{
		type: 'datetime',
		// categories: [],
		crosshair: true,
        autoRotation : true,
		// min: 1703721600000,
		// max: 1705037547000,
		min: [],
		max: [],
		startOnTick: true,
		tickInterval: 24 * 3600 * 1000,
		labels: {
		format: '{value:%d-%b-%y}'
		// format: '{value:%e.%b}'
        // step: 7
        }
      }],
    yAxis: [{ // Primary yAxis
		type: 'logarithmic',
		minorTickInterval: 0.1,
		min: 0.1, // Minimum value for the y-axis (will be the lower bound)
		max: 2900, // Maximum value for the y-axis (will be the upper bound)
		// tickInterval: 1, // Interval for the y-axis labels
        title: {
            text: 'Net (bopd)', //Qmax (bfpd)',
            style: {
                color: '#666666'
            }
        },
        labels: {
            format: '{value}',
            style: {
                color: '#999999'
            }
        }
    },
	{ // Secondary yAxis
        gridLineWidth: 0,
        title: {
            text: 'Gross (bfpd)',
            style: {
                color: '#666666'
            }
        },
        labels: {
            format: '{value}',
            style: {
                color: '#999999'
            }
        },
		type: 'logarithmic',
		minorTickInterval: 0.1,
		min: 0.1, // Minimum value for the y-axis (will be the lower bound)
		max: 2500, // Maximum value for the y-axis (will be the upper bound)
        opposite: true
    }],
	
    tooltip: {
		shared: true
    },
    legend: {
        layout: 'horizontal',
        align: 'center',
        verticalAlign: 'top',
        backgroundColor:
            Highcharts.defaultOptions.legend.backgroundColor || // theme
            'rgba(255,255,255,0.25)'
    },
    series: [
	{
        name: 'Gross',
        type: 'spline',
        yAxis: 1,
        // data: [[1703721600000, 24.053],[1703779200000, 24.053],[1703865600000, 23.467],[1703952000000, 26.4]],
		data: [],
		color: '#000000',
        tooltip: {
            valueSuffix: ' bfpd',
            valueDecimals: 2
        },
		marker: {
		  symbol: 'square', // Set the default marker type for the series
		  radius: 3 // Set the default marker radius
		}

    }, {
        name: 'Net',
        type: 'spline',
        yAxis: 0,
        data: [],
        color: '#00B050',
        tooltip: {
            valueSuffix: ' bopd',
            valueDecimals: 2
        },
		marker: {
		  symbol: 'triangle', // Set the default marker type for the series
		  radius: 3 // Set the default marker radius
		}

    }
	],

    
    responsive: {
        rules: [{
            condition: {
                maxWidth: 500
            },
            chartOptions: {
                legend: {
                    floating: false,
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom',
                    x: 0,
                    y: 0
                },
                yAxis: [{
                    labels: {
                        align: 'right',
                        x: 0,
                        y: -6
                    },
                    showLastLabel: false
                }, {
                    labels: {
                        align: 'left',
                        x: 0,
                        y: -6
                    },
                    showLastLabel: false
                }, {
                    visible: false
                }]
            }
        }]
    }
}

  @ViewChild('start_datePicker', {static: true}) start_datePicker: MatDatepicker<any>;
  start_dateControl = new FormControl(new Date(new Date().setDate(new Date().getDate()-4)));
  start_dateInput = this.start_dateControl.value.toLocaleDateString("en-US", { month:"short", year:"numeric", day:"numeric" });

  @ViewChild('end_datePicker', {static: true}) end_datePicker: MatDatepicker<any>;
  end_dateControl = new FormControl(new Date(new Date().setDate(new Date().getDate()-1)));
  end_dateInput = this.end_dateControl.value.toLocaleDateString("en-US", { month:"short", year:"numeric", day:"numeric" });

  exampleDatabase: ExampleHttpDao | null;
  well_xSelected = [];

  isLoadingResults:boolean = false;
  
  constructor(
	private http: HttpClient,
    private titleService: TitleService,
    private xfilterService: xFilterService,
  ) { }

  ngOnInit() {
	this.exampleDatabase = new ExampleHttpDao(this.http);

    this.titleService.titleSource.next({
      title: "Semilog Chart",
      icon: "ssid_chart",
      breadcrumbs: [
        { label: 'Petroleum Engineering', routerLink: '' },
        { label: 'Daily', routerLink: 'pe/daily' },
        { label: 'Chart', routerLink: '' }
      ]
    }
    );
	
	this.xfilterService.filter.subscribe(res => {
      this.getColumnValues(res);
    })
    this.xfilterService.selected.subscribe(res => {
      this[res["column"] + "_xSelected"] = res["selected"];
      this.refresh_Daily();
    })
    
    this.start_dateControl.valueChanges.subscribe(r => {
      this.refresh_Daily();
    })
    this.end_dateControl.valueChanges.subscribe(r => {
      this.refresh_Daily();
    })
	
  }
  
  getColumnValues(param: any) {
    var column = param["column"];
    var filter = param["filter"];
    var selected = param["selected"]
    var clear = param["clear"];
    var columnfilter = { well: this.well_xSelected.map(s => "^"+s+"$")};
    if(filter) columnfilter[column] = [filter];
    if(selected && selected.length > 0) columnfilter[column] = selected.map(s => "^"+s+"$");
    if(clear) delete columnfilter[column];

    return this.exampleDatabase!.getRepoIssues(
      "well", 
      "asc", 
      0, 
      0, 
      "",
      columnfilter,
      "well" 
    ).pipe(map((res) => {
      return res;
    })).subscribe(res => {
      this.xfilterService.updateItems({column: "well", items: res.items});
    }, () => {
      
    });
  }

  start_dateChange(evt) {
    this.start_dateInput = evt.value.toLocaleDateString("en-US", { month:"short", year:"numeric", day:"numeric" });
  }

  end_dateChange(evt) {
    this.end_dateInput = evt.value.toLocaleDateString("en-US", { month:"short", year:"numeric", day:"numeric" });
  }

  refresh_Daily() {
    let params = new HttpParams();
    params = params.append("type", "well_performance_semilog")
      .append("date", this.start_dateControl.value.toISOString())
      .append("end_date", this.end_dateControl.value.toISOString());
    for(const w of this.well_xSelected) {
      params = params.append("well", w);
      console.log(w);
    }
    
    this.http.get('/api/pe/daily/GetSemilogChart', {params: params}).subscribe(res => {
	  var hari_s = this.start_dateControl.value.getDate()
	  var bulan_s = this.start_dateControl.value.getMonth()
	  var tahun_s = this.start_dateControl.value.getFullYear()
	  
	  var hari_e = this.end_dateControl.value.getDate()
	  var bulan_e = this.end_dateControl.value.getMonth()
	  var tahun_e = this.end_dateControl.value.getFullYear()
	  
	  var time_s = Date.UTC(tahun_s, bulan_s, hari_s)
	  var time_e = Date.UTC(tahun_e, bulan_e, hari_e)
	  
	  var dt_date = res["data"].map(d => d["date"])
	  	  
	  var dt_gross = res["data"].map(d => d["gross"])
	  var dt_net = res["data"].map(d => d["net"])
	  
	  
      this.daily_chart_options["title"]["text"] = this.well_xSelected.join(",");
      this.daily_chart_options["caption"]["text"] = formatDate(this.start_dateControl.value, 'd MMM y', 'en-US') + " - " +formatDate(this.end_dateControl.value, 'd MMM y', 'en-US');
      // this.daily_chart_options["xAxis"][0]["categories"] = res["data"].map(d => formatDate(d["date"], "dd-MMM-yy", "en-US"));
      this.daily_chart_options["xAxis"][0]["min"] = time_s;
      this.daily_chart_options["xAxis"][0]["max"] = time_e;
	  // this.daily_chart_options["series"][0]["data"] = dt_gross;
      // this.daily_chart_options["series"][1]["data"] = res["data"].map(d => d["net"]);
	  
	  let dt_x = [];
	  let dt_x2 = [];
	  let hari = [];
	  let bulan = [];
	  let tahun = [];
	  let time = [];
	  let qw = [];
	  let day = [];
	  let month = [];
	  let year = [];
	  
	  for (var x = 0; x < res["data"].length; x++){
		hari[x] = new Date(dt_date[x]).getTime()
		day [x] = new Date(dt_date[x]).getDate()
		month [x] = new Date(dt_date[x]).getMonth()
		year [x] = new Date(dt_date[x]).getFullYear()
		time [x] = Date.UTC(year[x], month[x], day[x])
		
		console.log("data 3: "+time)
		
		
		dt_x[x] = [time[x], dt_gross[x]]
		dt_x2[x] = [time[x], dt_net[x]]
		
		this.daily_chart_options["series"][0]["data"] = dt_x;
		this.daily_chart_options["series"][1]["data"] = dt_x2;
		
	  }
	  console.log("data dt_x: "+dt_x)	  	  
	  console.log(res["data"])
	  console.log(res["data"].length)
	  
	  // console.log("Cek data: "+res["data"].map(d => d["gross"]))
	  
      Highcharts.chart(this.daily_chart_el.nativeElement, this.daily_chart_options);

    }, error => {

    }, () => {

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
