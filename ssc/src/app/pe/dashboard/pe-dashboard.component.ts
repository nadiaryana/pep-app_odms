import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { MatDatepicker } from '@angular/material';
import { FormControl } from '@angular/forms';
import { merge, Observable, of as observableOf, forkJoin } from 'rxjs';
import { catchError, map, startWith, switchMap, debounceTime, take, mergeAll } from 'rxjs/operators';
import { Chart } from 'angular-highcharts';
import { Router, ActivatedRoute } from "@angular/router";
import * as Highcharts from 'highcharts';
import exporting from 'highcharts/modules/exporting';
exporting(Highcharts);

import { MatSnackBar } from '@angular/material';

import { CommonService } from '../../common.service';
import { TitleService } from '../../navigation/title/title.service';

@Component({
  selector: 'app-pe-dashboard',
  templateUrl: './pe-dashboard.component.html',
  styleUrls: ['./pe-dashboard.component.scss']
})

export class PeDashboardComponent {

  	@ViewChild('oil_chart_el', {static:true}) public oil_chart_el: ElementRef;
  	oil_chart_options:object = {
		chart: {
			plotBackgroundColor: null,
			plotBorderWidth: null,
			plotShadow: false,
			//type: "pie",
      style: {
        fontFamily: 'Roboto, Helvetica Neue, sans-serif'
      }
		},
		title: {
			text: "Oil Production"
		},
    xAxis: {
      categories: [],
      labels: {
       // autoRotation: [-90],
        step : 3,
      }
    },
    yAxis: {
      title: "Net (BOPD)"
    },
		tooltip: {
			pointFormat: "{series.name}: <b>{point.y:.2f}</b>"
		},
		plotOptions: {
			
		},
		series: [{
			name: "Operation",
			color: '#5b9bd5',
			data: []
		},{
      name: "SOT",
      color: '#ed7d31',
      data: []
    },{
      name: "Figure",
      color: '#a9d18e',
      data: []
    }]
	}

  @ViewChild('gas_chart_el', {static:true}) public gas_chart_el: ElementRef;
  gas_chart_options: object = {
    chart: {
      //type: 'bar',
      style: {
        fontFamily: 'Roboto, Helvetica Neue, sans-serif'
      }
    },
    title: {
      text : 'Gas Production'
    },
    xAxis: {
      categories: [],
      labels: {
       // autoRotation: [-90],
        step: 3,
      }
    },
    yAxis: {
      title: "Gas Rate (MMSCFD)"
    },
    tooltip: {
      pointFormat: "{series.name}: <b>{point.y:.2f}</b>"
    },
    legend: {
      reversed: true
    },
    plotOptions: {
      
    },
    series: [{
      name: "Gas",
      color: '#f4b183',
      data: []
    }]
  };

