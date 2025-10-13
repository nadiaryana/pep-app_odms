import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpEventType, HttpParams, HttpResponse, HttpHeaders } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { MatDatepicker } from '@angular/material';
import { FormControl } from '@angular/forms';
import { merge, Observable, of as observableOf, forkJoin } from 'rxjs';
import { catchError, map, startWith, switchMap, debounceTime, take, mergeAll } from 'rxjs/operators';
import { Chart } from 'angular-highcharts';
import * as Highcharts from 'highcharts';
import exporting from 'highcharts/modules/exporting';
import offline from 'highcharts/modules/offline-exporting';
import annotations from 'highcharts/modules/annotations';
annotations(Highcharts);

exporting(Highcharts);
offline(Highcharts);

// import { annotations } from 'highcharts/modules/annotations';

import { MatSnackBar } from '@angular/material';

import { TitleService } from '../../navigation/title/title.service';
import { xFilterService } from '../../xfilter/xfilter.component';


@Component({
  selector: 'app-pe-dailychart',
  templateUrl: './pe-daily-chart.component.html',
  styleUrls: ['./pe-daily.scss']
})

export class PeDailyChartComponent {

  @ViewChild('daily_chart_el', { static: true }) public daily_chart_el: ElementRef;
  daily_table_data = [];
  daily_table_columns: string[] = ["status", "count"];
  
  showAnnotations: boolean = false; // Toggle this to enable/disable annotations

  daily_chart_options: object = {
    chart: {
      zoomType: 'x',
      style: {
        fontFamily: 'Roboto, Helvetica Neue, sans-serif'
      }
    },
	exporting: {
        fallbackToExportServer: false
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
        text: 'Gross (bfpd), Net (bopd), Qgas (bfpd), SL (inch)',
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
        text: 'WC (%), THP (psi), SM (m), SPM (SPM)',
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
      zIndex: 9,
      tooltip: {
        valueSuffix: ' bfpd',
        valueDecimals: 2
      }

    }, {
      name: 'Net',
      type: 'line',
      yAxis: 0,
      data: [],
      color: '#00B050',
      zIndex: 8,
      tooltip: {
        valueSuffix: ' bopd',
        valueDecimals: 2
      }

    }, {
      name: 'Q.Gas',
      type: 'line',
      yAxis: 0,
      data: [],
      color: '#C00000',
      zIndex: 7,
      tooltip: {
        valueSuffix: ' bfpd',
        valueDecimals: 2
      },
	  visible: false

    }, {
      name: 'WC',
      type: 'line',
      yAxis: 1,
      data: [],
      color: '#0070C0',
      zIndex: 6,
      tooltip: {
        valueSuffix: ' %',
        valueDecimals: 2
      }

    }, {
      name: 'THP',
      type: 'line',
      yAxis: 1,
      data: [],
      color: '#7030A0',
      zIndex: 5,
      tooltip: {
        valueSuffix: ' psi',
        valueDecimals: 2
      },
	  visible: false

    }, {
      name: 'SM',
      type: 'area',
      yAxis: 1,
      data: [],
      color: '#D5FFFF',
      zIndex: 4,
      tooltip: {
        valueSuffix: ' m',
        valueDecimals: 2
      },
	  visible: false
	  
    }, {
      name: 'SL',
      type: 'line',
      yAxis: 0,
      data: [],
      color: '#91e30e',
      zIndex: 3,
      marker: {
        enabled: false
      },
      tooltip: {
        valueSuffix: ' inch',
        valueDecimals: 2
      },
	  visible: false

    }, {
      name: 'SPM',
      type: 'line',
      yAxis: 1,
      data: [],
      color: '#d41179',
      zIndex: 2,
      marker: {
        enabled: false
      },
      tooltip: {
        valueSuffix: ' SPM',
        valueDecimals: 2
      },
	  visible: false
	  
    }, {
      name: 'KD',
      type: 'line',
      yAxis: 0,
      data: [],
      color: '#17d1b2',
      zIndex: 1,
      marker: {
        enabled: false
      },
      tooltip: {
        valueSuffix: ' Hz',
        valueDecimals: 2
      },
	  visible: false
	  
    }
	],
	
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
    let annotationList = [];
    let params = new HttpParams();
    params = params.append("type", "well_performance")
      .append("date", this.start_dateControl.value.toISOString())
      .append("end_date", this.end_dateControl.value.toISOString());
    for (const w of this.well_xSelected) {
      params = params.append("well", w);
      console.log("Well Parameter: "+w);
    }

