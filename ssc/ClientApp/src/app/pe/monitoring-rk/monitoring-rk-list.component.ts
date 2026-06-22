import { HttpClient, HttpParams, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';
import { merge, Observable, of as observableOf, Subscription } from 'rxjs';
import { catchError, map, startWith, switchMap, debounceTime } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { SelectionModel } from '@angular/cdk/collections';

import { MonitoringRKService } from './monitoring-rk.service';
import { MonitoringRK } from './monitoring-rk';
import { Barchart } from '../barchart/barchart';
import { SnackbarService } from '../../snackbar.service';
import { SnackbarApi } from '../../snackbar.service';
import { PePermissionService } from '../pe-permission.service';
import { TitleService } from '../../navigation/title/title.service';
import { xFilterService } from '../../xfilter/xfilter.component';
import { CommonService } from '../../common.service';


@Component({
  selector: 'monitoring-rk-list',
  templateUrl: './monitoring-rk-list.component.html',
  styleUrls: ['./monitoring-rk.scss']
})
export class MonitoringRKListComponent implements OnInit {

  // ==================== BARCHART TABLE (TOP) ====================
  barchartDisplayedColumns: string[] = ["bc_well", "bc_job", "bc_rig", "bc_plan_start", "bc_plan_end", "bc_remarks"];
  barchartData: Barchart[] = [];
  barchartResultsLength = 0;
  barchartIsLoadingResults = true;
  barchartIsRateLimitReached = false;
  barchartIsEditing = false;
  barchartExampleDatabase: BarchartHttpDao | null;

  @ViewChild('barchartPaginator', { static: true }) barchartPaginator: MatPaginator;
  @ViewChild('barchartSort', { static: true }) barchartSort: MatSort;

  bc_filterControl = new FormControl('');
  bc_wellFilter = new FormControl('');
  bc_jobFilter = new FormControl('');
  bc_rigFilter = new FormControl('');
  bc_plan_startFilter = new FormControl('');
  bc_plan_endFilter = new FormControl('');
  bc_remarksFilter = new FormControl('');

  bc_well_xSelected: any[] = [];
  bc_job_xSelected: any[] = [];
  bc_rig_xSelected: any[] = [];
  bc_plan_start_xSelected: any[] = [];
  bc_plan_end_xSelected: any[] = [];
  bc_remarks_xSelected: any[] = [];

  bc_filterSubscription: Subscription;
  bc_selectedSubscription: Subscription;

  // ==================== MONITORING RK TABLE (BOTTOM) ====================
  rk_displayedColumns: string[] = ["select", "well", "job", "rig", "plan_start", "plan_end", "remarks"];
  rkExampleDatabase: MonitoringRKHttpDao | null;
  rk_data: MonitoringRK[] = [];
  rk_dataSource = new MatTableDataSource<any>(this.rk_data);
  rk_selection = new SelectionModel<any>(true, []);
  rk_isEditing: boolean = false;
  rk_resultsLength = 0;
  rk_isLoadingResults = true;
  rk_isRateLimitReached = false;
  rk_submitting = false;

  @ViewChild('rkPaginator', { static: true }) rkPaginator: MatPaginator;
  @ViewChild('rkSort', { static: true }) rkSort: MatSort;
  rk_filterControl = new FormControl('');

  rk_wellFilter = new FormControl('');
  rk_jobFilter = new FormControl('');
  rk_rigFilter = new FormControl('');
  rk_plan_startFilter = new FormControl('');
  rk_plan_endFilter = new FormControl('');
  rk_remarksFilter = new FormControl('');

  well_xSelected = [];
  job_xSelected = [];
  rig_xSelected = [];
  plan_start_xSelected = [];
  plan_end_xSelected = [];
  remarks_xSelected = [];

  barchart_listSubscription: Subscription;
  rk_filterSubscription: Subscription;
  rk_selectedSubscription: Subscription;
  rk_listSubscription: Subscription;

  constructor(
    private http: HttpClient,
    private router: Router,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private monitoringRKService: MonitoringRKService,
    public snackbarService: SnackbarService,
    public pePermissionService: PePermissionService,
    private titleService: TitleService,
    private route: ActivatedRoute,
    private xfilterService: xFilterService,
    public commonService: CommonService,
  ) { }

  ngOnInit() {

    // Set judul & breadcrumbs halaman
    this.titleService.titleSource.next({
      title: "Monitoring RK",
      icon: "bar_chart",
      breadcrumbs: [
        { label: 'Petroleum Engineering', routerLink: '' },
        { label: 'Monitoring RK', routerLink: '' }
      ]
    });

    // ====================================================================
    // BARCHART TABLE — data dari API /api/pe/barchart (read-only)
    // Pakai prefix "bc_" untuk xFilter agar tidak bentrok dengan RK table
    // ====================================================================
    this.barchartExampleDatabase = new BarchartHttpDao(this.http);
    // Reset paginator ke halaman 1 setiap kali sorting berubah
    this.barchartSort.sortChange.subscribe(() => this.barchartPaginator.pageIndex = 0);

    // Filter xFilter: hanya proses event dengan column prefix "bc_"
    this.bc_filterSubscription = this.xfilterService.filter.subscribe(res => {
      if (res && res["column"] && res["column"].indexOf("bc_") === 0) this.bcGetColumnValues(res);
    });
    // Selected xFilter: update state untuk column prefix "bc_"
    this.bc_selectedSubscription = this.xfilterService.selected.subscribe(res => {
      var key = res["column"];
      if (key && key.indexOf("bc_") === 0) {
        (this as any)[key + "_xSelected"] = res["selected"];
      }
    });

    // Observable utama: reload data saat sort, page, filter, atau xSelected berubah
    this.barchart_listSubscription = merge(
      this.barchartSort.sortChange,
      this.barchartPaginator.page,
      this.bc_filterControl.valueChanges.pipe(debounceTime(300)),
      this.bc_wellFilter.valueChanges.pipe(debounceTime(300)),
      this.bc_jobFilter.valueChanges.pipe(debounceTime(300)),
      this.bc_rigFilter.valueChanges.pipe(debounceTime(300)),
      this.bc_plan_startFilter.valueChanges.pipe(debounceTime(300)),
      this.bc_plan_endFilter.valueChanges.pipe(debounceTime(300)),
      this.bc_remarksFilter.valueChanges.pipe(debounceTime(300)),
      this.xfilterService.selected,
    ).pipe(
      startWith({}),               // Trigger pertama kali saat komponen di-load
      switchMap(() => {
        this.barchartIsLoadingResults = true;
        var columnfilter = this.bcGetColumnFilter();
        return this.barchartExampleDatabase!.getRepoIssues(
          this.barchartSort.active,
          this.barchartSort.direction,
          this.barchartPaginator.pageIndex,
          this.barchartPaginator.pageSize,
          this.bc_filterControl.value,
          columnfilter,
        );
      }),
      map(data => {
        this.barchartIsLoadingResults = false;
        this.barchartIsRateLimitReached = false;
        this.barchartResultsLength = data.total_count;
        return data.items;
      }),
      catchError(() => {
        this.barchartIsLoadingResults = false;
        this.barchartIsRateLimitReached = true;
        return observableOf([]);
      })
    ).subscribe(data => {
      this.barchartData = data;
    });

    // ====================================================================
    // MONITORING RK TABLE — data dari API /api/pe/MonitoringRK (bisa dihapus)
    // Filter xFilter hanya untuk column tanpa prefix "bc_" (milik RK sendiri)
    // ====================================================================
    this.rkExampleDatabase = new MonitoringRKHttpDao(this.http);
    this.rkSort.sortChange.subscribe(() => this.rkPaginator.pageIndex = 0);

    // Filter xFilter: hanya proses event dengan column TANPA prefix "bc_"
    this.rk_filterSubscription = this.xfilterService.filter.subscribe(res => {
      if (res && res["column"] && res["column"].indexOf("bc_") !== 0) this.rkGetColumnValues(res);
    })
    // Selected xFilter: hanya update state untuk column TANPA prefix "bc_"
    this.rk_selectedSubscription = this.xfilterService.selected.subscribe(res => {
      if (res["column"] && res["column"].indexOf("bc_") !== 0) {
        (this as any)[res["column"] + "_xSelected"] = res["selected"];
      }
    })

    // Observable utama: reload data saat sort/page/filter/xSelected berubah
    this.rk_listSubscription = merge(
      this.rkSort.sortChange,
      this.rkPaginator.page,
      this.rk_filterControl.valueChanges.pipe(debounceTime(300)),
      this.rk_wellFilter.valueChanges.pipe(debounceTime(300)),
      this.rk_jobFilter.valueChanges.pipe(debounceTime(300)),
      this.rk_rigFilter.valueChanges.pipe(debounceTime(300)),
      this.rk_plan_startFilter.valueChanges.pipe(debounceTime(300)),
      this.rk_plan_endFilter.valueChanges.pipe(debounceTime(300)),
      this.rk_remarksFilter.valueChanges.pipe(debounceTime(300)),
      this.xfilterService.selected,
    ).pipe(
      startWith({}),
      switchMap(() => {
        this.rk_isLoadingResults = true;
        var columnfilter = this.rkGetColumnFilter();
        return this.rkExampleDatabase!.getRepoIssues(
          this.rkSort.active,
          this.rkSort.direction,
          this.rkPaginator.pageIndex,
          this.rkPaginator.pageSize,
          this.rk_filterControl.value,
          columnfilter,
        );
      }),
      map(data => {
        this.rk_isLoadingResults = false;
        this.rk_isRateLimitReached = false;
        this.rk_resultsLength = data.total_count;
        return data.items;
      }),
      catchError(() => {
        this.rk_isLoadingResults = false;
        this.rk_isRateLimitReached = true;
        return observableOf([]);
      })
    ).subscribe(data => {
      this.rk_data = data;
      this.rk_dataSource = new MatTableDataSource<any>(this.rk_data);
      this.rk_selection.clear();
    });
  }

  /** Cleanup: unsubscribe semua subscription saat komponen di-destroy */
  ngOnDestroy() {
    if (this.bc_filterSubscription) this.bc_filterSubscription.unsubscribe();
    if (this.bc_selectedSubscription) this.bc_selectedSubscription.unsubscribe();
    if (this.barchart_listSubscription) this.barchart_listSubscription.unsubscribe();
    if (this.rk_filterSubscription) this.rk_filterSubscription.unsubscribe();
    if (this.rk_selectedSubscription) this.rk_selectedSubscription.unsubscribe();
    if (this.rk_listSubscription) this.rk_listSubscription.unsubscribe();
  }

  /** Cek permission menu berdasarkan path */
  passPermission(path: String) {
    return this.pePermissionService.passPermission(path);
  }

  // ====================================================================
  // BARCHART — ambil daftar value unik tiap kolom untuk popup xFilter
  // Column name di-xFilter pakai prefix "bc_" → dipetakan ke nama asli API
  // ====================================================================
  bcGetColumnValues(param: any) {
    var column = param["column"];
    var filter = param["filter"];
    var selected = param["selected"]
    var clear = param["clear"];
    var columnfilter: any = this.bcGetColumnFilter();
    // Hapus prefix "bc_" untuk dapat nama kolom asli di API
    var apiColumn = column.replace("bc_", "");
    if (filter) columnfilter[apiColumn] = [filter];
    if (selected && selected.length > 0) columnfilter[apiColumn] = selected.map((s: any) => "^" + s + "$");
    if (clear) delete columnfilter[apiColumn];

    return this.barchartExampleDatabase!.getRepoIssues(
      this.barchartSort.active,
      this.barchartSort.direction,
      this.barchartPaginator.pageIndex,
      this.barchartPaginator.pageSize,
      this.bc_filterControl.value,
      columnfilter,
      apiColumn
    ).pipe(map((res) => {
      return res;
    })).subscribe(res => {
      this.xfilterService.updateItems({ column: column, items: res.items });
    }, () => {});
  }

  /** Kumpulkan semua filter aktif Barchart → object untuk dikirim ke API */
  bcGetColumnFilter() {
    var columnfilter: any = {};
    if (this.bc_well_xSelected.length) columnfilter["well"] = this.bc_well_xSelected;
    if (this.bc_job_xSelected.length) columnfilter["job"] = this.bc_job_xSelected;
    if (this.bc_rig_xSelected.length) columnfilter["rig"] = this.bc_rig_xSelected;
    if (this.bc_plan_start_xSelected.length) columnfilter["plan_start"] = this.bc_plan_start_xSelected;
    if (this.bc_plan_end_xSelected.length) columnfilter["plan_end"] = this.bc_plan_end_xSelected;
    if (this.bc_remarks_xSelected.length) columnfilter["remarks"] = this.bc_remarks_xSelected;
    return columnfilter;
  }

  // ========== MONITORING RK METHODS ==========
  rkExportExcel() {

    const httpOption: Object = {
      observe: 'response',
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: 'arraybuffer'
    };
    this.rk_isLoadingResults = true;
    var columnfilter = this.rkGetColumnFilter();

    this.rkExampleDatabase!.getRepoIssues(
      this.rkSort.active,
      this.rkSort.direction,
      this.rkPaginator.pageIndex,
      this.rkPaginator.pageSize,
      this.rk_filterControl.value,
      columnfilter,
      "excel",
      httpOption
    ).pipe(map((res: any) => {
      this.rk_isLoadingResults = false;
      return {
        filename: 'MonitoringRK.xlsx',
        data: new Blob(
          [res['body']],
          { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
        ),
      };
    })).subscribe(res => {
      const link = window.URL.createObjectURL(res.data);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = link;
      a.download = res.filename;
      a.click();
      window.URL.revokeObjectURL(link);
      a.remove();
    }, error => {
      this.rk_isLoadingResults = false;
      this.snackbarService.status.next(new SnackbarApi(true, error['message'], 'dismiss'));
      console.log(error);
    }, () => {
      console.log('Completed file download.');
    });
  }

  rkGetColumnValues(param: any) {
    var column = param["column"];
    var filter = param["filter"];
    var selected = param["selected"]
    var clear = param["clear"];
    var columnfilter: any = this.rkGetColumnFilter();
    if (filter) columnfilter[column] = [filter];
    if (selected && selected.length > 0) columnfilter[column] = selected.map((s: any) => "^" + s + "$");
    if (clear) delete columnfilter[column];

    return this.rkExampleDatabase!.getRepoIssues(
      this.rkSort.active,
      this.rkSort.direction,
      this.rkPaginator.pageIndex,
      this.rkPaginator.pageSize,
      this.rk_filterControl.value,
      columnfilter,
      column
    ).pipe(map((res) => {
      return res;
    })).subscribe(res => {
      this.xfilterService.updateItems({ column: column, items: res.items });
    }, () => {

    });
  }

  rkGetColumnFilter() {
    var columnfilter: any = {};
    if (this.well_xSelected.length) columnfilter["well"] = this.well_xSelected;
    if (this.job_xSelected.length) columnfilter["job"] = this.job_xSelected;
    if (this.rig_xSelected.length) columnfilter["rig"] = this.rig_xSelected;
    if (this.plan_start_xSelected.length) columnfilter["plan_start"] = this.plan_start_xSelected;
    if (this.plan_end_xSelected.length) columnfilter["plan_end"] = this.plan_end_xSelected;
    if (this.remarks_xSelected.length) columnfilter["remarks"] = this.remarks_xSelected;
    return columnfilter;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  rkIsAllSelected() {
    const numSelected = this.rk_selection.selected.length;
    const numRows = this.rk_dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  rkMasterToggle() {
    this.rkIsAllSelected() ?
      this.rk_selection.clear() :
      this.rk_dataSource.data.forEach(row => this.rk_selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  rkCheckboxLabel(row?: any): string {
    if (!row) {
      return `${this.rkIsAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.rk_selection.isSelected(row) ? 'deselect' : 'select'} row ${row._id}`;
  }

  rkDeleteSelected() {
    this.snackbarService.status.next(new SnackbarApi(false));

    const dialogRef = this.dialog.open(MonitoringRKDeleteDialogComponent, {
      width: '250px',
      data: this.rk_selection.selected.length
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.rk_isLoadingResults = true;
        this.snackbarService.status.next(new SnackbarApi(false));
        this.http.delete<any>('/api/pe/MonitoringRK', {
          headers: new HttpHeaders({
            'Content-Type': 'application/json'
          }),
          params: {
            _ids: this.rk_selection.selected.map<any>(s => s._id)
          }
        }).subscribe(res => {
          this.rk_isLoadingResults = false;
          this.snackbarService.status.next(new SnackbarApi(true, res["deleted_count"] + " item(s) deleted successfully.", "dismiss"));
          this.rkPaginator._changePageSize(this.rkPaginator.pageSize);
        },
          error => {
            this.rk_isLoadingResults = false;
            this.snackbarService.status.next(new SnackbarApi(true, error['message'], "dismiss"));
          })
      }
    });
  }

}

// ==================== INTERFACES ====================
export interface MonitoringRKApi {
  items: MonitoringRK[];
  total_count: number;
}

export interface BarchartApi {
  items: Barchart[];
  total_count: number;
}

// ==================== BARCHART HTTP DAO ====================
export class BarchartHttpDao {
  constructor(private http: HttpClient) { }

  getRepoIssues(sort: string, order: string, page: number, pagesize: number = 50, filter: string, columnfilter: any, mode: string = "", httpOption: any = {}): Observable<any> {

    var params: any = {};
    if (sort != null) params["sort"] = sort;
    if (order != null) params["order"] = order;
    if (page != null) params["page"] = page.toString();
    if (pagesize != null) params["pagesize"] = pagesize.toString();
    if (filter != null) params["filter"] = filter;
    if (Object.keys(columnfilter).length > 0) params["columnfilter"] = JSON.stringify(columnfilter);
    if (mode != null) params["mode"] = mode;

    httpOption["params"] = params;
    return this.http.get<any>('/api/pe/barchart', httpOption);
  }
}

// ==================== MONITORING RK HTTP DAO ====================
export class MonitoringRKHttpDao {
  constructor(private http: HttpClient) { }

  getRepoIssues(sort: string, order: string, page: number, pagesize: number = 50, filter: string, columnfilter: any, mode: string = "", httpOption: any = {}): Observable<any> {

    var params: any = {};
    if (sort != null) params["sort"] = sort;
    if (order != null) params["order"] = order;
    if (page != null) params["page"] = page.toString();
    if (pagesize != null) params["pagesize"] = pagesize.toString();
    if (filter != null) params["filter"] = filter;
    if (Object.keys(columnfilter).length > 0) params["columnfilter"] = JSON.stringify(columnfilter);
    if (mode != null) params["mode"] = mode;

    httpOption["params"] = params;
    return this.http.get<any>('/api/pe/MonitoringRK', httpOption);
  }
}

// ==================== DELETE DIALOG ====================
@Component({
  selector: 'app-monitoring-rk-delete-dialog',
  template: '<h1 mat-dialog-title>Confirm Delete</h1><div mat-dialog-content>  <p>Confirm delete {{data}} selected item ?</p></div><div mat-dialog-actions>  <button mat-button [mat-dialog-close]="1" >Yes</button> <button mat-button [mat-dialog-close]="0" cdkFocusInitial>No</button> </div>',
  styleUrls: ['./monitoring-rk.scss']
})

export class MonitoringRKDeleteDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<MonitoringRKDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {
    this.dialogRef.close();
  }

}
