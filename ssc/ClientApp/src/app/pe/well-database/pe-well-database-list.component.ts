import { HttpClient, HttpParams, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';
import { merge, Observable, of as observableOf, Subscription } from 'rxjs';
import { catchError, map, startWith, switchMap, debounceTime } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { SelectionModel } from '@angular/cdk/collections';

import { PeWellDatabaseService} from './pe-well-database.service';
import { PeWellDatabase}    from './pe-well-database';
import { SnackbarService } from '../../snackbar.service';
import { SnackbarApi } from '../../snackbar.service';
import { PePermissionService } from '../pe-permission.service';
import { TitleService } from '../../navigation/title/title.service';
import { xFilterService } from '../../xfilter/xfilter.component';
import { CommonService } from '../../common.service';

type PeWellDatabaseRow = PeWellDatabase & {
  isEdit?: boolean;
  _backup?: Partial<PeWellDatabase>;
};

@Component({
  selector: 'pe-well-database-list',
  templateUrl: './pe-well-database-list.component.html',
  styleUrls: ['./pe-well-database.scss']
})
export class PeWellDatabaseListComponent implements OnInit {

  displayedColumns: string[] = [
    "select", "well","last_comp_date", "layer_acc", "interval_acc", "top", "bottom", 
    "layer_unacc","interval_unacc","top_2","bottom_2","hole_feature","panjang_feature", 
    "date_acc", "gross_acc", "net_acc", "wc_acc", "remarks_acc", 
    "date_unacc", "gross_unacc", "net_unacc","wc_unacc","remarks_unacc",
    "date_acc_static","sfl_acc","ps_acc","date_acc_dynamic","dfl_acc", "pwf_acc","acc_pi", "acc_ipr",
    "date_unacc_static","sfl_unacc","ps_unacc","date_unacc_dynamic","dfl_unacc", "pwf_unacc","unacc_pi", "unacc_ipr",
    "rtl","remarks"
  ];
  headerColumns1: string[] = [
    "select","well","accessed_layer","unaccessed_layer", "hole_feature","panjang_feature", "acc_layer_perfo", "unacc_layer_perfo",
    "acc_layer_sonolog", "acc_pi","acc_ipr","unacc_layer_sonolog","unacc_pi", "unacc_ipr",
    "rtl","remarks"
  ];
  headerColumns2: string[] = [
    "last_comp_date", "layer_acc", "interval_acc", "top", "bottom", 
    "layer_unacc","interval_unacc","top_2","bottom_2", "date_acc", "gross_acc", "net_acc", "wc_acc", "remarks_acc", 
    "date_unacc", "gross_unacc", "net_unacc","wc_unacc","remarks_unacc", 
    "date_acc_static","sfl_acc","ps_acc","date_acc_dynamic","dfl_acc", "pwf_acc",
    "date_unacc_static","sfl_unacc","ps_unacc","date_unacc_dynamic","dfl_unacc", "pwf_unacc"
  ];
  exampleDatabase: ExampleHttpDao | null;
  data: PeWellDatabase[] = [];

  dataSource = new MatTableDataSource<any>(this.data);
  selection = new SelectionModel<any>(true, []);
  // isEditing:boolean = false;

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

  wellFilter = new FormControl('');
  last_comp_dateFilter = new FormControl('');
  layer_accFilter = new FormControl('');
  interval_accFilter = new FormControl('');
  topFilter = new FormControl('');
  bottomFilter = new FormControl('');
  layer_unaccFilter = new FormControl('');
  interval_unaccFilter = new FormControl('');
  top_2Filter = new FormControl('');
  bottom_2Filter = new FormControl('');
  hole_featureFilter = new FormControl('');
  panjang_featureFilter = new FormControl('');
  date_accFilter = new FormControl('');
  gross_accFilter = new FormControl('');
  net_accFilter = new FormControl('');
  wc_accFilter = new FormControl('');
  remarks_accFilter = new FormControl('');
  date_unaccFilter = new FormControl('');
  gross_unaccFilter = new FormControl('');
  net_unaccFilter = new FormControl('');
  wc_unaccFilter = new FormControl('');
  remarks_unaccFilter = new FormControl('');
  date_acc_staticFilter = new FormControl('');
  sfl_accFilter = new FormControl('');
  ps_accFilter = new FormControl('');
  date_acc_dynamicFilter = new FormControl('');
  dfl_accFilter = new FormControl('');
  pwf_accFilter = new FormControl('');
  acc_piFilter = new FormControl('');
  acc_iprFilter = new FormControl('');
  date_unacc_staticFilter = new FormControl('');
  sfl_unaccFilter = new FormControl('');
  ps_unaccFilter = new FormControl('');
  date_unacc_dynamicFilter = new FormControl('');
  dfl_unaccFilter = new FormControl('');
  pwf_unaccFilter = new FormControl('');
  unacc_piFilter = new FormControl('');
  unacc_iprFilter = new FormControl('');

  rtlFilter = new FormControl('');
  remarksFilter = new FormControl('');

  well_xSelected = [];
  last_comp_date_xSelected = [];
  layer_acc_xSelected = [];
  interval_acc_xSelected = [];
  top_xSelected = [];
  bottom_xSelected = [];
  layer_unacc_xSelected = [];
  interval_unacc_xSelected = [];
  top_2_xSelected = [];
  bottom_2_xSelected = [];
  hole_feature_xSelected = [];
  panjang_feature_xSelected = [];
  date_acc_xSelected = [];
  gross_acc_xSelected = [];
  net_acc_xSelected = [];
  wc_acc_xSelected = [];
  remarks_acc_xSelected = [];
  date_unacc_xSelected = [];
  gross_unacc_xSelected = [];
  net_unacc_xSelected = [];
  wc_unacc_xSelected = [];
  remarks_unacc_xSelected = [];
  date_acc_static_xSelected = [];
  sfl_acc_xSelected = [];
  ps_acc_xSelected = [];
  date_acc_dynamic_xSelected = [];
  dfl_acc_xSelected = [];
  pwf_acc_xSelected = [];
  acc_pi_xSelected = [];
  acc_ipr_xSelected = [];
  date_unacc_static_xSelected = [];
  sfl_unacc_xSelected = [];
  ps_unacc_xSelected = [];
  date_unacc_dynamic_xSelected = [];
  dfl_unacc_xSelected = [];
  pwf_unacc_xSelected = [];
  unacc_pi_xSelected = [];
  unacc_ipr_xSelected = [];

  rtl_xSelected = [];
  remarks_xSelected = [];

  filterSubscription:Subscription;
  selectedSubscription:Subscription;
  listSubscription:Subscription;

  constructor(
    private http: HttpClient,
    private router: Router,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private pe_suspendedService: PeWellDatabaseService,
    public snackbarService: SnackbarService,
    public pePermissionService: PePermissionService,
    private titleService: TitleService,
    private route: ActivatedRoute,
    private xfilterService: xFilterService,
    public commonService: CommonService,
    private service: PeWellDatabaseService,
    ) {}

  ngOnInit() {

    this.titleService.titleSource.next({
      title: "Suspended Well Database",
      icon: "storage",
      breadcrumbs: [
        {label: 'Petroleum Engineering', routerLink: ''}, 
        {label: 'Well Database', routerLink: ''}
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
      this.wellFilter.valueChanges.pipe(debounceTime(300)),
      this.last_comp_dateFilter.valueChanges.pipe(debounceTime(300)),
      this.layer_accFilter.valueChanges.pipe(debounceTime(300)),
      this.interval_accFilter.valueChanges.pipe(debounceTime(300)),
      this.topFilter.valueChanges.pipe(debounceTime(300)),
      this.bottomFilter.valueChanges.pipe(debounceTime(300)),
      this.layer_unaccFilter.valueChanges.pipe(debounceTime(300)),
      this.interval_unaccFilter.valueChanges.pipe(debounceTime(300)),
      this.top_2Filter.valueChanges.pipe(debounceTime(300)),
      this.bottom_2Filter.valueChanges.pipe(debounceTime(300)),
      this.hole_featureFilter.valueChanges.pipe(debounceTime(300)),
      this.panjang_featureFilter.valueChanges.pipe(debounceTime(300)),
      this.date_accFilter.valueChanges.pipe(debounceTime(300)),
      this.gross_accFilter.valueChanges.pipe(debounceTime(300)),
      this.net_accFilter.valueChanges.pipe(debounceTime(300)),
      this.wc_accFilter.valueChanges.pipe(debounceTime(300)),
      this.remarks_accFilter.valueChanges.pipe(debounceTime(300)),
      this.date_unaccFilter.valueChanges.pipe(debounceTime(300)),
      this.gross_unaccFilter.valueChanges.pipe(debounceTime(300)),
      this.net_unaccFilter.valueChanges.pipe(debounceTime(300)),
      this.wc_unaccFilter.valueChanges.pipe(debounceTime(300)),
      this.remarks_unaccFilter.valueChanges.pipe(debounceTime(300)),
      this.date_acc_staticFilter.valueChanges.pipe(debounceTime(300)),
      this.sfl_accFilter.valueChanges.pipe(debounceTime(300)),
      this.ps_accFilter.valueChanges.pipe(debounceTime(300)),
      this.date_acc_dynamicFilter.valueChanges.pipe(debounceTime(300)),
      this.dfl_accFilter.valueChanges.pipe(debounceTime(300)),
      this.pwf_accFilter.valueChanges.pipe(debounceTime(300)),
      this.acc_piFilter.valueChanges.pipe(debounceTime(300)),
      this.acc_iprFilter.valueChanges.pipe(debounceTime(300)),
      this.date_unacc_staticFilter.valueChanges.pipe(debounceTime(300)),
      this.sfl_unaccFilter.valueChanges.pipe(debounceTime(300)),
      this.ps_unaccFilter.valueChanges.pipe(debounceTime(300)),
      this.date_unacc_dynamicFilter.valueChanges.pipe(debounceTime(300)),
      this.dfl_unaccFilter.valueChanges.pipe(debounceTime(300)),
      this.pwf_unaccFilter.valueChanges.pipe(debounceTime(300)),
      this.unacc_piFilter.valueChanges.pipe(debounceTime(300)),
      this.unacc_iprFilter.valueChanges.pipe(debounceTime(300)),
      
      this.rtlFilter.valueChanges.pipe(debounceTime(300)),
      this.remarksFilter.valueChanges.pipe(debounceTime(300)),
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
        this.isLoadingResults = false;
        this.isRateLimitReached = false;
        this.resultsLength = data.total_count;

        return data.items;
      }),
      catchError(() => {
        this.isLoadingResults = false;
        this.isRateLimitReached = true;
        return observableOf([]);
      })
      ).subscribe((data: PeWellDatabase[]) => {
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

  edit(row: PeWellDatabaseRow) {
    row._backup = { ...row };
    row.isEdit = true;
  }

  save(row: PeWellDatabaseRow) {
    this.hitungSemuaStok(row);

    const payload: Partial<PeWellDatabase> = { ...row };
    // Simpan backup 
    const backupData = { ...row._backup };

    // buang properti frontend
    delete (payload as any).isEdit;
    delete (payload as any)._backup;

    this.service.updatePeWellDatabase(row._id, payload).subscribe({
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

    this.service.updatePeWellDatabase(id, payload).subscribe({
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


  cancel(row: PeWellDatabaseRow) {
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
    if(this.well_xSelected.length) columnfilter["well"] = this.well_xSelected;//.map(s => "^"+s+"$");
    if(this.last_comp_date_xSelected.length) columnfilter["last_comp_date"] = this.last_comp_date_xSelected;//.map(s => "^"+s+"$");
    if(this.layer_acc_xSelected.length) columnfilter["layer_acc"] = this.layer_acc_xSelected;
    if(this.interval_acc_xSelected.length) columnfilter["interval_acc"] = this.interval_acc_xSelected;
    if(this.top_xSelected.length) columnfilter["top"] = this.top_xSelected;
    if(this.bottom_xSelected.length) columnfilter["bottom"] = this.bottom_xSelected;
    if(this.layer_unacc_xSelected.length) columnfilter["layer_unacc"] = this.layer_unacc_xSelected;
    if(this.interval_unacc_xSelected.length) columnfilter["interval_unacc"] = this.interval_unacc_xSelected;
    if(this.top_2_xSelected.length) columnfilter["top_2"] = this.top_2_xSelected;
    if(this.bottom_2_xSelected.length) columnfilter["bottom_2"] = this.bottom_2_xSelected;
    if(this.hole_feature_xSelected.length) columnfilter["hole_feature"] = this.hole_feature_xSelected;
    if(this.panjang_feature_xSelected.length) columnfilter["panjang_feature"] = this.panjang_feature_xSelected;
    if(this.date_acc_xSelected.length) columnfilter["date_acc"] = this.date_acc_xSelected;
    if(this.gross_acc_xSelected.length) columnfilter["gross_acc"] = this.gross_acc_xSelected;
    if(this.net_acc_xSelected.length) columnfilter["net_acc"] = this.net_acc_xSelected;
    if(this.wc_acc_xSelected.length) columnfilter["wc_acc"] = this.wc_acc_xSelected;
    if(this.remarks_acc_xSelected.length) columnfilter["remarks_acc"] = this.remarks_acc_xSelected;
    if(this.date_unacc_xSelected.length) columnfilter["date_unacc"] = this.date_unacc_xSelected;
    if(this.gross_unacc_xSelected.length) columnfilter["gross_unacc"] = this.gross_unacc_xSelected;
    if(this.net_unacc_xSelected.length) columnfilter["net_unacc"] = this.net_unacc_xSelected;
    if(this.wc_unacc_xSelected.length) columnfilter["wc_unacc"] = this.wc_unacc_xSelected;
    if(this.remarks_unacc_xSelected.length) columnfilter["remarks_unacc"] = this.remarks_unacc_xSelected;
    if(this.date_acc_static_xSelected.length) columnfilter["date_acc_static"] = this.date_acc_static_xSelected;
    if(this.sfl_acc_xSelected.length) columnfilter["sfl_acc"] = this.sfl_acc_xSelected;
    if(this.ps_acc_xSelected.length) columnfilter["ps_acc"] = this.ps_acc_xSelected;
    if(this.date_acc_dynamic_xSelected.length) columnfilter["date_acc_dynamic"] = this.date_acc_dynamic_xSelected;
    if(this.dfl_acc_xSelected.length) columnfilter["dfl_acc"] = this.dfl_acc_xSelected;
    if(this.pwf_acc_xSelected.length) columnfilter["pwf_acc"] = this.pwf_acc_xSelected;
    if(this.acc_pi_xSelected.length) columnfilter["acc_pi"] = this.acc_pi_xSelected;
    if(this.acc_ipr_xSelected.length) columnfilter["acc_ipr"] = this.acc_ipr_xSelected;
    if(this.date_unacc_static_xSelected.length) columnfilter["date_unacc_static"] = this.date_unacc_static_xSelected;
    if(this.sfl_unacc_xSelected.length) columnfilter["sfl_unacc"] = this.sfl_unacc_xSelected;
    if(this.ps_unacc_xSelected.length) columnfilter["ps_unacc"] = this.ps_unacc_xSelected;
    if(this.date_unacc_dynamic_xSelected.length) columnfilter["date_unacc_dynamic"] = this.date_unacc_dynamic_xSelected;
    if(this.dfl_unacc_xSelected.length) columnfilter["dfl_unacc"] = this.dfl_unacc_xSelected;
    if(this.pwf_unacc_xSelected.length) columnfilter["pwf_unacc"] = this.pwf_unacc_xSelected;
    if(this.unacc_pi_xSelected.length) columnfilter["unacc_pi"] = this.unacc_pi_xSelected;
    if(this.unacc_ipr_xSelected.length) columnfilter["unacc_ipr"] = this.unacc_ipr_xSelected;

    if(this.rtl_xSelected.length) columnfilter["rtl"] = this.rtl_xSelected;
    if(this.remarks_xSelected.length) columnfilter["remarks"] = this.remarks_xSelected;

    //if(this.start_submitDate) columnfilter['start_submitDate'] = this.start_submitDate;// - date.getTimezoneOffset()*60*1000;//.getTime();
    //if(this.end_submitDate) columnfilter['end_submitDate'] = this.end_submitDate;// - date.getTimezoneOffset()*60*1000;//.getTime();
    //if(this.group) columnfilter['group'] = this.group;
    //if(this.status) columnfilter['status'] = this.status;
    return columnfilter;
  }

  formatInterval(arr) {
    return arr.map(a => a.join("-")).join(", ");
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  checkboxLabel(row?: any): string {
    if (!row) {
        return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.presence_user_workday_cycle_id}`;
  }

  deleteSelected() {
    this.snackbarService.status.next(new SnackbarApi(false));

    const dialogRef = this.dialog.open(PeWellDatabaseDeleteDialogComponent, {
      width: '250px',
      data: this.selection.selected.length
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.isLoadingResults = true; 
        this.snackbarService.status.next(new SnackbarApi(false));
        this.http.delete<any>('/api/pe/WellDatabase', {
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

export interface PeWellDatabaseApi {
  items: PeWellDatabase[];
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

export class ExampleHttpDao {
  constructor(private http: HttpClient) {}

  getRepoIssues(sort: string, order: string, page: number, pagesize: number = 50, filter: string, columnfilter: object, mode: string = "", httpOption: object = {}): Observable<PeWellDatabaseApi> {

    var params = {};
    if(sort!=null) params["sort"] = sort;
    if(order!=null) params["order"] = order;
    if(page!=null) params["page"] = page.toString();
    if(pagesize!=null) params["pagesize"] = pagesize.toString();
    if(filter!=null) params["filter"] = filter;
    if(Object.keys(columnfilter).length > 0) params["columnfilter"] = JSON.stringify(columnfilter);
    if(mode != null) params["mode"] = mode;

    httpOption["params"] = params;

    return this.http.get<PeWellDatabaseApi>('/api/pe/WellDatabase', httpOption);
  }
}

@Component({
  selector: 'app-well-database-delete-dialog',
  template: '<h1 mat-dialog-title>Confirm Delete</h1><div mat-dialog-content>  <p>Confirm delete {{data}} selected item ?</p></div><div mat-dialog-actions>  <button mat-button [mat-dialog-close]="1" >Yes</button> <button mat-button [mat-dialog-close]="0" cdkFocusInitial>No</button> </div>',
  styleUrls: ['./pe-well-database.scss']
})
export class PeWellDatabaseDeleteDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<PeWellDatabaseDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
  
  onYesClick(): void {
    this.dialogRef.close();
  }

}
