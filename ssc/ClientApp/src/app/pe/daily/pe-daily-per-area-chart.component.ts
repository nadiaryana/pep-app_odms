import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpEventType, HttpParams, HttpResponse, HttpHeaders } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { MatDatepicker } from '@angular/material';
import { FormControl } from '@angular/forms';
import { merge, Observable, of as observableOf, forkJoin } from 'rxjs';
import { catchError, map, startWith, switchMap, debounceTime, take, mergeAll } from 'rxjs/operators';
import { Chart } from 'angular-highcharts';
import * as Highcharts from 'highcharts';

// import { annotations } from 'highcharts/modules/annotations';

import { MatSnackBar } from '@angular/material';

import { TitleService } from '../../navigation/title/title.service';
import { xFilterService } from '../../xfilter/xfilter.component';

import { Export } from '../exporting.js';
import { OfflineExport } from '../offline-exporting.js';

@Component({
  selector: 'app-pe-daily-per-area-chart',
  templateUrl: './pe-daily-per-area-chart.component.html',
  styleUrls: ['./pe-daily.scss']
})
export class PeDailyPerAreaChartComponent {

  @ViewChild('per_area_chart_el', { static: true }) public per_area_chart_el: ElementRef;
  per_area_table_data = [];
  per_area_table_columns: string[] = ["status", "count"];

