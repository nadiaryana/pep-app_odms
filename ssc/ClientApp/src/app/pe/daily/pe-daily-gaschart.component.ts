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
  selector: 'app-pe-dailychart',
  templateUrl: './pe-daily-gaschart.component.html',
  styleUrls: ['./pe-daily.scss']
})

export class PeDailyGasChartComponent {

    @ViewChild('daily_gas_chart_el', {static:true}) public daily_gas_chart_el: ElementRef;
    daily_table_data = [];
    daily_table_columns:string[] = ["status", "count"];

    daily_gas_chart_options:object = {
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
        autoRotation : true,
      labels: {
         // step: 7
        }
      }],
    yAxis: [{ // Primary yAxis
        title: {
            text: 'Gas (MSCFD), THP (psi)',
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
            text: 'Bean Size (mm)',
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
    }, { // Third yAxis
        gridLineWidth: 0,
        title: {
            text: 'GLR, GOR (scf/bbl)',
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
    series: [{
        name: 'Gas',
        type: 'line',
        yAxis: 0,
        data: [],
        color: '#ff0000',
        tooltip: {
            valueSuffix: ' mMscd',
            valueDecimals: 2
        }

    },{
        name: 'THP',
        type: 'line',
        yAxis: 0,
        data: [],
        color: '#7030A0',
        tooltip: {
            valueSuffix: ' psi',
            valueDecimals: 2
        }

    }, {
        name: 'Bean Size',
        type: 'line',
        yAxis: 1,
        data: [],
        color: '#f5b58a',
        tooltip: {
            valueSuffix: ' mm',
            valueDecimals: 2
        },
		visible: false
    },
	{
        name: 'GLR',
        type: 'line',
        yAxis: 2,
        data: [],
        color: '#e6e600',
        tooltip: {
            valueSuffix: ' scf/bbl',
            valueDecimals: 2
        },
		visible: false
    }, {
        name: 'GOR',
        type: 'line',
        yAxis: 2,
        data: [],
        color: '#94b8b8',
        tooltip: {
            valueSuffix: ' scf/bbl',
            valueDecimals: 2
        },
		visible: false
    }],

    /*  exporting: {
        chartOptions: {
          plotOptions: {
            series: {
              dataLabels: {
                enabled: true
              }
            }
          },
          xAxis: [{
            categories: [],
            crosshair: true,
            labels: {
              step: 7
            }
          }],
        }
      }, */
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

  ngOnInit(){

    this.exampleDatabase = new ExampleHttpDao(this.http);

    this.titleService.titleSource.next({
      title: "Gas Chart",
      icon : "bar_chart",
      breadcrumbs: [
        {label: 'Petroleum Engineering', routerLink: ''}, 
        {label: 'Daily', routerLink: 'pe/daily'},
        {label: 'Chart', routerLink: ''}
      ]}
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

  getColumnValues(param:any) {
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

      this.daily_gas_chart_options["title"]["text"] = this.well_xSelected.join(",");
      this.daily_gas_chart_options["caption"]["text"] = formatDate(this.start_dateControl.value, 'd MMM y', 'en-US') + " - " +formatDate(this.end_dateControl.value, 'd MMM y', 'en-US');
      this.daily_gas_chart_options["xAxis"][0]["categories"] = res["data"].map(d => formatDate(d["date"], "dd-MMM-yy", "en-US"));
      this.daily_gas_chart_options["series"][0]["data"] = res["data"].map(d => d["gas_rates"] * 1000);
      this.daily_gas_chart_options["series"][1]["data"] = res["data"].map(d => d["thp"]);
      this.daily_gas_chart_options["series"][2]["data"] = res["data"].map(d => d["bean_size"]);
	  this.daily_gas_chart_options["series"][3]["data"] = res["data"].map(d => ((d["gas_rates"] * 1000) / d["gross"]) * 1000);
      this.daily_gas_chart_options["series"][4]["data"] = res["data"].map(d => ((d["gas_rates"] * 1000) / d["net"]) * 1000);
	  console.log("Nilai Gas: "+res["data"].map(d => d["gas_rates"] * 1000));
	  console.log("Nilai Gross: "+res["data"].map(d => d["gross"]));
	  console.log("Nilai net: "+res["data"].map(d => d["net"]));
	  console.log("Nilai Gas/Gross: "+res["data"].map(d => (d["gas_rates"] * 1000) / d["gross"]));
	  console.log("Nilai Gas/net: "+res["data"].map(d => ((d["gas_rates"] * 1000) / d["net"]) * 1000));

      console.log(res["data"].length)
     /* if (res["data"].length / 7 < 3) {
        this.daily_gas_chart_options["xAxis"][0]["labels"].step = 1;
        this.daily_gas_chart_options["xAxis"][0]["labels"].rotation = 0;
      } else if (res["data"].length / 7 < 6) {
        this.daily_gas_chart_options["xAxis"][0]["labels"].step = 2;
        this.daily_gas_chart_options["xAxis"][0]["labels"].rotation = 0;
      } else if (res["data"].length / 7 < 6) {
        this.daily_gas_chart_options["xAxis"][0]["labels"].step = 3;
        this.daily_gas_chart_options["xAxis"][0]["labels"].rotation = 0;
      } else if (res["data"].length / 7 < 9) {
        this.daily_gas_chart_options["xAxis"][0]["labels"].step = 4;
        this.daily_gas_chart_options["xAxis"][0]["labels"].rotation = 0;
      } else if (res["data"].length / 7 < 12) {
        this.daily_gas_chart_options["xAxis"][0]["labels"].step = 5;
        this.daily_gas_chart_options["xAxis"][0]["labels"].rotation = 0;
      } else if (res["data"].length / 7 < 15) {
        this.daily_gas_chart_options["xAxis"][0]["labels"].step = 6;
        this.daily_gas_chart_options["xAxis"][0]["labels"].rotation = 0;
      } else if (res["data"].length / 7 < 18) {
        this.daily_gas_chart_options["xAxis"][0]["labels"].step = 7;
        this.daily_gas_chart_options["xAxis"][0]["labels"].rotation = 0;
      } else if (res["data"].length / 7 < 21) {
        this.daily_gas_chart_options["xAxis"][0]["labels"].step = 8;
        this.daily_gas_chart_options["xAxis"][0]["labels"].rotation = 0;
      } else if (res["data"].length / 7 < 24) {
        this.daily_gas_chart_options["xAxis"][0]["labels"].step = 9;
        this.daily_gas_chart_options["xAxis"][0]["labels"].rotation = 0;
      } else if (res["data"].length / 7 < 27) {
        this.daily_gas_chart_options["xAxis"][0]["labels"].step = 10;
        this.daily_gas_chart_options["xAxis"][0]["labels"].rotation = 0;
      } else if (res["data"].length / 7 < 30) {
        this.daily_gas_chart_options["xAxis"][0]["labels"].step = 11;
        this.daily_gas_chart_options["xAxis"][0]["labels"].rotation = 0;
      } else if (res["data"].length / 7 < 33) {
        this.daily_gas_chart_options["xAxis"][0]["labels"].step = 12;
        this.daily_gas_chart_options["xAxis"][0]["labels"].rotation = 0;
      } else if (res["data"].length / 7 < 36) {
        this.daily_gas_chart_options["xAxis"][0]["labels"].step = 13;
        this.daily_gas_chart_options["xAxis"][0]["labels"].rotation = 0;
      } else {
        this.daily_gas_chart_options["xAxis"][0]["labels"].step = 14;
        this.daily_gas_chart_options["xAxis"][0]["labels"].rotation = -45;
        this.daily_gas_chart_options["exporting"]["chartOptions"]["xAxis"][0]["labels"].step = 14;
      }

*/
      Highcharts.chart(this.daily_gas_chart_el.nativeElement, this.daily_gas_chart_options);

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
