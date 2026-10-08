import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit, OnDestroy, ViewChild, Inject } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';
import { merge, Observable, of as observableOf, Subscription, Subject } from 'rxjs';
import { catchError, map, startWith, switchMap, debounceTime } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { SelectionModel } from '@angular/cdk/collections';
import { formatDate } from '@angular/common';

import { PeProdWaterfall, PeProdWaterfallKategori } from './pe-prod-waterfall';
import { PeProdWaterfallService } from './pe-prod-waterfall.service';
import { SnackbarService, SnackbarApi } from '../../snackbar.service';
import { PePermissionService } from '../pe-permission.service';
import { TitleService } from '../../navigation/title/title.service';
import { xFilterService } from '../../xfilter/xfilter.component';
import { CommonService } from '../../common.service';

type PeProdWaterfallRow = PeProdWaterfall & {
  isEdit?: boolean;
  _backup?: Partial<PeProdWaterfall>;
};


type PeProdWaterfallTableRow = PeProdWaterfallRow & {
  isGroup?: boolean;
  label?: string;
  well_count?: number;
};

@Component({
  selector: 'pe-prod-waterfall-list',
  templateUrl: './pe-prod-waterfall-list.component.html',
  styleUrls: ['./pe-prod-waterfall.scss']
})
export class PeProdWaterfallListComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ["select", "kategori", "well", "delta_prod", "remarks", "action"];
  headerColumns1: string[] = ["select", "kategori", "well", "delta_prod", "remarks", "action"];
  /** Kolom baris header kategori: label (menggabungkan select+kategori+well) + total delta. */
  groupColumns: string[] = ["group_label", "group_delta", "group_remarks", "group_action"];

  data: PeProdWaterfallRow[] = [];
  dataSource = new MatTableDataSource<PeProdWaterfallTableRow>([]);
  selection = new SelectionModel<PeProdWaterfallRow>(true, []);

  /** Total delta per kategori dari API (seluruh hasil filter, bukan hanya halaman aktif). */
  private categoryTotals: Map<string, number> = new Map();

  kategoriList: PeProdWaterfallKategori[] = [];
  private kategoriLabel: Map<string, string> = new Map();

  start_dateControl = new FormControl(new Date());
  start_dateInput = "";

  end_dateControl = new FormControl(new Date());
  end_dateInput = "";

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  isEditing: boolean = false;

  totalDelta: number = 0;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  filterControl = new FormControl('');

  kategoriFilter = new FormControl('');
  wellFilter = new FormControl('');
  delta_prodFilter = new FormControl('');
  remarksFilter = new FormControl('');

  kategori_xSelected = [];
  well_xSelected = [];
  delta_prod_xSelected = [];
  remarks_xSelected = [];

  private refresh = new Subject<void>();
  filterSubscription: Subscription;
  selectedSubscription: Subscription;
  listSubscription: Subscription;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private service: PeProdWaterfallService,
    public snackbarService: SnackbarService,
    public pePermissionService: PePermissionService,
    private titleService: TitleService,
    private route: ActivatedRoute,
    private xfilterService: xFilterService,
    public commonService: CommonService,
  ) { }

  ngOnInit() {

    this.titleService.titleSource.next({
      title: "Sangatta Production Monitoring",
      icon: "waterfall_chart",
      breadcrumbs: [
        { label: 'Petroleum Engineering', routerLink: '' },
        { label: 'Waterfall', routerLink: '' }
      ]
    });

    this.initDate();
    this.loadKategori();

    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    this.filterSubscription = this.xfilterService.filter.subscribe(res => {
      if (res) this.getColumnValues(res);
    })
    this.selectedSubscription = this.xfilterService.selected.subscribe(res => {
      if (!res) return;
      this[res["column"] + "_xSelected"] = res["selected"];
    })

    this.listSubscription = merge(
      this.sort.sortChange,
      this.paginator.page,
      this.filterControl.valueChanges.pipe(debounceTime(300)),
      this.kategoriFilter.valueChanges.pipe(debounceTime(300)),
      this.wellFilter.valueChanges.pipe(debounceTime(300)),
      this.delta_prodFilter.valueChanges.pipe(debounceTime(300)),
      this.remarksFilter.valueChanges.pipe(debounceTime(300)),
      this.xfilterService.selected,
      this.refresh,
    ).pipe(
      startWith({}),
      switchMap(() => {
        this.isLoadingResults = true;
        var columnfilter = this.getColumnFilter();
        return this.service.getRepoIssues(
          this.sort.active,
          this.sort.direction,
          this.paginator.pageIndex,
          this.paginator.pageSize,
          this.filterControl.value,
          columnfilter,
          "",
          this.start_dateControl.value,
          this.end_dateControl.value,
        );
      }),
      map(data => {
        this.isLoadingResults = false;
        this.isRateLimitReached = false;
        this.resultsLength = data.total_count;
        this.categoryTotals = new Map<string, number>();
        (data.categories || []).forEach(c => this.categoryTotals.set(c.kategori || "", this.toNumber(c.delta_prod)));
        return data.items;
      }),
      catchError(() => {
        this.isLoadingResults = false;
        this.isRateLimitReached = true;
        return observableOf([]);
      })
    ).subscribe((data: PeProdWaterfall[]) => {
      this.data = data.map(d => ({ ...d, isEdit: false }));
      this.renderRows();
      this.selection.clear();
    });
  }

  loadKategori() {
    this.service.getKategori().subscribe(res => {
      this.kategoriList = res;
      this.kategoriLabel.clear();
      res.forEach(k => this.kategoriLabel.set(k.code, k.label));
    });
  }

  /** Periode aktif; diwarisi dari halaman add bila ada. */
  /** Tanggal hari ini pada pukul 00:00 waktu lokal; dipakai agar cocok dengan tanggal data daily. */
  private startOfToday(): Date {
    var now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  }

  private initDate() {
    var today = this.startOfToday();
    var defStart = new Date(today);
    defStart.setDate(defStart.getDate() - 7);

    this.start_dateControl = new FormControl(defStart);
    this.end_dateControl = new FormControl(today);

    var p_start = this.route.snapshot.queryParamMap.get('start_date');
    var p_end = this.route.snapshot.queryParamMap.get('end_date');
    if (p_start && !isNaN(Date.parse(p_start))) this.start_dateControl.setValue(new Date(p_start));
    if (p_end && !isNaN(Date.parse(p_end))) this.end_dateControl.setValue(new Date(p_end));

    this.start_dateInput = formatDate(this.start_dateControl.value, 'd MMM y', 'en-US');
    this.end_dateInput = formatDate(this.end_dateControl.value, 'd MMM y', 'en-US');
  }

  start_dateChange(evt) {
    this.start_dateInput = formatDate(evt.value, 'd MMM y', 'en-US');
    this.paginator.pageIndex = 0;
    this.refresh.next();
  }

  end_dateChange(evt) {
    this.end_dateInput = formatDate(evt.value, 'd MMM y', 'en-US');
    this.paginator.pageIndex = 0;
    this.refresh.next();
  }

  /** Label kategori dari master, fallback ke kode apa adanya. */
  kategoriText(code: string): string {
    if (!code) return "(tanpa kategori)";
    return this.kategoriLabel.has(code) ? this.kategoriLabel.get(code) : code;
  }

  /** Baris tabel yang berupa data sumur (tanpa baris header kategori). */
  get dataRows(): PeProdWaterfallRow[] {
    return this.dataSource.data.filter(r => !r.isGroup) as PeProdWaterfallRow[];
  }

  /** Predikat `when` pada matRowDef: baris header kategori. */
  isGroupRow(index: number, row: PeProdWaterfallTableRow): boolean {
    return !!row && !!row.isGroup;
  }

  /** Predikat `when` pada matRowDef: baris data sumur. */
  isDataRow(index: number, row: PeProdWaterfallTableRow): boolean {
    return !row || !row.isGroup;
  }

  /**
   * Susun baris tabel: satu baris header kategori (berisi total delta kategori)
   * diikuti baris-baris sumur di bawahnya.
   */
  private renderRows() {
    var display: any[] = [];
    var groupKeys: string[] = [];
    var groups: PeProdWaterfallRow[][] = [];

    this.data.forEach(row => {
      var code = row.kategori || "";
      var index = groupKeys.indexOf(code);
      if (index == -1) {
        groupKeys.push(code);
        groups.push([]);
        index = groupKeys.length - 1;
      }
      groups[index].push(row);
    });

    groupKeys.forEach((code, index) => {
      display.push({
        isGroup: true,
        kategori: code,
        label: this.kategoriText(code),
        delta_prod: this.categoryTotal(code, groups[index]),
        well_count: groups[index].length
      });
      groups[index].forEach(row => display.push(row));
    });

    this.dataSource.data = display;
    this.totalDelta = this.data.reduce((sum, d) => sum + this.toNumber(d.delta_prod), 0);
  }

  /** Total kategori dari API (seluruh hasil filter); fallback ke total baris yang tampil. */
  private categoryTotal(code: string, rows: PeProdWaterfallRow[]): number {
    if (this.categoryTotals.has(code)) return this.categoryTotals.get(code);
    return rows.reduce((sum, r) => sum + this.toNumber(r.delta_prod), 0);
  }

  /** Sesuaikan total kategori agar header tetap sinkron setelah baris diedit. */
  private shiftCategoryTotal(code: string, amount: number) {
    var key = code || "";
    this.categoryTotals.set(key, this.toNumber(this.categoryTotals.get(key)) + amount);
  }

  addRow() {
    this.router.navigate(['pe', 'waterfall', 'add'], {
      queryParams: {
        start_date: this.start_dateControl.value.toISOString(),
        end_date: this.end_dateControl.value.toISOString()
      }
    });
  }

  openChart() {
    this.router.navigate(['pe', 'waterfall', 'chart'], {
      queryParams: {
        start_date: this.start_dateControl.value.toISOString(),
        end_date: this.end_dateControl.value.toISOString()
      }
    });
  }

  edit(row: PeProdWaterfallRow) {
    row._backup = { ...row };
    row.isEdit = true;
    this.isEditing = true;
  }

  save(row: PeProdWaterfallRow) {
    const payload: Partial<PeProdWaterfall> = {
      kategori: row.kategori,
      well: row.well,
      delta_prod: this.toNumber(row.delta_prod),
      remarks: row.remarks
    };
    // Simpan backup untuk fitur undo
    const backupData = { ...row._backup };
    // nilai sebelum edit, untuk menyesuaikan total kategori di header
    const prevKategori = row.kategori;
    const prevDelta = this.toNumber(row.delta_prod);

    this.service.update(row._id, payload).subscribe({
      next: (res) => {
        row.isEdit = false;
        this.isEditing = false;
        delete row._backup;

        const idx = this.data.findIndex(d => d._id === row._id);
        if (idx !== -1) {
          this.data[idx] = { ...this.data[idx], ...payload, isEdit: false };
          this.data = [...this.data];
        }
        // kategori/nilai bisa berubah: pindahkan nilainya lalu susun ulang grup
        this.shiftCategoryTotal(prevKategori, -prevDelta);
        this.shiftCategoryTotal(payload.kategori || "", this.toNumber(payload.delta_prod));
        this.renderRows();

        const snackBarRef = this.snackBar.open('Data berhasil diupdate', 'UNDO', { duration: 5000 });
        snackBarRef.onAction().subscribe(() => this.undoUpdate(row._id, backupData));
      },
      error: (error) => {
        this.cancel(row);
        this.snackBar.open(error.message ? error.message : 'Gagal mengupdate data', 'Tutup', { duration: 5000 });
      }
    });
  }

  undoUpdate(id: string, backupData: any) {
    const payload = { ...backupData };
    delete payload.isEdit;
    delete payload._backup;

    this.service.update(id, payload).subscribe({
      next: (res) => {
        this.refresh.next();
        this.snackBar.open('Perubahan dibatalkan', 'Tutup', { duration: 3000 });
      },
      error: (error) => {
        this.snackBar.open('Gagal membatalkan perubahan', 'Tutup', { duration: 5000 });
      }
    });
  }

  cancel(row: PeProdWaterfallRow) {
    Object.assign(row, row._backup);
    row.isEdit = false;
    this.isEditing = false;
  }

  toNumber(val: any): number {
    if (val === null || val === undefined || val === '') return 0;
    return Number(val);
  }

  ngOnDestroy() {
    this.filterSubscription.unsubscribe();
    this.selectedSubscription.unsubscribe();
    this.listSubscription.unsubscribe();
    this.refresh.complete();
  }

  passPermission(path: String) {
    return this.pePermissionService.passPermission(path);
  }

  exportExcel() {

    const httpOption: Object = {
      observe: 'response',
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      responseType: 'arraybuffer'
    };
    this.isLoadingResults = true;
    var columnfilter = this.getColumnFilter();

    this.service.getRepoIssues(
      this.sort.active,
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.filterControl.value,
      columnfilter,
      "excel",
      this.start_dateControl.value,
      this.end_dateControl.value,
      httpOption
    ).pipe(map((res) => {
      this.isLoadingResults = false;
      return {
        filename: 'Waterfall.xlsx',
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

    return this.service.getRepoIssues(
      this.sort.active,
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.filterControl.value,
      columnfilter,
      column,
      this.start_dateControl.value,
      this.end_dateControl.value,
    ).pipe(map((res) => {
      return res;
    })).subscribe(res => {
      this.xfilterService.updateItems({ column: column, items: res.items });
    }, () => {

    });
  }

  getColumnFilter() {
    var columnfilter = {};
    if (this.kategori_xSelected.length) columnfilter["kategori"] = this.kategori_xSelected;
    if (this.well_xSelected.length) columnfilter["well"] = this.well_xSelected;
    if (this.delta_prod_xSelected.length) columnfilter["delta_prod"] = this.delta_prod_xSelected;
    if (this.remarks_xSelected.length) columnfilter["remarks"] = this.remarks_xSelected;
    return columnfilter;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataRows.length;
    return numRows > 0 && numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataRows.forEach(row => this.selection.select(row));
  }

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.well}`;
  }

  get totalSelectedDelta(): number {
    return this.selection.selected.reduce((sum, d) => sum + this.toNumber(d.delta_prod), 0);
  }

  deleteSelected() {
    this.snackbarService.status.next(new SnackbarApi(false));

    const dialogRef = this.dialog.open(PeProdWaterfallDeleteDialogComponent, {
      width: '250px',
      data: this.selection.selected.length
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoadingResults = true;
        this.snackbarService.status.next(new SnackbarApi(false));
        this.service.deleteSelected(this.selection.selected.map(s => s._id)).subscribe(res => {
          this.isLoadingResults = false;
          this.snackbarService.status.next(new SnackbarApi(true, res["deleted_count"] + " item(s) deleted successfully.", "dismiss"));
          this.paginator._changePageSize(this.paginator.pageSize);
        }, error => {
          this.isLoadingResults = false;
          this.snackbarService.status.next(new SnackbarApi(true, error['message'], "dismiss"));
        })
      }
    });
  }
}

@Component({
  selector: 'app-prod-waterfall-delete-dialog',
  template: '<h1 mat-dialog-title>Confirm Delete</h1><div mat-dialog-content>  <p>Confirm delete {{data}} selected item ?</p></div><div mat-dialog-actions>  <button mat-button [mat-dialog-close]="1" >Yes</button> <button mat-button [mat-dialog-close]="0" cdkFocusInitial>No</button> </div>',
  styleUrls: ['./pe-prod-waterfall.scss']
})
export class PeProdWaterfallDeleteDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<PeProdWaterfallDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {
    this.dialogRef.close();
  }
}
