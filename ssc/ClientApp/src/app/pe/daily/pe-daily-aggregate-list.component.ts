import { HttpClient, HttpParams, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild, Inject, OnDestroy } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA, MatDatepicker } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';
import { merge, Observable, of as observableOf, Subscription } from 'rxjs';
import { catchError, map, startWith, switchMap, debounceTime } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { SelectionModel } from '@angular/cdk/collections';

// import { PeDailyService } from './pe-daily.service';
// import { PeDaily } from './pe-daily';
import { SnackbarService } from '../../snackbar.service';
import { SnackbarApi } from '../../snackbar.service';
import { PePermissionService } from '../pe-permission.service';
import { TitleService } from '../../navigation/title/title.service';
import { xFilterService } from '../../xfilter/xfilter.component';
import { CommonService } from '../../common.service';

@Component({
  selector: 'pe-daily-aggregate-list',
  templateUrl: './pe-daily-aggregate-list.component.html',
  styleUrls: ['./pe-daily.scss'],
})

export class PeDailyAggregateListComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = [
    'select','well',

    // YESTERDAY
    'fig_curr_gross_prev',
    'fig_curr_net_prev',
    'wc_prev',
    'gas_prev',
    'ds_efficiency_prev',
    'sm_prev',

    // TODAY
    'fig_curr_gross_today',
    'fig_curr_net_today',
    'wc_today',
    'gas_today',
    'ds_efficiency_today',
    'sm_today',

    // DELTA
    'delta_fig_curr_gross',
    'delta_fig_curr_net',
    'delta_wc',
    'delta_gas',
    'delta_ds_efficiency',
    'delta_sm'
  ];


  headerColumns1: string[] = [
    "select","well",
    'yesterday',"today","delta"];

  headerColumns2: string[] = [
    'fig_curr_gross_prev','fig_curr_net_prev','wc_prev','gas_prev','ds_efficiency_prev', 'sm_prev',
    "fig_curr_gross_today","fig_curr_net_today","wc_today","gas_today","ds_efficiency_today","sm_today",
    "delta_fig_curr_gross","delta_fig_curr_net","delta_wc","delta_gas","delta_ds_efficiency","delta_sm"];

  @ViewChild('start_datePicker', { static: true }) start_datePicker: MatDatepicker<any>;
  start_dateControl = new FormControl(new Date());
  start_dateInput = this.start_dateControl.value
    ? this.start_dateControl.value.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
        day: "numeric",
      })
    : "";  
  
  @ViewChild('end_datePicker', { static: true }) end_datePicker: MatDatepicker<any>;
  end_dateControl = new FormControl(new Date(new Date().setDate(new Date().getDate() - 1)));
  end_dateInput = this.end_dateControl.value.toLocaleDateString("en-US", { month: "short", year: "numeric", day: "numeric" });

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
  filterControl = new FormControl('');

  dateFilter = new FormControl('');
  wellFilter = new FormControl('');
  fig_curr_grossFilter = new FormControl('');
  fig_curr_netFilter = new FormControl('');
  // wor = new FormControl('');
  wcFilter = new FormControl('');
  gasFilter = new FormControl('');
  ds_efficiencyFilter = new FormControl('');
  

  date_xSelected = [];
  well_xSelected = [];
  fig_curr_gross_xSelected = [];
  fig_curr_net_xSelected = [];
  gas_xSelected = [];
  sm_xSelected = [];
  wor_xSelected = [];
  wc_xSelected = [];
  ds_efficiency_xSelected = [];


  filterSubscription: Subscription;
  selectedSubscription: Subscription;
  listSubscription: Subscription;
  
  constructor(
    private http: HttpClient,
    private router: Router,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    // private pe_dailyService: PeDailyService,
    public snackbarService: SnackbarService,
    public pePermissionService: PePermissionService,
    private titleService: TitleService,
    private route: ActivatedRoute,
    private xfilterService: xFilterService,
    public commonService: CommonService,
  ) { }

  ngOnInit() {
    this.loadData();
	this.titleService.titleSource.next({
      title: "Aggregate",
      icon: "trending_up",
      breadcrumbs: [
        { label: 'Petroleum Engineering', routerLink: '' },
        { label: 'Daily Aggregate', routerLink: '' }
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
      this.fig_curr_grossFilter.valueChanges.pipe(debounceTime(300)),
      this.fig_curr_netFilter.valueChanges.pipe(debounceTime(300)),
      this.ds_efficiencyFilter.valueChanges.pipe(debounceTime(300)),
      this.wcFilter.valueChanges.pipe(debounceTime(300)),
      this.gasFilter.valueChanges.pipe(debounceTime(300)),

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

  start_dateChange(evt) {
    this.start_dateInput = evt.value.toLocaleDateString("en-US", { month: "short", year: "numeric", day: "numeric" });
    this.loadData();
  }

  end_dateChange(evt) {
    this.end_dateInput = evt.value.toLocaleDateString("en-US", { month: "short", year: "numeric", day: "numeric" });
    this.loadData();
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
    if (this.fig_curr_gross_xSelected.length) columnfilter["fig_curr_gross"] = this.fig_curr_gross_xSelected;
    if (this.fig_curr_net_xSelected.length) columnfilter["fig_curr_net"] = this.fig_curr_net_xSelected;
    if (this.gas_xSelected.length) columnfilter["gas"] = this.gas_xSelected;
    if (this.sm_xSelected.length) columnfilter["sm"] = this.sm_xSelected;
    if (this.wor_xSelected.length) columnfilter["wor"] = this.wor_xSelected;
    if (this.ds_efficiency_xSelected.length) columnfilter["ds_efficiency"] = this.ds_efficiency_xSelected;
	
    //if(this.start_submitDate) columnfilter['start_submitDate'] = this.start_submitDate;// - date.getTimezoneOffset()*60*1000;//.getTime();
    if(this.end_submitDate) columnfilter['end_submitDate'] = this.end_submitDate;// - date.getTimezoneOffset()*60*1000;//.getTime();
    //if(this.group) columnfilter['group'] = this.group;
    //if(this.status) columnfilter['status'] = this.status;
    return columnfilter;
	
  }

  getDeltaClass(value: number): string {
  if (value > 0) return 'delta-up';
  if (value < 0) return 'delta-down';
  return 'delta-flat';
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

    const dialogRef = this.dialog.open(PeDailyAggregateDeleteDialogComponent, {
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

  loadData() {
    this.http.get<any>('/api/pe/daily/delta', {
      params: {
        mode: 'delta',
        page: '0',
        pagesize: '50',
        date: this.end_dateControl.value.toISOString(),
      }
    }).subscribe(res => {
      res.items.forEach(x => {
        console.log(
          x.well,
          'TODAY:', x.fig_curr_gross_today,
          'YESTERDAY:', x.fig_curr_gross_prev
        );
      });

      this.dataSource.data = res.items;
      this.resultsLength = res.total_count;
      this.isLoadingResults = false;
    });
  }

}



export interface editR {
  // items: PeDaily[];
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

  getRepoIssues(sort: string, order: string, page: number, pagesize: number = 50, filter: string, columnfilter: object, mode: string = "", httpOption: object = {}): Observable<any> {

    var params = {};
    if (sort != null) params["sort"] = sort;
    if (order != null) params["order"] = order;
    if (page != null) params["page"] = page.toString();
    if (pagesize != null) params["pagesize"] = pagesize.toString();
    if (filter != null) params["filter"] = filter;
    if (Object.keys(columnfilter).length > 0) params["columnfilter"] = JSON.stringify(columnfilter);
    if (mode != null) params["mode"] = mode;

    params["date"] =  new Date().toISOString(); 

    httpOption["params"] = params;

    return this.http.get<any>('/api/pe/daily/delta', httpOption);
  }
} 

@Component({
  selector: 'app-daily-delete-dialog',
  template: '<h1 mat-dialog-title>Confirm Delete</h1><div mat-dialog-content>  <p>Confirm delete {{data}} selected item ?</p></div><div mat-dialog-actions>  <button mat-button [mat-dialog-close]="1" >Yes</button> <button mat-button [mat-dialog-close]="0" cdkFocusInitial>No</button> </div>',
  // styleUrls: ['./pe-daily.scss']
})

export class PeDailyAggregateDeleteDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<PeDailyAggregateDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {
    this.dialogRef.close();
  }

}