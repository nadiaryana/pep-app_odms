import { Component, OnInit, ElementRef, ViewChild, LOCALE_ID, Inject } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { MatDatepicker, MatDatepickerInput, MatDatepickerInputEvent} from '@angular/material';
import { FormControl } from '@angular/forms';
import { merge, Observable, of as observableOf, forkJoin } from 'rxjs';
import { catchError, map, startWith, switchMap, debounceTime, take, mergeAll } from 'rxjs/operators';
import { Chart } from 'angular-highcharts';
import { Router, ActivatedRoute } from "@angular/router";
import * as Highcharts from 'node_modules/highcharts';
import Export from 'highcharts/modules/exporting';
import Offline from 'highcharts/modules/offline-exporting';
// import { OfflineExport } from 'https://code.highcharts.com/modules/offline-exporting.js';
Offline(Highcharts);


import { MatSnackBar } from '@angular/material';

import { CommonService } from '../../common.service';
import { TitleService } from '../../navigation/title/title.service';
import { formatDate } from '@angular/common';


@Component({
  selector: 'app-pe-dashboard',
  templateUrl: './pe-dashboard.component.html',
  styleUrls: ['./pe-dashboard.component.scss']
})

export class PeDashboardComponent   {

  @ViewChild('oil_chart_el', { static: true }) public oil_chart_el: ElementRef;

  	oil_chart_options:object = {
      chart: {
      alignTicks: true,
			  plotBackgroundColor: null,
			  plotBorderWidth: null,
			  plotShadow: false,
        type: "spline",
        style: {
          fontFamily: 'Roboto, Helvetica Neue, sans-serif'
        }
	  },
	  exporting: {
        fallbackToExportServer: false
      },
	  title: {
			  text: "Oil Production"
      },
      subtitle: {
        text: "Oil Production"
      },
      xAxis: {
        categories: [],
        labels: {
          //type: "datetime",
          //format:'{value:%d-%b-%y}',
          rotation: [-45],
          step: 5,
          style: {
            fontSize: 10
          }
        },
        maxPadding: 0.5
      },
      yAxis: {
        title: {
        text: 'BOPD',
        style: {
          color: '#666666'
        }
      },
      labels: {
      formatter: function () {
        // Format angka agar tampil penuh (tanpa singkatan)
        return this.value.toLocaleString('id-ID'); // hasil: 1.000, 2.000, dst.
        }
      }
      },
		  tooltip: {
			  pointFormat: "{series.name}: <b>{point.y:.2f}</b>"
		  },
		  plotOptions: {
			
		  },
		  series: [{
        name: "SOT",
        color: '#ed7d31',
        data: [],
        zIndex: 1
		  },{
        name: "Operation",
        color: '#5b9bd5',
			  data: [],
         zIndex: 2
      },{
        name: "Figure",
        color: '#a9d18e',
        data: [],
         zIndex: 3
      }]
	}

  @ViewChild('gas_chart_el', {static:true}) public gas_chart_el: ElementRef;
  gas_chart_options: object = {
    chart: {
      type: 'spline',
      alignTicks: true,
      style: {
        fontFamily: 'Roboto, Helvetica Neue, sans-serif'
      }
    },
    title: {
      text : 'Gas Production & Sales'
    },
    subtitle: {
      text: "Gas Production"
    },
    xAxis: {
      categories: [],
      labels: {
        //type: "datetime",
        //format: '{value:%d-%b-%y}',
        rotation: [-45],
        step: 3,
        style: {
          fontSize : 10
        }
      },
      maxPadding: 0.5
    },
    yAxis: {
      title: {
        text: 'MMSCFD',
        style: {
          color: '#666666'
        }
      },
    },
    tooltip: {
      pointFormat: "{series.name}: <b>{point.y:.2f}</b>"
    },
    legend: {
      reversed: true
    },
    plotOptions: {
      
    },
    series: [
      {
        name: "Gas Production",
        color: '#f4b183',
        data: []
      },
      {
        name: "Gas Sales",
        color: '#e6e600',
        data: []
      },
    ]
  };
  

  @ViewChild('active_well_chart_el', { static: true }) public active_well_chart_el: ElementRef;
  
