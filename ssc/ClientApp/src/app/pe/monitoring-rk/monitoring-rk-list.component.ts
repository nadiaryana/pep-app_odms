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


  barchartWellList: string[] = [];
  barchartJobList: string[] = [];
  barchartRigList: string[] = [];

  // === Rigless Table ===
  rl_displayedColumns: string[] = ["select", "well", "job", "rig", "pop", "target_oil", "target_gas", "realisasi_oil", "realisasi_gas", "remarks", "action"];
  rl_headerColumns1: string[] = ["select", "well", "job", "rig", "pop", "target", "realisasi", "remarks", "action"];
  rl_headerColumns2: string[] = ["target_oil", "target_gas", "realisasi_oil", "realisasi_gas"];
  rl_data: any[] = [];
  rl_dataSource = new MatTableDataSource<any>(this.rl_data);
  rl_selection = new SelectionModel<any>(true, []);
  rl_isEditing: boolean = false;
  rl_isLoadingResults: boolean = false;
  rl_resultsLength = 0;

  // Rigless xFilter selected values
  rl_well_xSelected = [];
  rl_job_xSelected = [];
  rl_rig_xSelected = [];
  rl_pop_xSelected = [];
  rl_target_oil_xSelected = [];
  rl_target_gas_xSelected = [];
  rl_realisasi_oil_xSelected = [];
  rl_realisasi_gas_xSelected = [];
  rl_remarks_xSelected = [];

  @ViewChild('rlSort', { static: true }) rlSort: MatSort;
  @ViewChild('rlPaginator', { static: true }) rlPaginator: MatPaginator;

  private rk_filterSubscription: any = null;
  rk_selectedSubscription: Subscription;
  rk_listSubscription: Subscription;
  rl_listSubscription: Subscription;

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

    this.rkExampleDatabase = new MonitoringRKHttpDao(this.http);
    this.rkSort.sortChange.subscribe(() => this.rkPaginator.pageIndex = 0);

    // Filter xFilter
    this.rk_filterSubscription = this.xfilterService.filter.subscribe(res => {
      if (res && res["column"]) {
        if (res["column"].indexOf("rl_") === 0) {
          // Rigless xFilter — panggil API rigless dengan mode=column
          this.rlGetColumnValues(res);
        } else if (res["column"].indexOf("bc_") !== 0) {
          this.rkGetColumnValues( res);
        }
      }
    })
    // Selected xFilter
    this.rk_selectedSubscription = this.xfilterService.selected.subscribe(res => {
      if (res["column"]) {
        (this as any)[res["column"] + "_xSelected"] = res["selected"];
        // Jika rigless filter berubah, reload data rigless
        if (res["column"].indexOf("rl_") === 0) {
          this.rlPaginator._changePageSize(this.rlPaginator.pageSize);
        }
      }
    })

    // Observable utama: reload data saat sort/page/filter/xSelected berubah
    // Hanya reaksi terhadap xfilter selected non-rl_ (rigless filter dikelola client-side)
    const rkSelected$ = this.xfilterService.selected.pipe(
      map(res => res && res["column"] && res["column"].indexOf("rl_") === 0 ? undefined : res)
    );
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
      rkSelected$,
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

        // Set distinct values untuk autocomplete dari backend
        if (data.distinct_wells) this.barchartWellList = data.distinct_wells;
        if (data.distinct_jobs) this.barchartJobList = data.distinct_jobs;
        if (data.distinct_rigs) this.barchartRigList = data.distinct_rigs;

        // Gabungkan items monitoring_rk + merge_items dari barchart
        return data.items || [];
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
    });

    // ========== Rigless Table: Load data dari endpoint terpisah ==========
    this.rlSort.sortChange.subscribe(() => this.rlPaginator.pageIndex = 0);

    this.rl_listSubscription = merge(
      this.rlSort.sortChange,
      this.rlPaginator.page,
    ).pipe(
      startWith({}),
      switchMap(() => {
        this.rl_isLoadingResults = true;
        var columnfilter = this.rlGetColumnFilter();
        return this.service.getRigless(
          this.rlSort.active,
          this.rlSort.direction,
          this.rlPaginator.pageIndex,
          this.rlPaginator.pageSize,
          '',
          columnfilter,
        );
      }),
      map(data => {
        this.rl_isLoadingResults = false;
        this.rl_resultsLength = data.total_count;
        return data.items || [];
      }),
      catchError(() => {
        this.rl_isLoadingResults = false;
        return observableOf([]);
      })
    ).subscribe((data: any[]) => {
      this.rl_data = data.map((d: any) => ({ ...d, isEdit: false }));
      this.rl_dataSource.data = this.rl_data;
      this.rl_dataSource.sort = this.rlSort;
      this.rl_dataSource.paginator = this.rlPaginator;
      this.rl_selection.clear();
    });
  }

  /** Cleanup: unsubscribe semua subscription saat komponen di-destroy */
  ngOnDestroy() {
    if (this.rk_filterSubscription) this.rk_filterSubscription.unsubscribe();
    if (this.rk_selectedSubscription) this.rk_selectedSubscription.unsubscribe();
    if (this.rk_listSubscription) this.rk_listSubscription.unsubscribe();
    if (this.rl_listSubscription) this.rl_listSubscription.unsubscribe();
  }

  /** Cek permission menu berdasarkan path */
  passPermission(path: String) {
    return this.pePermissionService.passPermission(path);
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

  rlGetColumnFilter() {
    var columnfilter: any = {};
    if (this.rl_well_xSelected.length) columnfilter["well"] = this.rl_well_xSelected;
    if (this.rl_job_xSelected.length) columnfilter["job"] = this.rl_job_xSelected;
    if (this.rl_rig_xSelected.length) columnfilter["rig"] = this.rl_rig_xSelected;
    if (this.rl_pop_xSelected.length) columnfilter["pop"] = this.rl_pop_xSelected;
    if (this.rl_remarks_xSelected.length) columnfilter["remarks"] = this.rl_remarks_xSelected;
    return columnfilter;
  }

  rlGetColumnValues(param: any) {
    var column = param["column"];
    var filter = param["filter"];
    var selected = param["selected"];
    var clear = param["clear"];
    var realCol = column.substring(3); // "rl_well" -> "well"
    var columnfilter: any = this.rlGetColumnFilter();
    if (filter) columnfilter[realCol] = [filter];
    if (selected && selected.length > 0) columnfilter[realCol] = selected.map((s: any) => "^" + s + "$");
    if (clear) delete columnfilter[realCol];

    return this.service.getRigless(
      this.rlSort.active,
      this.rlSort.direction,
      this.rlPaginator.pageIndex,
      this.rlPaginator.pageSize,
      '',
      columnfilter,
      realCol
    ).pipe(map((res) => res))
    .subscribe(res => {
      this.xfilterService.updateItems({ column: column, items: res.items });
    }, () => {});
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

    const isNew = !row._id;

    const request$ = isNew
      ? this.service.create([payload])  // Backend expects an array
      : this.service.update(row._id, payload);

    request$.subscribe({
      next: (res: any) => {
        row.isEdit = false;
        delete row._backup;

        if (isNew) {
          // Reload data setelah create agar mendapat _id dari database
          this.rkPaginator._changePageSize(this.rkPaginator.pageSize);
        } else {
          const idx = this.rk_dataSource.data.findIndex(d => d._id === row._id);
          if (idx !== -1) {
            this.rk_dataSource.data[idx] = {
              ...this.rk_dataSource.data[idx],
              ...payload,
              isEdit: false
            };
            this.rk_dataSource.data = [...this.rk_dataSource.data];
          }
        }

        const msg = isNew ? 'Data berhasil ditambahkan' : 'Data berhasil diupdate';
        const snackBarRef = this.snackBar.open(msg, 'UNDO', { duration: 5000 });
        if (!isNew) {
          snackBarRef.onAction().subscribe(() => {
            this.rkUndoUpdate(row._id, backupData);
          });
        }
      },
      error: (error) => {
        this.rkCancel(row);
        const errMsg = isNew ? 'Gagal menambahkan data' : 'Gagal mengupdate data';
        this.snackBar.open(error.message ? error.message : errMsg, 'Tutup', { duration: 5000 });
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

  // ========== Rigless Table Methods ==========

  rlEdit(row: any) {
    row._backup = { ...row };
    row.isEdit = true;
    this.rl_isEditing = true;
  }

  rlCancel(row: any) {
    if (row._backup) {
      Object.assign(row, row._backup);
    }
    row.isEdit = false;
    this.rl_isEditing = false;
  }

  rlSave(row: any) {
    const payload: any = { ...row };
    const backupData = { ...row._backup };

    delete payload.isEdit;
    delete payload._backup;
    delete payload._error;

    const isNew = !row._id;

    const request$ = isNew
      ? this.service.create([payload])
      : this.service.update(row._id, payload);

    request$.subscribe({
      next: (res: any) => {
        row.isEdit = false;
        delete row._backup;
        this.rl_isEditing = false;

        if (isNew) {
          // Reload data rigless setelah create
          this.rlPaginator._changePageSize(this.rlPaginator.pageSize);
        } else {
          const idx = this.rl_dataSource.data.findIndex(d => d._id === row._id);
          if (idx !== -1) {
            this.rl_dataSource.data[idx] = {
              ...this.rl_dataSource.data[idx],
              ...payload,
              isEdit: false
            };
            this.rl_dataSource.data = [...this.rl_dataSource.data];
          }
        }

        const msg = isNew ? 'Data berhasil ditambahkan' : 'Data berhasil diupdate';
        const snackBarRef = this.snackBar.open(msg, 'UNDO', { duration: 5000 });
        if (!isNew) {
          snackBarRef.onAction().subscribe(() => {
            this.rlUndoUpdate(row._id, backupData);
          });
        }
      },
      error: (error) => {
        this.rlCancel(row);
        const errMsg = isNew ? 'Gagal menambahkan data' : 'Gagal mengupdate data';
        this.snackBar.open(error.message ? error.message : errMsg, 'Tutup', { duration: 5000 });
      }
    });
  }

  rlUndoUpdate(id: string, backupData: any) {
    const payload = { ...backupData };
    delete payload.isEdit;
    delete payload._backup;
    delete payload._error;

    this.service.update(id, payload).subscribe({
      next: (res) => {
        const dataIdx = this.rl_dataSource.data.findIndex(d => d._id === id);
        if (dataIdx !== -1) {
          Object.keys(backupData).forEach(key => {
            if (key !== 'isEdit' && key !== '_backup' && key !== '_error') {
              (this.rl_dataSource.data[dataIdx] as any)[key] = backupData[key];
            }
          });
          (this.rl_dataSource.data[dataIdx] as any).isEdit = false;
          delete (this.rl_dataSource.data[dataIdx] as any)._backup;
        }
        this.rl_dataSource.data = [...this.rl_dataSource.data];
        this.snackBar.open('Perubahan dibatalkan', 'Tutup', { duration: 3000 });
      },
      error: (error) => {
        this.snackBar.open('Gagal membatalkan perubahan', 'Tutup', { duration: 5000 });
      }
    });
  }

  rlMasterToggle() {
    this.rlIsAllSelected()
      ? this.rl_selection.clear()
      : this.rl_dataSource.data.forEach(row => this.rl_selection.select(row));
  }

  rlIsAllSelected() {
    const numSelected = this.rl_selection.selected.length;
    const numRows = this.rl_dataSource.data.length;
    return numSelected === numRows;
  }

  rlDeleteSelected() {
    const dialogRef = this.dialog.open(MonitoringRKDeleteDialogComponent, {
      width: '350px',
      data: this.rl_selection.selected.length
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        this.rl_isLoadingResults = true;
        const ids = this.rl_selection.selected.map(s => s._id).filter((id: string) => id);
        if (ids.length === 0) {
          // Hanya item tanpa _id, reload rigless data
          this.rlPaginator._changePageSize(this.rlPaginator.pageSize);
          this.rl_selection.clear();
          this.rl_isLoadingResults = false;
          this.snackbarService.status.next(new SnackbarApi(true, "Item(s) removed from view.", "dismiss"));
          return;
        }
        this.http.delete('/api/pe/MonitoringRK', {
          params: { _ids: ids }
        }).subscribe((res: any) => {
          this.rl_isLoadingResults = false;
          this.snackbarService.status.next(new SnackbarApi(true, res["deleted_count"] + " item(s) deleted successfully.", "dismiss"));
          this.rlPaginator._changePageSize(this.rlPaginator.pageSize);
        },
          error => {
            this.rl_isLoadingResults = false;
            this.snackbarService.status.next(new SnackbarApi(true, error['message'], "dismiss"));
          })
      }
    });
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
