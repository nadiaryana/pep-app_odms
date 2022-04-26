import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { HttpClient, HttpEventType, HttpParams, HttpResponse, HttpHeaders } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { MatDatepicker, MatPaginator, MatSort, MatDialog, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource,  MatTabGroup } from '@angular/material';
import { FormControl } from '@angular/forms';
import { merge, Observable, of as observableOf, forkJoin, Subscription } from 'rxjs';
import { catchError, map, startWith, switchMap, debounceTime, take, mergeAll } from 'rxjs/operators';
import { Chart } from 'angular-highcharts';
import * as Highcharts from 'highcharts';
import { TitleService } from '../../navigation/title/title.service';
import { xFilterService } from '../../xfilter/xfilter.component';
import { SnackbarService } from '../../snackbar.service';
import { SnackbarApi } from '../../snackbar.service';
import { CommonService } from '../../common.service';


@Component({
  selector: 'app-pe-wellperformance',
  templateUrl: './pe-wellperformance.component.html',
  styleUrls: ['./pe-wellperformance.component.scss']
})

export class PeWellPerformanceComponent {

  tab:string = "annual";
  isLoadingResults:boolean = false;
  @ViewChild( MatTabGroup, {static: true}) tabGroup:  MatTabGroup;
  grouping:string = "well";

  data_annual = [];
  resultsLength_annual = 0;
  dataSource_annual = new MatTableDataSource(this.data_annual);
  @ViewChild('paginator_annual', {static: true}) paginator_annual: MatPaginator;
  @ViewChild('sort_annual', {static: true}) sort_annual: MatSort;
  @ViewChild('annual_datePicker', {static: true}) annual_datePicker: MatDatepicker<any>;
  annual_dateControl = new FormControl(new Date(new Date().setDate(new Date().getDate()-1)));
  annual_dateInput = this.annual_dateControl.value.toLocaleDateString("en-US", { year:"numeric" });
  annual_radioControl = new FormControl();
  curr_annual:string = "";

  data_monthly = [];
  resultsLength_monthly = 0;
  dataSource_monthly = new MatTableDataSource(this.data_monthly);
  @ViewChild('paginator_monthly', {static: true}) paginator_monthly: MatPaginator;
  @ViewChild('sort_monthly', {static: true}) sort_monthly: MatSort;
  @ViewChild('monthly_datePicker', {static: true}) monthly_datePicker: MatDatepicker<any>;
  monthly_dateControl = new FormControl(new Date(new Date().setDate(new Date().getDate()-1)));
  monthly_dateInput = this.monthly_dateControl.value.toLocaleDateString("en-US", { month:"short", year:"numeric" });
  @ViewChild('monthly_prev_datePicker', {static: true}) monthly_prev_datePicker: MatDatepicker<any>;
  monthly_prev_dateControl = new FormControl(new Date(new Date(new Date().setDate(new Date().getDate()-1)).setMonth(new Date().getMonth()-1)));
  monthly_prev_dateInput = this.monthly_prev_dateControl.value.toLocaleDateString("en-US", { month:"short", year:"numeric" });
  monthly_radioControl = new FormControl();
  curr_monthly:string = "";
  prev_monthly:string = "";

  data_weekly = [];
  resultsLength_weekly = 0;
  dataSource_weekly = new MatTableDataSource(this.data_weekly);
  @ViewChild('paginator_weekly', {static: true}) paginator_weekly: MatPaginator;
  @ViewChild('sort_weekly', {static: true}) sort_weekly: MatSort;
  @ViewChild('weekly_datePicker', {static: true}) weekly_datePicker: MatDatepicker<any>;
  weekly_dateControl = new FormControl(new Date(new Date().setDate(new Date().getDate()-1)));
  weekly_dateInput = this.weekly_dateControl.value.toLocaleDateString("en-US", { month:"short", year:"numeric", day:"numeric" });
  @ViewChild('weekly_prev_datePicker', {static: true}) weekly_prev_datePicker: MatDatepicker<any>;
  weekly_prev_dateControl = new FormControl(new Date(new Date().setDate(new Date().getDate()-8)));
  weekly_prev_dateInput = this.weekly_prev_dateControl.value.toLocaleDateString("en-US", { month:"short", year:"numeric", day:"numeric" });
  weekly_radioControl = new FormControl();
  curr_weekly:string = "";
  prev_weekly:string = "";

