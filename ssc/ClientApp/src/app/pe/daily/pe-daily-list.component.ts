import { HttpClient, HttpParams, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';
import { merge, Observable, of as observableOf, Subscription } from 'rxjs';
import { catchError, map, startWith, switchMap, debounceTime } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { SelectionModel } from '@angular/cdk/collections';

import { PeDailyService } from './pe-daily.service';
import { PeDaily } from './pe-daily';
import { SnackbarService } from '../../snackbar.service';
import { SnackbarApi } from '../../snackbar.service';
import { PePermissionService } from '../pe-permission.service';
import { TitleService } from '../../navigation/title/title.service';
import { xFilterService } from '../../xfilter/xfilter.component';
import { CommonService } from '../../common.service';


@Component({
  selector: 'pe-daily-list',
  templateUrl: './pe-daily-list.component.html',
  styleUrls: ['./pe-daily.scss']
})
export class PeDailyListComponent implements OnInit {

  displayedColumns: string[] = ["select", "date","nomor","location","well","well_string","zone","interval","potensi_prod_gross","potensi_prod_net","tes_prod_gross","tes_prod_net",
                                "fig_last_gross","fig_last_net","fig_curr_gross","fig_curr_net","thp_last_fig","thp_potensi","wc","prod_hours","wor","gas","gor","glr",
                                "ls_method","ls_brandtype","ls_prime_mover","ls_hp","ds_bean","ds_whp","ds_fl","ds_casing","ds_separator","ds_spm","ds_size","ds_pump_displace","ds_efficiency",
                              "ds_sl","ds_kd","sm","ds_tgl_pengujian","noted"];
  headerColumns1: string[] = ["select", "date","nomor","location","well","well_string","zone","interval","potensi_prod","tes_prod","fig","thp_last_fig","thp_potensi","wc","prod_hours","wor","gas","gor","glr",
                              "lifting_status","daftar_sumur","noted"];
  headerColumns2: string[] = ["potensi_prod_gross","potensi_prod_net","tes_prod_gross","tes_prod_net","fig_last_gross","fig_last_net","fig_curr_gross","fig_curr_net",
                              "ls_method","ls_brandtype","ls_prime_mover","ls_hp","ds_bean","ds_whp","ds_fl","ds_casing","ds_separator","ds_spm","ds_size","ds_pump_displace","ds_efficiency",
                              "ds_sl","ds_kd","sm","ds_tgl_pengujian"]
  headerColumns3: string[] = ["last_test", "current_test"]
  exampleDatabase: ExampleHttpDao | null;
  data: PeDaily[] = [];

  dataSource = new MatTableDataSource<any>(this.data);
  selection = new SelectionModel<any>(true, []);
  isEditing:boolean = false;

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  submitting = false;

  start_submitDate: Number;
  end_submitDate: Number;
  group: string;
  status: string;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  filterControl = new FormControl('');

  dateFilter = new FormControl('');
  nomorFilter = new FormControl('');
  locationFilter = new FormControl('');
  wellFilter = new FormControl('');
  well_stringFilter = new FormControl('');
  zoneFilter = new FormControl('');
  intervalFilter = new FormControl('');
  // test_dateFilter = new FormControl('');
  // test_durationFilter = new FormControl('');
  potensi_prod_grossFilter = new FormControl('');
  potensi_prod_netFilter = new FormControl('');
  tes_prod_grossFilter = new FormControl('');
  tes_prod_netFilter = new FormControl('');
  fig_last_grossFilter = new FormControl('');
  fig_last_netFilter = new FormControl('');
  fig_curr_grossFilter = new FormControl('');
  fig_curr_netFilter = new FormControl('');
  thp_last_figFilter = new FormControl('');
  thp_potensiFilter = new FormControl('');
  wcFilter = new FormControl('');
  prod_hoursFilter = new FormControl('');
  worFilter = new FormControl('');
  gorFilter = new FormControl('');
  glrFilter = new FormControl('');
  ls_methodFilter = new FormControl('');
  ls_brandtypeFilter = new FormControl('');
  ls_prime_moverFilter = new FormControl('');
  ls_hpFilter = new FormControl('');
  ds_sizeFilter = new FormControl('');
  ds_slFilter = new FormControl('');
  ds_spmFilter = new FormControl('');
  ds_beanFilter = new FormControl('');
  ds_flFilter = new FormControl('');
  ds_efficiencyFilter = new FormControl('');
  ds_casingFilter = new FormControl('');
  ds_separatorFilter = new FormControl('');
  ds_kdFilter = new FormControl('');
  ds_tgl_pengujianFilter = new FormControl('');
  notedFilter = new FormControl('');

  date_xSelected = [];
  nomor_xSelected = [];
  location_xSelected = [];
  well_xSelected = [];
  well_string_xSelected = [];
  zone_xSelected = [];
  interval_xSelected = [];
  // test_date_xSelected = [];
  // test_duration_xSelected = [];
  potensi_prod_gross_xSelected = [];
  potensi_prod_net_xSelected = [];
  tes_prod_gross_xSelected = [];
  tes_prod_net_xSelected = [];
  fig_last_gross_xSelected = [];
  fig_last_net_xSelected = [];
  fig_curr_gross_xSelected = [];
  fig_curr_net_xSelected = [];
  thp_last_fig_xSelected = [];
  thp_potensi_xSelected = [];
  wc_xSelected = [];
  gas_xSelected = [];
  prod_hours_xSelected = [];
  wor_xSelected = [];
  gor_xSelected = [];
  glr_xSelected = [];
  ls_method_xSelected = [];
  ls_brandtype_xSelected = [];
  ls_prime_mover_xSelected = [];
  ls_hp_xSelected = [];
  ds_size_xSelected = [];
  ds_sl_xSelected = [];
  ds_spm_xSelected = [];
  ds_bean_xSelected = [];
  ds_whp_xSelected = [];
  ds_fl_xSelected = [];
  ds_casing_xSelected = [];
  ds_separator_xSelected = [];
  ds_kd_xSelected = [];
  ds_tgl_pengujian_xSelected = [];
  ds_pump_displace_xSelected = [];
  ds_efficiency_xSelected = [];
  sm_xSelected = [];
  noted_xSelected = [];

  filterSubscription:Subscription;
  selectedSubscription:Subscription;
  listSubscription:Subscription;

  constructor(
    private http: HttpClient,
    private router: Router,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private pe_dailyService: PeDailyService,
    public snackbarService: SnackbarService,
    public pePermissionService: PePermissionService,
    private titleService: TitleService,
    private route: ActivatedRoute,
    private xfilterService: xFilterService,
    public commonService: CommonService,
    ) {}

  ngOnInit() {

    this.titleService.titleSource.next({
      title: "Daily",
      icon : "list",
      breadcrumbs: [
        {label: 'Petroleum Engineering', routerLink: ''}, 
        {label: 'Daily', routerLink: ''}
      ]}
    );

    var p_start_submitDate = this.route.snapshot.paramMap.get('start_submitDate');
    if(p_start_submitDate != null && p_start_submitDate.length > 0) {
      //this.start_submitDate = isNaN(Number(p_start_submitDate)) ? new Date(Date.parse(p_start_submitDate)) : new Date(Number(p_start_submitDate));
      this.start_submitDate = Number(p_start_submitDate);
      console.log(this.start_submitDate);
    }
    var p_end_submitDate = this.route.snapshot.paramMap.get('end_submitDate');
    if(p_end_submitDate != null && p_end_submitDate.length > 0) {
      //this.end_submitDate = isNaN(Number(p_end_submitDate)) ? new Date(Date.parse(p_end_submitDate)) : new Date(Number(p_end_submitDate));
      this.end_submitDate = Number(p_end_submitDate);
      console.log(this.end_submitDate);
    }
    this.group = this.route.snapshot.paramMap.get('group');
    this.status = this.route.snapshot.paramMap.get('status');

    this.exampleDatabase = new ExampleHttpDao(this.http);

    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    this.filterSubscription = this.xfilterService.filter.subscribe(res => {
      if(res) this.getColumnValues(res);
    })
    this.selectedSubscription = this.xfilterService.selected.subscribe(res => {
      this[res["column"] + "_xSelected"] = res["selected"];
    })
    
    this.listSubscription = merge(
      this.sort.sortChange, 
      this.paginator.page, 
      this.filterControl.valueChanges.pipe(debounceTime(300)),
      this.dateFilter.valueChanges.pipe(debounceTime(300)),
      this.nomorFilter.valueChanges.pipe(debounceTime(300)),
      this.locationFilter.valueChanges.pipe(debounceTime(300)),
      this.wellFilter.valueChanges.pipe(debounceTime(300)),
      this.well_stringFilter.valueChanges.pipe(debounceTime(300)),
      this.zoneFilter.valueChanges.pipe(debounceTime(300)),
      this.intervalFilter.valueChanges.pipe(debounceTime(300)),
      // this.test_dateFilter.valueChanges.pipe(debounceTime(300)),
      // this.test_durationFilter.valueChanges.pipe(debounceTime(300)),
      this.potensi_prod_grossFilter.valueChanges.pipe(debounceTime(300)),
      this.potensi_prod_netFilter.valueChanges.pipe(debounceTime(300)),
      this.tes_prod_grossFilter.valueChanges.pipe(debounceTime(300)),
      this.tes_prod_netFilter.valueChanges.pipe(debounceTime(300)),
      this.fig_last_grossFilter.valueChanges.pipe(debounceTime(300)),
      this.fig_last_netFilter.valueChanges.pipe(debounceTime(300)),
      this.fig_curr_grossFilter.valueChanges.pipe(debounceTime(300)),
      this.fig_curr_netFilter.valueChanges.pipe(debounceTime(300)),
      this.thp_last_figFilter.valueChanges.pipe(debounceTime(300)),
      this.thp_potensiFilter.valueChanges.pipe(debounceTime(300)),
      this.wcFilter.valueChanges.pipe(debounceTime(300)),
      this.prod_hoursFilter.valueChanges.pipe(debounceTime(300)),
      this.worFilter.valueChanges.pipe(debounceTime(300)),
      this.gorFilter.valueChanges.pipe(debounceTime(300)),
      this.glrFilter.valueChanges.pipe(debounceTime(300)),
      this.ls_methodFilter.valueChanges.pipe(debounceTime(300)),
      this.ls_brandtypeFilter.valueChanges.pipe(debounceTime(300)),
      this.ls_prime_moverFilter.valueChanges.pipe(debounceTime(300)),
      this.ls_hpFilter.valueChanges.pipe(debounceTime(300)),
      this.ds_sizeFilter.valueChanges.pipe(debounceTime(300)),
      this.ds_slFilter.valueChanges.pipe(debounceTime(300)),
      this.ds_spmFilter.valueChanges.pipe(debounceTime(300)),
      this.ds_tgl_pengujianFilter.valueChanges.pipe(debounceTime(300)),
      this.ds_beanFilter.valueChanges.pipe(debounceTime(300)),
      this.ds_efficiencyFilter.valueChanges.pipe(debounceTime(300)),
      this.ds_casingFilter.valueChanges.pipe(debounceTime(300)),
      this.ds_flFilter.valueChanges.pipe(debounceTime(300)),
      this.ds_separatorFilter.valueChanges.pipe(debounceTime(300)),
      this.ds_kdFilter.valueChanges.pipe(debounceTime(300)),
      this.notedFilter.valueChanges.pipe(debounceTime(300)),
      this.xfilterService.selected,
    ).pipe(
      startWith({}),
      switchMap(() => {
        this.isLoadingResults = true;
        var columnfilter = this.getColumnFilter();
        return this.exampleDatabase!.getRepoIssues(
          this.sort.active, 
          this.sort.direction, 
          this.paginator.pageIndex, 
          this.paginator.pageSize, 
          this.filterControl.value,
          columnfilter,
          );
      }),
      map(data => {
        // Flip flag to show that loading has finished.
        this.isLoadingResults = false;
        this.isRateLimitReached = false;
        this.resultsLength = data.total_count;

        return data.items;
      }),
      catchError(() => {
        this.isLoadingResults = false;
        // Catch if the GitHub API has reached its rate limit. Return empty data.
        this.isRateLimitReached = true;
        return observableOf([]);
      })
      ).subscribe(data => {
        this.data = data;
        this.dataSource = new MatTableDataSource<any>(this.data);
		// console.log('Isi data daily: '+this.dataSource);
        this.selection.clear();
      });
      //document.body.style.zoom = "90%";
  }

  ngOnDestroy() {
    this.filterSubscription.unsubscribe();
    this.selectedSubscription.unsubscribe();
    this.listSubscription.unsubscribe();
  }

  passPermission(path:String) {
    return this.pePermissionService.passPermission(path);
  }

  exportExcel() {

    const httpOption: Object = {
      observe: 'response',
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: 'arraybuffer'
    };
    this.isLoadingResults = true;
    var columnfilter = this.getColumnFilter();

    this.exampleDatabase!.getRepoIssues(
      this.sort.active, 
      this.sort.direction, 
      this.paginator.pageIndex, 
      this.paginator.pageSize, 
      this.filterControl.value,
      columnfilter,
      "excel",
      httpOption
    ).pipe(map((res) => {
      this.isLoadingResults = false;
      return {
        filename: 'Daily.xlsx',
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
		console.log("Nilai link nya: "+link);
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

  getColumnValues(param:any) {
    var column = param["column"];
    var filter = param["filter"];
    var selected = param["selected"]
    var clear = param["clear"];
    var columnfilter = this.getColumnFilter();
    if(filter) columnfilter[column] = [filter];
    if(selected && selected.length > 0) columnfilter[column] = selected.map(s => "^"+s+"$");
    if(clear) delete columnfilter[column];

    return this.exampleDatabase!.getRepoIssues(
      this.sort.active, 
      this.sort.direction, 
      this.paginator.pageIndex, 
      this.paginator.pageSize, 
      this.filterControl.value,
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
    if(this.date_xSelected.length) columnfilter["date"] = this.date_xSelected;
    if(this.nomor_xSelected.length) columnfilter["nomor"] = this.nomor_xSelected;
    if(this.location_xSelected.length) columnfilter["location"] = this.location_xSelected;
    if(this.well_xSelected.length) columnfilter["well"] = this.well_xSelected;//.map(s => "^"+s+"$");
    if(this.well_string_xSelected.length) columnfilter["well_string"] = this.well_string_xSelected;//.map(s => "^"+s+"$");
    if(this.zone_xSelected.length) columnfilter["zone"] = this.zone_xSelected;//.map(s => "^"+s+"$");
    if(this.interval_xSelected.length) columnfilter["interval"] = this.interval_xSelected;
    // if(this.test_date_xSelected.length) columnfilter["test_date"] = this.test_date_xSelected;
    // if(this.test_duration_xSelected.length) columnfilter["test_duration"] = this.test_duration_xSelected;
    if(this.potensi_prod_gross_xSelected.length) columnfilter["potensi_prod_gross"] = this.potensi_prod_gross_xSelected;
    if(this.potensi_prod_net_xSelected.length) columnfilter["potensi_prod_net"] = this.potensi_prod_net_xSelected;
    if(this.tes_prod_gross_xSelected.length) columnfilter["tes_prod_gross"] = this.tes_prod_gross_xSelected;
    if(this.tes_prod_net_xSelected.length) columnfilter["tes_prod_net"] = this.tes_prod_net_xSelected;
    if(this.fig_last_gross_xSelected.length) columnfilter["fig_last_gross"] = this.fig_last_gross_xSelected;
    if(this.fig_last_net_xSelected.length) columnfilter["fig_last_net"] = this.fig_last_net_xSelected;
    if(this.fig_curr_gross_xSelected.length) columnfilter["fig_curr_gross"] = this.fig_curr_gross_xSelected;
    if(this.fig_curr_net_xSelected.length) columnfilter["fig_curr_net"] = this.fig_curr_net_xSelected;
    if(this.thp_last_fig_xSelected.length) columnfilter["thp_last_fig"] = this.thp_last_fig_xSelected;
    if(this.thp_potensi_xSelected.length) columnfilter["thp_potensi"] = this.thp_potensi_xSelected;
    if(this.wc_xSelected.length) columnfilter["wc"] = this.wc_xSelected;
    if(this.gas_xSelected.length) columnfilter["gas"] = this.gas_xSelected;
    if(this.prod_hours_xSelected.length) columnfilter["prod_hours"] = this.prod_hours_xSelected;
    if(this.wor_xSelected.length) columnfilter["wor"] = this.wor_xSelected;
    if(this.gor_xSelected.length) columnfilter["gor"] = this.gor_xSelected;
    if(this.glr_xSelected.length) columnfilter["glr"] = this.glr_xSelected;
    if(this.ls_method_xSelected.length) columnfilter["ls_method"] = this.ls_method_xSelected;
    if(this.ls_brandtype_xSelected.length) columnfilter["ls_brandtype"] = this.ls_brandtype_xSelected;
    if(this.ls_prime_mover_xSelected.length) columnfilter["ls_prime_mover"] = this.ls_prime_mover_xSelected;
    if(this.ls_hp_xSelected.length) columnfilter["ls_hp"] = this.ls_hp_xSelected;
    if(this.ds_size_xSelected.length) columnfilter["ds_size"] = this.ds_size_xSelected;//.map(s => "^"+s+"$");
    if(this.ds_sl_xSelected.length) columnfilter["ds_sl"] = this.ds_sl_xSelected;
    if(this.ds_spm_xSelected.length) columnfilter["ds_spm"] = this.ds_spm_xSelected;
    if(this.ds_bean_xSelected.length) columnfilter["ds_bean"] = this.ds_bean_xSelected;
    if(this.ds_fl_xSelected.length) columnfilter["ds_fl"] = this.ds_fl_xSelected;
    if(this.ds_efficiency_xSelected.length) columnfilter["ds_efficiency"] = this.ds_efficiency_xSelected;
    if(this.ds_whp_xSelected.length) columnfilter["ds_whp"] = this.ds_whp_xSelected;
    if(this.ds_casing_xSelected.length) columnfilter["ds_casing"] = this.ds_casing_xSelected;
    if(this.ds_bean_xSelected.length) columnfilter["ds_separator"] = this.ds_separator_xSelected;
    if(this.ds_kd_xSelected.length) columnfilter["ds_kd"] = this.ds_kd_xSelected;
    if(this.ds_tgl_pengujian_xSelected.length) columnfilter["ds_tgl_pengujian"] = this.ds_tgl_pengujian_xSelected;
    if(this.ds_pump_displace_xSelected.length) columnfilter["ds_pump_displace"] = this.ds_pump_displace_xSelected;
    if(this.sm_xSelected.length) columnfilter["sm"] = this.sm_xSelected;
    if(this.noted_xSelected.length) columnfilter["noted"] = this.noted_xSelected;

    //if(this.start_submitDate) columnfilter['start_submitDate'] = this.start_submitDate;// - date.getTimezoneOffset()*60*1000;//.getTime();
    //if(this.end_submitDate) columnfilter['end_submitDate'] = this.end_submitDate;// - date.getTimezoneOffset()*60*1000;//.getTime();
    //if(this.group) columnfilter['group'] = this.group;
    //if(this.status) columnfilter['status'] = this.status;
    return columnfilter;
  }

  formatInterval(arr) {
    return arr.map(a => a.join("-")).join(", ");
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
        return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.presence_user_workday_cycle_id}`;
  }

  deleteSelected() {
    this.snackbarService.status.next(new SnackbarApi(false));

    const dialogRef = this.dialog.open(PeDailyDeleteDialogComponent, {
      width: '250px',
      data: this.selection.selected.length
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.isLoadingResults = true; 
        this.snackbarService.status.next(new SnackbarApi(false));
        this.http.delete<any>('/api/pe/daily', {
          headers: new HttpHeaders({
            'Content-Type': 'application/json'
          }),
          params: {
            _ids: this.selection.selected.map<any>(s => s._id)
          }
        }).subscribe(res => {
          this.isLoadingResults = false; 
          this.snackbarService.status.next(new SnackbarApi(true, res["deleted_count"] + " item(s) deleted successfully.", "dismiss"));
          this.paginator._changePageSize(this.paginator.pageSize);
		  
        },
        error => {
          this.isLoadingResults = false; 
          this.snackbarService.status.next(new SnackbarApi(true, error['message'], "dismiss"));
		  
        })
      }
    });
  }

}

export interface PeDailyApi {
  items: PeDaily[];
  total_count: number;
}

/*export interface PeDaily {
  PE_TICKET_ID: number;
  ASSET_ID: number;
  ASSET_NAME: string;
}*/

export class MatTableApi {
	constructor(
		public sort: string,
		public order: string,
		public page: number,
		public pagesize: number,
		public filter: string,
    ) {}
}

/** An example database that the data source uses to retrieve data for the table. */
export class ExampleHttpDao {
  constructor(private http: HttpClient) {}

  getRepoIssues(sort: string, order: string, page: number, pagesize: number = 50, filter: string, columnfilter: object, mode: string = "", httpOption: object = {}): Observable<PeDailyApi> {

    var params = {};
    if(sort!=null) params["sort"] = sort;
    if(order!=null) params["order"] = order;
    if(page!=null) params["page"] = page.toString();
    if(pagesize!=null) params["pagesize"] = pagesize.toString();
    if(filter!=null) params["filter"] = filter;
    if(Object.keys(columnfilter).length > 0) params["columnfilter"] = JSON.stringify(columnfilter);
    if(mode != null) params["mode"] = mode;

    httpOption["params"] = params;
	// console.log('Isi data daily: '+httpOption["params"]);
    return this.http.get<PeDailyApi>('/api/pe/daily', httpOption);
  }
}

@Component({
  selector: 'app-daily-delete-dialog',
  template: '<h1 mat-dialog-title>Confirm Delete</h1><div mat-dialog-content>  <p>Confirm delete {{data}} selected item ?</p></div><div mat-dialog-actions>  <button mat-button [mat-dialog-close]="1" >Yes</button> <button mat-button [mat-dialog-close]="0" cdkFocusInitial>No</button> </div>',
  styleUrls: ['./pe-daily.scss']
})

export class PeDailyDeleteDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<PeDailyDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
  
  onYesClick(): void {
    this.dialogRef.close();
  }

}
