import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpEventType, HttpParams, HttpResponse, HttpHeaders } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { MatDatepicker } from '@angular/material';
import { FormControl } from '@angular/forms';
import { merge, Observable, of as observableOf, forkJoin } from 'rxjs';
import { catchError, map, startWith, switchMap, debounceTime, take, mergeAll } from 'rxjs/operators';
import { Chart } from 'angular-highcharts';
import * as Highcharts from 'highcharts';
import { TitleService } from '../../navigation/title/title.service';
import { xFilterService } from '../../xfilter/xfilter.component';

import { MatSnackBar } from '@angular/material';


@Component({
  selector: 'app-pe-daily-area-chart',
  templateUrl: './pe-daily-area-chart.component.html',
  styleUrls: ['./pe-daily.scss']
})
export class PeDailyAreaChartComponent implements OnInit {

  @ViewChild('daily_chart_el', { static: true }) public daily_chart_el: ElementRef;
  daily_table_data = [];
  daily_table_columns: string[] = ["status", "count"];

  daily_chart_options: object = {
    chart: {
	  type: 'area',
      zoomType: 'x',
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
      categories: [],
      crosshair: true,
      autoRotation: true,
      labels: {
        // step: 7
      }
    }],
    yAxis: [{ // Primary yAxis
      title: {
        text: 'Gross (bfpd), Water (bwpd), Net (bopd)',
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
    }, { // Secondary yAxis
      gridLineWidth: 0,
      title: {
        text: 'SM (m)',
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
	plotOptions: {
        area: {
            // stacking: 'normal',
			lineWidth: 0,
            marker: {
                enabled: false
            }
        }
    },
    series: [{
      name: 'Gross',
      // type: 'line',
      yAxis: 0,
      data: [],
      color: '#B4846C',
      zIndex: 1,
      tooltip: {
        valueSuffix: ' bfpd',
        valueDecimals: 2
      }

    }, {
      name: 'Water',
      // type: 'line',
      yAxis: 0,
      data: [],
      color: '#5b9bd5',
      zIndex: 2,
      tooltip: {
        valueSuffix: ' bwpd',
        valueDecimals: 2
      }

    }, {
      name: 'Net',
      // type: 'line',
      yAxis: 0,
      data: [],
      color: '#5A3E36',
      zIndex: 3,
      tooltip: {
        valueSuffix: ' bopd',
        valueDecimals: 2
      }

    }, {
      name: 'SM',
      type: 'line',
      yAxis: 1,
	  dashStyle: 'shortdot',
      data: [],
      color: '#C55A11',
      zIndex: 4,
      tooltip: {
        valueSuffix: ' m',
        valueDecimals: 2
      }
    }],
	
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

  @ViewChild('start_datePicker', { static: true }) start_datePicker: MatDatepicker<any>;
  start_dateControl = new FormControl(new Date(new Date().setDate(new Date().getDate() - 4)));
  start_dateInput = this.start_dateControl.value.toLocaleDateString("en-US", { month: "short", year: "numeric", day: "numeric" });

  @ViewChild('end_datePicker', { static: true }) end_datePicker: MatDatepicker<any>;
  end_dateControl = new FormControl(new Date(new Date().setDate(new Date().getDate() - 1)));
  end_dateInput = this.end_dateControl.value.toLocaleDateString("en-US", { month: "short", year: "numeric", day: "numeric" });

  exampleDatabase: ExampleHttpDao | null;
  well_xSelected = [];

  isLoadingResults: boolean = false;

  constructor(
    private http: HttpClient,
    private titleService: TitleService,
    private xfilterService: xFilterService,
  ) { }

  ngOnInit() {

    this.exampleDatabase = new ExampleHttpDao(this.http);

    this.titleService.titleSource.next({
      title: "Area Chart",
      icon: "area_chart",
      breadcrumbs: [
        { label: 'Petroleum Engineering', routerLink: '' },
        { label: 'Daily', routerLink: 'pe/daily' },
        { label: 'Area Chart', routerLink: '' }
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
    var columnfilter = { well: this.well_xSelected.map(s => "^" + s + "$") };
    if (filter) columnfilter[column] = [filter];
    if (selected && selected.length > 0) columnfilter[column] = selected.map(s => "^" + s + "$");
    if (clear) delete columnfilter[column];

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
      this.xfilterService.updateItems({ column: "well", items: res.items });
    }, () => {

    });
  }

  start_dateChange(evt) {
    this.start_dateInput = evt.value.toLocaleDateString("en-US", { month: "short", year: "numeric", day: "numeric" });
  }

  end_dateChange(evt) {
    this.end_dateInput = evt.value.toLocaleDateString("en-US", { month: "short", year: "numeric", day: "numeric" });
  }

  refresh_Daily() {
    let params = new HttpParams();
    params = params.append("type", "well_performance_daily")
      .append("date", this.start_dateControl.value.toISOString())
      .append("end_date", this.end_dateControl.value.toISOString());
    for (const w of this.well_xSelected) {
      params = params.append("well", w);
      console.log(w);
    }

    this.http.get<any>('/api/pe/daily/GetAreaChart', { params: params }).subscribe(res => {
	  
	  let tgl = res["data"].map(d => formatDate(d["date"], "dd-MMM-yy", "en-US"));
	  let well = res["data"].map(d => d["well"]);
	  let g = res["data"].map(d => d["gross"]);
	  let n = res["data"].map(d => d["net"]);
	  let w = res["data"].map(d => d["well"]);
	  console.log("w: "+w);
	  let tanggal = 0;
	  var tg = []
	  var tgg = ""
	  let grs = []
	  let sm = res["data"].map(d => d["sm"]);
	  let dt_well = this.well_xSelected.length;
	  
	  let g1 = [];
	  let n1 = [];
	  let w1 = [];
	  let sm1 = [];
	  
	  let dt_date = [];
	  let dt_grs = [];
	  let dt_net = [];
	  let dt_wc = [];
	  let dt_sm = [];
	  
	  let dt_grss = [];	  
	  let dt_nett = [];
	  let dt_wcc = [];
	  let dt_smm = [];
	  
	  for (var s = 0; s < sm.length; s++){
		  if (sm[s] < 0){
			// console.log("SM minus: "+sm[s]);
			sm[s] = 0;
		  }
		  else{
			sm[s] = sm[s];
		  }
	  }
	  
	  
      this.daily_chart_options["title"]["text"] = this.well_xSelected.join(",");
      this.daily_chart_options["caption"]["text"] = formatDate(this.start_dateControl.value, 'd MMM y', 'en-US') + " - " + formatDate(this.end_dateControl.value, 'd MMM y', 'en-US');
      
	  if (dt_well == 1){
		  this.daily_chart_options["xAxis"][0]["categories"] = res["data"].map(d => formatDate(d["date"], "dd-MMM-yy", "en-US"));
		  this.daily_chart_options["series"][0]["data"] = res["data"].map(d => d["gross"]);
		  this.daily_chart_options["series"][1]["data"] = res["data"].map(d => d["gross"] - d["net"]);
		  this.daily_chart_options["series"][2]["data"] = res["data"].map(d => d["net"]);
		  this.daily_chart_options["series"][3]["data"] = sm;
	  }
	  else{
	      for (var y = 0; y < tgl.length; y++){
			// Sintak LIKE //
			// if(well[y].includes("NKL-1002")){
				// console.log("Apa aja : "+well[y]);
			// }
			
			
			if (well[y] == undefined){
				console.log("gaada nilai nya: "+well[y]+" - "+g[y]);
				// well[y] = 'SBJ-155';
				g[y] = 0;
				n1[y] = 0;
				sm1[y] = 0;
				
				// console.log("nilai nya: "+g[y]);
			}
			
			if (tanggal == tgl[y]){
				g1[y] = g1[y-1] + g[y];
				n1[y] = n1[y-1] + n[y];
				sm1[y] = sm1[y-1] + sm[y];
				
				tg[y] = tgl[y];
				i = i + 1;
				
				if (i == dt_well-1){
					dt_grs[y] = [tg[y], g1[y]];
					dt_wc[y] = [tg[y], g1[y]-n1[y]];
					dt_net[y] = [tg[y], n1[y]];
					dt_sm[y] = [tg[y], sm1[y]/dt_well];
				}
				
				
			}
			else{
				i = 0;
				tanggal = tgl[y];
				g1[y] = g[y];
				w1[y] = g[y] - n[y];
				n1[y] = n[y];
				sm1[y] = sm[y];
				
				// console.log("Masuk else kah ?");
			}
			
			console.log("Nilai nya: "+well[y]+" - "+g1[y]);
		}
	  
		var i = 0
		for (var x = 0; x < dt_grs.length; x++){
			if (dt_grs[x] != undefined){
				dt_date[i] = tg[x];
				dt_grss[i] = dt_grs[x];
				dt_wcc[i] = dt_wc[x];
				dt_nett[i] = dt_net[x];
				dt_smm[i] = dt_sm[x];
				
				// console.log("nilai grss2: "+dt_grss);
				i++;
			}
			else{
				// console.log("nilai grss3: "+dt_grss[x]);
			}
		}
		
		// -- FIXX --
		this.daily_chart_options["xAxis"][0]["categories"] = dt_date;
		this.daily_chart_options["series"][0]["data"] = dt_grss;
		this.daily_chart_options["series"][1]["data"] = dt_wcc;
		this.daily_chart_options["series"][2]["data"] = dt_nett;
		this.daily_chart_options["series"][3]["data"] = dt_smm;
		
	  }

      // console.log(res["data"].length)
      // console.log("Datanya apa aja: "+res["data"].map(d => d["gross"]))
      // console.log("nilai water: "+res["data"].map(d => d["gross"] - d["net"]));
	    
	  
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
  constructor(private http: HttpClient) { }

  getRepoIssues(sort: string, order: string, page: number, pagesize: number = 50, filter: string, columnfilter: object, mode: string = "", httpOption: object = {}): Observable<PeWellApi> {

    var params = {};
    if (sort != null) params["sort"] = sort;
    if (order != null) params["order"] = order;
    if (page != null) params["page"] = page.toString();
    if (pagesize != null) params["pagesize"] = pagesize.toString();
    if (filter != null) params["filter"] = filter;
    if (Object.keys(columnfilter).length > 0) params["columnfilter"] = JSON.stringify(columnfilter);
    if (mode != null) params["mode"] = mode;

    httpOption["params"] = params;

    return this.http.get<PeWellApi>('/api/pe/daily', httpOption);
  }
}