  active_well_chart_options: object = {
    chart: {
      type: 'spline',
      style: {
        fontFamily: 'Roboto, Helvetica Neue, sans-serif'
      }
    },
    title: {
      text: 'Active Well History'
    },
    subtitle: {
      text: "Active Well History"
    },
    time: {
      timezoneOffset: -8 * 60 // untuk GMT+8 (menggeser waktu agar tidak muncul GMT)
    },
    xAxis: {
      categories: [],
      labels: {
        formatter: function () {
          return Highcharts.dateFormat('%e %b %Y', this.value); 
        },
        autoRotation: [-45],
        style: {
          fontSize: 10
        }
      }
    },
    yAxis: {
     title: {
        text: 'Well',
        style: {
          color: '#666666'
        }
      },
      tickInterval: 1
    },
    tooltip: {
      useHTML: true,
      useUTC : false,
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
      color: '#008040',
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
    //title: {
    //  text: "Well Status",
    //  align: 'left',
    //  floating: true,
    //  },
    //subtitle: {
    //  text: "Well Status"
    //},
    title: {
      text: 'Well Status'
    },
    subtitle: {
      text: "Well Status"
    },
    tooltip: {
      pointFormat: "<b>{point.y} ({point.percentage:.1f}%)</b>"
    },
     legend: {
      layout: 'vertical',
      enabled: true,
      align : 'right',
      itemStyle: {
        fontWeight: 'normal',
        fontSize: '18px'
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
    subtitle: {
      text: "Well Rank"
    },
    xAxis: {
      categories: [],
      labels: {
        autoRotation: [-45],
        style: {
          fontSize: 10
        }
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
  }
  
  @ViewChild('production_chart_el', { static: true }) public production_chart_el: ElementRef;
  	production_chart_options:object = {
      chart: {
		alignTicks: true,
		plotBackgroundColor: null,
		plotBorderWidth: null,
		plotShadow: false,
        type: "column",
        style: {
          fontFamily: 'Roboto, Helvetica Neue, sans-serif'
        }
	  },
	  exporting: {
        fallbackToExportServer: false
      },
	  title: {
			  text: "Realisasi Production Field"
      },
      subtitle: {
        text: "Realisasi Production Field"
      },
      xAxis: {
        categories: ['YTD', 'MTD', 'Last 7 Days'],
		crosshair: true,
        labels: {
          //type: "datetime",
          //format:'{value:%d-%b-%y}',
          // rotation: [-45],
          // step: 5,
          // style: {
            // fontSize: 10
          // }
        },
        maxPadding: 0.5
      },
      yAxis: {
        title: "Net (BOPD)",
		min: 4000
      },
	  tooltip: {
		  pointFormat: "{series.name}: <b>{point.y:.0f}</b>"
	  },
	  plotOptions: {
      column: {
        dataLabels: {
          enabled: true,
          format: '{point.y:.0f}',
          rotation: 0,
          x: 0,
          y: 0,
          
        }
      },
	  series: {
		pointWidth: 50,
		borderRadius: 10
      }
     
	  },
	  series: [{
		  name: "Operation",
		  color: '#5b9bd5',
		  data: []
	  }
	  ,{
		name: "SOT",
		color: '#ed7d31',
		data: []
	  }
	  ]
	}
		
	@ViewChild('perform_production_chart_el', { static: true }) public perform_production_chart_el: ElementRef;
  	perform_production_chart_options:object = {
      chart: {
		type: "column",
        style: {
          fontFamily: 'Roboto, Helvetica Neue, sans-serif'
        }
	  },
	  exporting: {
        fallbackToExportServer: false
      },
	  title: {
			  text: "Perform Production Weekly"
      },
      subtitle: {
        text: "Perform Production Weekly"
      },
      xAxis: {
        categories: ['Operations (BOPD)', 'SOT (BOPD)', 'Operations (BOPD)', 'SOT (BOPD)'],
		crosshair: true,
        // maxPadding: 0.5
		plotBands: [{
            color: 'rgba(255, 75, 66, 0.07)',
            from: 1.5,
            to: 4,
            label: {
                text: 'Current Week'
            }
        },{
            color: 'rgba(255, 75, 66, 0.03)',
            from: -1,
            to: 1.5,
            label: {
                text: 'Last Week'
            }
        }],
      },
      yAxis: {
        title: "BOPD",
		min: 1000,
		stackLabels: {
            enabled: true,
			// format: '{:.0f}'
        }
      },
	  // legend: {
        // align: 'left',
        // x: 70,
        // verticalAlign: 'top',
        // y: 70,
        // floating: true,
        // backgroundColor:
            // Highcharts.defaultOptions.legend.backgroundColor || 'white',
        // borderColor: '#CCC',
        // borderWidth: 1,
        // shadow: false
	  // },
	  tooltip: {
		  headerFormat: "<b>{point.x}</b><br/>",
		  pointFormat: "{series.name}: <b>{point.y:.0f}</b>"
	  },
	  plotOptions: {
      column: {
		stacking: 'normal',
        dataLabels: {
          enabled: true,
          format: '{point.y:.0f}',
          
        }		
		},     
	  },
	  series: [{
		  name: "SBJ Borderless",
		  // color: '#5b9bd5',
		  data: []
	  }
	  ,{
		name: "NKL Borderless", 
		// color: '#ed7d31',
		data: []
	  }
	  ,{
		name: "SBJ",
		// color: '#5b9bd5',
		data: []
	  }
	  ,{
		name: "sgt",
		// color: '#ed7d31',
		data: []
	  }
	  ,{
		name: "sbr",
		// color: '#5b9bd5',
		data: []
	  }
	  ]
	}
	
	@ViewChild('seven_production_chart_el', { static: true }) public seven_production_chart_el: ElementRef;
  	seven_production_chart_options:object = {
      chart: {
		alignTicks: true,
		plotBackgroundColor: null,
		plotBorderWidth: null,
		plotShadow: false,
        type: "column",
        style: {
          fontFamily: 'Roboto, Helvetica Neue, sans-serif'
        }
	  },
	  exporting: {
        fallbackToExportServer: false
      },
	  title: {
		text: "SOT & Operation Production Last 7 days"
      },
      subtitle: {
        text: "SOT & Operation Production Field"
      },
      xAxis: {
        categories: [],
		crosshair: true,
        // labels: {
          // type: "datetime",
          // format:'{value:%d-%b-%y}',
          // rotation: [-45],
          // step: 5,
          // style: {
            // fontSize: 10
          // }
        // },
        // maxPadding: 0.5
      },
      yAxis: {
        title: "(BOPD)",
		min: 4000
      },
	  tooltip: {
		  pointFormat: "{series.name}: <b>{point.y:.0f}</b>"
	  },
	  plotOptions: {
      column: {
        dataLabels: {
          enabled: true,
          format: '{point.y:.0f}',
          rotation: 0,
          x: 0,
          y: 0,
          
        }
      },
	  series: {
		pointWidth: 50,
		borderRadius: 10
      }
     
	  },
	  series: [{
		  name: "Operation",
		  color: '#5b9bd5',
		  data: []
	  }
	  ,{
		name: "SOT",
		color: '#ed7d31',
		data: []
	  },{
		  name: "RKAP",
		  type: 'spline',
		  color: '#151515',
		  data: []
	  }
	  ,{
		name: "WP&B",
		type: 'spline',
		color: '#77B0AA',
		data: []
	  }
	  ]
	}
	

  @ViewChild('datePicker', { static: true }) datePicker: MatDatepicker<any>;
  @ViewChild('datePicker2', { static: true }) datePicker2: MatDatepicker<any>;
  @ViewChild('datePicker3', { static: true }) datePicker3: MatDatepicker<any>;

  yesterday: Date = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
  dateControl = new FormControl(new Date(this.yesterday.setDate(this.yesterday.getDate() - 1)));
  dateControl2 = new FormControl(new Date());
  dateControl3 = new FormControl(new Date());
  dateInput = this.dateControl.value.toLocaleDateString("id-ID", { month:"short", year:"numeric", day:"numeric" });
  dateInput2 = this.dateControl2.value.toLocaleDateString("id-ID", { month: "short", year: "numeric", day: "numeric" });
  dateInput3 = this.dateControl3.value.toLocaleDateString("id-ID", { month: "short", year: "numeric", day: "numeric" });
  
  active_wells_count: number;
  dateActiveWell: string;

  isLoadingSOT:boolean = false;
  isLoadingProduction:boolean = false;
  valueOperation:number;
  valueSOT:number;
  valueFigure:number;
  valueGas: number;
  valueGasSales: number;

  interval: number;
  dateDiff: number;

  constructor(
  	private http: HttpClient,
  	private titleService: TitleService,
    public commonService: CommonService,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(LOCALE_ID) public locale: string
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
    
    //this.dateControl.valueChanges.subscribe(r => {
  
    //  this.refresh_Production();
    //  this.refresh_WellStatus();
    //  this.refresh_WellRank();
    //})

    setTimeout(() => {
      this.dateInput = this.dateControl.value.toLocaleDateString("id-ID", { month: "short", year: "numeric", day: "numeric" });
      this.refresh_Production();

      this.dateControl3 = new FormControl(new Date(this.dateControl.value));
      this.dateControl2 = new FormControl(new Date(new Date(this.dateControl.value).getFullYear(), new Date(this.dateControl.value).getMonth() - 1, new Date(this.dateControl.value).getDate()));

      this.intervalCount();

      var end_date = this.dateControl3.value;
      var start_date = new Date(end_date.getFullYear(), end_date.getMonth() - 1, end_date.getDate());
      this.dateInput2 = start_date.toLocaleDateString("id-ID", { month: "short", year: "numeric", day: "numeric" });
      this.dateInput3 = end_date.toLocaleDateString("id-ID", { month: "short", year: "numeric", day: "numeric" });

      this.refresh_Production2();
      this.refresh_Production3();
      this.refresh_Production4();
      this.refresh_Production5();
      this.refresh_WellStatus();
      this.refresh_WellRank();
    }, 500)

  }

  intervalCount() {
    this.dateDiff = new Date(this.dateControl3.value).valueOf() - new Date(this.dateControl2.value).valueOf();
    this.dateDiff = Math.ceil(this.dateDiff / (1000 * 3600 * 24));
    this.interval = Math.ceil(this.dateDiff / 90);
  }

  dateChange(evt) {
    this.dateInput = evt.value.toLocaleDateString("id-ID", { month: "short", year: "numeric", day: "numeric" });

    this.refresh_Production();

    this.dateControl3 = new FormControl(new Date(this.dateControl.value));
    this.dateControl2 = new FormControl(new Date(new Date(this.dateControl.value).getFullYear(), new Date(this.dateControl.value).getMonth() - 1, new Date(this.dateControl.value).getDate()));

    this.intervalCount();

    var end_date = this.dateControl3.value;
    var start_date = new Date(end_date.getFullYear(), end_date.getMonth() - 1, end_date.getDate());
    this.dateInput2 = start_date.toLocaleDateString("id-ID", { month: "short", year: "numeric", day: "numeric" });
    this.dateInput3 = end_date.toLocaleDateString("id-ID", { month: "short", year: "numeric", day: "numeric" });

    this.refresh_Production2();
    this.refresh_Production3();
    this.refresh_Production4();
    this.refresh_Production5();
    this.refresh_WellStatus();
    this.refresh_WellRank();
  }

  dateChange2(evt) {
    var end_date = this.dateControl3.value;
    var start_date = this.dateControl2.value;
    this.dateInput2 = start_date.toLocaleDateString("id-ID", { month: "short", year: "numeric", day: "numeric" });
    this.dateInput3 = end_date.toLocaleDateString("id-ID", { month: "short", year: "numeric", day: "numeric" });

    this.intervalCount();
    this.refresh_Production2();
    this.refresh_Production3();
    this.refresh_Production4();
    this.refresh_Production5();
    this.refresh_WellStatus();
    this.refresh_WellRank();
  }

  dateChange3(evt) {
    var end_date = this.dateControl3.value;
    var start_date = this.dateControl2.value;
    this.dateInput2 = start_date.toLocaleDateString("id-ID", { month: "short", year: "numeric", day: "numeric" });
    this.dateInput3 = end_date.toLocaleDateString("id-ID", { month: "short", year: "numeric", day: "numeric" });

    this.intervalCount();
    this.refresh_Production2();
    this.refresh_Production3();
    this.refresh_Production4();
    this.refresh_Production5();
    this.refresh_WellStatus();
    this.refresh_WellRank();
  }



  refresh_Production() {
    this.isLoadingProduction = true;
   
    var end_date = this.dateControl.value;
    var start_date = new Date(end_date.getFullYear(), end_date.getMonth() - 1, end_date.getDate());
   
    this.http.get('/api/pe/production', { params: { sort: 'date', order: 'asc', pagesize: '10000', columnfilter: '{"date":[{"opr":"gte","val":"'+start_date.toISOString()+'","log":"and"},{"opr":"lte","val":"'+end_date.toISOString()+'","log":"and"}]}'}}).subscribe(res => {

      var categories = [];
      var series_operation = [];
      var series_sot = [];
      var series_figure = [];
      var series_gas = [];
      var series_gas_sales = [];

      res["items"].map(d => {
        console.log("this" + d);
        var xdt = new Date(d.date);
        //var dt = [xdt.getDate(), xdt.getMonth() + 1, xdt.getFullYear().toString().substr(-2)].join("-");
        var dt = [xdt.getDate(), xdt.toLocaleString('en', { month: 'short' }), xdt.getFullYear().toString().substr(-2)].join("-");
        //var dt = xdt;
        //var dt = new Date(xdt.getFullYear(), xdt.getMonth(), xdt.getDate());
        categories.push(dt);
        series_operation.push({name: dt, y: d.operation});
        series_sot.push({name: dt, y: d.sot});
        series_figure.push({name: dt, y: d.figure});  
        series_gas.push({ name: dt, y: d.gas / 1000 });
        series_gas_sales.push({ name: dt, y: d.gas_sales / 1000 });
        console.log(this.dateControl.value.toLocaleDateString("id-ID"));
        console.log(new Date(d.date).toLocaleDateString("id-ID"));

        //Check data (Daily upload) on database
        //if value is 0. Data not uploaded yet.
        if (this.dateControl.value.toLocaleDateString("id-ID") == new Date(d.date).toLocaleDateString("id-ID")) {
          this.valueSOT = d.sot;
          this.valueFigure = d.figure;
          this.valueGas = d.gas;
          this.valueGasSales = d.gas_sales;
          this.valueOperation = d.operation;
        } else {
          this.valueSOT = 0;
          this.valueFigure = 0;
          this.valueGas = 0;
          this.valueGasSales = 0;
          this.valueOperation = 0;
        }
      });

      this.oil_chart_options["xAxis"]["tickInterval"] = this.interval;
      this.oil_chart_options["xAxis"]["categories"] = categories;
      this.oil_chart_options["series"][0]["data"] = series_operation;
      this.oil_chart_options["series"][1]["data"] = series_sot;
      this.oil_chart_options["series"][2]["data"] = series_figure;
      Highcharts.chart(this.oil_chart_el.nativeElement, this.oil_chart_options);

      this.gas_chart_options["xAxis"]["tickInterval"] = this.interval;
      this.gas_chart_options["xAxis"]["categories"] = categories;
      this.gas_chart_options["series"][0]["data"] = series_gas;
      this.gas_chart_options["series"][1]["data"] = series_gas_sales;
      Highcharts.chart(this.gas_chart_el.nativeElement, this.gas_chart_options);

     

      this.isLoadingProduction = false;

    }, error => {

    }, () => {

    });
  }

  refresh_Production2() {
    this.isLoadingProduction = true;

    var start_date = this.dateControl2.value;
    var end_date = this.dateControl3.value;

    this.http.get('/api/pe/production', { params: { sort: 'date', order: 'asc', pagesize: '10000', columnfilter: '{"date":[{"opr":"gte","val":"' + start_date.toISOString() + '","log":"and"},{"opr":"lte","val":"' + end_date.toISOString() + '","log":"and"}]}' } }).subscribe(res => {

      var categories = [];
      var series_operation = [];
      var series_sot = [];
      var series_figure = [];
      var series_gas = [];
      var series_gas_sales = [];

      res["items"].map(d => {
        console.log("this" + d);
        var xdt = new Date(d.date);
        //var dt = [xdt.getDate(), xdt.getMonth() + 1, xdt.getFullYear().toString().substr(-2)].join("-");
        var dt = [xdt.getDate(), xdt.toLocaleString('en', { month: 'short' }), xdt.getFullYear().toString().substr(-2)].join("-");
        //var dt = xdt;
        //var dt = new Date(xdt.getFullYear(), xdt.getMonth(), xdt.getDate());
        categories.push(dt);
        series_operation.push({ name: dt, y: d.operation });
        series_sot.push({ name: dt, y: d.sot });
        series_figure.push({ name: dt, y: d.figure });
        series_gas.push({ name: dt, y: d.gas });
        series_gas_sales.push({ name: dt, y: d.gas_sales });
        console.log(this.dateControl.value.toLocaleDateString("id-ID"));
        console.log(new Date(d.date).toLocaleDateString("id-ID"));

        //Check data (Daily upload) on database
        //if value is 0. Data not uploaded yet.
        //if (this.dateControl.value.toLocaleDateString("id-ID") == new Date(d.date).toLocaleDateString("id-ID")) {
        //  this.valueSOT = d.sot;
        //  this.valueFigure = d.figure;
        //  this.valueGas = d.gas / 1000;
        //  this.valueGasSales = d.gas_sales / 1000;
        //  this.valueOperation = d.operation;
        //} else {
        //  this.valueSOT = 0;
        //  this.valueFigure = 0;
        //  this.valueGas = 0;
        //  this.valueGasSales = 0;
        //  this.valueOperation = 0;
        //}
      });

      this.oil_chart_options["subtitle"]["text"] = "( " + start_date.toLocaleDateString("id-ID", { month: "short", year: "numeric", day: "numeric" }) + " - " + end_date.toLocaleDateString("id-ID", { month: "short", year: "numeric", day: "numeric" }) + " )";
      this.oil_chart_options["xAxis"]["tickInterval"] = this.interval;
      this.oil_chart_options["xAxis"]["categories"] = categories;
      this.oil_chart_options["series"][0]["data"] = series_operation;
      this.oil_chart_options["series"][1]["data"] = series_sot;
      this.oil_chart_options["series"][2]["data"] = series_figure;
      Highcharts.chart(this.oil_chart_el.nativeElement, this.oil_chart_options);


      this.gas_chart_options["subtitle"]["text"] = "( " + start_date.toLocaleDateString("id-ID", { month: "short", year: "numeric", day: "numeric" }) + " - " + end_date.toLocaleDateString("id-ID", { month: "short", year: "numeric", day: "numeric" }) + " )";
      this.gas_chart_options["xAxis"]["tickInterval"] = this.interval;
      this.gas_chart_options["xAxis"]["categories"] = categories;
      this.gas_chart_options["series"][0]["data"] = series_gas;
      this.gas_chart_options["series"][1]["data"] = series_gas_sales;
      Highcharts.chart(this.gas_chart_el.nativeElement, this.gas_chart_options);



      /*this.isLoadingProduction = false;*/

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
    this.http.get('/api/pe/data', { params: { type: "well_status", date: this.dateControl2.value.toISOString(), end_date: this.dateControl3.value.toISOString() } }).subscribe(res => {
      
      var series_data = [];
      res["data"].map(function (d) {
        d.count < 10 ? series_data.push({ name: d.status, y: d.count, dataLabels: { distance: 10 } }) : series_data.push({ name: d.status, y: d.count })
		console.log(d.status+" : "+d.count);
      });
	  
      this.wellstat_chart_options["subtitle"]["text"] = "( " +  this.dateControl3.value.toLocaleDateString("id-ID", { month: "short", year: "numeric", day: "numeric" }) + " )";
      this.wellstat_chart_options["series"][0]["data"] = series_data;
      Highcharts.chart(this.wellstat_chart_el.nativeElement, this.wellstat_chart_options);
      
	  
	  //console.log("Nilai2: "+[series_data]);
	  
      
	  var act_well_series_data = [];
      var date_category = [];
      res["data_active_well"].map(function (daw) {
        console.log(new Date(new Date(daw.dates).getFullYear(), new Date(daw.dates).getMonth(), new Date(daw.dates).getDate()));
        var xdt = new Date(new Date(daw.dates).getFullYear(), new Date(daw.dates).getMonth(), new Date(daw.dates).getDate() + 1);
        //var dt = [xdt.getDate(), xdt.getMonth() + 1, xdt.getFullYear().toString().substr(-2)].join("/");
        date_category.push(xdt);
		//console.log("Ini apalagiii: "+date_category.push(xdt));
        act_well_series_data.push(Math.round(daw.count));
      });
	  
	  var length = act_well_series_data.length;
	  var active_well = 0;
	  var active_well_date = "";
	  
	  for(var x = 0; x < length ; x++){
		active_well = act_well_series_data[length-1];
		active_well_date = date_category[length-2];
	  }
	  
	  // this.active_wells_count = res["active_wells_count"];
	  this.active_wells_count = active_well;
	  
      // this.dateActiveWell = "( " +  active_well_date.toLocaleDateString("id-ID", { month: "short", year: "numeric", day: "numeric" }) + " )";
      this.dateActiveWell = formatDate(active_well_date, "dd MMM yyyy", "en-US");
      this.active_well_chart_options["subtitle"]["text"] = "( " + this.dateControl2.value.toLocaleDateString("id-ID", { month: "short", year: "numeric", day: "numeric" }) + " - " + this.dateControl3.value.toLocaleDateString("id-ID", { month: "short", year: "numeric", day: "numeric" }) + " )";
      
      this.active_well_chart_options["xAxis"]["categories"] = date_category;
      this.active_well_chart_options["series"][0]["data"] = act_well_series_data;
      Highcharts.chart(this.active_well_chart_el.nativeElement, this.active_well_chart_options);
	
      this.isLoadingProduction = false;
	  console.log("well aktif: "+active_well);
	  // console.log("well tdk aktif: "+res["inactive_wells_count"]);
	  console.log("Tgl Berapa ini: "+active_well_date);
	  console.log("Ini apalagi: "+act_well_series_data);
	  
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
      this.wellrank_chart_options["subtitle"]["text"] = "( " + this.dateControl3.value.toLocaleDateString("id-ID", { month: "short", year: "numeric", day: "numeric" }) + " )";
      this.wellrank_chart_options["yAxis"].max = Math.max(...series[0]["data"]);
      this.wellrank_chart_options["xAxis"]["categories"] = categories;
      this.wellrank_chart_options["series"] = series;
      Highcharts.chart(this.wellrank_chart_el.nativeElement, this.wellrank_chart_options);
      
    }, error => {

    }, () => {

    });
  }
  
  refresh_Production3() {
    this.isLoadingProduction = true;

    // var start_date = this.dateControl2.value;
	const month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
	var datee = this.dateControl3.value.getFullYear();
	var month_mtd = month[this.dateControl3.value.getMonth()];
	// var day_get = day[this.dateControl3.value.getDay()];
	var tahun = datee-1;
	var tahunn = datee;
	var date = 'Jan 1 ' + tahunn + ' 00:00:00';
	var date_mtd = month_mtd + ' 1 ' + tahunn + ' 00:00:00';
	// var day = this.dateControl3.value-604800000;
	
    var start_date = formatDate(date, "dd-MMM-yy", "en-US");
    var end_date = this.dateControl3.value;
	console.log("Tgl Berapa: "+this.dateControl3.value);
	// console.log("Hari apa ini : "+day_get);
	console.log("datee Berapa: "+datee+" - tahun berapa: "+tahun);
	
    this.http.get('/api/pe/production', { params: { sort: 'date', order: 'asc', pagesize: '10000', columnfilter: '{"date":[{"opr":"gte","val":"' + 'Jan 1 ' + tahun + '","log":"and"},{"opr":"lte","val":"' + end_date.toISOString() + '","log":"and"}]}' } }).subscribe(res => {

      var categories = [];
      var series_operation = [];
      var series_sot = [];

      
	  var cat = res["items"].map(d => formatDate(d["date"], "dd-MMM-yy", "en-US"));
	  var opr = res["items"].map(d => d["operation"])
	  var sot = res["items"].map(d => d["sot"])
	  let opr_ytd = 0;
	  let sot_ytd = 0;
	  let opr_last_7 = 0;
	  let sot_last_7 = 0;
	  let opr_mtd = 0;
	  let sot_mtd = 0;
	  
	  
	  console.log("Berapa isinya: "+opr.length);
	  // console.log("Hari tagl berapa: "+cat1);
	  
	  
	  // *YTD*
	  let start_ytd = 0;
	  let ytd_length = 0;
	  
	  for (var y = 0; y < opr.length; y++){
		if (start_date == cat[y]){
			start_ytd = y;
			// console.log("tanggal: match "+start_date+" - "+cat[y]);
				
		  }
		  else{
			// console.log("tanggal: not match "+start_date+" - "+cat[y]);
		  }
		
		
		// console.log("operations: "+opr_ytd);
		// console.log("nilai operations YTD "+y+" : "+opr[y]+" - "+cat[y]+" - "+sot[y]);
	  }
	  
	  for (var y = start_ytd; y < opr.length; y++){
		opr_ytd = opr_ytd + opr[y];
		sot_ytd = sot_ytd + sot[y];
		ytd_length++;
		
		console.log("nilai operations ytd "+y+" : "+opr_ytd/ytd_length+" - "+cat[y]+" - "+sot_ytd/ytd_length+" - "+ytd_length);
	  }
	  
	  // *MTD*
	  var cek_tgl = formatDate(date_mtd, "dd-MMM-yy", "en-US");
	  var tgll = 0;
	  let code = opr.length;
	  let mtd_length = 0;
	  
	  for (var y = 0; y < opr.length; y++){
		if (cek_tgl == cat[y]){
			// console.log("tanggal: match "+cek_tgl+" - "+cat[y]);
			code = y;
			// opr_mtd = opr[y];
			// tgll = cat[y];			
		  }
		  else{
			// console.log("tanggal: not match");
		  }
	  }
	  
	  for (var y = code; y < opr.length; y++){
		opr_mtd = opr_mtd + opr[y];
		sot_mtd = sot_mtd + sot[y];
		mtd_length++;
		// console.log("operations: "+opr_mtd);
		console.log("nilai operations mtd "+y+" : "+opr[y]+" - "+cat[y]+" - "+sot[y]);
	  }
	  console.log("MTD length: "+mtd_length);
	  console.log("nilai rata operations mtd: "+opr_mtd/mtd_length);
	  console.log("nilai rata sot mtd: "+sot_mtd/mtd_length);
	  
	  
	  // *LAST 7 DAYS*
	  var dt_last_7 = opr.length - 7;
	  var day_1 = 0;
	  
	  if(cat[dt_last_7] == undefined){
		day_1 = 0;
	  }else{
		day_1 = cat[dt_last_7];
	  }
	  	  
	  console.log("nilai dt_last_7: "+dt_last_7);
	  for (var yy = dt_last_7; yy < opr.length; yy++){
		opr_last_7 = opr_last_7 + opr[yy];
		sot_last_7 = sot_last_7 + sot[yy];
		// console.log("operations 2: "+opr_last_7);
		console.log("nilai operations 7 "+yy+" : "+opr[yy]+" - "+cat[yy]+" - "+sot[yy]);
	  }
	  console.log("nilai operations 7: "+opr_last_7/7);
	  console.log("nilai sot 7: "+sot_last_7/7);
	  
	  	  
	  // for (var y = codee; y < opr.length; y++){
		// opr_mtd = opr_mtd + opr[y];
		// sot_mtd = sot_mtd + sot[y];
		// mtd_length++;
		
		// console.log("nilai operations mtd "+y+" : "+opr[y]+" - "+cat[y]+" - "+sot[y]);
	  // }
	  // console.log("MTD length: "+mtd_length);
	  // console.log("nilai rata operations mtd: "+opr_mtd/mtd_length);
	  // console.log("nilai rata sot mtd: "+sot_mtd/mtd_length);
	  
	  
	  
      this.production_chart_options["subtitle"]["text"] = "YTD : " + formatDate(date, 'd MMM y', 'en-US') + " - " + end_date.toLocaleDateString("id-ID", { month: "short", year: "numeric", day: "numeric" }) + "<br>MTD : " + formatDate(cek_tgl, 'd MMM y', 'id-ID') + " - " + end_date.toLocaleDateString("id-ID", { month: "short", year: "numeric", day: "numeric" }) + "<br>Last 7 Days : " + formatDate(day_1, 'd MMM y', 'id-ID') + " - " + end_date.toLocaleDateString("id-ID", { month: "short", year: "numeric", day: "numeric" });
      // this.production_chart_options["xAxis"]["tickInterval"] = this.interval;
      // this.production_chart_options["xAxis"]["categories"] = 1;
      this.production_chart_options["series"][0]["data"] = [opr_ytd/ytd_length, opr_mtd/mtd_length, opr_last_7/7];
      this.production_chart_options["series"][1]["data"] = [sot_ytd/ytd_length, sot_mtd/mtd_length, sot_last_7/7];
      Highcharts.chart(this.production_chart_el.nativeElement, this.production_chart_options);

    }, error => {

    }, () => {

    });
  }
  
  
  refresh_Production4() {
    this.isLoadingProduction = true;

    // var start_date = this.dateControl2.value;
	const month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
	const day = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
	var datee = this.dateControl3.value.getFullYear();
	var month_mtd = month[this.dateControl3.value.getMonth()];
	// var day_get = day[this.dateControl3.value.getDay()];
	var tahun = datee-1;
	var tahunn = datee;
	var date = 'Jan 1 ' + tahunn + ' 00:00:00';
	var date_mtd = month_mtd + ' 1 ' + tahunn + ' 00:00:00';
	// var day = this.dateControl3.value-604800000;
	
    // var start_date = date;
    var end_date = this.dateControl3.value;
	var cek_tgl = formatDate(date_mtd, "dd-MMM-yy", "en-US");
	// console.log("Hari apa ini : "+day_get);
	// console.log("Tgl Berapa: "+this.dateControl3.value);
	
    this.http.get('/api/pe/production', { params: { sort: 'date', order: 'asc', pagesize: '10000', columnfilter: '{"date":[{"opr":"gte","val":"' + 'Jan 1 ' + tahun + '","log":"and"},{"opr":"lte","val":"' + end_date.toISOString() + '","log":"and"}]}' } }).subscribe(res => {

      var cat = res["items"].map(d => formatDate(d["date"], "dd-MMM-yy", "en-US"));
	  var cat1 = res["items"].map(d => formatDate(d["date"], "EE", "en-US"));
	  var opr = res["items"].map(d => d["operation"]);
	  var sgt_opr = res["items"].map(d => d["sgt_opr"]);
	  var sbr_opr = res["items"].map(d => d["sbr_opr"]);
	  var bd_opr = res["items"].map(d => d["bd_opr"]);
	  var sgt_sot = res["items"].map(d => d["sgt_sot"]);
	  var sbr_sot = res["items"].map(d => d["sbr_sot"]);
	  var bd_sot = res["items"].map(d => d["bd_sot"]);
	  let sgt_opr_current = 0;
	  let sbr_opr_current = 0;
	  let bd_opr_current = 0;
	  let sgt_sot_current = 0;
	  let sbr_sot_current = 0;
	  let bd_sot_current = 0;
	  let sgt_opr_last = 0;
	  let sbr_opr_last = 0;
	  let bd_opr_last = 0;
	  let sgt_sot_last = 0;
	  let sbr_sot_last = 0;
	  let bd_sot_last = 0;
	      
	  
	  // *LAST WEEK*
	  var gain = 0;
	  var harii = "";
	  var q = "";
	  var start_last = 0;
	  var end_last = 0;
	  
	  for (var yy = 0; yy < opr.length; yy++){
		harii = cat1[yy];
		q = cat[yy];
	  }
	  console.log("Hari pa muncul: "+harii+" - "+q);
	  console.log("Banyaknya: "+opr.length);
	  	  
	  if (harii == "Mon"){
		gain = opr.length - 8;
	  }
	  else if (harii == "Tue"){
		gain = opr.length - 9;
	  }
	  else if (harii == "Wed"){
		gain = opr.length - 10;
	  }
	  else if (harii == "Thu"){
		gain = opr.length - 11;
	  }
	  else if (harii == "Fri"){
		gain = opr.length - 12;
	  }
	  else if (harii == "Sat"){
		gain = opr.length - 13;
	  }
	  else if (harii == "Sun"){
		gain = opr.length - 14;
	  }
	  
	  console.log("Gain berapa: "+gain);
	  
	  for (var yy = gain; yy < gain+7; yy++){
		console.log("brp tanggal: "+cat1[yy]+" - "+cat[yy]);
		sgt_opr_last = sgt_opr_last + sgt_opr[yy];
		sbr_opr_last = sbr_opr_last + sbr_opr[yy];
		bd_opr_last = bd_opr_last + bd_opr[yy];
		sgt_sot_last = sgt_sot_last + sgt_sot[yy];
		sbr_sot_last = sbr_sot_last + sbr_sot[yy];
		bd_sot_last = bd_sot_last + bd_sot[yy];
		
		start_last = cat[gain];
		end_last = cat[gain+6];
	  }
	  // console.log("bor sbj last: "+Math.round(borderless_sbj_opr_last/7));
	  // console.log("bor bd last: "+borderless_bd_opr);
	  
	  // *CURRENT WEEK*
	  let codee = opr.length;
	  let current_length = 0;
	  var start_date = 0;
	  var dt_last_7 = opr.length - 7;
	  	  
	  for (var yyy = dt_last_7; yyy < opr.length; yyy++){
		if (cat1[yyy] == "Mon"){
			console.log("tanggal: match - "+cat[yyy]+" - "+sgt_opr[yyy]);
			start_date = cat[yyy];
			codee = yyy;
			// console.log("codee: "+codee);	
		  }
		  else{
			// console.log("tanggal: not match");
		  }
	  }
	  
	  for (var y = codee; y < opr.length; y++){
		console.log("sgt : "+sgt_opr[y]);
		sgt_opr_current = sgt_opr_current + sgt_opr[y];
		sbr_opr_current = sbr_opr_current + sbr_opr[y];
		bd_opr_current = bd_opr_current + bd_opr[y];
		sgt_sot_current = sgt_sot_current + sgt_sot[y];
		sbr_sot_current = sbr_sot_current + sbr_sot[y];
		bd_sot_current = bd_sot_current + bd_sot[y];
		
		current_length++;
	  }
	  
	  // console.log("Date sgt : "+start_date);
	  // console.log("sgt current length: "+current_length);
	  // console.log("length: "+opr.length);
	  // console.log("sgt current: "+Math.round(sgt_opr_current/current_length));
	  
	  
      this.perform_production_chart_options["subtitle"]["text"] = "Last Week : " + formatDate(start_last, 'EEEE, d MMM y', 'id-ID') + " - " + formatDate(end_last, 'EEEE, d MMM y', 'id-ID') + "<br>Current Week : " + formatDate(start_date, 'EEEE, d MMM y', 'id-ID') + " - " + formatDate(end_date, 'EEEE, d MMM y', 'id-ID') ;
      this.perform_production_chart_options["series"][0]["data"] = [Math.round(bd_opr_last/7), Math.round(bd_sot_last/7), Math.round(bd_opr_current/current_length), Math.round(bd_sot_current/current_length)];
      this.perform_production_chart_options["series"][1]["data"] = [Math.round(sgt_opr_last/7), Math.round(sgt_sot_last/7), Math.round(sgt_opr_current/current_length), Math.round(sgt_sot_current/current_length)];
      this.perform_production_chart_options["series"][2]["data"] = [Math.round(sbr_opr_last/7), Math.round(sbr_sot_last/7), Math.round(sbr_opr_current/current_length), Math.round(sbr_sot_current/current_length)];
      Highcharts.chart(this.perform_production_chart_el.nativeElement, this.perform_production_chart_options);

    }, error => {

    }, () => {

    });
  }
  
  
  refresh_Production5() {
    this.isLoadingProduction = true;

    // var start_date = this.dateControl2.value;
	const month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
	var datee = this.dateControl3.value.getFullYear();
	var month_mtd = month[this.dateControl3.value.getMonth()];
	// var day_get = day[this.dateControl3.value.getDay()];
	var tahun = datee-1;
	var tahunn = datee;
	var date = 'Jan 1 ' + tahunn + ' 00:00:00';
	var date_mtd = month_mtd + ' 1 ' + tahunn + ' 00:00:00';
	// var day = this.dateControl3.value-604800000;
	
    // var start_date = date;
    var end_date = this.dateControl3.value;
	
	// console.log("Hari apa ini : "+day_get);
	console.log("Tgl Berapa: "+this.dateControl3.value);
	
    this.http.get('/api/pe/production', { params: { sort: 'date', order: 'asc', pagesize: '10000', columnfilter: '{"date":[{"opr":"gte","val":"' + 'Jan 1 ' + tahun + '","log":"and"},{"opr":"lte","val":"' + end_date.toISOString() + '","log":"and"}]}' } }).subscribe(res => {

      var categories = [];
      var series_operation = [];
      var series_sot = [];

      
	  var cat = res["items"].map(d => formatDate(d["date"], "dd-MMM-yy", "en-US"));
	  var opr = res["items"].map(d => d["operation"])
	  var sot = res["items"].map(d => d["sot"])
	  var rkap = res["items"].map(d => d["rkap"])
	  var wpnb = res["items"].map(d => d["wpnb"])
	  let opr_ytd = 0;
	  let sot_ytd = 0;
	  let opr_last_7 = [];
	  let sot_last_7 = [];
	  let rkap_last_7 = [];
	  let wpnb_last_7 = [];
	  let opr_mtd = 0;
	  let sot_mtd = 0;
	  var cek_tgl = formatDate(date_mtd, "dd-MMM-yy", "en-US");
	  
	  console.log("Berapa isinya: "+opr.length);
	  // console.log("Hari tagl berapa: "+cat1);
	  
	  
	  // *LAST 7 DAYS*
	  var dt_last_7 = opr.length - 7;
	  var day_1 = 0;
	  let tgl_prod = [];
	  var i = 0;
	  
	  if(cat[dt_last_7] == undefined){
		day_1 = 0;
	  }else{
		day_1 = cat[dt_last_7];
	  }
	  	  
	  console.log("nilaiii dt_last_7: "+dt_last_7);
	  for (var yy = dt_last_7; yy < opr.length; yy++){
		opr_last_7[i] = opr[yy];
		sot_last_7[i] = sot[yy];
		rkap_last_7[i] = rkap[yy];
		wpnb_last_7[i] = wpnb[yy];
		tgl_prod[i] = cat[yy];
		
		i++;
		// console.log("operations 2: "+opr_last_7);
		// console.log("nilai operations 7 "+yy+" : "+opr[yy]+" - "+cat[yy]+" - "+sot[yy]);
	  }
	  // console.log("nilai operations 7: "+opr_last_7/7);
	  // console.log("nilai sot 7: "+sot_last_7/7);
	  console.log("Tgl last 7: "+tgl_prod);
	  console.log("Opr last 7: "+opr_last_7);
	  console.log("Sot last 7: "+sot_last_7);
	  console.log("RKAP last 7: "+rkap_last_7);
	  console.log("WP&B last 7: "+wpnb_last_7);
	  
	  	  
	  // for (var y = codee; y < opr.length; y++){
		// opr_mtd = opr_mtd + opr[y];
		// sot_mtd = sot_mtd + sot[y];
		// mtd_length++;
		
		// console.log("nilai operations mtd "+y+" : "+opr[y]+" - "+cat[y]+" - "+sot[y]);
	  // }
	  // console.log("MTD length: "+mtd_length);
	  // console.log("nilai rata operations mtd: "+opr_mtd/mtd_length);
	  // console.log("nilai rata sot mtd: "+sot_mtd/mtd_length);
	  
	  
	  
      this.seven_production_chart_options["subtitle"]["text"] = "Last 7 Days : " + formatDate(day_1, 'd MMM y', 'id-ID') + " - " + end_date.toLocaleDateString("id-ID", { month: "short", year: "numeric", day: "numeric" });
      this.seven_production_chart_options["xAxis"]["categories"] = tgl_prod;
      this.seven_production_chart_options["series"][0]["data"] = opr_last_7;
      this.seven_production_chart_options["series"][1]["data"] = sot_last_7;
      this.seven_production_chart_options["series"][2]["data"] = rkap_last_7;
      this.seven_production_chart_options["series"][3]["data"] = wpnb_last_7;
      Highcharts.chart(this.seven_production_chart_el.nativeElement, this.seven_production_chart_options);

    }, error => {

    }, () => {

    });
  }
  

  makeFullScreen() {

    this.commonService.toggleFullwindow()
    setTimeout(a => {

      this.dateInput = this.dateControl.value.toLocaleDateString("id-ID", { month: "short", year: "numeric", day: "numeric" });

      this.refresh_Production();
      this.dateControl3 = new FormControl(new Date(this.dateControl.value));
      this.dateControl2 = new FormControl(new Date(new Date(this.dateControl.value).getFullYear(), new Date(this.dateControl.value).getMonth() - 1, new Date(this.dateControl.value).getDate()));

      var end_date = this.dateControl3.value;
      var start_date = new Date(end_date.getFullYear(), end_date.getMonth() - 1, end_date.getDate());
      this.dateInput2 = start_date.toLocaleDateString("id-ID", { month: "short", year: "numeric", day: "numeric" });
      this.dateInput3 = end_date.toLocaleDateString("id-ID", { month: "short", year: "numeric", day: "numeric" });

      this.refresh_Production2();
	  this.refresh_Production3();
      this.refresh_WellRank()
      this.refresh_WellStatus()
	  
      console.log("fullscreen change")
    },1000)
   
  }

}
