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
  selector: 'pe-daily-chan-plot-chart',
  templateUrl: './pe-daily-chan-plot-chart.component.html',
  styleUrls: ['./pe-daily.scss']
})

export class PeDailyChanPlotChartComponent {

  @ViewChild('daily_chart_el', {static:true}) public daily_chart_el: ElementRef;
    daily_table_data = [];
    daily_table_columns:string[] = ["status", "count"];
	
	
    daily_chart_options:object = {
	
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
		type: 'logarithmic',
		minorTickInterval: 0.1,
		categories: [],
		// min: 1,
		crosshair: true,
        autoRotation : true,
		labels: {
		// format: '{value:%d-%b-%y}',
         // step: 7
        }
      }],
    yAxis: { // Primary yAxis
		type: 'logarithmic',
		minorTickInterval: 0.1,
		data: [],
		min: 0.000001, // Minimum value for the y-axis (will be the lower bound)
		// max: 300, // Maximum value for the y-axis (will be the upper bound)
		// tickInterval: 1, // Interval for the y-axis labels
        title: {
            text: 'WOR, WOR`',
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
	
    tooltip: {
		headerFormat: '<b>{series.name}</b><br />',
		pointFormat: 'Days = {point.x}, {series.name} = {point.y}',
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
        series: {
            label: {
                // connectorAllowed: false
            },
            pointStart: 1
        }
    },
    series: [
	{
		// Regression: true,
        name: 'WOR',
        type: 'scatter',
        yAxis: 0,
        data: [],
		// id: 'one',
        color: '#0000cc',
        tooltip: {
            valueSuffix: ' ',
            valueDecimals: 5
        },
		marker: {
		  symbol: 'circle', // Set the default marker type for the series
		  radius: 3 // Set the default marker radius
		}

    },
	{
        name: 'WOR`',
        type: 'scatter',
        yAxis: 0,
        data: [],
		id: "base_worr",
        color: '#e60000',
        tooltip: {
            valueSuffix: ' ',
            valueDecimals: 5
        },
		marker: {
		  symbol: 'circle', // Set the default marker type for the series
		  radius: 3 // Set the default marker radius
		}

    }, {
            type: 'spline',
			name: 'Trend Line',
			dashStyle: 'shortdot',
			data: [],
			color: '#b3b3ff',
			marker: {
            enabled: false
			},
			states: {
				hover: {
					lineWidth: 0
				}
			},
        }, {
            type: 'spline',
			name: 'Trend Line',
			dashStyle: 'shortdot',
			data: [],
			color: '#ffb3b3',
			marker: {
            enabled: false
			},
			states: {
				hover: {
					lineWidth: 0
				}
			},
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
      title: "Chan Plot",
      icon: "scatter_plot",
      breadcrumbs: [
        { label: 'Petroleum Engineering', routerLink: '' },
        { label: 'Daily', routerLink: '' },
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
    params = params.append("type", "well_performance_daily")
      .append("date", this.start_dateControl.value.toISOString())
      .append("end_date", this.end_dateControl.value.toISOString());
    for(const w of this.well_xSelected) {
      params = params.append("well", w);
      console.log(w);
    }
    
    this.http.get('/api/pe/data', {params: params}).subscribe(res => {
	  
	  var g = res["data"].map(d => d["date"])
	  // let WOR = res["data"].map(d => d["wor"]);
	  
	  
      this.daily_chart_options["title"]["text"] = this.well_xSelected.join(",");
      this.daily_chart_options["caption"]["text"] = formatDate(this.start_dateControl.value, 'd MMM y', 'en-US') + " - " +formatDate(this.end_dateControl.value, 'd MMM y', 'en-US');
      this.daily_chart_options["series"][0]["data"] = res["data"].map(d => d["wor"]);
      this.daily_chart_options["series"][2]["data"] = getTrendLine(res["data"].map(d => d["wor"]));
	  
	  console.log(res["data"])
      console.log(res["data"].length)
	  
	  let q = res["data"].map(d => d["wor"]);
	  let worr = [];
	  for (var r = 0; r < res["data"].length; r++){
		if (r == 0){
			worr[r] = 0
		}
		else{
			worr[r] = (q[r]-q[r-1])/1
		}
		
		console.log("data worr' dlm: "+worr)
		// this.daily_chart_options["series"][1]["data"] = worr;
		
	  }
	  
	  // console.log("Cek data: "+res["data"].map(d => d["wor"]))
	  console.log("data worr' luar: "+worr.length)
	  // console.log("data worr' luar dt: "+worr)
	  this.daily_chart_options["series"][1]["data"] = worr;
	  this.daily_chart_options["series"][3]["data"] = getTrendLine(worr);
	  
	  function getTrendLine(data) {
		const n = data.length;
		
		console.log("Dlm trendline func data: "+data)

		let sumX = 0,
			sumY = 0,
			sumXY = 0,
			sumX2 = 0;

		// Calculate the sums needed for linear regression
		for (let i = 0; i < n; i++) {			
			sumX += i;
			sumY += data[i];
			sumXY += i * data[i];
			sumX2 += i * i;
			
		}
		
		console.log("Dlm trendline func sumX: "+sumX)
		console.log("Dlm trendline func sumY: "+sumY)
		console.log("Dlm trendline func sumXY: "+sumXY)
		console.log("Dlm trendline func sumX2: "+sumX2)
		
		// Calculate the slope of the trend line
		const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX ** 2);
		
		// Calculate the intercept of the trend line
		let intercept = ((sumY / n) - slope * (sumX / n));
				
		const trendline = []; // Array to store the trend line data points
		
		// Find the minimum and maximum x-values from the scatter plot data		
				
		console.log("Dlm trendline slope : "+slope)
		console.log("Dlm trendline intercept : "+intercept)
		
				
		// console.log("Dlm trendline func dt: "+minX, maxX)
		// console.log("Dlm trendline func min: "+[minX, MIN])
		// console.log("Dlm trendline func max: "+[maxX, MAX])
		
		// Calculate the corresponding y-values for the trend line using the slope
		// and intercept
					
		for (let i = 0; i < n; i++) {
			
			if (intercept < 0.000001){
				intercept = 0.00001;
			}
			else{
				intercept = intercept;
			}
			
			let linee = slope * i + intercept;
						
			
			trendline.push(linee);
			console.log("Dlm trendline : "+linee);
		}
		
		return trendline;
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