  data_daily = [];
  resultsLength_daily = 0;
  dataSource_daily = new MatTableDataSource(this.data_daily);
  @ViewChild('paginator_daily', {static: true}) paginator_daily: MatPaginator;
  @ViewChild('sort_daily', {static: true}) sort_daily: MatSort;
  @ViewChild('daily_datePicker', {static: true}) daily_datePicker: MatDatepicker<any>;
  daily_dateControl = new FormControl(new Date(new Date().setHours(0,0,0,0)));
  daily_dateInput = this.daily_dateControl.value.toLocaleDateString("en-US", { month:"short", year:"numeric", day:"numeric" });
  @ViewChild('daily_prev_datePicker', {static: true}) daily_prev_datePicker: MatDatepicker<any>;
  daily_prev_dateControl = new FormControl(new Date(new Date(new Date().setDate(new Date().getDate()-1)).setHours(0,0,0,0)));
  daily_prev_dateInput = this.daily_prev_dateControl.value.toLocaleDateString("en-US", { month:"short", year:"numeric", day:"numeric" });
  daily_radioControl = new FormControl();
  curr_daily:string = "";
  prev_daily:string = "";

  maxDate:Date = new Date();

  well_xSelected = [];
  structure_xSelected = [];
  m1_xSelected = [];
  m2_xSelected = [];
  m3_xSelected = [];
  m4_xSelected = [];
  m5_xSelected = [];
  m6_xSelected = [];
  m7_xSelected = [];
  m8_xSelected = [];
  m9_xSelected = [];
  m10_xSelected = [];
  m11_xSelected = [];
  m12_xSelected = [];
  gross_prev_xSelected = [];
  net_prev_xSelected = [];
  wc_prev_xSelected = [];
  gross_xSelected = [];
  net_xSelected = [];
  wc_xSelected = [];
  gross_gap_xSelected = [];
  net_gap_xSelected = [];
  wc_gap_xSelected = [];

  filterSubscription:Subscription;
  selectedSubscription:Subscription;
  listSubscription:Subscription;

  constructor(
  	private http: HttpClient,
  	private titleService: TitleService,
    public snackbarService: SnackbarService,
    private xfilterService: xFilterService,
    public commonService: CommonService,
    public dialog: MatDialog,
  	) { }

  ngOnInit(){

  	this.titleService.titleSource.next({
      title: "Well Performance", 
      breadcrumbs: [
        {label: 'Petroleum Engineering', routerLink: ''}, 
        {label: 'Well Performance', routerLink: ''}
      ]}
    );

    this.dataSource_annual.paginator = this.paginator_annual;
    this.sort_annual.sortChange.subscribe(() => this.paginator_annual.pageIndex = 0);

    this.dataSource_monthly.paginator = this.paginator_monthly;
    this.sort_monthly.sortChange.subscribe(() => this.paginator_monthly.pageIndex = 0);
    
    this.dataSource_weekly.paginator = this.paginator_weekly;
    this.sort_weekly.sortChange.subscribe(() => this.paginator_weekly.pageIndex = 0);

    this.dataSource_daily.paginator = this.paginator_daily;
    this.sort_daily.sortChange.subscribe(() => this.paginator_daily.pageIndex = 0);

    this.xfilterService.selected.subscribe(() => this['paginator_'+this.tab].pageIndex = 0);

    this.filterSubscription = this.xfilterService.filter.subscribe(res => {
      if(res) this.getColumnValues(res);
    })
    this.selectedSubscription = this.xfilterService.selected.subscribe(res => {
      this[res["column"] + "_xSelected"] = res["selected"];
    })

    this.listSubscription = merge(
      this.sort_annual.sortChange,
      this.paginator_annual.page, 
      this.annual_dateControl.valueChanges,
      this.annual_radioControl.valueChanges,

      this.sort_monthly.sortChange,
      this.paginator_monthly.page, 
      this.monthly_dateControl.valueChanges,
      this.monthly_prev_dateControl.valueChanges,

      this.sort_weekly.sortChange,
      this.paginator_weekly.page, 
      this.weekly_dateControl.valueChanges,
      this.weekly_prev_dateControl.valueChanges,

      this.sort_daily.sortChange,
      this.paginator_daily.page, 
      this.daily_dateControl.valueChanges,
      this.daily_prev_dateControl.valueChanges,

      this.tabGroup.selectedIndexChange,
      this.xfilterService.selected,
    ).pipe(
        startWith({}),
        switchMap(() => {
          switch(this.tabGroup.selectedIndex) {
            case 0 :
              this.tab = "annual";
              break;
            case 1 :
              this.tab = "monthly";
              break;
            case 2 :
              this.tab = "weekly";
              break;
            case 3 :
              this.tab = "daily";
              break;
          }

          this.isLoadingResults = true;
          var columnfilter = this.getColumnFilter();
          return this.getData(
            '/api/pe/wellperformance/'+this.tab,
            this['sort_'+this.tab].active, 
            this['sort_'+this.tab].direction, 
            this['paginator_'+this.tab].pageIndex, 
            this['paginator_'+this.tab].pageSize, 
            null,
            columnfilter,
            "grouping-well",
          )
        }),
        map(data => {
          return data;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return observableOf([]);
      })).subscribe(data => {
        switch(this.tab) {
          case 'annual' :
            this.data_annual = data.items;
            this.curr_annual = data.curr;
            this.resultsLength_annual = data.total_count;
            break;
          case 'monthly' :
            this.data_monthly = data.items;
            this.curr_monthly = data.curr;
            this.prev_monthly = data.prev;
            this.resultsLength_monthly = data.total_count;
            break;
          case 'weekly' :
            this.data_weekly = data.items;
            this.curr_weekly = data.curr;
            this.prev_weekly = data.prev;
            this.resultsLength_weekly = data.total_count;
            break;
          case 'daily' :
            this.data_daily = data.items;
            this.curr_daily = data.curr;
            this.prev_daily = data.prev;
            this.resultsLength_daily = data.total_count;
            break;
        }
        
        this.isLoadingResults = false;
      });

      this.weekly_dateChange({value: this.weekly_dateControl.value});
      this.weekly_prev_dateChange({value: this.weekly_prev_dateControl.value});
  }

