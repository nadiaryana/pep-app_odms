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
  selector: 'app-pe-bhp-chart',
  templateUrl: './pe-bhp-chart.component.html',
  styleUrls: ['./pe-bhp.scss']
})

export class PeBhpChartComponent implements OnInit{

  @ViewChild('bhp_chart_el', { static: true }) public bhp_chart_el: ElementRef;
  bhp_table_data = [];
  bhp_table_columns: string[] = ["status", "count"];

  bhp_chart_options: object = {
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
        text: 'Pmax (psi)',
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
    },
    // { // Primary yAxis
    //   title: {
    //     text: 'Tmax (psi)',
    //     style: {
    //       color: '#000000'
    //     }
    //   },
    //   reversed: false,
    //   showFirstLabel: true,
    //   showLastLabel: true,
    //   labels: {
    //     format: '{value}',
    //     style: {
    //       color: '#999999'
    //     }
    //   }
    // }
  ],
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
         // theme
          'rgba(255,255,255,0.25)'
            },
            series: [{
              name: 'Pmax',
              type: 'scatter',
              yAxis: 0,
              data: [],
              color: '#008000',
              zIndex: 3,
              tooltip: {
          valueSuffix: ' psi',
          valueDecimals: 2
              },
              marker: {
          enabled: true,
          radius: 4,
          symbol: 'circle',
          lineWidth: 1,
          lineColor: '#ffffff'
              },
              lineWidth: 0
            },
          //   {
          //     name: 'Tmax',
          //     type: 'scatter',
          //     data: [],
          //     yAxis: 1,
          //     color: '#ff3300',
          //     tooltip: {
          // valueSuffix: ' psi',
          // valueDecimals: 2
          //     },
          //     marker: {
          // enabled: true,
          // radius: 4,
          // symbol: 'circle',
          // lineWidth: 1,
          // lineColor: '#ffffff'
          //     },
          //     lineWidth: 0
          //   }
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
            yAxis: [
              { // yAxis[0] → Pmax
              title: {
                text: 'Pmax (psi)'
              },
              labels: {
                align: 'right',
                x: 0,
                y: -6
              },
              showLastLabel: false
            },
            // { // yAxis[1] → Tmax
            //   title: {
            //     text: 'Tmax (°C)'
            //   },
            //   labels: {
            //     align: 'left',
            //     x: 0,
            //     y: -6
            //   },
            //   opposite: true,
            //   showLastLabel: false
            // }
          ]
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
      title: "BHP Chart",
      icon: "bar_chart",
      breadcrumbs: [
        { label: 'Petroleum Engineering', routerLink: '' },
        { label: 'BHP', routerLink: 'pe/bhp' },
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

    // if (!this.well_xSelected || this.well_xSelected.length === 0) {
    // return;
    // }

    // let start = new Date(this.start_dateControl.value);
    // start.setHours(0, 0, 0, 0);

    // let end = new Date(this.end_dateControl.value);
    // end.setHours(23, 59, 59, 999);
    let params = new HttpParams();
        params = params.append("type", "bhp")
          .append("date", this.start_dateControl.value.toISOString())
          .append("end_date", this.end_dateControl.value.toISOString());
        for (const w of this.well_xSelected) {
          params = params.append("well", w);
          console.log(w);
        }
    
        this.http.get('/api/pe/data', { params: params }).subscribe(res => {
    
          this.bhp_chart_options["title"]["text"] = this.well_xSelected.join(",");
          this.bhp_chart_options["caption"]["text"] = formatDate(this.start_dateControl.value, 'd MMM y', 'en-US') + " - " + formatDate(this.end_dateControl.value, 'd MMM y', 'en-US');
          this.bhp_chart_options["xAxis"][0]["categories"] = res["data"].map(d => formatDate(d["date"], "dd-MMM-yy", "en-US"));
          this.bhp_chart_options["series"][0]["data"] = res["data"].map(d => d["pmax"]);
          // this.bhp_chart_options["series"][1]["data"] = res["data"].map(d => d["tmax"]);
          // this.bhp_chart_options["series"][1]["data"] = res["data"].map(d => d["dfl"]);
          // this.sonolog_chart_options["series"][1]["data"] = res["data"].map(d => d["cdfl"]);
          // this.bhp_chart_options["series"][2]["data"] = res["data"].map(d => d["sfl"]);
          // this.sonolog_chart_options["series"][4]["data"] = res["data"].map(d => d["tglc"]);
          // this.sonolog_chart_options["series"][5]["data"] = res["data"].map(d => d["egfl"]);
          // this.sonolog_chart_options["series"][6]["data"] = res["data"].map(d => d["al"]);
    
          console.log(res["data"].length)
          Highcharts.chart(this.bhp_chart_el.nativeElement, this.bhp_chart_options);
    

    // let params = new HttpParams();
    // params = params.append("type", "bhp_chart")
    //   .append("start", this.start_dateControl.value.toString())
    //   .append("end", this.end_dateControl.value.toString());

    // for (const w of this.well_xSelected) {
    //   params = params.append("well", w);
    //   console.log(w);
    // }

    // this.http.get<BhpResponse>('/api/pe/bhp', { params }).subscribe(res => {
    //   console.log('RAW RESPONSE:', res);


    //   const items = res.items|| [];
    //   const pmaxData = [];
    //   const tmaxData = [];

    //   items.forEach(d => {
    //   const time = new Date(d.date).getTime();
    //   pmaxData.push([time, d.pmax !== undefined ? d.pmax : null]);
    //   tmaxData.push([time, d.tmax !== undefined ? d.tmax : null]);

    //   });

    //   this.bhp_chart_options["title"]["text"] = this.well_xSelected.join(",");
    //   this.bhp_chart_options["caption"]["text"] =
    //     formatDate(start, 'd MMM y', 'en-US') +
    //     " - " +
    //     formatDate(end, 'd MMM y', 'en-US');

    //   this.bhp_chart_options["series"][0]["data"] = pmaxData;
    //   this.bhp_chart_options["series"][1]["data"] = tmaxData;

      // params = params
      //   .set('start', start.toISOString())
      //   .set('end', end.toISOString());


    //   this.bhp_chart_options["title"]["text"] = this.well_xSelected.join(",");
    //   this.bhp_chart_options["caption"]["text"] = formatDate(this.start_dateControl.value, 'd MMM y', 'en-US') + " - " + formatDate(this.end_dateControl.value, 'd MMM y', 'en-US');

      // this.bhp_chart_options["series"][0]["data"] = items.map(d => [new Date(d.date).getTime(),d.pmax]);

      // this.bhp_chart_options["xAxis"][0]["categories"] = items.map(d => formatDate(d.date, "dd-MMM-yy", "en-US"));
    //   this.bhp_chart_options["xAxis"][0] = {type: 'datetime',crosshair: true};

      // this.bhp_chart_options["series"][0]["data"] = items.map(d => d.pmax);

      // this.bhp_chart_options["series"][1]["data"] = items.map(d => [new Date(d.date).getTime(),d.tmax]);

      // this.bhp_chart_options["xAxis"][0]["categories"] = res["data"].map(d => formatDate(d["date"], "dd-MMM-yy", "en-US"));
      // this.bhp_chart_options["series"][0]["data"] = res["data"].map(d => d["pmax"]);
      // this.bhp_chart_options["series"][0]["data"] = items.filter(d => d.pmax != null).map(d => [new Date(d.date).getTime(),d.pmax]);

    // this.bhp_chart_options["series"][1]["data"] = items.filter(d => d.tmax != null).map(d => [new Date(d.date).getTime(),d.tmax]);


    //   this.bhp_chart_options["series"][0]["data"] = [];
    //   this.bhp_chart_options["series"][1]["data"] = [];

      // this.bhp_chart_options["series"][1]["data"] = res["data"].map(d => d["tmax"]);

    //   console.log(items.length)
    //   console.table(this.bhp_chart_options["series"][0]["data"]);


      

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

    return this.http.get<PeWellApi>('/api/pe/bhp', httpOption);
  }
}

interface BhpItem {
  date: string;
  pmax: number;
  tmax: number;
}

interface BhpResponse {
  items: BhpItem[];
}
