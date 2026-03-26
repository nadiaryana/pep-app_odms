import { HttpClient, HttpParams, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild, Inject, OnDestroy } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA, MatDatepicker } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';
import { merge, Observable, of as observableOf, Subscription, forkJoin } from 'rxjs';
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
    'week1',"week2","delta"];

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
  // end_dateControl = new FormControl(new Date(new Date().setDate(new Date().getDate() - 1)));
  end_dateControl = new FormControl(new Date());
  end_dateInput = this.end_dateControl.value.toLocaleDateString("en-US", { month: "short", year: "numeric", day: "numeric" });

  @ViewChild('weekly_start_datePicker', { static: true }) weekly_start_datePicker: MatDatepicker<any>;
  weekly_start_dateControl = new FormControl(new Date(new Date().setDate(new Date().getDate() - 7)));
  weekly_start_dateInput = this.weekly_start_dateControl.value
    ? this.weekly_start_dateControl.value.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
        day: "numeric",
      })
    : "";

  @ViewChild('weekly_end_datePicker', { static: true }) weekly_end_datePicker: MatDatepicker<any>;
  weekly_end_dateControl = new FormControl(new Date());
  weekly_end_dateInput = this.weekly_end_dateControl.value.toLocaleDateString("en-US", { month: "short", year: "numeric", day: "numeric" });

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

  // dateFilter = new FormControl('');
  start_dateFilter = new FormControl('');
  end_dateFilter = new FormControl('');
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
    // this.start_dateControl.valueChanges.subscribe(() => this.loadData());
    // this.end_dateControl.valueChanges.subscribe(() => this.loadData());

    // this.loadData();
	this.titleService.titleSource.next({
      title: "Aggregate",
      icon: "change_history",
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
      this.start_dateControl.valueChanges.pipe(debounceTime(300)),
      this.end_dateControl.valueChanges.pipe(debounceTime(300)),
      this.weekly_start_dateControl.valueChanges.pipe(debounceTime(300)),
      this.weekly_end_dateControl.valueChanges.pipe(debounceTime(300)),
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
        if (!this.start_dateControl.value || !this.end_dateControl.value ||
            !this.weekly_start_dateControl.value || !this.weekly_end_dateControl.value) {
          return observableOf({
            items: [],
            total_count: 0
          });
        }

        this.isLoadingResults = true;
        
        // Fetch Week 2 (regular dates - 'today') data
        const week2Observable = this.exampleDatabase!.getRepoIssues(
          this.sort.active,
          this.sort.direction,
          this.paginator.pageIndex,
          this.paginator.pageSize,
          this.filterControl.value,
          this.getColumnFilter(),
          "weekly_average",
          {},
          this.start_dateControl.value,
          this.end_dateControl.value
        );

        // Fetch Week 1 (weekly dates - 'prev') data
        const week1Observable = this.exampleDatabase!.getRepoIssues(
          this.sort.active,
          this.sort.direction,
          this.paginator.pageIndex,
          this.paginator.pageSize,
          this.filterControl.value,
          this.getColumnFilter(),
          "weekly_average",
          {},
          this.weekly_start_dateControl.value,
          this.weekly_end_dateControl.value
        );

        // Combine both requests
        return forkJoin([week1Observable, week2Observable]).pipe(
          map(([week1Data, week2Data]) => {
            // Log raw data from both weeks
            console.log("Week 1 (prev) raw API response count:",week1Data.items && week1Data.items.length ? week1Data.items.length : 0);
            if (week1Data.items && week1Data.items.length > 0) {
              console.log("Week 1 sample (first item):", week1Data.items[0]);
            }
            console.log("Week 2 (today) raw API response count:", week2Data.items && week2Data.items.length ? week2Data.items.length : 0);
            if (week2Data.items && week2Data.items.length > 0) {
              console.log("Week 2 sample (first item):", week2Data.items[0]);
            }
            
            // Merge the data and calculate deltas
            const mergedData = this.mergeWeeksData(week1Data.items || [], week2Data.items || []);
            return {
              items: mergedData,
              total_count: mergedData.length
            };
          })
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
    ).subscribe(data => {
      // Panggil function sortMergedData untuk mengurutkan data sesuai pilihan user (sort field & direction)
      this.data = this.sortMergedData(data);
      console.log("Weekly Comparison Data (Week 1 vs Week 2): ", this.data);
      this.dataSource = new MatTableDataSource<any>(this.data);
      this.selection.clear();
    });
	
  }

  // start_dateChange(evt) {
  //   this.start_dateInput = evt.value.toLocaleDateString("en-US", { month: "short", year: "numeric", day: "numeric" });
  //   this.loadData();
  // }

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
  }

  end_dateChange(event: any) {
    if (!event.value) return;

    this.end_dateControl.setValue(event.value);
    this.end_dateInput = this.formatDate(event.value);

    // this.loadData();
  }

  weekly_start_dateChange(event: any) {
    if (!event.value) return;

    this.weekly_start_dateControl.setValue(event.value);
    this.weekly_start_dateInput = this.formatDate(event.value);
  }

  weekly_end_dateChange(event: any) {
    if (!event.value) return;

    this.weekly_end_dateControl.setValue(event.value);
    this.weekly_end_dateInput = this.formatDate(event.value);
  }

  // end_dateChange(evt) {
  //   this.end_dateInput = evt.value.toLocaleDateString("en-US", { month: "short", year: "numeric", day: "numeric" });
  //   this.loadData();
  // }

  
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
      httpOption,
      this.start_dateControl.value,
      this.end_dateControl.value
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
      column,
      {},
      this.start_dateControl.value,
      this.end_dateControl.value
    ).pipe(map((res) => {
      return res;
    })).subscribe(res => {
      this.xfilterService.updateItems({ column: column, items: res.items });
    }, () => {

    });
  }

  // Function untuk mengurutkan (sort) merged data berdasarkan pilihan user
  private sortMergedData(data: any[]): any[] {
    // Jika data kosong atau null, langsung return tanpa diurutkan
    if (!data || data.length === 0) return data;
    
    // Ambil nama field yang dipilih untuk sorting, jika tidak ada default ke 'well'
    const sortField = this.sort && this.sort.active ? this.sort.active : 'well';
    // Cek apakah sorting ascending (true) atau descending (false)
    const isAsc = this.sort && this.sort.direction === 'asc';
    
    // Lakukan array.sort() dengan custom comparator function
    return data.sort((a, b) => {
      // Ambil nilai dari field yang akan diurutkan untuk item a dan b
      let aVal = a[sortField];
      let bVal = b[sortField];
      
      // Jika kedua nilai null/undefined, dianggap sama (tidak perlu diurutkan)
      if (aVal == null && bVal == null) return 0;
      // Jika hanya nilai a yang null, taruh di akhir (asc: 1, desc: -1)
      if (aVal == null) return isAsc ? 1 : -1;
      // Jika hanya nilai b yang null, taruh di akhir (asc: -1, desc: 1)
      if (bVal == null) return isAsc ? -1 : 1;
      
      // Jika keduanya adalah string, ubah ke UPPERCASE agar case-insensitive
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        aVal = aVal.toUpperCase();
        bVal = bVal.toUpperCase();
      }
      
      // Bandingkan nilai a dengan nilai b
      if (aVal < bVal) {
        // Jika a lebih kecil dari b: return -1 untuk asc, return 1 untuk desc
        return isAsc ? -1 : 1;
      } else if (aVal > bVal) {
        // Jika a lebih besar dari b: return 1 untuk asc, return -1 untuk desc
        return isAsc ? 1 : -1;
      }
      // Jika nilai sama, return 0 (tidak perlu diubah urutan)
      return 0;
    });
  }

  private mergeWeeksData(week1Items: any[], week2Items: any[]): any[] {
    // Create a map for week1 data by well
    const week1Map = new Map();
    week1Items.forEach(item => {
      week1Map.set(item.well, item);
    });

    // Create a map for week2 data by well
    const week2Map = new Map();
    week2Items.forEach(item => {
      week2Map.set(item.well, item);
    });

    console.log("=== mergeWeeksData DEBUG ===");
    console.log("Week 1 Map size:", week1Map.size);
    console.log("Week 2 Map size:", week2Map.size);
    
    // Log first item from each week for comparison
    if (week1Map.size > 0) {
      const firstWell = Array.from(week1Map.keys())[0];
      const w1First = week1Map.get(firstWell);
      const w2First = week2Map.get(firstWell);
      console.log(`Comparing well '${firstWell}':`);
      console.log("  Week 1:", w1First);
      console.log("  Week 2:", w2First);
      if (w1First && w2First) {
        console.log(`  fig_curr_gross: W1=${w1First.fig_curr_gross}, W2=${w2First.fig_curr_gross}, Delta should be=${(w2First.fig_curr_gross || 0) - (w1First.fig_curr_gross || 0)}`);
      }
    }

    // Get all unique wells
    const allWells = new Set([...week1Map.keys(), ...week2Map.keys()]);

    // Merge and calculate deltas
    const mergedData = Array.from(allWells).map(well => {
      const week1 = week1Map.get(well) || {};
      const week2 = week2Map.get(well) || {};

      const merged = {
        well: well,
        // Week 1 (prev) data
        fig_curr_gross_prev: week1.fig_curr_gross || 0,
        fig_curr_net_prev: week1.fig_curr_net || 0,
        wc_prev: week1.wc || 0,
        gas_prev: week1.gas || 0,
        ds_efficiency_prev: week1.ds_efficiency || 0,
        sm_prev: week1.sm || 0,
        // Week 2 (today) data
        fig_curr_gross_today: week2.fig_curr_gross || 0,
        fig_curr_net_today: week2.fig_curr_net || 0,
        wc_today: week2.wc || 0,
        gas_today: week2.gas || 0,
        ds_efficiency_today: week2.ds_efficiency || 0,
        sm_today: week2.sm || 0,
        // Calculate deltas (week2 - week1)
        delta_fig_curr_gross: (week2.fig_curr_gross || 0) - (week1.fig_curr_gross || 0),
        delta_fig_curr_net: (week2.fig_curr_net || 0) - (week1.fig_curr_net || 0),
        delta_wc: (week2.wc || 0) - (week1.wc || 0),
        delta_gas: (week2.gas || 0) - (week1.gas || 0),
        delta_ds_efficiency: (week2.ds_efficiency || 0) - (week1.ds_efficiency || 0),
        delta_sm: (week2.sm || 0) - (week1.sm || 0),
        // Include other fields from original data
        ...week1,
        ...week2
      };
      
      // Log first merged item for verification
      if (well === Array.from(allWells)[0]) {
        console.log(`First merged item (${well}):`, merged);
      }
      
      return merged;
    });

    console.log("Final merged data count:", mergedData.length);
    return mergedData;
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

  // loadData() {
  //   if (!this.start_dateControl.value || !this.end_dateControl.value) {
  //   return;
  //   }
  //   this.isLoadingResults = true;

  //   this.http.get<any>('/api/pe/daily/delta', {
  //     params: {
  //       mode: 'delta',
  //       page: '0',
  //       pagesize: '50',
  //       // date: new Date(this.end_dateInput).toISOString(),
  //       startDate: this.start_dateControl.value.toISOString(),
  //       endDate: this.end_dateControl.value.toISOString(),
  //       columnfilter: JSON.stringify(this.getColumnFilter())
  //     }
  //   }).subscribe(res => {
  //     this.dataSource.data = res.items;
  //     this.resultsLength = res.total_count;
  //     this.isLoadingResults = false;
  //   });
  // }

  loadData(): void {
    const week2Start = this.start_dateControl.value;
    const week2End = this.end_dateControl.value;
    const week1Start = this.weekly_start_dateControl.value;
    const week1End = this.weekly_end_dateControl.value;

    if (!week2Start || !week2End || !week1Start || !week1End) {
      console.warn('All dates are required (Week 1 and Week 2)');
      return;
    }

    this.isLoadingResults = true;

    // Fetch Week 1 data
    const week1$ = this.http.get<any>('/api/pe/daily/delta', {
      params: {
        startDate: new Date(week1Start).toISOString(),
        endDate: new Date(week1End).toISOString(),
        mode: 'weekly_average',
        page: '0',
        pagesize: '50',
        sort: 'well',
        order: 'asc'
      }
    });

    // Fetch Week 2 data
    const week2$ = this.http.get<any>('/api/pe/daily/delta', {
      params: {
        startDate: new Date(week2Start).toISOString(),
        endDate: new Date(week2End).toISOString(),
        mode: 'weekly_average',
        page: '0',
        pagesize: '50',
        sort: 'well',
        order: 'asc'
      }
    });

    forkJoin([week1$, week2$]).subscribe({
      next: ([week1Res, week2Res]) => {
        const mergedData = this.mergeWeeksData(week1Res.items || [], week2Res.items || []);
        // Lakukan sorting pada merged data sesuai pilihan user (sort field & direction)
        const sortedData = this.sortMergedData(mergedData);
        this.dataSource.data = sortedData;
        this.isLoadingResults = false;
      },
      error: err => {
        console.error('API ERROR:', err);
        this.isLoadingResults = false;
      }
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

  getRepoIssues(sort: string, order: string, page: number, pagesize: number = 50, filter: string, columnfilter: object, mode: string = "", httpOption: object = {}, startDate: Date, endDate: Date): Observable<any> {

    var params = {};
    if (sort != null) params["sort"] = sort;
    if (order != null) params["order"] = order;
    if (page != null) params["page"] = page.toString();
    if (pagesize != null) params["pagesize"] = pagesize.toString();
    if (filter != null) params["filter"] = filter;
    if (Object.keys(columnfilter).length > 0) params["columnfilter"] = JSON.stringify(columnfilter);
    if (mode != null) params["mode"] = mode;

    params["startDate"] =  startDate.toISOString();
    params["endDate"] =  endDate.toISOString();

    httpOption["params"] = params;

    console.log('API Request - Endpoint: /api/pe/daily/delta, Params:', params);

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