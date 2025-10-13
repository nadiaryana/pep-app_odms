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
        areaspline: {
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
    })
    this.end_dateControl.valueChanges.subscribe(r => {
      this.refresh_Daily();
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

    this.http.get('/api/pe/data', { params: params }).subscribe(res => {
	  
	  let tgl = res["data"].map(d => formatDate(d["date"], "dd-MMM-yy", "en-US"));
	  let gross = res["data"].map(d => d["gross"]);
	  let net = res["data"].map(d => d["net"]);
	  let well = res["data"].map(d => d["well"]);
	  let tgl_cek = 0;
	  
	  
	  let g = res["data"].map(d => d["gross"]);
	  let n = res["data"].map(d => d["net"]);
	  let o = 0;
	  let k = 0;
	  let w = 0;
	  let p = 0;
	  let q = 0;
	  let j = 0;
	  
	  
	  let well_sgt = [];
	  let g_sgt = [];
	  let n_sgt = [];
	  var tgl_sgt = [];
	  
	  let well_sbr = [];
	  let g_sbr = [];
	  let n_sbr = [];
	  var tgl_sbr = [];
	  
	  let well_bd = [];
	  let g_bd = [];
	  let n_bd = [];
	  var tgl_bd = [];	  
	  
	  let g1_sgt = [];
	  let n1_sgt = [];
	  let tg_sgt = [];
	  
	  let g1_sbr = [];
	  let n1_sbr = [];
	  let tg_sbr = [];
	  
	  let g1_bd = [];
	  let n1_bd = [];
	  let tg_bd = [];
	  
	  let well_cek = [];
	  let g1 = [];
	  let gg = [];
	  let n1 = [];
	  let nn = [];
	  let welll = [];
	  let tanggal = 0;
	  let tanggal2 = 0;
	  var tg = [];
	  var tgg = [];
	  
	  let dt_well = well.length;
	  let dt_date = [];
	  let dt_grs_sgt = [];
	  let dt_net_sgt = [];
	  
	  let dt_grs_sbr = [];
	  let dt_net_sbr = [];
	  
	  let dt_grs_bd = [];
	  let dt_net_bd = [];
	  
	  let dt_grss_sgt = [];	  
	  let dt_nett_sgt = [];
	  
	  let dt_grss_sbr = [];	  
	  let dt_nett_sbr = [];
	  
	  let dt_grss_bd = [];	  
	  let dt_nett_bd = [];
	  
	  let dt_datee = [];
	  
	  
	    
	  this.per_area_chart_options["title"]["text"] = "Net Per Area";
      this.per_area_chart_options["caption"]["text"] = formatDate(this.start_dateControl.value, 'd MMM y', 'en-US') + " - " + formatDate(this.end_dateControl.value, 'd MMM y', 'en-US');
	  
	  // console.log("Brp well: "+dt_well);
	  // console.log("Tgl Brp: "+formatDate('2023-03-12T00:00:00+08:00', "dd-MMM-yy", "en-US"));
	  // console.log("Tgl Brp: "+res["data"].map(d => d["date"]));
	  
	  
	  for (var i = 0; i < tgl.length; i++){
			if(well[i].includes("NKL")){
				well_sgt[o] = well[i];
				g_sgt[o] = gross[i];
				n_sgt[o] = net[i];
				tgl_sgt[o] = tgl[i];
				
				o++;
			}
			else if(well[i].includes("SKL")){
				well_sgt[o] = well[i];
				g_sgt[o] = gross[i];
				n_sgt[o] = net[i];
				tgl_sgt[o] = tgl[i];
				
				o++;
			}
			else if(well[i].includes("ANG")){
				well_sgt[o] = well[i];
				g_sgt[o] = gross[i];
				n_sgt[o] = net[i];
				tgl_sgt[o] = tgl[i];
				
				o++;
			}
			else if(well[i].includes("TJU")){
				well_sgt[o] = well[i];
				g_sgt[o] = gross[i];
				n_sgt[o] = net[i];
				tgl_sgt[o] = tgl[i];
				
				o++;
			}
			
			else if(well[i].includes("LSE")){
				well_sbr[k] = well[i];
				g_sbr[k] = gross[i];
				n_sbr[k] = net[i];
				tgl_sbr[k] = tgl[i];
				
				k++;
			}
			else if(well[i].includes("MRA")){
				well_sbr[k] = well[i];
				g_sbr[k] = gross[i];
				n_sbr[k] = net[i];
				tgl_sbr[k] = tgl[i];
				
				k++;
			}
			else if(well[i].includes("MT")){
				well_sbr[k] = well[i];
				g_sbr[k] = gross[i];
				n_sbr[k] = net[i];
				tgl_sbr[k] = tgl[i];
				
				k++;
			}
			else if(well[i].includes("NNY")){
				well_sbr[k] = well[i];
				g_sbr[k] = gross[i];
				n_sbr[k] = net[i];
				tgl_sbr[k] = tgl[i];
				
				k++;
			}
		
			else if(well[i].includes("SBJ")){
				well_bd[q] = well[i];
				g_bd[q] = gross[i];
				n_bd[q] = net[i];
				tgl_bd[q] = tgl[i];
				
				q++;
			}
			// console.log("Nilai nya: "+i+". "+tgl[i]+" - "+well[i]+" - "+g[i]+" - "+n[i]);
			// console.log("sgt "+tgl[i]+" - Gross: "+g_sgt[i]+", Net: "+n_sgt[i]);
			// console.log("nilai grss: "+i+". "+dt_grs[i]);
		
		}
		
		
		// SGT
		for(o = 0; o <= well_sgt.length; o++){
			// console.log("Dt sgt: "+o+". "+tgl_sgt[o]+" - "+well_sgt[o]+" - "+g_sgt[o]+" - "+n_sgt[o]);
			
			if (tanggal == tgl_sgt[o]){
				g1_sgt[o] = g1_sgt[o-1] + g_sgt[o];
				n1_sgt[o] = n1_sgt[o-1] + n_sgt[o];
				
				// console.log("Masuk if kah ? "+tanggal+" - "+g1[y])
				tg_sgt[o] = tgl_sgt[o];
			}
			else{
				// console.log("nilai g1_sgt: "+g1_sgt[o-1]);		
				dt_grs_sgt[w] = [tg_sgt[o-1], g1_sgt[o-1]];
				dt_net_sgt[w] = [tg_sgt[o-1], n1_sgt[o-1]];
				dt_date[w] = tg_sgt[o-1];
				
				w++;
				
				tanggal = tgl_sgt[o];
				g1_sgt[o] = g_sgt[o];
				n1_sgt[o] = n_sgt[o];
				
				// console.log("nilai tg_sgt: "+tg_sgt[o-1]);
			}
		}
		// console.log("nilai well_sgt: "+well_sgt.length);
		// console.log("nilai dt_grs: "+dt_grs.length);
		// console.log("nilai tanggal: "+tanggal);
		// console.log("nilai w: "+w);
		// console.log("nilai dt_grs: "+dt_grs_sgt);
		
		
		
		// SBR
		for(k = 0; k <= well_sbr.length; k++){
			// console.log("Dt sgt: "+o+". "+tgl_sgt[o]+" - "+well_sgt[o]+" - "+g_sgt[o]+" - "+n_sgt[o]);
			
			if (tanggal == tgl_sbr[k]){
				g1_sbr[k] = g1_sbr[k-1] + g_sbr[k];
				n1_sbr[k] = n1_sbr[k-1] + n_sbr[k];
								
				tg_sbr[k] = tgl_sbr[k];
				
				// console.log("nilai tgl: "+tg_sbr[o])
				// console.log("nilai grs: "+g1_sbr[o])
			}
			else{
				// console.log("nilai g1_sbr: "+g1_sbr[k-1]);
				dt_grs_sbr[p] = [tg_sbr[k-1], g1_sbr[k-1]];
				dt_net_sbr[p] = [tg_sbr[k-1], n1_sbr[k-1]];
				dt_date[p] = tg_sbr[k-1];
				
				p++;
				
				tanggal = tgl_sbr[k];
				g1_sbr[k] = g_sbr[k];
				n1_sbr[k] = n_sbr[k];
				
				// console.log("nilai tg_sgt: "+tg_sgt[o-1]);
			}
		}
		
		
		
		// BD
		for(q = 0; q <= well_bd.length; q++){
			// console.log("Dt sgt: "+o+". "+tgl_sgt[o]+" - "+well_sgt[o]+" - "+g_sgt[o]+" - "+n_sgt[o]);
			
			if (tanggal == tgl_bd[q]){
				g1_bd[q] = g1_bd[q-1] + g_bd[q];
				n1_bd[q] = n1_bd[q-1] + n_bd[q];
								
				tg_bd[q] = tgl_bd[q];
				
				// console.log("nilai tgl: "+tg_sbj[q])
				// console.log("nilai grs: "+g1_sbj[q])
			}
			else{
				// console.log("nilai g1_sbj: "+g1_sbj[q-1]);
				dt_grs_bd[j] = [tg_bd[q-1], g1_bd[q-1]];
				dt_net_bd[j] = [tg_bd[q-1], n1_bd[q-1]];
				dt_date[j] = tg_bd[q-1];
				
				j++;
				
				tanggal = tgl_bd[q];
				g1_bd[q] = g_bd[q];
				n1_bd[q] = n_bd[q];
				
				// console.log("nilai tg_sgt: "+tg_sgt[o-1]);
			}
		}
		
		
		var y = 0;
		for (var x = 1; x <= dt_grs_sgt.length; x++){
			if (dt_grs_sgt[x] != null){
				dt_datee[y] = dt_date[x];
				dt_grss_sgt[y] = dt_grs_sgt[x];
				dt_nett_sgt[y] = dt_net_sgt[x];
				
				dt_grss_sbr[y] = dt_grs_sbr[x];
				dt_nett_sbr[y] = dt_net_sbr[x];
				
				dt_grss_bd[y] = dt_grs_bd[x];
				dt_nett_bd[y] = dt_net_bd[x];
				// console.log("nilai grss2: "+dt_datee);
				y++;
			}
			else{
				// console.log("nilai grss3: "+dt_grss[x])
			}
		}
		// console.log("nilai date out: "+dt_date);
		// console.log("nilai grss out: "+dt_grs_sbr);
		// console.log("nilai nett out: "+dt_net_sbj);
		
		
		
		
		
		
		
		
		// -- FIXX --
		this.per_area_chart_options["xAxis"][0]["categories"] = dt_datee;
		this.per_area_chart_options["series"][0]["data"] = dt_nett_sgt;
		this.per_area_chart_options["series"][1]["data"] = dt_nett_sbr;
		this.per_area_chart_options["series"][2]["data"] = dt_nett_bd;
		// this.per_area_chart_options["series"][3]["data"] = dt_nett_sbr;
		// else if(well[i].includes("TJU")){
				// if (tanggal == tgl[i]){
					// g_sgt[i] = g_sgt[i-1] + gross[i];
					// n_sgt[i] = n_sgt[i-1] + net[i];
					
					// tg[i] = tgl[i];
					// dt_grs[i] = [tg[i], g_sgt[i]];
					// dt_net[i] = [tg[i], n_sgt[i]];
					// console.log("nilai grss: "+i+". "+dt_grs[i]);
				// }
				// else{
					// o = 0
					// tanggal = tgl[i]
					// g_sgt[i] = gross[i]
					// n_sgt[i] = net[i]
					
					// console.log("Masuk else kah ?")
				// }
				
			// }
	  
	  
	  
	        
	  
		Highcharts.chart(this.per_area_chart_el.nativeElement, this.per_area_chart_options);

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