    this.http.get('/api/pe/daily/GetChart', { params: params }).subscribe(res => {
	  
	  let tgl = res["data"].map(d => formatDate(d["date"], "dd-MMM-yy", "en-US"));
	  let g = res["data"].map(d => d["gross"]);
	  let n = res["data"].map(d => d["net"]);
	  let q = res["data"].map(d => d["gas"]);
	  let w = res["data"].map(d => d["wc"]);
	  let t = res["data"].map(d => d["thp"]);
	  let sm = res["data"].map(d => d["sm"]);
	  let sl = res["data"].map(d => d["ds_sl"]);
	  let spm = res["data"].map(d => d["ds_spm"]);
    let kd = res["data"].map(d => d["ds_kd"]);
	  let note = res["data"].map(d => d["noted"]);
	  let well = res["data"].map(d => d["well"]);
	  
	  let g1 = [];
	  let n1 = [];
	  let q1 = [];
	  let w1 = [];
	  let t1 = [];
	  let sm1 = [];
	  let sl1 = [];
	  let spm1 = [];
    let kd1 = [];
	  let tanggal = 0;
	  var tg = [];
	  var i = 0;
	  
	  let dt_well = this.well_xSelected.length;
	  let dt_date = [];
	  let dt_grs = [];
	  let dt_net = [];
	  let dt_gas = [];
	  let dt_wc = [];
	  let dt_thp = [];
	  let dt_sm = [];
	  let dt_sl = [];
	  let dt_spm = [];
    let dt_kd = [];
	  
	  let dt_grss = [];	  
	  let dt_nett = [];
	  let dt_qgass = [];
	  let dt_wcc = [];
	  let dt_thpp = [];
	  let dt_smm = [];
	  let dt_sll = [];
	  let dt_spmm = [];
    let dt_kdd = [];
	  
	  
	  this.daily_chart_options["title"]["text"] = this.well_xSelected.join(",");
      this.daily_chart_options["caption"]["text"] = formatDate(this.start_dateControl.value, 'd MMM y', 'en-US') + " - " + formatDate(this.end_dateControl.value, 'd MMM y', 'en-US');
	  
	  console.log("Brp well: "+dt_well);
	  // console.log("Tgl Brp: "+formatDate('2023-03-12T00:00:00+08:00', "dd-MMM-yy", "en-US"));
	  // console.log("Tgl Brp: "+res["data"].map(d => d["date"]));
	  
	  
	  if (g == ""){
			console.log("gaada nilai nya: "+g);
			// g = 10;
			console.log("klo skrg nilai nya: "+g);
	  }
	  else{
			console.log("nilai nya: "+g);
	  }
	  
	  let tgl_note = [];
	  var x = 0;
	  console.log("Byk tgl: "+tgl.length);
	  for (var y = 0; y < tgl.length; y++){
		 // console.log("Isi noted: "+note[y]);
		if (note[y] != null){
			console.log("Isi y: "+y);
			tgl_note[x] = y;
			
			x++;
		  }
		  else{
			// console.log("tanggal: not match");
		  }
	  }
	  console.log("tanggal note: "+tgl_note);
	  
	  // if(tgl_note == ""){
		// console.log("tanggal note 2: kosong");
		// tgl_note = null;
	  // }
	  
	  // console.log("Well nya: "+well.length);
	  // console.log("Wellll nya: "+this.well_xSelected.length);
	  
	  for (var s = 0; s < sm.length; s++){
		  if (sm[s] < 0){
			// console.log("SM minus: "+sm[s]);
			sm[s] = 0;
		  }
		  else{
			sm[s] = sm[s];
		  }
	  }
	  
	  // console.log("SM nya: "+sm);
	  
	  if (dt_well == 1){
	      
		for (let i = 0; i < tgl.length; i++) {
		  if (note[i]) {
			const categoryLabel = tgl[i];
			const xIndex = tgl.findIndex(t => t.trim() === categoryLabel.trim());
			const yVal = g[i] != null ? g[i] : 0;  // Versi aman TypeScript <3.7

			console.log(`note[${i}] = ${note[i]} at ${categoryLabel}, xIndex: ${xIndex}, y: ${yVal}`);

			if (xIndex !== -1) {
			  annotationList.push({
				labels: [{
				  point: {
					xAxis: 0,
					yAxis: 0,
					x: xIndex,
					y: yVal
				  },
				  text: note[i],
				  backgroundColor: 'rgba(255,255,255,0.5)',
				  // borderColor: 'black',
				  style: {
					fontSize: '10px',
					color: '#000'
				  },
				  shape: 'callout',
				  align: 'center',
				  verticalAlign: 'top',
				}]
			  });
			}
		  }
		}
		
		this.daily_chart_options["xAxis"][0]["categories"] = res["data"].map(d => formatDate(d["date"], "dd-MMM-yy", "en-US"));
		// this.daily_chart_options["xAxis"][0]["plotLines"][0]["value"] = tgl_note;
		// this.daily_chart_options["xAxis"][0]["plotLines"][0]["label"]["text"] = res["data"].map(d => d["noted"]);
		this.daily_chart_options["series"][0]["data"] = res["data"].map(d => d["gross"]);
		this.daily_chart_options["series"][1]["data"] = res["data"].map(d => d["net"]);
		this.daily_chart_options["series"][2]["data"] = res["data"].map(d => d["gas"]);
		this.daily_chart_options["series"][3]["data"] = res["data"].map(d => d["wc"]);
		this.daily_chart_options["series"][4]["data"] = res["data"].map(d => d["thp"]);
		this.daily_chart_options["series"][5]["data"] = sm;
		this.daily_chart_options["series"][6]["data"] = res["data"].map(d => d["sl"]);
		this.daily_chart_options["series"][7]["data"] = res["data"].map(d => d["spm"]);
    this.daily_chart_options["series"][8]["data"] = res["data"].map(d => d["kd"]);
		this.daily_chart_options["annotations"] = annotationList;
		// this.daily_chart_options["series"][9]["data"] = res["data"].map(d => d["noted"]);
		// console.log("nilai noted: "+this.daily_chart_options["series"][9]["data"]);
	  }
	  else {
		console.log(res["data"].length)
		console.log("Datanya apa aja: "+res["data"].map(d => d["gross"]))
		console.log("nilai date: "+res["data"].map(d => d["date"]));
		
	  
	  	
		
		for (var y = 0; y < tgl.length; y++){
			// Sintak LIKE //
			// if(well[y].includes("NKL-1002")){
				// console.log("Apa aja : "+well[y]);
			// }
			
			
			if (well[y] == null){
				console.log("gaada nilai nya: "+well[y]+" - "+g[y]);
				g[y] = 0;
				n1[y] = 0;
				q1[y] = 0;
				w1[y] = 0;
				t1[y] = 0;
				sm1[y] = 0;
				sl1[y] = 0;
				spm1[y] = 0;
        kd1[y] = 0;
				console.log("nilai nya: "+g[y]);
			}
			
			if (tanggal == tgl[y]){
				g1[y] = g1[y-1] + g[y];
				n1[y] = n1[y-1] + n[y];
				q1[y] = q1[y-1] + q[y];
				w1[y] = w1[y-1] + w[y];
				t1[y] = t1[y-1] + t[y];
				sm1[y] = sm1[y-1] + sm[y];
				sl1[y] = sl1[y-1] + sl[y];
				spm1[y] = spm1[y-1] + spm[y];
        kd1[y] = kd1[y-1] + kd[y];
				
				console.log("Masuk if kah ? "+tanggal+" - "+g1[y])
				tg[y] = tgl[y];
				console.log("nilai tg_y: "+tg[y]);
				console.log("nilai i sblm: "+i);
				i = i + 1;
				console.log("nilai i: "+i);
				
				if (i == dt_well-1){
					dt_grs[y] = [tg[y], g1[y]];
					dt_net[y] = [tg[y], n1[y]];
					dt_qgass[y] = [tg[y], q1[y]/dt_well];
					dt_wc[y] = [tg[y], 100*(1-(n1[y]/g1[y]))];
					dt_thp[y] = [tg[y], t1[y]/dt_well];
					dt_sm[y] = [tg[y], sm1[y]/dt_well];
					dt_sl[y] = [tg[y], sl1[y]/dt_well];
					dt_spm[y] = [tg[y], spm1[y]/dt_well];
          dt_kd[y] = [tg[y], kd1[y]/dt_well];
					// dt_grs[y] = 10;
					// dt_net[y] = 10;
					// dt_qmax[y] = 10;
					// dt_wc[y] = 10;
					// dt_thp[y] = 10;
					// dt_sm[y] = 10;
					// dt_sl[y] = 10;
					// dt_spm[y] = 10;
					// dt_freq[y] = 10;
				}
				console.log("nilai tgl: "+tg[y]);
				console.log("nilai grs: "+g1[y]);
				console.log("nilai qgass: "+q1[y]);
				
			}
			else{
				i = 0;
				tanggal = tgl[y];
				g1[y] = g[y];
				n1[y] = n[y];
				q1[y] = q[y];
				w1[y] = w[y];
				t1[y] = t[y];
				sm1[y] = sm[y];
				sl1[y] = sl[y];
				spm1[y] = spm[y];
        kd1[y] = kd1[y];
				
				console.log("Masuk else kah ?");
			}
			
	    
		}
	  
		var i = 0
		for (var x = 0; x < dt_grs.length; x++){
			if (dt_grs[x] != undefined){
				dt_date[i] = tg[x];
				dt_grss[i] = dt_grs[x];
				dt_nett[i] = dt_net[x];
				dt_qgass[i] = dt_qgass[x];
				dt_wcc[i] = dt_wc[x];
				dt_thpp[i] = dt_thp[x];
				dt_smm[i] = dt_sm[x];
				dt_sll[i] = dt_sl[x];
				dt_spmm[i] = dt_spm[x];
        dt_kddd[i] = dt_kd[x];
				
				// console.log("nilai grss2: "+dt_grss);
				i++;
			}
			else{
				// console.log("nilai grss3: "+dt_grss[x]);
			}
		}
		// console.log("nilai date out: "+dt_date);
		// console.log("nilai grss out: "+dt_grss)
		// console.log("nilai nett out: "+dt_nett)
		// console.log("nilai qmaxx out: "+dt_qmaxx)
		// console.log("nilai wc out: "+dt_wcc)
		// console.log("nilai thpp out: "+dt_thpp)
		// console.log("nilai smm out: "+dt_smm)
		// console.log("nilai sll out: "+dt_sll)
		// console.log("nilai spmm out: "+dt_spmm)
		// console.log("nilai freqq out: "+dt_freqq)
		
	  
		// -- FIXX --
		this.daily_chart_options["xAxis"][0]["categories"] = dt_date;
		this.daily_chart_options["series"][0]["data"] = dt_grss;
		this.daily_chart_options["series"][1]["data"] = dt_nett;
		this.daily_chart_options["series"][2]["data"] = dt_qgass;
		this.daily_chart_options["series"][3]["data"] = dt_wcc;
		this.daily_chart_options["series"][4]["data"] = dt_thpp;
		this.daily_chart_options["series"][5]["data"] = dt_smm;
		this.daily_chart_options["series"][6]["data"] = dt_sll;
		this.daily_chart_options["series"][7]["data"] = dt_spmm;
		this.daily_chart_options["series"][8]["data"] = dt_kdd;

	  }
	        
	  if (this.showAnnotations) {
		  this.daily_chart_options["annotations"] = annotationList;
	  } else {
		  this.daily_chart_options["annotations"] = [];
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
