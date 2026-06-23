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

  barchartWellList: string[] = [];
  barchartJobList: string[] = [];
  barchartRigList: string[] = [];
  barchartItems: any[] = [];
  barchartLoaded: boolean = false;
  autoAddedWells: Set<string> = new Set();

  rk_displayedColumns: string[] = ["select", "well", "job", "rig","pop","target_oil","target_gas","realisasi_oil","realisasi_gas", "remarks", "action"];
  headerColumns1: string[] = ["select",  "well", "job", "rig","pop","target","realisasi", "remarks","action"];
  headerColumns2: string[] = ["target_oil","target_gas","realisasi_oil","realisasi_gas"];

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
  rk_popFilter = new FormControl('');
  rk_target_oilFilter = new FormControl('');
  rk_target_gasFilter = new FormControl('');
  rk_realisasi_oilFilter = new FormControl('');
  rk_realisasi_gasFilter = new FormControl('');
  rk_remarksFilter = new FormControl('');

  well_xSelected = [];
  job_xSelected = [];
  rig_xSelected = [];
  plan_start_xSelected = [];
  plan_end_xSelected = [];
  pop_xSelected = [];
  target_oil_xSelected = [];
  target_gas_xSelected = [];
  realisasi_oil_xSelected = [];
  realisasi_gas_xSelected = [];
  remarks_xSelected = [];

  // === Rigless Table ===
  rk_rigless_displayedColumns: string[] = ["well", "job", "rig", "pop", "target_oil", "target_gas", "realisasi_oil", "realisasi_gas", "remarks"];
  rk_rigless_headerColumns1: string[] = ["well", "job", "rig", "pop", "target", "realisasi", "remarks"];
  rk_rigless_headerColumns2: string[] = ["target_oil", "target_gas", "realisasi_oil", "realisasi_gas"];
  rk_rigless_data: any[] = [];
  rk_rigless_dataSource = new MatTableDataSource<any>(this.rk_rigless_data);

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
    private service: MonitoringRKService,
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
    this.loadBarchartDistinctValues();


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
      this.rk_popFilter.valueChanges.pipe(debounceTime(300)),
      this.rk_target_oilFilter.valueChanges.pipe(debounceTime(300)),
      this.rk_target_gasFilter.valueChanges.pipe(debounceTime(300)),
      this.rk_realisasi_oilFilter.valueChanges.pipe(debounceTime(300)),
      this.rk_realisasi_gasFilter.valueChanges.pipe(debounceTime(300)),
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
    ).subscribe((data: MonitoringRK[]) => {
      this.rk_data = data.map(d => ({
        ...d,
        isEdit: false
      }));
      this.rk_dataSource.data = this.rk_data;
      this.rk_selection.clear();
      // Merge barchart items untuk mengisi well/job/rig yang belum ada
      this.mergeBarchartToRK();
    });
  }

  /** Cleanup: unsubscribe semua subscription saat komponen di-destroy */
  ngOnDestroy() {
    if (this.rk_filterSubscription) this.rk_filterSubscription.unsubscribe();
    if (this.rk_selectedSubscription) this.rk_selectedSubscription.unsubscribe();
    if (this.rk_listSubscription) this.rk_listSubscription.unsubscribe();
  }

  /** Cek permission menu berdasarkan path */
  passPermission(path: String) {
    return this.pePermissionService.passPermission(path);
  }

  //ambil data barchart
  loadBarchartDistinctValues() {
    // Ambil semua item barchart (well, job, rig)
    this.http.get<any>('/api/pe/Barchart', {
      params: { pagesize: '9999' }
    }).subscribe(res => {
      this.barchartItems = res.items || [];
      this.barchartLoaded = true;
      // Isi daftar distinct
      this.barchartWellList = [...new Set(this.barchartItems.map((i: any) => i.well).filter((w: string) => w))];
      this.barchartJobList = [...new Set(this.barchartItems.map((i: any) => i.job).filter((j: string) => j))];
      this.barchartRigList = [...new Set(this.barchartItems.map((i: any) => i.rig).filter((r: string) => r))];
      // Merge ke tabel monitoring RK jika data RK sudah ada
      this.mergeBarchartToRK();
      // Isi tabel rigless
      this.populateRiglessData();
    });
  }

  /** Gabungkan data barchart ke monitoring RK untuk mengisi well/job/rig */
  mergeBarchartToRK() {
    if (!this.barchartLoaded || !this.rk_data) return;
    var existingWells = new Set(this.rk_data.map(d => d.well));
    var newRows: any[] = [];

    // Tambah barchart items yang belum ada di RK & belum pernah di-auto-add
    this.barchartItems.forEach(bc => {
      if (bc.well && !existingWells.has(bc.well)) {
        if (!this.autoAddedWells.has(bc.well)) {
          newRows.push({
            well: bc.well,
            job: bc.job,
            rig: bc.rig,
            isEdit: false
          });
          this.autoAddedWells.add(bc.well);
        } else {
          // Auto-added sebelumnya, pastikan tetap masuk (karena rk_data di-replace)
          newRows.push({
            well: bc.well,
            job: bc.job,
            rig: bc.rig,
            isEdit: false
          });
        }
      }
    });
    if (newRows.length > 0) {
      this.rk_data = [...this.rk_data, ...newRows];
      this.rk_dataSource.data = this.rk_data;
      this.rk_resultsLength = this.rk_data.length;
    }
  }

  /** Isi tabel rigless dari barchart items yang rig-nya mengandung "rigless" */
  populateRiglessData() {
    if (!this.barchartItems.length) return;
    this.rk_rigless_data = this.barchartItems
      .filter(bc => bc.rig && bc.rig.toLowerCase().includes('rigless'))
      .map(bc => ({
        well: bc.well,
        job: bc.job,
        rig: bc.rig,
        pop: null,
        target_oil: null,
        target_gas: null,
        realisasi_oil: null,
        realisasi_gas: null,
        remarks: null,
      }));
    this.rk_rigless_dataSource.data = this.rk_rigless_data;
  }

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
    if (this.pop_xSelected.length) columnfilter["pop"] = this.pop_xSelected;
    if (this.target_oil_xSelected.length) columnfilter["target_oil"] = this.target_oil_xSelected;
    if (this.target_gas_xSelected.length) columnfilter["target_gas"] = this.target_gas_xSelected;
    if (this.realisasi_oil_xSelected.length) columnfilter["realisasi_oil"] = this.realisasi_oil_xSelected;
    if (this.realisasi_gas_xSelected.length) columnfilter["realisasi_gas"] = this.realisasi_gas_xSelected;
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

  //edit, save, cancel

  rkEdit(row: any) {
    row._backup = { ...row };
    row.isEdit = true;
  }

  rkSave(row: any) {
    const payload: any = { ...row };
    const backupData = { ...row._backup };

    delete payload.isEdit;
    delete payload._backup;
    delete payload._error;

    this.service.update(row._id, payload).subscribe({
      next: (res) => {
        row.isEdit = false;
        delete row._backup;

        const idx = this.rk_dataSource.data.findIndex(d => d._id === row._id);
        if (idx !== -1) {
          this.rk_dataSource.data[idx] = {
            ...this.rk_dataSource.data[idx],
            ...payload,
            isEdit: false
          };
          this.rk_dataSource.data = [...this.rk_dataSource.data];
        }

        const snackBarRef = this.snackBar.open('Data berhasil diupdate', 'UNDO', { duration: 5000 });
        snackBarRef.onAction().subscribe(() => {
          this.rkUndoUpdate(row._id, backupData);
        });
      },
      error: (error) => {
        this.rkCancel(row);
        this.snackBar.open(error.message ? error.message : 'Gagal mengupdate data', 'Tutup', { duration: 5000 });
      }
    });
  }

  rkUndoUpdate(id: string, backupData: any) {
    const payload = { ...backupData };
    delete payload.isEdit;
    delete payload._backup;
    delete payload._error;

    this.service.update(id, payload).subscribe({
      next: (res) => {
        const dataIdx = this.rk_dataSource.data.findIndex(d => d._id === id);
        if (dataIdx !== -1) {
          Object.keys(backupData).forEach(key => {
            if (key !== 'isEdit' && key !== '_backup' && key !== '_error') {
              (this.rk_dataSource.data[dataIdx] as any)[key] = backupData[key];
            }
          });
          (this.rk_dataSource.data[dataIdx] as any).isEdit = false;
          delete (this.rk_dataSource.data[dataIdx] as any)._backup;
        }
        this.rk_dataSource.data = [...this.rk_dataSource.data];
        this.snackBar.open('Perubahan dibatalkan', 'Tutup', { duration: 3000 });
      },
      error: (error) => {
        this.snackBar.open('Gagal membatalkan perubahan', 'Tutup', { duration: 5000 });
      }
    });
  }

  rkCancel(row: any) {
    if (row._backup) {
      Object.assign(row, row._backup);
    }
    row.isEdit = false;
  }

}

export interface MonitoringRKApi {
  items: MonitoringRK[];
  total_count: number;
}

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
