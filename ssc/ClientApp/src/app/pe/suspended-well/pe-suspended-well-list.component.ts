import { HttpClient, HttpParams, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';
import { merge, Observable, of as observableOf, Subscription } from 'rxjs';
import { catchError, map, startWith, switchMap, debounceTime } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { SelectionModel } from '@angular/cdk/collections';

import { PePumpingUnitService} from './pe-pumping-unit.service';
import { PePumpingUnit}    from './pe-pumping-unit';
import { SnackbarService } from '../../snackbar.service';
import { SnackbarApi } from '../../snackbar.service';
import { PePermissionService } from '../pe-permission.service';
import { TitleService } from '../../navigation/title/title.service';
import { xFilterService } from '../../xfilter/xfilter.component';
import { CommonService } from '../../common.service';

type PePumpingUnitRow = PePumpingUnit & {
  isEdit?: boolean;
  _backup?: Partial<PePumpingUnit>;
};

@Component({
  selector: 'pe-suspended-well-list',
  templateUrl: './pe-suspended-well-list.component.html',
  styleUrls: ['./pe-suspended-well.scss']
})
export class PeSuspendedWellListComponent implements OnInit {

  displayedColumns: string[] = ["select", "nomor","well", "status", "primemover", "merk", "tipe", "min_ch","med_ch","max_ch","min_sl","med_sl","max_sl","used_sl","noted","action"];
  headerColumns1: string[] = ["select", "nomor","well","status","primemover", "merk", "tipe","crankhole","panjang_sl","noted","action"];
  headerColumns2: string[] = ["min_ch","med_ch","max_ch","min_sl","med_sl","max_sl","used_sl"];
  exampleDatabase: ExampleHttpDao | null;
  data: PePumpingUnit[] = [];

  dataSource = new MatTableDataSource<any>(this.data);
  selection = new SelectionModel<any>(true, []);

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

  nomorFilter = new FormControl('');
  wellFilter = new FormControl('');
  statusFilter = new FormControl('');
  primemoverFilter = new FormControl('');
  merkFilter = new FormControl('');
  tipeFilter = new FormControl('');
  min_chFilter = new FormControl('');
  med_chFilter = new FormControl('');
  max_chFilter = new FormControl('');
  min_slFilter = new FormControl('');
  med_slFilter = new FormControl('');
  max_slFilter = new FormControl('');
  used_slFilter = new FormControl('');
  notedFilter = new FormControl('');

  nomor_xSelected = [];
  well_xSelected = [];
  status_xSelected = [];
  primemover_xSelected = [];
  merk_xSelected = [];
  tipe_xSelected = [];
  min_ch_xSelected = [];
  med_ch_xSelected = [];
  max_ch_xSelected = [];
  min_sl_xSelected = [];
  med_sl_xSelected = [];
  max_sl_xSelected = [];
  used_sl_xSelected = [];
  noted_xSelected = [];
  lama_xSelected = [];
  rusak_xSelected = [];
  stok_awal_xSelected = [];
  barang_masuk_xSelected = [];
  barang_keluar_xSelected = [];
  stok_akhir_xSelected = [];
  keterangan_xSelected = [];

  filterSubscription:Subscription;
  selectedSubscription:Subscription;
  listSubscription:Subscription;

  constructor(
    private http: HttpClient,
    private router: Router,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private pe_bhpService: PePumpingUnitService,
    public snackbarService: SnackbarService,
    public pePermissionService: PePermissionService,
    private titleService: TitleService,
    private route: ActivatedRoute,
    private xfilterService: xFilterService,
    public commonService: CommonService,
    private service: PePumpingUnitService,
    ) {}

  ngOnInit() {

    this.titleService.titleSource.next({
      title: "Pumping Unit",
      icon: "summarize",
      breadcrumbs: [
        {label: 'Petroleum Engineering', routerLink: ''}, 
        {label: 'Pumping Unit', routerLink: ''}
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
      this.nomorFilter.valueChanges.pipe(debounceTime(300)),
      this.wellFilter.valueChanges.pipe(debounceTime(300)),
      this.primemoverFilter.valueChanges.pipe(debounceTime(300)),
      this.statusFilter.valueChanges.pipe(debounceTime(300)),
      this.merkFilter.valueChanges.pipe(debounceTime(300)),
      this.tipeFilter.valueChanges.pipe(debounceTime(300)),
      this.min_chFilter.valueChanges.pipe(debounceTime(300)),
      this.med_chFilter.valueChanges.pipe(debounceTime(300)),
      this.max_chFilter.valueChanges.pipe(debounceTime(300)),
      this.min_slFilter.valueChanges.pipe(debounceTime(300)),
      this.med_slFilter.valueChanges.pipe(debounceTime(300)),
      this.max_slFilter.valueChanges.pipe(debounceTime(300)),
      this.used_slFilter.valueChanges.pipe(debounceTime(300)),
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
      ).subscribe((data: PePumpingUnit[]) => {
        this.data = data.map(d => ({
          ...d,
          isEdit: false   
        }));

        // this.dataSource = new MatTableDataSource<any>(this.data);
        this.dataSource.data = data.map(item => ({
          ...item,
          isEdit: false
        }));
        this.selection.clear();
      });
  }

  edit(row: PePumpingUnitRow) {
    row._backup = { ...row };
    row.isEdit = true;
  }

  save(row: PePumpingUnitRow) {
    this.hitungSemuaStok(row);

    const payload: Partial<PePumpingUnit> = { ...row };
    // Simpan backup 
    const backupData = { ...row._backup };

    // buang properti frontend
    delete (payload as any).isEdit;
    delete (payload as any)._backup;

    this.service.updatePePumpingUnit(row._id, payload).subscribe({
      next: (res) => {
        // Update row state
        row.isEdit = false;
        delete row._backup;

        // Update dataSource
        const idx = this.dataSource.data.findIndex(
          d => d._id === row._id
        );
        if (idx !== -1) {
          this.dataSource.data[idx] = {
            ...this.dataSource.data[idx],
            ...payload,
            isEdit: false
          };
          this.dataSource.data = [...this.dataSource.data];
        }

        // Show success notification with undo option (5 seconds)
        const snackBarRef = this.snackBar.open('Data berhasil diupdate', 'UNDO', {
          duration: 5000
        });

        snackBarRef.onAction().subscribe(() => {
          // User clicked UNDO - revert to backup
          this.undoUpdate(row._id, backupData);
        });
      },
      error: (error) => {
        // rollback kalau gagal
        this.cancel(row);
        this.snackBar.open(error.message ? error.message : 'Gagal mengupdate data', 'Tutup', {
          duration: 5000
        });
      }
    });
  }

  undoUpdate(id: string, backupData: any) {
    const payload = { ...backupData };
    delete payload.isEdit;
    delete payload._backup;

    this.service.updatePePumpingUnit(id, payload).subscribe({
      next: (res) => {
        // Update this.data array
        const dataIdx = this.data.findIndex(d => d._id === id);
        if (dataIdx !== -1) {
          // Update the object in place and create new reference
          Object.keys(backupData).forEach(key => {
            if (key !== 'isEdit' && key !== '_backup') {
              (this.data[dataIdx] as any)[key] = backupData[key];
            }
          });
          (this.data[dataIdx] as any).isEdit = false;
          delete (this.data[dataIdx] as any)._backup;
        }

        // Update dataSource.data array
        const dsIdx = this.dataSource.data.findIndex(d => d._id === id);
        if (dsIdx !== -1) {
          Object.keys(backupData).forEach(key => {
            if (key !== 'isEdit' && key !== '_backup') {
              (this.dataSource.data[dsIdx] as any)[key] = backupData[key];
            }
          });
          (this.dataSource.data[dsIdx] as any).isEdit = false;
          delete (this.dataSource.data[dsIdx] as any)._backup;
        }
        
        // Force Angular to detect changes by creating new array reference
        this.data = [...this.data];
        this.dataSource.data = [...this.data];
        
        this.snackBar.open('Perubahan dibatalkan', 'Tutup', { duration: 3000 });
      },
      error: (error) => {
        this.snackBar.open('Gagal membatalkan perubahan', 'Tutup', { duration: 5000 });
      }
    });
  }

  toNumber(val: any): number {
    if (val === null || val === undefined || val === '') {
      return 0;
    }
    return Number(val);
  }

  hitungStokAwal(row: any) {
    const baru = this.toNumber(row.baru);
    const lama = this.toNumber(row.lama);
    const rusak = this.toNumber(row.rusak);
    

    row.stok_awal = baru + lama + rusak;
  }

  hitungStokAkhir(row: any) {
    const stokAwal = this.toNumber(row.stok_awal);
    const barangMasuk = this.toNumber(row.barang_masuk);
    const barangKeluar = this.toNumber(row.barang_keluar);
    
    row.stok_akhir = stokAwal + barangMasuk - barangKeluar;
  }

  hitungSemuaStok(row: any) {
    this.hitungStokAwal(row);
    this.hitungStokAkhir(row);
  }

  onValueChange(row: any) {
    this.hitungSemuaStok(row);
  }


  cancel(row: PePumpingUnitRow) {
    Object.assign(row, row._backup);
    row.isEdit = false;
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
        filename: 'BHP.xlsx',
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
    if(this.nomor_xSelected.length) columnfilter["nomor"] = this.nomor_xSelected;
    if(this.well_xSelected.length) columnfilter["well"] = this.well_xSelected;//.map(s => "^"+s+"$");
    if(this.primemover_xSelected.length) columnfilter["primemover"] = this.primemover_xSelected;
    if(this.status_xSelected.length) columnfilter["status"] = this.status_xSelected;
    if(this.merk_xSelected.length) columnfilter["merk"] = this.merk_xSelected;
    if(this.tipe_xSelected.length) columnfilter["tipe"] = this.tipe_xSelected;
    if(this.min_ch_xSelected.length) columnfilter["min_ch"] = this.min_ch_xSelected;
    if(this.med_ch_xSelected.length) columnfilter["med_ch"] = this.med_ch_xSelected;
    if(this.max_ch_xSelected.length) columnfilter["max_ch"] = this.max_ch_xSelected;
    if(this.min_sl_xSelected.length) columnfilter["min_sl"] = this.min_sl_xSelected;
    if(this.med_sl_xSelected.length) columnfilter["med_sl"] = this.med_sl_xSelected;
    if(this.max_sl_xSelected.length) columnfilter["max_sl"] = this.max_sl_xSelected;
    if(this.used_sl_xSelected.length) columnfilter["used_sl"] = this.used_sl_xSelected;
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

    const dialogRef = this.dialog.open(PePumpingUnitDeleteDialogComponent, {
      width: '250px',
      data: this.selection.selected.length
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.isLoadingResults = true; 
        this.snackbarService.status.next(new SnackbarApi(false));
        this.http.delete<any>('/api/pe/PumpingUnit', {
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

export interface PePumpingUnitApi {
  items: PePumpingUnit[];
  total_count: number;
}

/*export interface PeSensor {
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

  getRepoIssues(sort: string, order: string, page: number, pagesize: number = 50, filter: string, columnfilter: object, mode: string = "", httpOption: object = {}): Observable<PePumpingUnitApi> {

    var params = {};
    if(sort!=null) params["sort"] = sort;
    if(order!=null) params["order"] = order;
    if(page!=null) params["page"] = page.toString();
    if(pagesize!=null) params["pagesize"] = pagesize.toString();
    if(filter!=null) params["filter"] = filter;
    if(Object.keys(columnfilter).length > 0) params["columnfilter"] = JSON.stringify(columnfilter);
    if(mode != null) params["mode"] = mode;

    httpOption["params"] = params;

    return this.http.get<PePumpingUnitApi>('/api/pe/PumpingUnit', httpOption);
  }
}

@Component({
  selector: 'app-pumping-unit-delete-dialog',
  template: '<h1 mat-dialog-title>Confirm Delete</h1><div mat-dialog-content>  <p>Confirm delete {{data}} selected item ?</p></div><div mat-dialog-actions>  <button mat-button [mat-dialog-close]="1" >Yes</button> <button mat-button [mat-dialog-close]="0" cdkFocusInitial>No</button> </div>',
  styleUrls: ['./pe-pumping-unit.scss']
})
export class PePumpingUnitDeleteDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<PePumpingUnitDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
  
  onYesClick(): void {
    this.dialogRef.close();
  }

}