  per_area_chart_options: object = {
    chart: {
	  type: 'areaspline',
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
      }//,
	  // plotLines: [{
            // color: 'black',
            // dashStyle: 'dot',
            // width: 2,
            // value: [],
            // label: {
                // rotation: 0,
                // y: 1,
                // style: {
                    // fontStyle: 'italic'
                // },
                // text: []
            // },
            // zIndex: 3
        // }]
    }],
    yAxis: [{ // Primary yAxis
      title: {
        text: 'Net (bopd)',
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
	],
    tooltip: {
      shared: true,
      formatter: function () {
        let s = `<b>${this.x}</b><br/>`;
        let total = 0;

        this.points.forEach(p => {
          s += `${p.series.name}: <b>${p.y.toFixed(2)}</b> bopd<br/>`;
          total += p.y;
        });

        s += `<hr/><b>Total: ${total.toFixed(2)} bopd</b>`;
        return s;
      }
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
        areaspline: {
            stacking: 'normal',
            fillOpacity: 0.6
        }
    },
    series: [{
      name: 'SGT',
      // type: 'spline',
      yAxis: 0,
      data: [],
      color: '#FCDEC0',
      tooltip: {
        valueSuffix: ' bopd',
        valueDecimals: 2
      }

    },{
      name: 'SBR',
      // type: 'spline',
      yAxis: 0,
      data: [],
      color: '#E5B299',
      tooltip: {
        valueSuffix: ' bopd',
        valueDecimals: 2
      }

    },{
      name: 'BD',
      // type: 'spline',
      yAxis: 0,
      data: [],
      color: '#B4846C',
      tooltip: {
        valueSuffix: ' bopd',
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

  per_area_chart_off_options: any = {
	chart: {
		zoomType: 'x',
		style: {
		fontFamily: 'Roboto, Helvetica Neue, sans-serif'
		}
	},
	title: { text: null },
	xAxis: [{
		categories: [],
		crosshair: true
	}],
	yAxis: [{
		title: {
		text: 'Total LPO Off',
		style: { color: '#666666' }
		},
		labels: { format: '{value}' }
	}, {
		title: {
		text: 'Well Off',
		style: { color: '#666666' }
		},
		labels: { format: '{value}' },
		opposite: true
	}],
	tooltip: { shared: true },
	legend: {
		layout: 'horizontal',
		align: 'center',
		verticalAlign: 'top',
		backgroundColor: 'rgba(255,255,255,0.25)'
	},
	plotOptions: {
      column: {
        dataLabels: {
          enabled: true,
          format: '{point.y:.0f}',
          rotation: 0,
          x: 0,
          y: -2,
          style: {
            fontWeight: 'normal'
          }
        }
      },
      series: {
        borderRadius: 10,
      },
     
    },
	series: [
		{
		name: 'LPO',
		type: 'column',
		yAxis: 0,
		data: []
		},
		{
		name: 'Well',
		type: 'line',
		yAxis: 1,
		data: []
		}
	]
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

  @ViewChild('per_area_chart_off_el', { static: true }) public per_area_chart_off_el: ElementRef;


  ngOnInit() {

    this.exampleDatabase = new ExampleHttpDao(this.http);

    this.titleService.titleSource.next({
      title: "Field Chart",
      icon: "auto_graph",
      breadcrumbs: [
        { label: 'Petroleum Engineering', routerLink: '' },
        { label: 'Daily', routerLink: 'pe/daily' },
        { label: 'Chart', routerLink: '' }
      ]
    }
    );


    this.start_dateControl.valueChanges.subscribe(r => {
      this.refresh_Daily();
	  this.refresh_Daily_Off();
    })
    this.end_dateControl.valueChanges.subscribe(r => {
      this.refresh_Daily();
	  this.refresh_Daily_Off();
    })
  }


  start_dateChange(evt) {
    this.start_dateInput = evt.value.toLocaleDateString("en-US", { month: "short", year: "numeric", day: "numeric" });
  }

  end_dateChange(evt) {
    this.end_dateInput = evt.value.toLocaleDateString("en-US", { month: "short", year: "numeric", day: "numeric" });
  }

  refresh_Daily() {
    let params = new HttpParams();
    params = params.append("type", "well_area_performance")
      .append("date", this.start_dateControl.value.toISOString())
      .append("end_date", this.end_dateControl.value.toISOString());
    // for (const w of this.well_xSelected) {
      // params = params.append("well", w);
      // console.log("Well Parameter: "+w);
    // }

	this.http.get('/api/pe/data', { params: params }).subscribe((res: any) => {
	  this.renderPerArea(res["data"] || []);


    }, error => {

    }, () => {

    });
  }

  // Agregasi Net Per Area (group-by tanggal). Kebal terhadap ukuran & urutan data.
  renderPerArea(rows: any[]) {
    const sgtAreaCodes = ["GS-1", "GS-2", "GS-3", "GS-4", "GS-5", "GS-6", "TOS"];
    const sbrAreaCodes = ["MINI-P", "SBR-P", "TJ-BT", "TOS-SBT"];
    const bdAreaCodes  = ["BD"];
    const areaOf = (loc) =>
      sgtAreaCodes.includes(loc) ? 'SGT' :
      sbrAreaCodes.includes(loc) ? 'SBR' :
      bdAreaCodes.includes(loc)  ? 'BD'  : null;

    const byDate = {};
    for (const d of rows) {
      const area = areaOf(d["location"]);
      if (!area) continue;
      const dt = new Date(d["date"]);
      if (isNaN(dt.getTime())) continue;
      const key = dt.getFullYear() + '-' +
                  String(dt.getMonth() + 1).padStart(2, '0') + '-' +
                  String(dt.getDate()).padStart(2, '0');
      if (!byDate[key]) byDate[key] = { SGT: 0, SBR: 0, BD: 0 };
      byDate[key][area] += Number(d["net"]) || 0;
    }

    const keys = Object.keys(byDate).sort();
    const categories = keys.map(k => {
      const parts = k.split('-').map(Number);
      return formatDate(new Date(parts[0], parts[1] - 1, parts[2]), "dd-MMM-yy", "en-US");
    });

    this.per_area_chart_options["title"]["text"] = "Net Per Area";
    this.per_area_chart_options["caption"]["text"] =
      formatDate(this.start_dateControl.value, 'd MMM y', 'en-US') + " - " +
      formatDate(this.end_dateControl.value, 'd MMM y', 'en-US');
    this.per_area_chart_options["xAxis"][0]["categories"] = categories;
    this.per_area_chart_options["series"][0]["data"] = keys.map(k => byDate[k].SGT);
    this.per_area_chart_options["series"][1]["data"] = keys.map(k => byDate[k].SBR);
    this.per_area_chart_options["series"][2]["data"] = keys.map(k => byDate[k].BD);

    Highcharts.chart(this.per_area_chart_el.nativeElement, this.per_area_chart_options);
  }

  refresh_Daily_Off() {
  const params = new HttpParams()
    .append("type", "well_off")
    .append("date", this.start_dateControl.value.toISOString())
    .append("end_date", this.end_dateControl.value.toISOString());

  this.http.get('/api/pe/data', { params }).subscribe((res: any) => {

    const group: { [k: string]: { sum: number, count: number } } = {};

    (res.data || []).forEach((x: any) => {
      const d = new Date(x.date);
      const key = d.getFullYear() + '-' +
                  String(d.getMonth() + 1).padStart(2, '0') + '-' +
                  String(d.getDate()).padStart(2, '0');

      if (!group[key]) {
        group[key] = { sum: 0, count: 0 };
      }

      if (x.hours < 24 && x.gross > 0) {

        group[key].count += 1;

        if (x.log_figure != null && x.log_figure !== 0) {
          group[key].sum += Number(x.log_figure);
        }
      }
    });

    // prepare arrays untuk chart, sorted by date asc
    const keys = Object.keys(group).sort();
    const kategori_date: string[] = [];
    const sumArr: number[] = [];
    const countArr: number[] = [];

    keys.forEach(k => {
      // format label: "DD-MMM" (mis. 08-Nov)
      const parts = k.split('-'); // k = "YYYY-MM-DD"
      const y = Number(parts[0]), m = Number(parts[1]) - 1, dd = Number(parts[2]);
      const dateObj = new Date(y, m, dd);
      kategori_date.push(dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }));

      sumArr.push(group[k].sum);
      countArr.push(group[k].count);
    });

    // update chart options (pastikan series index sesuai: 0 = column sum, 1 = line/count)
    this.per_area_chart_off_options.xAxis[0].categories = kategori_date;

    // jika series belum terdefinisi, inisialisasi struktur yang benar
    if (!this.per_area_chart_off_options.series || this.per_area_chart_off_options.series.length < 2) {
      this.per_area_chart_off_options.series = [
        { name: 'SUM (condition)', type: 'column', yAxis: 0, data: [] },
        { name: 'COUNT (condition)', type: 'line', yAxis: 1, data: [], marker: { enabled: true } }
      ];
    }

    this.per_area_chart_off_options.series[0].data = sumArr;
    this.per_area_chart_off_options.series[1].data = countArr;

    // render chart ke element container
    // Pastikan kamu punya ViewChild per_area_chart_off_el: ElementRef
    Highcharts.chart(this.per_area_chart_off_el.nativeElement, this.per_area_chart_off_options);
  }, err => {
    console.error('refresh_Daily_Off error', err);
  });
}

//   refresh_Daily_Off() {

//   let params = new HttpParams()
//     .append("type","well_off")
//     .append("date", this.start_dateControl.value.toISOString())
//     .append("end_date", this.end_dateControl.value.toISOString());

//   this.http.get('/api/pe/data', {params}).subscribe((res:any)=>{
// 	console.log("resp",res.data);


//     const group:any = {};
//     res.data.forEach((x=>{
// 		const d = new Date(x.date);
// 		const key = d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
      
//       if(!group[key]) group[key] = { sum:0, count:0 };

//       if(x.log_figure != null && x.log_figure != 0){
//         group[key].sum += x.log_figure;
//       }

//       if(x.hours < 24 && x.gross > 0){
//         group[key].count += 1;
//       }

//     }));

//     let kategori_date:string[]=[];
//     let sumArr:number[]=[];
//     let countArr:number[]=[];

//     Object.keys(group).sort().forEach(k=>{
// 	const d = new Date(k);
//       kategori_date.push(d.toLocaleDateString('en-GB', {day:'2-digit', month:'short'}));
//       sumArr.push(group[k].sum);
//       countArr.push(group[k].count);
//     });

//     this.per_area_chart_off_options.xAxis[0].categories = kategori_date;
//     this.per_area_chart_off_options.series[0].data = sumArr;
//     this.per_area_chart_off_options.series[1].data = countArr;

//     Highcharts.chart(this.per_area_chart_off_el.nativeElement, this.per_area_chart_off_options);

//   });

// }


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
