import { HttpClient, HttpParams, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';
import { merge, Observable, of as observableOf, Subscription } from 'rxjs';
import { catchError, map, startWith, switchMap, debounceTime } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { SelectionModel } from '@angular/cdk/collections';

import { PeLabService} from './pe-lab.service';
import { PeLab}    from './pe-lab';
import { SnackbarService } from '../../snackbar.service';
import { SnackbarApi } from '../../snackbar.service';
import { PePermissionService } from '../pe-permission.service';
import { TitleService } from '../../navigation/title/title.service';
import { xFilterService } from '../../xfilter/xfilter.component';
import { CommonService } from '../../common.service';

@Component({
  selector: 'pe-lab-list',
  templateUrl: './pe-lab-list.component.html',
  styleUrls: ['./pe-lab.scss']
})
export class PeLabListComponent implements OnInit {

  displayedColumns: string[] = ["select", "nomor", "id", "nama_alat", "spesifikasi", "satuan", "kegunaan", "baru", "lama", "rusak", "stok_awal", "barang_masuk", "barang_keluar", "stok_akhir", "keterangan"];
  exampleDatabase: ExampleHttpDao | null;
  data: PeLab[] = [];

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

  nomorFilter = new FormControl('');
  idFilter = new FormControl('');
  nama_alatFilter = new FormControl('');
  spesifikasiFilter = new FormControl('');
  kegunaanFilter = new FormControl('');
  baruFilter = new FormControl('');
  lamaFilter = new FormControl('');
  rusakFilter = new FormControl('');
  stok_awalFilter = new FormControl('');
  stok_akhirFilter = new FormControl('');
  barang_masukFilter = new FormControl('');
  barang_keluarFilter = new FormControl('');
  keteranganFilter = new FormControl('');

  nomor_xSelected = [];
  id_xSelected = [];
  nama_alat_xSelected = [];
  spesifikasi_xSelected = [];
  kegunaan_xSelected = [];
  baru_xSelected = [];
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
    //public snackBar: MatSnackBar,
    private pe_bhpService: PeLabService,
    public snackbarService: SnackbarService,
    public pePermissionService: PePermissionService,
    private titleService: TitleService,
    private route: ActivatedRoute,
    private xfilterService: xFilterService,
    public commonService: CommonService,
    ) {}

  ngOnInit() {

    this.titleService.titleSource.next({
      title: "Lab",
      icon: "sensors",
      breadcrumbs: [
        {label: 'Petroleum Engineering', routerLink: ''}, 
        {label: 'BHP', routerLink: ''}
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
      this.idFilter.valueChanges.pipe(debounceTime(300)),
      this.nama_alatFilter.valueChanges.pipe(debounceTime(300)),
      this.kegunaanFilter.valueChanges.pipe(debounceTime(300)),
      this.spesifikasiFilter.valueChanges.pipe(debounceTime(300)),
      this.baruFilter.valueChanges.pipe(debounceTime(300)),
      this.lamaFilter.valueChanges.pipe(debounceTime(300)),
      this.rusakFilter.valueChanges.pipe(debounceTime(300)),
      this.barang_masukFilter.valueChanges.pipe(debounceTime(300)),
      this.stok_awalFilter.valueChanges.pipe(debounceTime(300)),
      this.stok_akhirFilter.valueChanges.pipe(debounceTime(300)),
      this.barang_keluarFilter.valueChanges.pipe(debounceTime(300)),
      this.keteranganFilter.valueChanges.pipe(debounceTime(300)),
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
        this.selection.clear();
      });

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
    if(this.id_xSelected.length) columnfilter["id"] = this.id_xSelected;//.map(s => "^"+s+"$");
    if(this.nama_alat_xSelected.length) columnfilter["nama_alat"] = this.nama_alat_xSelected;
    if(this.spesifikasi_xSelected.length) columnfilter["spesifikasi"] = this.spesifikasi_xSelected;
    if(this.kegunaan_xSelected.length) columnfilter["kegunaan"] = this.kegunaan_xSelected;
    if(this.baru_xSelected.length) columnfilter["baru"] = this.baru_xSelected;
    if(this.lama_xSelected.length) columnfilter["lama"] = this.lama_xSelected;
    if(this.rusak_xSelected.length) columnfilter["rusak"] = this.rusak_xSelected;
    if(this.stok_awal_xSelected.length) columnfilter["stok_awal"] = this.stok_awal_xSelected;
    if(this.barang_masuk_xSelected.length) columnfilter["barang_masuk"] = this.barang_masuk_xSelected;
    if(this.barang_keluar_xSelected.length) columnfilter["barang_keluar"] = this.barang_keluar_xSelected;
    if(this.stok_akhir_xSelected.length) columnfilter["stok_akhir"] = this.stok_akhir_xSelected;
    if(this.keterangan_xSelected.length) columnfilter["keterangan"] = this.keterangan_xSelected;

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

    const dialogRef = this.dialog.open(PeLabDeleteDialogComponent, {
      width: '250px',
      data: this.selection.selected.length
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.isLoadingResults = true; 
        this.snackbarService.status.next(new SnackbarApi(false));
        this.http.delete<any>('/api/pe/bhp', {
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

export interface PeLabApi {
  items: PeLab[];
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

  getRepoIssues(sort: string, order: string, page: number, pagesize: number = 50, filter: string, columnfilter: object, mode: string = "", httpOption: object = {}): Observable<PeLabApi> {

    var params = {};
    if(sort!=null) params["sort"] = sort;
    if(order!=null) params["order"] = order;
    if(page!=null) params["page"] = page.toString();
    if(pagesize!=null) params["pagesize"] = pagesize.toString();
    if(filter!=null) params["filter"] = filter;
    if(Object.keys(columnfilter).length > 0) params["columnfilter"] = JSON.stringify(columnfilter);
    if(mode != null) params["mode"] = mode;

    httpOption["params"] = params;

    return this.http.get<PeLabApi>('/api/pe/lab', httpOption);
  }
}

@Component({
  selector: 'app-bhp-delete-dialog',
  template: '<h1 mat-dialog-title>Confirm Delete</h1><div mat-dialog-content>  <p>Confirm delete {{data}} selected item ?</p></div><div mat-dialog-actions>  <button mat-button [mat-dialog-close]="1" >Yes</button> <button mat-button [mat-dialog-close]="0" cdkFocusInitial>No</button> </div>',
  styleUrls: ['./pe-lab.scss']
})
export class PeLabDeleteDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<PeLabDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
  
  onYesClick(): void {
    this.dialogRef.close();
  }

}