  ngOnDestroy() {
    this.filterSubscription.unsubscribe();
    this.selectedSubscription.unsubscribe();
    this.listSubscription.unsubscribe();
  }

  getColumnValues(param:any) {
    var column = param["column"];
    var filter = param["filter"];
    var selected = param["selected"]
    var clear = param["clear"];
    var columnfilter = this.getColumnFilter();
    if(filter) columnfilter[column] = [filter];
    if(selected && selected.length > 0) columnfilter[column] = selected.map(s => "^"+s+"$");
    if(clear) delete columnfilter[column];

    return this.getData(
      '/api/pe/wellperformance/'+this.tab,
      this['sort_'+this.tab].active, 
      this['sort_'+this.tab].direction,
      this['paginator_'+this.tab].pageIndex, 
      this['paginator_'+this.tab].pageSize, 
      null,
      columnfilter,
      column
    ).pipe(map((res) => {
      return res;
    })).subscribe(res => {
      this.xfilterService.updateItems({column: column, items: res.items});
    }, () => {
      
    });
  }

  getColumnFilter() {
    var columnfilter = {};
    if(this.well_xSelected.length) columnfilter["well"] = this.well_xSelected;//.map(s => "^"+s+"$");
    if(this.structure_xSelected.length) columnfilter["structure"] = this.structure_xSelected;

    switch(this.tab) {
      case 'annual' :
        columnfilter["year"] = [this.annual_dateControl.value.getFullYear()];
        if(this.m1_xSelected.length) columnfilter["m1"] = this.m1_xSelected;
        if(this.m2_xSelected.length) columnfilter["m2"] = this.m2_xSelected;
        if(this.m3_xSelected.length) columnfilter["m3"] = this.m3_xSelected;
        if(this.m4_xSelected.length) columnfilter["m4"] = this.m4_xSelected;
        if(this.m5_xSelected.length) columnfilter["m5"] = this.m5_xSelected;
        if(this.m6_xSelected.length) columnfilter["m6"] = this.m6_xSelected;
        if(this.m7_xSelected.length) columnfilter["m7"] = this.m7_xSelected;
        if(this.m8_xSelected.length) columnfilter["m8"] = this.m8_xSelected;
        if(this.m9_xSelected.length) columnfilter["m9"] = this.m9_xSelected;
        if(this.m10_xSelected.length) columnfilter["m10"] = this.m10_xSelected;
        if(this.m11_xSelected.length) columnfilter["m11"] = this.m11_xSelected;
        if(this.m12_xSelected.length) columnfilter["m12"] = this.m12_xSelected;
        break;
        
      default :
        columnfilter["date"] = [this.commonService.convertUTCtoLocal(this[this.tab+'_dateControl'].value).toISOString()];
        columnfilter["date_prev"] = [this.commonService.convertUTCtoLocal(this[this.tab+'_prev_dateControl'].value).toISOString()];
        if(this.gross_prev_xSelected.length) columnfilter["gross_prev"] = this.gross_prev_xSelected;
        if(this.net_prev_xSelected.length) columnfilter["net_prev"] = this.net_prev_xSelected;
        if(this.wc_prev_xSelected.length) columnfilter["wc_prev"] = this.wc_prev_xSelected;
        if(this.gross_xSelected.length) columnfilter["gross"] = this.gross_xSelected;
        if(this.net_xSelected.length) columnfilter["net"] = this.net_xSelected;
        if(this.wc_xSelected.length) columnfilter["wc"] = this.wc_xSelected;
        if(this.gross_gap_xSelected.length) columnfilter["gross_gap"] = this.gross_gap_xSelected;
        if(this.net_gap_xSelected.length) columnfilter["net_gap"] = this.net_gap_xSelected;
        if(this.wc_gap_xSelected.length) columnfilter["wc_gap"] = this.wc_gap_xSelected;
        break;
    }
    return columnfilter;
  }

