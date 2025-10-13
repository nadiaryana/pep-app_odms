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
  selector: 'app-pe-zonechart',
  templateUrl: './pe-daily-zonechart.component.html',
  styleUrls: ['./pe-daily.scss']
})

export class PeDailyZonechartComponent {

  @ViewChild('daily_chart_el', { static: true }) public daily_chart_el: ElementRef;
  daily_table_data = [];
  daily_table_columns: string[] = ["status", "count"];

  daily_chart_options: object = {
    chart: {
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
        text: 'Gross (bfpd), Net (bopd)',
		//text: 'Gross (bfpd)',
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
    }
	, { // Secondary yAxis
      gridLineWidth: 0,
      title: {
        text: 'WC (%)',
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
    }
	],
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
    series: [{
      name: 'Gross',
      type: 'line',
      yAxis: 0,
      data: [],
      color: '#000000',
      tooltip: {
        valueSuffix: ' bfpd',
        valueDecimals: 2
      }
	}
    ,{
      name: 'Net',
      type: 'line',
      yAxis: 1,
      data: [],
      color: '#00B050',
      tooltip: {
        valueSuffix: ' bopd',
        valueDecimals: 2
      }

    }, {
      name: 'WC',
      type: 'line',
      yAxis: 0,
      data: [],
      color: '#0070C0',
      tooltip: {
        valueSuffix: ' %',
        valueDecimals: 2
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

  @ViewChild('start_datePicker', { static: true }) start_datePicker: MatDatepicker<any>;
  start_dateControl = new FormControl(new Date(new Date().setDate(new Date().getDate() - 4)));
  start_dateInput = this.start_dateControl.value.toLocaleDateString("en-US", { month: "short", year: "numeric", day: "numeric" });

  @ViewChild('end_datePicker', { static: true }) end_datePicker: MatDatepicker<any>;
  end_dateControl = new FormControl(new Date(new Date().setDate(new Date().getDate() - 1)));
  end_dateInput = this.end_dateControl.value.toLocaleDateString("en-US", { month: "short", year: "numeric", day: "numeric" });
	
  exampleDatabase: ExampleHttpDao | null;
  zone_xSelected = [];
  well_xSelected = [];
  filterControl = new FormControl('');

  isLoadingResults: boolean = false;

  constructor(
    private http: HttpClient,
    private titleService: TitleService,
    private xfilterService: xFilterService,
	// private xfilterServicee: xFilterService,
  ) { }

  ngOnInit() {

    this.exampleDatabase = new ExampleHttpDao(this.http);

    this.titleService.titleSource.next({
      title: "Zone Chart",
      icon: "bar_chart",
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
	// this.xfilterServicee.filter.subscribe(res => {
	  // this.getColumnValuess(res);
    // })
    this.xfilterService.selected.subscribe(res => {
      this[res["column"] + "_xSelected"] = res["selected"];
	  //console.log("Data apa ini: "+res["column"] + "_xSelected");
      this.refresh_Daily();
    })
	// this.xfilterServicee.selected.subscribe(res => {
      // this[res["column"] + "_xSelected"] = res["selected"];
	  // console.log("Data apa ini: "+res["column"] + "_xSelected");
      // this.refresh_Daily();
    // })

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
    var columnfilter = { zone: this.zone_xSelected.map(s => "^" + s + "$") };
    if (filter) columnfilter[column] = [filter];
    if (selected && selected.length > 0) columnfilter[column] = selected.map(s => "^" + s + "$");
    if (clear) delete columnfilter[column];
	
    return this.exampleDatabase!.getRepoIssues(
      column,
      "asc",
      0,
      0,
      "",
      columnfilter,
      column
    ).pipe(map((res) => {
      return res;
    })).subscribe(res => {
      this.xfilterService.updateItems({ column: column, items: res.items });
    }, () => {

    });
  }
  
  // getColumnValuess(param: any) {
    // var column = param["column"];
    // var filter = param["filter"];
    // var selected = param["selected"]
    // var clear = param["clear"];
    // var columnfilterr = { well: this.well_xSelected.map(s => "^" + s + "$") };
    // if (filter) columnfilterr[column] = [filter];
    // if (selected && selected.length > 0) columnfilterr[column] = selected.map(s => "^" + s + "$");
    // if (clear) delete columnfilterr[column];
	
    // return this.exampleDatabase!.getRepoIssues(
      // "well",
      // "asc",
      // 0,
      // 0,
      // "",
      // columnfilterr,
      // "well"
    // ).pipe(map((res) => {
      // return res;
    // })).subscribe(res => {
      // this.xfilterServicee.updateItems({ column: "well", items: res.items });
    // }, () => {

    // });
  // }


  start_dateChange(evt) {
    this.start_dateInput = evt.value.toLocaleDateString("en-US", { month: "short", year: "numeric", day: "numeric" });
  }

  end_dateChange(evt) {
    this.end_dateInput = evt.value.toLocaleDateString("en-US", { month: "short", year: "numeric", day: "numeric" });
  }

  refresh_Daily() {
    let params = new HttpParams();
	
    params = params.append("type", "zone_performance")
      .append("date", this.start_dateControl.value.toISOString())
      .append("end_date", this.end_dateControl.value.toISOString());
	  // .append("well", this.well_xSelected);
	  // console.log(params);
	for (const v of this.well_xSelected) {
	  console.log("Masuk sini ga sihhh");
      params = params.append("well", v);
      console.log("Nilai v : "+v);
    }
    for (const w of this.zone_xSelected) {
	  console.log("Masuk sini ga sih");
      params = params.append("zone", w);
	  console.log(this.well_xSelected);
      console.log("Nilai w : "+w);
    }
	
	

    this.http.get('/api/pe/data', { params: params }).subscribe(res => {
	  let dt_well = this.well_xSelected.length;
	  let tgl = res["data"].map(d => formatDate(d["date"], "dd-MMM-yy", "en-US"));
	  let g = res["data"].map(d => d["gross"]);
	  let n = res["data"].map(d => d["net"]);
	  let w = res["data"].map(d => d["wc"]);
	  let well = res["data"].map(d => d["well"]);
	  
	  let g1 = [];
	  let n1 = [];
	  let w1 = [];
	  let tanggal = 0;
	  var tg = [];
	  var i = 0;
	  
	  let dt_date = [];
	  let dt_grs = [];
	  let dt_net = [];
	  let dt_wc = [];
	  
	  let dt_grss = [];	  
	  let dt_nett = [];
	  let dt_wcc = [];
	  
	  console.log("Berapa banyak well: "+dt_well);
	  
      this.daily_chart_options["title"]["text"] = "Zone " + this.zone_xSelected.join(",") + " (" + this.well_xSelected + ")";
      this.daily_chart_options["caption"]["text"] = formatDate(this.start_dateControl.value, 'd MMM y', 'en-US') + " - " + formatDate(this.end_dateControl.value, 'd MMM y', 'en-US');
      
	  console.log("masuk data: "+res["data"].map(d => d["well"]));
	  
	  if (dt_well == 1){
		  this.daily_chart_options["xAxis"][0]["categories"] = res["data"].map(d => formatDate(d["date"], "dd-MMM-yy", "en-US"));
		  this.daily_chart_options["series"][0]["data"] = res["data"].map(d => d["gross"]);
		  this.daily_chart_options["series"][1]["data"] = res["data"].map(d => d["net"]);
		  this.daily_chart_options["series"][2]["data"] = res["data"].map(d => d["wc"]);
		  //this.daily_chart_options["series"][0]["name"] = res["data"].map(d => d["well"]);
	  }
	  else{
		
		// for (var t = 0; t < dt_well; t++){
			// for (var s = 0; s < well.length; s++){
				// if (this.well_xSelected[t] == well[s]){
					// console.log("Well nya ada: "+this.well_xSelected[t]+" = "+well[s]);
				// }
				// else{
					// console.log("Well nya gaada: "+this.well_xSelected[t]+" != "+well[s]);
					// well[y+1]
				// }
			// }
		// }
	  
		for (var y = 0; y < tgl.length; y++){
			
			console.log("Apa aja well nya yg ada : "+well[y]);
			
			// for (var v = 0; v < dt_well; v++){
				// if (well[y] != this.well_xSelected[v]){
					// well[y] = this.well_xSelected[v];
					
					// g[y] = 0;
					// n1[y] = 0;
					// w1[y] = 0;
					
					// console.log("gaada nilai nya: "+well[y]+" - "+g[y]);
					
				// }
			// }
			
						
			if (tanggal == tgl[y]){
				g1[y] = g1[y-1] + g[y];
				n1[y] = n1[y-1] + n[y];
				w1[y] = w1[y-1] + w[y];
				
				tg[y] = tgl[y];
				
				i = i + 1;
				
				if (i == dt_well-1){
					dt_grs[y] = [tg[y], g1[y]];
					dt_net[y] = [tg[y], n1[y]];
					dt_wc[y] = [tg[y], 100*(1-(n1[y]/g1[y]))];
				}
				
			}
			else{
				i = 0;
				tanggal = tgl[y];
				g1[y] = g[y];
				n1[y] = n[y];
				w1[y] = w[y];
				
			}
			
	    
		}
	  
		var i = 0
		for (var x = 0; x < dt_grs.length; x++){
			if (dt_grs[x] != undefined){
				dt_date[i] = tg[x];
				dt_grss[i] = dt_grs[x];
				dt_nett[i] = dt_net[x];
				dt_wcc[i] = dt_wc[x];
				
				console.log("nilai grss2: "+dt_grss);
				i++;
			}
			else{
				console.log("nilai grss3: "+dt_grss[x]);
			}
		}
		
		console.log("nilai data: "+dt_grss);
	  
		this.daily_chart_options["xAxis"][0]["categories"] = dt_date;
		this.daily_chart_options["series"][0]["data"] = dt_grss;
		this.daily_chart_options["series"][1]["data"] = dt_nett;
		this.daily_chart_options["series"][2]["data"] = dt_wcc;
		
	  }
	  
      

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
