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
  selector: 'app-pe-sonolog-chart',
  templateUrl: './pe-sonolog-chart.component.html',
  styleUrls: ['./pe-sonolog.scss']
})

export class PeSonologChartComponent {

  @ViewChild('sonolog_chart_el', { static: true }) public sonolog_chart_el: ElementRef;
  daily_table_data = [];
  daily_table_columns: string[] = ["status", "count"];

  sonolog_chart_options: object = {
    chart: {
      zoomType: 'xy',
      style: {
        fontFamily: 'Roboto, Helvetica Neue, sans-serif'
      },
    },
    title: {
      text: null,
      align: 'center',
      verticalAlign: 'top'
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
      // offset: -275,
      labels: {
        // step: 7
      }
    }],
    yAxis: [{ // Primary yAxis
      title: {
        text: 'Pump Intake (m), DFL (m), SFL (m)',
        style: {
          color: '#666666'
        }
      },
      reversed: false,
      showFirstLabel: true,
      showLastLabel: true,
      labels: {
        format: '{value}',
        style: {
          color: '#999999'
        }
      }
    }],
    tooltip: {
      headerFormat: '<b>{series.name}</b><br />',
      pointFormat: '{point.y}',
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
      name: 'Pump Intake',
      type: 'line',
      yAxis: 0,
      data: [],
      color: '#008000',
      zIndex: 3,
      tooltip: {
        valueSuffix: ' m',
        valueDecimals: 2
      },
      marker: {
        symbol: 'circle', // Set the default marker type for the series
        radius: 3 // Set the default marker radius
      }

    }, {
      name: 'DFL',
      type: 'area',
      yAxis: 0,
      data: [],
      color: '#ff3300',
      zIndex: 2,
      tooltip: {
        valueSuffix: ' m',
        valueDecimals: 2
      },
      marker: {
        symbol: 'circle', // Set the default marker type for the series
        radius: 3 // Set the default marker radius
      }

    }, {
      name: 'SFL',
      type: 'scatter',
      yAxis: 0,
      data: [],
      color: '#5c00e6',
      zIndex: 1,
      tooltip: {
        valueSuffix: ' m',
        valueDecimals: 2
      },
      marker: {
        symbol: 'circle', // Set the default marker type for the series
        radius: 3 // Set the default marker radius
      }

    }
      // , {
      // name: 'TGLC',
      // type: 'scatter',
      // yAxis: 1,
      // data: [],
      // color: '#7030A0',
      // tooltip: {
      // valueSuffix: ' m',
      // valueDecimals: 2
      // },
      // marker: {
      // symbol: 'circle', // Set the default marker type for the series
      // radius: 3 // Set the default marker radius
      // }

      // }, {
      // name: 'EGFL',
      // type: 'scatter',
      // yAxis: 1,
      // data: [],
      // color: '#C55A11',
      // tooltip: {
      // valueSuffix: ' m',
      // valueDecimals: 2
      // },
      // marker: {
      // symbol: 'circle', // Set the default marker type for the series
      // radius: 3 // Set the default marker radius
      // }
      // }, {
      // name: 'AL',
      // type: 'scatter',
      // yAxis: 1,
      // data: [],
      // color: '#91e30e',
      // tooltip: {
      // valueSuffix: ' m',
      // valueDecimals: 2
      // },
      // marker: {
      // symbol: 'circle', // Set the default marker type for the series
      // radius: 3 // Set the default marker radius
      // }

      // }
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
      title: "Chart",
      icon: "bar_chart",
      breadcrumbs: [
        { label: 'Petroleum Engineering', routerLink: '' },
        { label: 'Sonolog', routerLink: 'pe/sonolog' },
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
    params = params.append("type", "well_performance_sonolog")
      .append("date", this.start_dateControl.value.toISOString())
      .append("end_date", this.end_dateControl.value.toISOString());
    for (const w of this.well_xSelected) {
      params = params.append("well", w);
      console.log(w);
    }

    this.http.get('/api/pe/data', { params: params }).subscribe(res => {

      this.sonolog_chart_options["title"]["text"] = this.well_xSelected.join(",");
      this.sonolog_chart_options["caption"]["text"] = formatDate(this.start_dateControl.value, 'd MMM y', 'en-US') + " - " + formatDate(this.end_dateControl.value, 'd MMM y', 'en-US');
      this.sonolog_chart_options["xAxis"][0]["categories"] = res["data"].map(d => formatDate(d["date"], "dd-MMM-yy", "en-US"));
      this.sonolog_chart_options["series"][0]["data"] = res["data"].map(d => d["pump_intake"]);
      this.sonolog_chart_options["series"][1]["data"] = res["data"].map(d => d["dfl"]);
      // this.sonolog_chart_options["series"][1]["data"] = res["data"].map(d => d["cdfl"]);
      this.sonolog_chart_options["series"][2]["data"] = res["data"].map(d => d["sfl"]);
      // this.sonolog_chart_options["series"][4]["data"] = res["data"].map(d => d["tglc"]);
      // this.sonolog_chart_options["series"][5]["data"] = res["data"].map(d => d["egfl"]);
      // this.sonolog_chart_options["series"][6]["data"] = res["data"].map(d => d["al"]);

      console.log(res["data"].length)

      Highcharts.chart(this.sonolog_chart_el.nativeElement, this.sonolog_chart_options);

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

    return this.http.get<PeWellApi>('/api/pe/sonolog', httpOption);
  }
}