  ngAfterViewInit() {
    
  }

  daily_dateChange(evt) {
    this.daily_dateInput = evt.value.toLocaleDateString("en-US", { month:"short", year:"numeric", day:"numeric" });
  }

  daily_prev_dateChange(evt) {
    this.daily_prev_dateInput = evt.value.toLocaleDateString("en-US", { month:"short", year:"numeric", day:"numeric" });
  }
  
  weekly_dateChange(evt) {
    var dt = evt.value;
    var monday = new Date(dt.valueOf());
    monday.setDate(monday.getDate()-((monday.getDay()+6)%7));
    var sunday = new Date(monday.valueOf());
    sunday.setDate(sunday.getDate()+6);
    this.weekly_dateInput = 
      monday.toLocaleDateString("en-US", { month:"short", year:"numeric", day:"numeric" }) + " - " + 
      sunday.toLocaleDateString("en-US", { month:"short", year:"numeric", day:"numeric" });
  }

  weekly_prev_dateChange(evt) {
    var dt = evt.value;
    var monday = new Date(dt.valueOf());
    monday.setDate(monday.getDate()-((monday.getDay()+6)%7));
    var sunday = new Date(monday.valueOf());
    sunday.setDate(sunday.getDate()+6);
    this.weekly_prev_dateInput = 
      monday.toLocaleDateString("en-US", { month:"short", year:"numeric", day:"numeric" }) + " - " + 
      sunday.toLocaleDateString("en-US", { month:"short", year:"numeric", day:"numeric" });
  }
  
  monthly_dateChange(evt) {
    this.monthly_dateInput = evt.toLocaleDateString("en-US", { month:"short", year:"numeric" });
    this.monthly_datePicker.select(evt);
    this.monthly_datePicker.close();
  }

  monthly_prev_dateChange(evt) {
    this.monthly_prev_dateInput = evt.toLocaleDateString("en-US", { month:"short", year:"numeric" });
    this.monthly_prev_datePicker.select(evt);
    this.monthly_prev_datePicker.close();
  }
  
  annual_dateChange(evt) {
    this.annual_dateInput = evt.toLocaleDateString("en-US", { year:"numeric" });
    this.annual_datePicker.select(evt);
    this.annual_datePicker.close();
  }
  
