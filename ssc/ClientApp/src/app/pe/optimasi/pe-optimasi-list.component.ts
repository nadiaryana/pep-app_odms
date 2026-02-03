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
import { PeDaily } from '../daily/pe-daily';
// import { ExampleHttpDao } from '../daily/pe-daily-list.component';

@Component({
  selector: 'app-pe-optimasi-list',
  templateUrl: './pe-optimasi-list.component.html',
  styleUrls: ['../daily/pe-daily.scss']
})
export class PeOptimasiListComponent implements OnInit {

  displayedColumns: string[] = ['select','well', 'avg_sm', 'avg_ds_efficiency'];

  headerColumns1: string[] = ["select","well", "avg_sm", "avg_ds_efficiency"];


    @ViewChild('start_datePicker', { static: true }) start_datePicker: MatDatepicker<any>;
    start_dateControl = new FormControl();
    start_dateInput = this.start_dateControl.value
      ? this.start_dateControl.value.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
          day: "numeric",
        })
      : "";  
    
    @ViewChild('end_datePicker', { static: true }) end_datePicker: MatDatepicker<any>;
    // end_dateControl = new FormControl(new Date(new Date().setDate(new Date().getDate() - 1)));
    end_dateControl = new FormControl();
    end_dateInput = this.end_dateControl.value ? this.end_dateControl.value.toLocaleDateString("en-US", { month: "short", year: "numeric", day: "numeric" }) : "";
  
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

    start_dateFilter = new FormControl('');
    end_dateFilter = new FormControl('');
    wellFilter = new FormControl('');
    dateFilter = new FormControl('');
    avg_wcFilter = new FormControl('');
    avg_smFilter = new FormControl('');
    avg_ds_efficiencyFilter = new FormControl('');

    date_xSelected = [];
    well_xSelected = [];
    avg_wc_xSelected = [];
    avg_sm_xSelected = [];
    avg_ds_efficiency_xSelected = [];

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
    this.titleService.titleSource.next({
      title: "Optimasi",
      icon: "analytics",
      breadcrumbs: [
        { label: 'Petroleum Engineering', routerLink: '' },
        { label: 'Daily Optimasi', routerLink: '' }
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
      // this.dateFilter.valueChanges.pipe(debounceTime(300)),
      this.start_dateControl.valueChanges.pipe(debounceTime(300)),
      this.end_dateControl.valueChanges.pipe(debounceTime(300)),
      this.dateFilter.valueChanges.pipe(debounceTime(300)),
      this.wellFilter.valueChanges.pipe(debounceTime(300)),
      this.avg_wcFilter.valueChanges.pipe(debounceTime(300)),
      this.avg_smFilter.valueChanges.pipe(debounceTime(300)),
      this.avg_ds_efficiencyFilter.valueChanges.pipe(debounceTime(300)),

      this.xfilterService.selected,
    ).pipe(
      startWith({}),
      switchMap(() => {
        if (!this.start_dateControl.value || !this.end_dateControl.value) {
          return observableOf({
            items: [],
            total_count: 0
          });
        }
        this.isLoadingResults = true;
        var columnfilter = this.getColumnFilter();
        return this.exampleDatabase!.getRepoIssues(
          this.sort.active,
          this.sort.direction,
          this.paginator.pageIndex,
          this.paginator.pageSize,
          this.filterControl.value,
          columnfilter,
          "",
          {},
          this.start_dateControl.value,
          this.end_dateControl.value
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
      column,
      {},
      // this.end_dateInput
      this.start_dateControl.value,
      this.end_dateControl.value
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
    if (this.avg_wc_xSelected.length) columnfilter["avg_wc"] = this.avg_wc_xSelected;
    if (this.avg_sm_xSelected.length) columnfilter["avg_sm"] = this.avg_sm_xSelected;
    if (this.avg_ds_efficiency_xSelected.length) columnfilter["avg_ds_efficiency"] = this.avg_ds_efficiency_xSelected;
	
    //if(this.start_submitDate) columnfilter['start_submitDate'] = this.start_submitDate;// - date.getTimezoneOffset()*60*1000;//.getTime();
    if(this.end_submitDate) columnfilter['end_submitDate'] = this.end_submitDate;// - date.getTimezoneOffset()*60*1000;//.getTime();
    //if(this.group) columnfilter['group'] = this.group;
    //if(this.status) columnfilter['status'] = this.status;
    return columnfilter;
	
  }
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
  
      const dialogRef = this.dialog.open(PeDailyChanPlotDeleteDialogComponent, {
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

    
  formatDate(date: Date): string {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
      day: 'numeric'
    });
  }

  start_dateChange(event: any) {
  if (!event.value) return;

  this.start_dateControl.setValue(event.value);
  this.start_dateInput = this.formatDate(event.value);

  // this.loadData();
  }

  end_dateChange(event: any) {
    if (!event.value) return;

    this.end_dateControl.setValue(event.value);
    this.end_dateInput = this.formatDate(event.value);

    // this.loadData();
  }
}

export interface editR {
  items: PeDaily[];
  total_count: number;
}

export class MatTableApi {
  constructor(
    public sort: string,
    public order: string,
    public page: number,
    public pagesize: number,
    public filter: string,
  ) { }
}

export class ExampleHttpDao {
  constructor(private http: HttpClient) { }

  getRepoIssues(sort: string, order: string, page: number, pagesize: number = 50, filter: string, columnfilter: object, mode: string = "", httpOption: object = {}, startDate: Date, endDate: Date): Observable<any> {

    var params = {};
    if (sort != null) params["sort"] = sort;
    if (order != null) params["order"] = order;
    if (page != null) params["page"] = page.toString();
    if (pagesize != null) params["pagesize"] = pagesize.toString();
    if (filter != null) params["filter"] = filter;
    if (Object.keys(columnfilter).length > 0) params["columnfilter"] = JSON.stringify(columnfilter);
    if (mode != null) params["mode"] = mode;

    // Gunakan format ISO untuk backend
    params["startDate"] = startDate.toISOString();
    params["endDate"] = endDate.toISOString();

    httpOption["params"] = params;

    // Gunakan endpoint optimasi yang sudah dibuat
    return this.http.get<any>('/api/pe/daily/optimasi', httpOption);
  }
} 

@Component({
  selector: 'app-daily-delete-dialog',
  template: '<h1 mat-dialog-title>Confirm Delete</h1><div mat-dialog-content>  <p>Confirm delete {{data}} selected item ?</p></div><div mat-dialog-actions>  <button mat-button [mat-dialog-close]="1" >Yes</button> <button mat-button [mat-dialog-close]="0" cdkFocusInitial>No</button> </div>',
  styleUrls: ['./pe-optimasi.scss']
})

export class PeDailyChanPlotDeleteDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<PeDailyChanPlotDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {
    this.dialogRef.close();
  }

}

