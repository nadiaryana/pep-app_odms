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
  selector: 'pe-daily-gas-list',
  templateUrl: './pe-daily-gas-list.component.html',
  styleUrls: ['./pe-daily.scss']
}) 
export class PeDailyGasListComponent implements OnInit {

  displayedColumns: string[] = ["select", "date", "well", "zone", "interval", "test_date", "test_duration", "gas", "art_lift_bean_size", "thp", "chp", "pfl", "psep"];
  headerColumns1: string[] = ["select", "date", "well", "zone", "interval", "test_date", "test_duration", "gas","art_lift_bean_size", "thp", "chp", "pfl", "psep"];
  // headerColumns2: string[] = ["art_lift_bean_size"]
  exampleDatabase: ExampleHttpDao | null;
  data: any[] = [];

  dataSource = new MatTableDataSource<any>(this.data);
  selection = new SelectionModel<any>(true, []);
  isEditing: boolean = false;

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  submitting = false;

  start_submitDate: Number;
  end_submitDate: Number;
  group: string;
  status: string;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  filterControl = new FormControl('gas');

  dateFilter = new FormControl('');
  wellFilter = new FormControl('');
  zoneFilter = new FormControl('');
  intervalFilter = new FormControl('');
  test_dateFilter = new FormControl('');
  test_durationFilter = new FormControl('');
  last_prod_hoursFilter = new FormControl('');
  last_prod_grossFilter = new FormControl('');
  last_prod_netFilter = new FormControl('');
  last_prod_wcFilter = new FormControl('');
  art_lift_sizeFilter = new FormControl('');
  art_lift_typeFilter = new FormControl('');
  art_lift_slFilter = new FormControl('');
  art_lift_spmFilter = new FormControl('');
  art_lift_freqFilter = new FormControl('');
  art_lift_loadFilter = new FormControl('');
  art_lift_bean_sizeFilter = new FormControl('');
  art_lift_efficiencyFilter = new FormControl('');
  chpFilter = new FormControl('');
  pflFilter = new FormControl('');
  psepFilter = new FormControl('');
  pump_intakeFilter = new FormControl('');
  topFilter = new FormControl('');
  midFilter = new FormControl('');
  bottomFilter = new FormControl('');

  date_xSelected = [];
  well_xSelected = [];
  zone_xSelected = [];
  interval_xSelected = [];
  test_date_xSelected = [];
  test_duration_xSelected = [];
  last_prod_hours_xSelected = [];
  last_prod_gross_xSelected = [];
  last_prod_net_xSelected = [];
  last_prod_wc_xSelected = [];
  gas_xSelected = [];
  art_lift_size_xSelected = [];
  art_lift_type_xSelected = [];
  art_lift_sl_xSelected = [];
  art_lift_spm_xSelected = [];
  art_lift_freq_xSelected = [];
  art_lift_load_xSelected = [];
  art_lift_bean_size_xSelected = [];
  art_lift_efficiency_xSelected = [];
  thp_xSelected = [];
  chp_xSelected = [];
  pfl_xSelected = [];
  psep_xSelected = [];
  pump_intake_xSelected = [];
  top_xSelected = [];
  mid_xSelected = [];
  bottom_xSelected = [];
  pump_capacity_xSelected = [];
  pump_efficiency_xSelected = [];
  sonolog_date_xSelected = [];
  sonolog_dfl_xSelected = [];
  sonolog_sfl_xSelected = [];
  sm_xSelected = [];
  ps_xSelected = [];
  pwf_xSelected = [];
  qmax_xSelected = [];
  well_efficiency_xSelected = [];

