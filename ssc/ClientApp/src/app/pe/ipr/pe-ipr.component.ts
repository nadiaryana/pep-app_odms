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
exporting(Highcharts);

import { MatSnackBar } from '@angular/material';

import { TitleService } from '../../navigation/title/title.service';
import { xFilterService } from '../../xfilter/xfilter.component';
import { CommonService } from '../../common.service';

@Component({
  selector: 'app-pe-ipr',
  templateUrl: './pe-ipr.component.html',
  styleUrls: ['./pe-ipr.component.scss']
})

export class PeIPRComponent {

    @ViewChild('ipr_chart_el', {static:true}) public ipr_chart_el: ElementRef;
    ipr_table_data = [];
    ipr_table_columns:string[] = ["status", "count"];

    ipr_chart_options:object = {
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
        gridLineWidth: 1,
        minorGridLineWidth: 0,
        labels: {
          step: 1,
        },
        //tickInterval: 500,
        //minorTickInterval: 'auto',
        //minorTicks: true,
        //minorTickWidth: 1,
        title: {
          text: '<strong>Flow Rate (bfpd)</strong>',
          useHTML: true,
        }
    }],
    yAxis: [{ // Primary yAxis
        labels: {
            format: '{value}',
            step: 1,
            style: {
                color: '#999999'
            }
        },
        title: {
          text: '<strong>Pressure (psi)</strong>',
          useHTML: true,
        },
    }],
    tooltip: {
        shared: true,
        headerFormat: null,
        pointFormat: '{series.name}: <b>{point.x:.2f} bfpd</b><br/>',
    },
    legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
        backgroundColor:
            Highcharts.defaultOptions.legend.backgroundColor || // theme
            'rgba(255,255,255,0.25)'
    },
    series: [{
        name: 'Vogel',
        type: 'line',
        yAxis: 0,
        data: [],
        color: '#00B050',
        showInLegend: true
    }, {
        name: 'Fertkovich',
        type: 'line',
        yAxis: 0,
        data: [],
        color: '#C55A11',
        showInLegend: true
    }, {
        name: 'Wiggins',
        type: 'line',
        yAxis: 0,
        data: [],
        color: '#4472C4',
        showInLegend: true
    }, {
      name: null,
      type: 'line',
      yAxis: 0,
      dashStyle: 'ShortDash',
      data: [],
      color: '#000000',
      showInLegend: false
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
  @ViewChild('datePicker', {static: true}) datePicker: MatDatepicker<any>;
  dateControl = new FormControl(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()-1));
  dateInput = this.dateControl.value.toLocaleDateString("en-US", { month:"short", year:"numeric", day:"numeric" });

  well_xSelected = [];
  isLoadingResults:boolean = false;

  top:number;
  mid:number;
  bottom:number;

  gross:number;
  net:number;
  wc:number;
  sgmix:number;

  dfl:number;
  pwf:number;
  sfl:number;
  ps:number;

  vogel:number;
  fetkovich:number;
  wiggins:number;

  constructor(
    private http: HttpClient,
    private titleService: TitleService,
    private xfilterService: xFilterService,
    private commonService: CommonService,
    ) { }

  ngOnInit(){

    this.titleService.titleSource.next({
      title: "Inflow Performance Relationship", 
      breadcrumbs: [
        {label: 'Petroleum Engineering', routerLink: ''}, 
        {label: 'IPR', routerLink: ''}
      ]}
    );

    this.xfilterService.filter.subscribe(res => {
      if(res) this.getColumnValues(res);
    })
    this.xfilterService.selected.subscribe(res => {
      this[res["column"] + "_xSelected"] = res["selected"];
      this.refresh_IPR();
    })
    
    this.dateControl.valueChanges.subscribe(r => {
      this.refresh_IPR();
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

    return this.commonService.getGridData("/api/pe/daily", "well", "asc", 0, 0, "", columnfilter, "well").pipe(map((res) => {
      return res;
    })).subscribe(res => {
      this.xfilterService.updateItems({column: "well", items: res.items});
    }, () => {
      
    });;
  }

  dateChange(evt) {
    this.dateInput = evt.value.toLocaleDateString("en-US", { month:"short", year:"numeric", day:"numeric" });
  }

  refresh_IPR() {
    let params = new HttpParams();
    params = params.append("date", this.dateControl.value.toISOString());
    for(const w of this.well_xSelected) {
      params = params.append("well", w);
      console.log(w);
    }
    
    this.http.get('/api/pe/ipr', {params: params}).subscribe(res => {

      this.top = res["daily"]["top"];
      this.mid = res["daily"]["mid"];
      this.bottom = res["daily"]["bottom"];
      this.gross = res["daily"]["last_prod_gross"];
      this.net = res["daily"]["last_prod_net"];
      this.wc = res["daily"]["last_prod_wc"];
      this.sgmix = res["daily"]["sgmix"];
      this.dfl = res["daily"]["sonolog_dfl"];
      this.pwf = res["daily"]["pwf"];
      this.sfl = res["daily"]["sonolog_sfl"];
      this.ps = res["daily"]["ps"];
      this.vogel = res["ipr"][0]["vogel"];
      this.fetkovich = res["ipr"][0]["fetkovich"];
      this.wiggins = res["ipr"][0]["wiggins"];

      this.ipr_chart_options["title"]["text"] = this.well_xSelected.join(",");
      this.ipr_chart_options["caption"]["text"] = formatDate(this.dateControl.value, 'd MMM y', 'en-US');
      this.ipr_chart_options["series"][0]["data"] = res["ipr"].map(d => [d["vogel"], d["pwf"]]);
      this.ipr_chart_options["series"][1]["data"] = res["ipr"].map(d => [d["fetkovich"], d["pwf"]]);
      this.ipr_chart_options["series"][2]["data"] = res["ipr"].map(d => [d["wiggins"], d["pwf"]]);
      this.ipr_chart_options["series"][3]["data"] = [[0, this.pwf],[this.gross, this.pwf],[this.gross, 0]];

      var xmax = Math.max(
        this.ipr_chart_options["series"][0]["data"][0][0],
        this.ipr_chart_options["series"][1]["data"][0][0],
        this.ipr_chart_options["series"][2]["data"][0][0]);
      var intv;
      for(var p=0; p<=4; p++) {
        intv = 5*Math.pow(10, p);
        if(Math.floor(xmax/intv) < 20) break;
        intv = 10*Math.pow(10, p);
        if(Math.floor(xmax/intv) < 20) break;
        intv = 25*Math.pow(10, p);
        if(Math.floor(xmax/intv) < 20) break;
      }
      console.log(xmax+' '+intv);
      this.ipr_chart_options["xAxis"][0]["tickInterval"] = intv;

      Highcharts.chart(this.ipr_chart_el.nativeElement, this.ipr_chart_options);

    }, error => {

    }, () => {

    });
  }

}