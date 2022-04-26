import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
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
import { CommonService } from '../../common.service';

@Component({
  selector: 'app-pe-activewells',
  templateUrl: './pe-activewells.component.html',
  styleUrls: ['./pe-activewells.component.scss']
})

export class PeActiveWellsComponent {

  	@ViewChild('wellstat_chart_el', {static:true}) public wellstat_chart_el: ElementRef;
  	wellstat_table_data = [];
  	wellstat_table_columns:string[] = ["status", "count"];

  	wellstat_chart_options:object = {
		chart: {
			plotBackgroundColor: null,
			plotBorderWidth: null,
			plotShadow: false,
			type: "pie",
      style: {
        fontFamily: 'Roboto, Helvetica Neue, sans-serif'
      }
		},
		title: {
			text: "Well Status"
		},
		tooltip: {
			pointFormat: "<b>{point.percentage:.1f}%</b>"
		},
    legend: {
      enabled: true,
      layout: 'horizontal',
      itemStyle: {
        fontWeight: 'normal'
      },
      align : 'left'
      //align: 'right',
    },
		plotOptions: {
			pie: {
				allowPointSelect: true,
				cursor: "pointer",
        showInLegend: true,
				dataLabels: 		{
					enabled: true,
          distance: -30,
					format: "{point.y}",
          style: {
            fontWeight: 'normal'
          }
				}
			}
		},
		series: [{
			type: "pie",
			name: "Status",
			colorByPoint: true,
			data: []
		}]
	}

  @ViewChild('structprod_chart_el', {static:true}) public structprod_chart_el: ElementRef;
  structprod_table_data = [];
  structprod_table_columns:string[] = ["structure", "oil_count", "gas_count"];

  structprod_chart_options: object = {
    chart: {
      type: 'bar',
      style: {
        fontFamily: 'Roboto, Helvetica Neue, sans-serif'
      }
    },
    title: {
      text: 'Structure'
    },
    xAxis: {
      categories: []
    },
    yAxis: {
      min: 0,
      title: null
    },
    legend: {
      enabled: true,
      layout: 'vertical',
      itemStyle: {
        fontWeight: 'normal'
      },
      align: 'right',
      verticalAlign: 'middle',
    },
    plotOptions: {
      bar: {
        dataLabels: {
          enabled: true,
          style: {
            fontWeight: 'normal'
          }
        }
      }
    },
    series: []
  };

  @ViewChild('wellprod_chart_el', {static:true}) public wellprod_chart_el: ElementRef;
    wellprod_table_data = [];
    wellprod_table_columns:string[] = ["prod", "count"];