  exportExcel(p) {

    let columnfilter = {};
    switch(p) {
      case 'annual' :
        columnfilter["year"] = [this.annual_dateControl.value.getFullYear()];
        break;
      case 'monthly' :
        columnfilter["date"] = [this.monthly_dateControl.value.toISOString()];
        columnfilter["date_prev"] = [this.monthly_prev_dateControl.value.toISOString()];
        break;
      case 'weekly':
        columnfilter["date"] = [this.commonService.convertUTCtoLocal(this.weekly_dateControl.value).toISOString()];
        columnfilter["date_prev"] = [this.commonService.convertUTCtoLocal(this.weekly_prev_dateControl.value).toISOString()];
        break;
      case 'daily' :
        columnfilter["date"] = [this.commonService.convertUTCtoLocal(this.daily_dateControl.value).toISOString()];
        columnfilter["date_prev"] = [this.commonService.convertUTCtoLocal(this.daily_prev_dateControl.value).toISOString()];
        break;
    }

    const httpOption: Object = {
      observe: 'response',
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: 'arraybuffer',
    };

    this.isLoadingResults = true;
    this.getData(
      '/api/pe/wellperformance/'+p,
      this['sort_'+this.tab].active, 
      this['sort_'+this.tab].direction,
      null, 
      null, 
      null,
      columnfilter,
      "excel-"+this.grouping,
      httpOption
    ).pipe(map((res) => {
      this.isLoadingResults = false;
      return {
        filename: 'WellPerformance-'+p+'.xlsx',
        data: new Blob(
          [res['body']],
          { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}
        ),
      };
    })).subscribe(res => {
      if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(res.data, res.filename);
      } else {
        const link = window.URL.createObjectURL(res.data);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = link;
        a.download = res.filename;
        a.click();
        window.URL.revokeObjectURL(link);
        a.remove();
      }
    }, error => {
      this.isLoadingResults = false;
      this.snackbarService.status.next(new SnackbarApi(true, error['message'], 'dismiss'));
      console.log(error);
    }, () => {
      console.log('Completed file download.');
    });
  }

  colorScale(val, min=0, max=100) {
    var r, g, b = 0;

    if(max > min) {
      if(val < min) val = min;
      if(val > max) val = max;
    }
    if(max < min) {
      if(val > min) val = min;
      if(val < max) val = max;
    }
    
    val = 100*(val-min)/(max-min);
    if(val < 50) {
      r = 255;
      g = Math.round(5.1 * val);
    }
    else {
      g = 255;
      r = Math.round(510 - 5.10 * val);
    }
    var h = r * 0x10000 + g * 0x100 + b * 0x1;
    console.log('#' + ('000000' + h.toString(16)).slice(-6));
    return '#' + ('000000' + h.toString(16)).slice(-6);
  }

  getData(url:string, sort: string, order: string, page: number, pagesize: number = 50, filter: string, columnfilter: object, mode: string = "", httpOption: object = {}): Observable<any> {

    var params = {};
    if(sort!=null) params["sort"] = sort;
    if(order!=null) params["order"] = order;
    if(page!=null) params["page"] = page.toString();
    if(pagesize!=null) params["pagesize"] = pagesize.toString();
    if(filter!=null) params["filter"] = filter;
    if(Object.keys(columnfilter).length > 0) params["columnfilter"] = JSON.stringify(columnfilter);
    if(mode != null) params["mode"] = mode;

    httpOption["params"] = params;

    return this.http.get(url, httpOption);
  }

  openChart(well) {
    console.log(this.data_annual)
    this.dialog.open(PeWellPerformanceChartComponent, {
      width: '40vw',
      data: this.data_annual.filter(wp => wp.well == well)[0],
    });
    

  }
}

@Component({
  selector: 'pe-wellperformance-chart-modal',
  templateUrl: 'pe-wellperformance-chart-modal.html',
})
export class PeWellPerformanceChartComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: PeWellPerformanceComponent) { }



  ngOnInit() {

    var wp_well_series_data = Object.values(this.data).splice(5, 12);

   console.log(Object.values(this.data))
    //console.log(this.curr_year)

    this.well_performance_annual_chart_options["xAxis"]["categories"] = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Aug","Sept","Okt","Nov","Des"];
    this.well_performance_annual_chart_options["series"][0]["data"] = wp_well_series_data.map(a => Math.round(a));
    Highcharts.chart(this.well_performance_annual_chart.nativeElement, this.well_performance_annual_chart_options);
  }

  @ViewChild('well_performance_annual_chart', { static: true }) public well_performance_annual_chart: ElementRef;
  well_performance_annual_chart_options: object = {
    chart: {
      //type: 'bar',
      style: {
        fontFamily: 'Roboto, Helvetica Neue, sans-serif'
      }
    },
    title: {
      text: this.data["well"]
    },
    xAxis: {
     
    },
    yAxis: {

      title: {
        text: 'Net (BOPD)'
      },
      tickInterval: 1,
    },
    tooltip: {
      useHTML: true,
      headerFormat: '{point.x}',
      pointFormat: "</br>{series.name}: <b>{point.y} BOPD</b>"
    },
    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
          format: '{point.y}',
          style: {
            fontWeight: 'small'
          }
        }
      }

    },
    legend: {
      enabled: false,
    },
    series: [{
      name: "Net",
      color: '#4fc3f7',
      data: []
    }]
  };
}