  @ViewChild('active_well_chart_el', { static: true }) public active_well_chart_el: ElementRef;
  active_well_chart_options: object = {
    chart: {
      //type: 'bar',
      style: {
        fontFamily: 'Roboto, Helvetica Neue, sans-serif'
      }
    },
    title: {
      text: 'Active Well History'
    },
    xAxis: {
      categories: [],
      labels: {
        type: "datetime",
        format:'{value:%d-%b-%y}',
        autoRotation: [-45]
      }
    },
    yAxis: {
      title: "null",
      tickInterval: 1
    },
    tooltip: {
      useHTML: true,
      headerFormat: '{point.x:%d %b %Y}',
      pointFormat: "</br>{series.name}: <b>{point.y}</b>"
    },
    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
          y: -10,
          format: '{point.y}',
          style: {
            fontWeight: 'small'
          },
        },
        marker: {
          lineWidth: 5,
          lineColor: null // inherit from series
        },
      }
      
    },
    legend: {
      enabled: false,
    },
    series: [{
      name: "Active Well",
      color: '#4fc3f7',
      data: []
    }]
  };

  @ViewChild('wellstat_chart_el', {static:true}) public wellstat_chart_el: ElementRef;
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
      text: "Well Status",
      align: 'left',
      floating: true,
    },
    tooltip: {
      pointFormat: "<b>{point.y} ({point.percentage:.1f}%)</b>"
    },
    legend: {
      enabled: true,
      align : 'center',
      itemStyle: {
        fontWeight: 'normal'
      }
      //align: 'right',
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

 /* @ViewChild('structprod_chart_el', {static:true}) public structprod_chart_el: ElementRef;
  structprod_chart_options: object = {
    chart: {
      type: 'bar',
      style: {
        fontFamily: 'Roboto, Helvetica Neue, sans-serif'
      }
    },
    title: {
      text: null//'Structure'
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
        text: 'Well Production',
        floating: true,
        align: 'left',
    },
    tooltip: {
      pointFormat: "{point.y} ({point.percentage:.1f}%)"
    },
    legend: {
      enabled: true,
      layout: 'vertical',
      align: 'left',
      verticalAlign: 'bottom',
      floating : true,
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
          format: "{point.percentage:.1f}%",
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
  } */

  @ViewChild('wellrank_chart_el', {static:true}) public wellrank_chart_el: ElementRef;
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
        autoRotation: [-45]
      }
    },
    tooltip: {
      pointFormat: "Oil : <strong>{point.y:.2f}</strong>"
    },
    yAxis: {
      title: null,
    },
    legend: {
      enabled: false
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
    series: []
  };

  @ViewChild('datePicker', {static: true}) datePicker: MatDatepicker<any>;
  dateControl = new FormControl(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()-1));
  dateInput = this.dateControl.value.toLocaleDateString("en-US", { month:"short", year:"numeric", day:"numeric" });
  
  active_wells_count:number;

  isLoadingSOT:boolean = false;
  isLoadingProduction:boolean = false;
  valueOperation:number;
  valueSOT:number;
  valueFigure:number;
  valueGas:number;
  
  constructor(
  	private http: HttpClient,
  	private titleService: TitleService,
    public commonService: CommonService,
    private route: ActivatedRoute,
    private router: Router,
  	) { }

  ngOnInit(){

  	this.titleService.titleSource.next({
          title: "Dashboard",
          icon : "dashboard",
      breadcrumbs: [
        {label: 'Petroleum Engineering', routerLink: ''}, 
        {label: 'Dashboard', routerLink: ''}
      ]}
    );
    
    this.dateControl.valueChanges.subscribe(r => {
      this.refresh_Production();
      //this.refresh_Gas();
      this.refresh_WellStatus();
     // this.refresh_StructureProduction();
     // this.refresh_WellProduction();
      this.refresh_WellRank();
      //this.refresh_SOT();
    })
    
    this.refresh_WellStatus();
  //  this.refresh_StructureProduction();
   // this.refresh_WellProduction();
    this.refresh_WellRank();
    this.refresh_Production();
    //this.refresh_Gas();
    //this.refresh_SOT();
  }

  dateChange(evt) {
    this.dateInput = evt.value.toLocaleDateString("en-US", { month:"short", year:"numeric", day:"numeric" });
  }

  refresh_SOT() {
    this.isLoadingSOT = true;
    this.http.get('/api/pe/production/ProdVolume', {params: {FacilityName:"SANGASANGA", date: this.dateControl.value.toISOString()}}).subscribe(res => {
      this.valueSOT = res["PeriodVolumeValue"];
      this.isLoadingSOT = false;
    }, error => {

    }, () => {

    });
  }

  refresh_Production() {
    this.isLoadingProduction = true;
    var end_date = this.dateControl.value;
    var start_date = new Date(end_date.getFullYear(), end_date.getMonth()-1, end_date.getDate());

    this.http.get('/api/pe/production', {params: {sort:'date', order:'asc', columnfilter: '{"date":[{"opr":"gte","val":"'+start_date.toISOString()+'","log":"and"},{"opr":"lte","val":"'+end_date.toISOString()+'","log":"and"}]}'}}).subscribe(res => {

      var categories = [];
      var series_operation = [];
      var series_sot = [];
      var series_figure = [];
      var series_gas = [];

      res["items"].map(d => { 
        var xdt = new Date(d.date);
        var dt = [xdt.getDate(), xdt.getMonth()+1, xdt.getFullYear().toString().substr(-2)].join("/");
        categories.push(dt);
        series_operation.push({name: dt, y: d.operation});
        series_sot.push({name: dt, y: d.sot});
        series_figure.push({name: dt, y: d.figure});
        series_gas.push({name: dt, y: d.gas/1000}); 

        if(this.dateControl.value.toLocaleDateString("id-ID") == new Date(d.date).toLocaleDateString("id-ID")) {
          this.valueSOT = d.sot;
          this.valueFigure = d.figure;
          this.valueGas = d.gas / 1000;
          this.valueOperation = d.operation;
        }
      });
      
      this.oil_chart_options["xAxis"]["categories"] = categories;
      this.oil_chart_options["series"][0]["data"] = series_operation;
      this.oil_chart_options["series"][1]["data"] = series_sot;
      this.oil_chart_options["series"][2]["data"] = series_figure;
      Highcharts.chart(this.oil_chart_el.nativeElement, this.oil_chart_options);

      this.gas_chart_options["xAxis"]["categories"] = categories;
      this.gas_chart_options["series"][0]["data"] = series_gas;
      Highcharts.chart(this.gas_chart_el.nativeElement, this.gas_chart_options);

     

      this.isLoadingProduction = false;

    }, error => {

    }, () => {

    });
  }

  refresh_Gas() {
    this.http.get('/api/pe/data', {params: {type:"structure_production", date: this.dateControl.value.toISOString()}}).subscribe(res => {

      var categories = [];
      var series = [{name: "Oil", data: []}, {name: "Gas", data: []}];
      res["data"].map(function(d) { 
        categories.push(d.structure);
        series[0]["data"].push(d.oil_count);
        series[1]["data"].push(d.gas_count);
      });
      this.gas_chart_options["xAxis"]["categories"] = categories;
      this.gas_chart_options["series"] = series;
      Highcharts.chart(this.gas_chart_el.nativeElement, this.gas_chart_options);
      
    }, error => {

    }, () => {

    });
  }

  refresh_WellStatus() {
    this.http.get('/api/pe/data', {params: {type:"well_status", date: this.dateControl.value.toISOString()}}).subscribe(res => {

      var series_data = [];
      res["data"].map(function (d) {
        d.count < 10 ? series_data.push({ name: d.status, y: d.count, dataLabels: { distance: 10 } }) : series_data.push({ name: d.status, y: d.count })
      });
      this.wellstat_chart_options["series"][0]["data"] = series_data;
      Highcharts.chart(this.wellstat_chart_el.nativeElement, this.wellstat_chart_options);
      this.active_wells_count = res["active_wells_count"];
      var act_well_series_data = [];
      var date_category = [];
      res["data_active_well"].map(function (daw) {
        var xdt = new Date(daw.dates);
        //var dt = [xdt.getDate(), xdt.getMonth() + 1, xdt.getFullYear().toString().substr(-2)].join("/");
        date_category.push(xdt);
        act_well_series_data.push(Math.round(daw.count));
      });
      this.active_well_chart_options["xAxis"]["categories"] = date_category;
      this.active_well_chart_options["series"][0]["data"] = act_well_series_data;
      Highcharts.chart(this.active_well_chart_el.nativeElement, this.active_well_chart_options);

    }, error => {

    }, () => {

    });
  }

 /* refresh_StructureProduction() {
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
      
    }, error => {

    }, () => {

    });
  }

  refresh_WellProduction() {
    this.http.get('/api/pe/data', {params: {type:"well_production", date: this.dateControl.value.toISOString()}}).subscribe(res => {

      var series_data = [];
      res["data"].map(function (d) {
        d.count < 10 ? series_data.push({ name: d.prod, y: d.count, dataLabels: { distance: 30 } }) : series_data.push({ name: d.prod, y: d.count })
      });
      this.wellprod_chart_options["series"][0]["data"] = series_data;
      Highcharts.chart(this.wellprod_chart_el.nativeElement, this.wellprod_chart_options);

    }, error => {

    }, () => {

    });
  }
  */
  refresh_WellRank() {
    this.http.get('/api/pe/data', { params: { type: "well_rank", date: this.dateControl.value.toISOString() } }).subscribe(res => {

      var categories = [];
      var series = [{ name: "Oil", color: "#A9D18E", data: [] }];
      res["data"].map(function (d, index) {
        if (index < 10) {
        categories.push(d.well);
          series[0]["data"].push(d.net);
        }
      });
      this.wellrank_chart_options["yAxis"].max = Math.max(...series[0]["data"]);
      this.wellrank_chart_options["xAxis"]["categories"] = categories;
      this.wellrank_chart_options["series"] = series;
      Highcharts.chart(this.wellrank_chart_el.nativeElement, this.wellrank_chart_options);
      
    }, error => {

    }, () => {

    });
  }

}