    wellprod_chart_options:object = {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: "pie",
      style: {
        fontFamily: 'Roboto, Helvetica Neue, sans-serif'
      }
    },
    title: {
      text: "Well Production"
    },
    tooltip: {
      pointFormat: "{point.percentage:.1f}%"
    },
    legend: {
      enabled: true,
      layout: 'horizontal',
      itemStyle: {
        fontWeight: 'normal'
      }
      //align: 'right',
      //verticalAlign: 'middle',
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        showInLegend: true,
        dataLabels:     {
          enabled: true,
          distance: -30,
          format: "{point.y}",
          style: {
            fontWeight: 'normal'
          }
        }
      }
    },
    series: [{
      type: "pie",
      name: "Status",
      colorByPoint: true,
      data: []
    }]
  }

  @ViewChild('wellrank_chart_el', {static:true}) public wellrank_chart_el: ElementRef;
  wellrank_table_data = [];
  wellrank_table_columns:string[] = ["rank", "well", "net"];

  wellrank_chart_options: object = {
    chart: {
      type: 'column',
      style: {
        fontFamily: 'Roboto, Helvetica Neue, sans-serif'
      }
    },
    title: {
      text: 'Well Rank'
    },
    xAxis: {
      categories: [],
      labels: {
        autoRotation: [-90]
      }
    },
    yAxis: {
      title: null,
      ceiling:600,
    },
    legend: {
      enabled: false
    },
    plotOptions: {
      column: {
        dataLabels: {
          enabled: true,
          format: '{point.y:.2f}',
          rotation: '-90',
          x : 0,
          y :-18,
          style: {
            fontWeight: 'normal'
          }
        }
      }
    },
    series: []
  };

  @ViewChild('datePicker', {static: true}) datePicker: MatDatepicker<any>;
  dateControl = new FormControl(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()-1));
  dateInput = this.dateControl.value.toLocaleDateString("en-US", { month:"short", year:"numeric", day:"numeric" });
  
  constructor(
  	private http: HttpClient,
  	private titleService: TitleService,
    public commonService: CommonService,
  	) { }

  ngOnInit(){

  	this.titleService.titleSource.next({
      title: "Active Wells", 
      breadcrumbs: [
        {label: 'Petroleum Engineering', routerLink: ''}, 
        {label: 'Active Wells', routerLink: ''}
      ]}
    );
    
    this.dateControl.valueChanges.subscribe(r => {
      this.refresh_WellStatus();
      this.refresh_StructureProduction();
      this.refresh_WellProduction();
      this.refresh_WellRank();
    })
    
    this.refresh_WellStatus();
    this.refresh_StructureProduction();
    this.refresh_WellProduction();
    this.refresh_WellRank();
  }

  dateChange(evt) {
    this.dateInput = evt.value.toLocaleDateString("en-US", { month:"short", year:"numeric", day:"numeric" });
  }

  isFullWindow() {
    return this.commonService.isFullWindow();
  }

  refresh_WellStatus() {
    this.http.get('/api/pe/data', {params: {type:"well_status", date: this.dateControl.value.toISOString()}}).subscribe(res => {

      var series_data = [];
      res["data"].map(function(d) { series_data.push({name: d.status, y: d.count}) });
      this.wellstat_chart_options["series"][0]["data"] = series_data;
      Highcharts.chart(this.wellstat_chart_el.nativeElement, this.wellstat_chart_options);

      this.wellstat_table_data = res["data"];
    }, error => {

    }, () => {

    });
  }

  refresh_StructureProduction() {
    this.http.get('/api/pe/data', {params: {type:"structure_production", date: this.dateControl.value.toISOString()}}).subscribe(res => {

      var categories = [];
      var series = [{name: "Oil", color: "#A9D18E", data: []}, {name: "Gas", color: "#F4B183", data: []}];
      res["data"].map(function(d) { 
        categories.push(d.structure);
        series[0]["data"].push(d.oil_count);
        series[1]["data"].push(d.gas_count);
      });
      this.structprod_chart_options["xAxis"]["categories"] = categories;
      this.structprod_chart_options["series"] = series;
      Highcharts.chart(this.structprod_chart_el.nativeElement, this.structprod_chart_options);
      
      this.structprod_table_data = res["data"];
    }, error => {

    }, () => {

    });
  }

  refresh_WellProduction() {
    this.http.get('/api/pe/data', {params: {type:"well_production", date: this.dateControl.value.toISOString()}}).subscribe(res => {

      var series_data = [];
      res["data"].map(function(d) { series_data.push({name: d.prod, y: d.count}) });
      this.wellprod_chart_options["series"][0]["data"] = series_data;
      Highcharts.chart(this.wellprod_chart_el.nativeElement, this.wellprod_chart_options);

      this.wellprod_table_data = res["data"];
    }, error => {

    }, () => {

    });
  }

  refresh_WellRank() {
    this.http.get('/api/pe/data', {params: {type:"well_rank", date: this.dateControl.value.toISOString()}}).subscribe(res => {

      var categories = [];
      var series = [{name: "Oil", color: "#A9D18E", data: []}];
      res["data"].map(function(d) { 
        categories.push(d.well);
        series[0]["data"].push(d.net);
      });
      this.wellrank_chart_options["xAxis"]["categories"] = categories;
      this.wellrank_chart_options["series"] = series;
      Highcharts.chart(this.wellrank_chart_el.nativeElement, this.wellrank_chart_options);
      
      this.wellrank_table_data = res["data"];
    }, error => {

    }, () => {

    });
  }

}