  filterSubscription: Subscription;
  selectedSubscription: Subscription;
  listSubscription: Subscription;

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
  ) { }

  ngOnInit() {

    this.titleService.titleSource.next({
      title: "Daily",
      icon: "list",
      breadcrumbs: [
        { label: 'Petroleum Engineering', routerLink: '' },
        { label: 'Daily', routerLink: '' }
      ]
    }
    );

    var p_start_submitDate = this.route.snapshot.paramMap.get('start_submitDate');
    if (p_start_submitDate != null && p_start_submitDate.length > 0) {
      //this.start_submitDate = isNaN(Number(p_start_submitDate)) ? new Date(Date.parse(p_start_submitDate)) : new Date(Number(p_start_submitDate));
      this.start_submitDate = Number(p_start_submitDate);
      console.log(this.start_submitDate);
    }
    var p_end_submitDate = this.route.snapshot.paramMap.get('end_submitDate');
    if (p_end_submitDate != null && p_end_submitDate.length > 0) {
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
      if (res) this.getColumnValues(res);
    })
    this.selectedSubscription = this.xfilterService.selected.subscribe(res => {
      this[res["column"] + "_xSelected"] = res["selected"];
    })

    this.listSubscription = merge(
      this.sort.sortChange,
      this.paginator.page,
      this.filterControl.valueChanges.pipe(debounceTime(300)),
      this.dateFilter.valueChanges.pipe(debounceTime(300)),
      this.wellFilter.valueChanges.pipe(debounceTime(300)),
      this.zoneFilter.valueChanges.pipe(debounceTime(300)),
      this.intervalFilter.valueChanges.pipe(debounceTime(300)),
      this.test_dateFilter.valueChanges.pipe(debounceTime(300)),
      this.test_durationFilter.valueChanges.pipe(debounceTime(300)),
      this.last_prod_hoursFilter.valueChanges.pipe(debounceTime(300)),
      this.last_prod_grossFilter.valueChanges.pipe(debounceTime(300)),
      this.last_prod_netFilter.valueChanges.pipe(debounceTime(300)),
      this.last_prod_wcFilter.valueChanges.pipe(debounceTime(300)),
      this.art_lift_sizeFilter.valueChanges.pipe(debounceTime(300)),
      this.art_lift_typeFilter.valueChanges.pipe(debounceTime(300)),
      this.art_lift_slFilter.valueChanges.pipe(debounceTime(300)),
      this.art_lift_spmFilter.valueChanges.pipe(debounceTime(300)),
      this.art_lift_freqFilter.valueChanges.pipe(debounceTime(300)),
      this.art_lift_loadFilter.valueChanges.pipe(debounceTime(300)),
      this.art_lift_bean_sizeFilter.valueChanges.pipe(debounceTime(300)),
      this.art_lift_efficiencyFilter.valueChanges.pipe(debounceTime(300)),
      this.chpFilter.valueChanges.pipe(debounceTime(300)),
      this.pflFilter.valueChanges.pipe(debounceTime(300)),
      this.psepFilter.valueChanges.pipe(debounceTime(300)),
      this.pump_intakeFilter.valueChanges.pipe(debounceTime(300)),
      this.topFilter.valueChanges.pipe(debounceTime(300)),
      this.midFilter.valueChanges.pipe(debounceTime(300)),
      this.bottomFilter.valueChanges.pipe(debounceTime(300)),
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
      console.log("Isinya apa: "+this.data);
      this.dataSource = new MatTableDataSource<any>(this.data);
      this.selection.clear();
    });

  }

  ngOnDestroy() {
    this.filterSubscription.unsubscribe();
    this.selectedSubscription.unsubscribe();
    this.listSubscription.unsubscribe();
  }

  passPermission(path: String) {
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
          { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
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

  getColumnValues(param: any) {
    var column = param["column"];
    var filter = param["filter"];
    var selected = param["selected"]
    var clear = param["clear"];
    var columnfilter = this.getColumnFilter();
    if (filter) columnfilter[column] = [filter];
    if (selected && selected.length > 0) columnfilter[column] = selected.map(s => "^" + s + "$");
    if (clear) delete columnfilter[column];

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
      this.xfilterService.updateItems({ column: column, items: res.items });
    }, () => {

    });
  }

  getColumnFilter() {
    var columnfilter = {};
    if (this.date_xSelected.length) columnfilter["date"] = this.date_xSelected;
    if (this.well_xSelected.length) columnfilter["well"] = this.well_xSelected;//.map(s => "^"+s+"$");
    if (this.zone_xSelected.length) columnfilter["zone"] = this.zone_xSelected;//.map(s => "^"+s+"$");
    if (this.interval_xSelected.length) columnfilter["interval"] = this.interval_xSelected;
    if (this.test_date_xSelected.length) columnfilter["test_date"] = this.test_date_xSelected;
    if (this.test_duration_xSelected.length) columnfilter["test_duration"] = this.test_duration_xSelected;
    if (this.last_prod_hours_xSelected.length) columnfilter["last_prod_hours"] = this.last_prod_hours_xSelected;
    if (this.last_prod_gross_xSelected.length) columnfilter["last_prod_gross"] = this.last_prod_gross_xSelected;
    if (this.last_prod_net_xSelected.length) columnfilter["last_prod_net"] = this.last_prod_net_xSelected;
    if (this.last_prod_wc_xSelected.length) columnfilter["last_prod_wc"] = this.last_prod_wc_xSelected;
    if (this.gas_xSelected.length) columnfilter["gas"] = this.gas_xSelected;
    if (this.art_lift_size_xSelected.length) columnfilter["art_lift_size"] = this.art_lift_size_xSelected;//.map(s => "^"+s+"$");
    if (this.art_lift_type_xSelected.length) columnfilter["art_lift_type"] = this.art_lift_type_xSelected;//.map(s => "^"+s+"$");
    if (this.art_lift_sl_xSelected.length) columnfilter["art_lift_sl"] = this.art_lift_sl_xSelected;
    if (this.art_lift_spm_xSelected.length) columnfilter["art_lift_spm"] = this.art_lift_spm_xSelected;
    if (this.art_lift_freq_xSelected.length) columnfilter["art_lift_freq"] = this.art_lift_freq_xSelected;
    if (this.art_lift_load_xSelected.length) columnfilter["art_lift_load"] = this.art_lift_load_xSelected;
    if (this.art_lift_bean_size_xSelected.length) columnfilter["art_lift_bean_size"] = this.art_lift_bean_size_xSelected;
    if (this.art_lift_efficiency_xSelected.length) columnfilter["art_lift_efficiency"] = this.art_lift_efficiency_xSelected;
    if (this.thp_xSelected.length) columnfilter["thp"] = this.thp_xSelected;
    if (this.chp_xSelected.length) columnfilter["chp"] = this.chp_xSelected;
    if (this.pfl_xSelected.length) columnfilter["pfl"] = this.pfl_xSelected;
    if (this.psep_xSelected.length) columnfilter["psep"] = this.psep_xSelected;
    if (this.pump_intake_xSelected.length) columnfilter["pump_intake"] = this.pump_intake_xSelected;
    if (this.top_xSelected.length) columnfilter["top"] = this.top_xSelected;
    if (this.mid_xSelected.length) columnfilter["mid"] = this.mid_xSelected;
    if (this.bottom_xSelected.length) columnfilter["bottom"] = this.bottom_xSelected;
    if (this.pump_capacity_xSelected.length) columnfilter["pump_capacity"] = this.pump_capacity_xSelected;
    if (this.pump_efficiency_xSelected.length) columnfilter["pump_efficiency"] = this.pump_efficiency_xSelected;
    if (this.sonolog_date_xSelected.length) columnfilter["sonolog_date"] = this.sonolog_date_xSelected;
    if (this.sonolog_dfl_xSelected.length) columnfilter["sonolog_dfl"] = this.sonolog_dfl_xSelected;
    if (this.sonolog_sfl_xSelected.length) columnfilter["sonolog_sfl"] = this.sonolog_sfl_xSelected;
    if (this.sm_xSelected.length) columnfilter["sm"] = this.sm_xSelected;
    if (this.ps_xSelected.length) columnfilter["ps"] = this.ps_xSelected;
    if (this.pwf_xSelected.length) columnfilter["pwf"] = this.pwf_xSelected;
    if (this.qmax_xSelected.length) columnfilter["qmax"] = this.qmax_xSelected;
    if (this.well_efficiency_xSelected.length) columnfilter["well_efficiency"] = this.well_efficiency_xSelected;
	
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

    const dialogRef = this.dialog.open(PeDailyGasDeleteDialogComponent, {
      width: '250px',
      data: this.selection.selected.length
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
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

export interface editR {
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
  ) { }
}

/** An example database that the data source uses to retrieve data for the table. */
export class ExampleHttpDao {
  constructor(private http: HttpClient) { }

  getRepoIssues(sort: string, order: string, page: number, pagesize: number = 50, filter: string = "gas", columnfilter: object, mode: string = "", httpOption: object = {}): Observable<any> {

    var params = {};
    if (sort != null) params["sort"] = sort;
    if (order != null) params["order"] = order;
    if (page != null) params["page"] = page.toString();
    if (pagesize != null) params["pagesize"] = pagesize.toString();
    if (filter != null) params["filter"] = filter;
    if (Object.keys(columnfilter).length > 0) params["columnfilter"] = JSON.stringify(columnfilter);
    if (mode != null) params["mode"] = mode;

    httpOption["params"] = params;

    return this.http.get<any>('/api/pe/daily', httpOption);
  }
} 

@Component({
  selector: 'app-daily-delete-dialog',
  template: '<h1 mat-dialog-title>Confirm Delete</h1><div mat-dialog-content>  <p>Confirm delete {{data}} selected item ?</p></div><div mat-dialog-actions>  <button mat-button [mat-dialog-close]="1" >Yes</button> <button mat-button [mat-dialog-close]="0" cdkFocusInitial>No</button> </div>',
  styleUrls: ['./pe-daily.scss']
})

export class PeDailyGasDeleteDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<PeDailyGasDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {
    this.dialogRef.close();
  }

}

