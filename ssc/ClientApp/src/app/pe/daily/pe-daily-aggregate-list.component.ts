import { HttpClient, HttpParams, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild, Inject, OnDestroy } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA, MatDatepicker } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';
import { merge, Observable, of as observableOf, Subscription, forkJoin } from 'rxjs';
import { catchError, map, startWith, switchMap, debounceTime } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { SelectionModel } from '@angular/cdk/collections';

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

  /**
   * Kolom yang ditampilkan di tabel Material.
   * Urutan: identitas well → data Week 1 (prev) → data Week 2 (today) → selisih (delta)
   */
  displayedColumns: string[] = [
    'well', 'well_string',

    // === DATA WEEK 1 (periode lama / "prev") ===
    'fig_curr_gross_prev',
    'fig_curr_net_prev',
    'wc_prev',
    'gas_prev',
    'ds_efficiency_prev',
    'sm_prev',

    // === DATA WEEK 2 (periode baru / "today") ===
    'fig_curr_gross_today',
    'fig_curr_net_today',
    'wc_today',
    'gas_today',
    'ds_efficiency_today',
    'sm_today',

    // === DELTA (Week 2 - Week 1) ===
    'delta_fig_curr_gross',
    'delta_fig_curr_net',
    'delta_wc',
    'delta_gas',
    'delta_ds_efficiency',
    'delta_sm'
  ];

  /**
   * Header baris pertama (grup kolom): select, well, well_string, Week1, Week2, Delta
   * Digunakan bersama headerColumns2 untuk multi-row header di HTML template.
   */
  headerColumns1: string[] = [
    "well", "well_string",
    'week1', "week2", "delta"
  ];

  /**
   * Header baris kedua: nama field individual di dalam setiap grup
   */
  headerColumns2: string[] = [
    'fig_curr_gross_prev', 'fig_curr_net_prev', 'wc_prev', 'gas_prev', 'ds_efficiency_prev', 'sm_prev',
    "fig_curr_gross_today", "fig_curr_net_today", "wc_today", "gas_today", "ds_efficiency_today", "sm_today",
    "delta_fig_curr_gross", "delta_fig_curr_net", "delta_wc", "delta_gas", "delta_ds_efficiency", "delta_sm"
  ];

  // ─── Date Picker: Week 2 (periode baru = "today") ───────────────────────────
  @ViewChild('start_datePicker', { static: true }) start_datePicker: MatDatepicker<any> = null!;
  /** Tanggal awal Week 2 */
  start_dateControl = new FormControl(new Date(new Date(new Date().setDate(new Date().getDate() - 1)).setHours(0, 0, 0, 0)));
  // start_dateInput = this.start_dateControl.value
  //   ? this.start_dateControl.value.toLocaleDateString("en-US", {
  //       month: "short",
  //       year: "numeric",
  //       day: "numeric",
  //     })
  //   : "";
  start_dateInput = new Date(new Date().setDate(new Date().getDate() - 1)).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
    day: "numeric",
  });

  @ViewChild('end_datePicker', { static: true }) end_datePicker: MatDatepicker<any> = null!;
  /** Tanggal akhir Week 2 */
  end_dateControl = new FormControl(new Date(new Date(new Date().setDate(new Date().getDate() - 1)).setHours(0, 0, 0, 0)));
  // end_dateInput = this.end_dateControl.value ? this.end_dateControl.value.toLocaleDateString("en-US", { month: "short", year: "numeric", day: "numeric" }) :  "";
  end_dateInput = new Date(new Date().setDate(new Date().getDate() - 1)).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
    day: "numeric",
  });
  
  // ─── Date Picker: Week 1 (periode lama = "prev") ────────────────────────────
  @ViewChild('weekly_start_datePicker', { static: true }) weekly_start_datePicker: MatDatepicker<any> = null!;
  /** Tanggal awal Week 1 (default 7 hari yang lalu) */
  weekly_start_dateControl = new FormControl(new Date(new Date(new Date().setDate(new Date().getDate() - 7)).setHours(0, 0, 0, 0)));
  weekly_start_dateInput = this.weekly_start_dateControl.value
    ? this.weekly_start_dateControl.value.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
        day: "numeric",
      })
    : "";

  @ViewChild('weekly_end_datePicker', { static: true }) weekly_end_datePicker: MatDatepicker<any> = null!;
  /** Tanggal akhir Week 1 */
  weekly_end_dateControl = new FormControl(new Date(new Date(new Date().setDate(new Date().getDate() - 7)).setHours(0, 0, 0, 0)));
  weekly_end_dateInput = this.weekly_start_dateControl.value 
  ? this.weekly_end_dateControl.value.toLocaleDateString("en-US", { 
    month: "short", 
    year: "numeric", 
    day: "numeric" }) 
    : "";

  // ─── State tabel ────────────────────────────────────────────────────────────
  exampleDatabase: ExampleHttpDao | null = null;
  data: any[] = [];
  dataSource = new MatTableDataSource<any>(this.data);
  /** Model seleksi checkbox (multi-select) */
  selection = new SelectionModel<any>(true, []);
  isEditing: boolean = false;

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  submitting = false;

  /** Parameter dari route (opsional, untuk filter awal dari halaman lain) */
  start_submitDate: Number = 0;
  end_submitDate: Number = 0;
  group: string = '';
  status: string = '';

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = null!;
  @ViewChild(MatSort, { static: true }) sort: MatSort = null!;
  /** Filter teks bebas (search box umum) */
  filterControl = new FormControl('');

  // ─── FormControl untuk input filter per kolom (text input di header) ────────
  start_dateFilter = new FormControl('');
  end_dateFilter = new FormControl('');
  wellFilter = new FormControl('');
  well_stringFilter = new FormControl('');
  fig_curr_grossFilter = new FormControl('');
  fig_curr_netFilter = new FormControl('');
  wcFilter = new FormControl('');
  gasFilter = new FormControl('');
  ds_efficiencyFilter = new FormControl('');

  /**
   * Array nilai yang dipilih user dari komponen xfilter (dropdown filter per kolom).
   * Nama property mengikuti pola: {nama_kolom}_xSelected
   * Diisi otomatis oleh subscription xfilterService.selected di ngOnInit.
   *
   * [PERUBAHAN] well_string_xSelected ditambahkan agar filter well_string
   * bisa dikirim ke backend melalui getColumnFilter() → columnfilter["well_string"]
   */
  date_xSelected = [];
  well_xSelected = [];
  well_string_xSelected = [];   // [BARU] filter untuk kolom well_string
  fig_curr_gross_xSelected = [];
  fig_curr_net_xSelected = [];
  gas_xSelected = [];
  sm_xSelected = [];
  wor_xSelected = [];
  wc_xSelected = [];
  ds_efficiency_xSelected = [];

  // ─── Subscription RxJS (dibersihkan di ngOnDestroy) ─────────────────────────
  filterSubscription: Subscription = null!;
  selectedSubscription: Subscription = null!;
  listSubscription: Subscription = null!;
  
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
    // Set judul halaman di navigation bar
    this.titleService.titleSource.next({
      title: "Aggregate",
      icon: "change_history",
      breadcrumbs: [
        { label: 'Petroleum Engineering', routerLink: '' },
        { label: 'Daily Aggregate', routerLink: '' }
      ]
    });

    // ─── Baca parameter dari route URL (opsional, dikirim dari halaman lain) ──
    var p_start_submitDate = this.route.snapshot.paramMap.get('start_submitDate');
    if (p_start_submitDate != null && p_start_submitDate.length > 0) {
      this.start_submitDate = Number(p_start_submitDate);
    }
    var p_end_submitDate = this.route.snapshot.paramMap.get('end_submitDate');
    if (p_end_submitDate != null && p_end_submitDate.length > 0) {
      this.end_submitDate = Number(p_end_submitDate);
    }
    this.group = (this.route.snapshot.paramMap.get('group') as string) || '';
    this.status = (this.route.snapshot.paramMap.get('status') as string) || '';

    this.exampleDatabase = new ExampleHttpDao(this.http);

    // Reset ke halaman pertama setiap kali kolom sort berubah
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    /**
     * Subscription ke xfilterService.filter:
     * Dipanggil ketika user mengetik di search box dalam dropdown xfilter.
     * Akan memanggil getColumnValues() untuk mengambil pilihan yang tersedia.
     */
    this.filterSubscription = this.xfilterService.filter.subscribe(res => {
      if (res) this.getColumnValues(res);
    });

    /**
     * Subscription ke xfilterService.selected:
     * Dipanggil ketika user memilih/menghapus item di dropdown xfilter.
     * Mengisi property {kolom}_xSelected secara dinamis, misal:
     *   well_xSelected, well_string_xSelected, dll.
     * Ini yang nantinya diambil oleh getColumnFilter() untuk dikirim ke backend.
     */
    this.selectedSubscription = this.xfilterService.selected.subscribe(res => {
      (this as any)[res["column"] + "_xSelected"] = res["selected"];
    });

    /**
     *
     * Alur:
     * 1. Panggil API Week 2 (start_dateControl ~ end_dateControl) → mode: weekly_average
     * 2. Panggil API Week 1 (weekly_start_dateControl ~ weekly_end_dateControl) → mode: weekly_average
     * 3. forkJoin: tunggu keduanya selesai
     * 4. mergeWeeksData: gabungkan berdasarkan composite key well+well_string, hitung delta
     * 5. sortMergedData: urutkan hasil merge sesuai pilihan sort user
     */
    this.listSubscription = merge(
      this.sort.sortChange,
      this.paginator.page,
      this.filterControl.valueChanges.pipe(debounceTime(300)),
      this.start_dateControl.valueChanges.pipe(debounceTime(300)),
      this.end_dateControl.valueChanges.pipe(debounceTime(300)),
      this.weekly_start_dateControl.valueChanges.pipe(debounceTime(300)),
      this.weekly_end_dateControl.valueChanges.pipe(debounceTime(300)),
      this.wellFilter.valueChanges.pipe(debounceTime(300)),
      this.well_stringFilter.valueChanges.pipe(debounceTime(300)),
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
          return observableOf({ items: [], total_count: 0 });
        }

        this.isLoadingResults = true;

        console.log("start_dateControl value", this.start_dateControl.value);
        console.log("end_dateControl value", this.end_dateControl.value);
        // ── Request Week 2 (periode baru, "today") ──
        const week2Observable = this.exampleDatabase!.getRepoIssues(
          this.sort.active,
          this.sort.direction,
          0,       
          9999,    // pagesize 
          this.filterControl.value,
          this.getColumnFilter(),
          "weekly_average",
          {},
          this.start_dateControl.value,    
          this.end_dateControl.value       
        );

        // ── Request Week 1 (periode lama, "prev") ──
        const week1Observable = this.exampleDatabase!.getRepoIssues(
          this.sort.active,
          this.sort.direction,
          0,       
          9999,    
          this.filterControl.value,
          this.getColumnFilter(),
          "weekly_average",
          {},
          this.weekly_start_dateControl.value,   
          this.weekly_end_dateControl.value       
        );

        // ── Gabungkan kedua request, tunggu keduanya selesai ──
        return forkJoin([week1Observable, week2Observable]).pipe(
          map(([week1Data, week2Data]) => {
            console.log("Week 1 (prev) raw API response count:", week1Data.items ? week1Data.items.length : 0);
            console.log("Week 2 (today) raw API response count:", week2Data.items ? week2Data.items.length : 0);

            // Merge data Week 1 dan Week 2, hitung delta di frontend
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
      this.data = this.sortMergedData(data);
      console.log("Weekly Comparison Data (Week 1 vs Week 2):", this.data);

      this.dataSource = new MatTableDataSource<any>(this.data);
      // Hubungkan paginator ke dataSource agar Material Table bisa memotong data per halaman
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.selection.clear();
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
    const d = new Date(event.value); d.setHours(0, 0, 0, 0);
    this.start_dateControl.setValue(d);
    this.start_dateInput = this.formatDate(d);
  }

  end_dateChange(event: any) {
    if (!event.value) return;
    const d = new Date(event.value); d.setHours(0, 0, 0, 0);
    this.end_dateControl.setValue(d);
    this.end_dateInput = this.formatDate(d);
  }

  weekly_start_dateChange(event: any) {
    if (!event.value) return;
    const d = new Date(event.value); d.setHours(0, 0, 0, 0);
    this.weekly_start_dateControl.setValue(d);
    this.weekly_start_dateInput = this.formatDate(d);
  }

  weekly_end_dateChange(event: any) {
    if (!event.value) return;
    const d = new Date(event.value); d.setHours(0, 0, 0, 0);
    this.weekly_end_dateControl.setValue(d);
    this.weekly_end_dateInput = this.formatDate(d);
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
      if ((window.navigator as any).msSaveOrOpenBlob) {
        (window.navigator as any).msSaveBlob(res.data, res.filename);
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

  /**
   * @param param - object dari xfilterService.filter, berisi { column, filter, selected, clear }
   */
  getColumnValues(param: any) {
    var column = param["column"];
    var filter = param["filter"];
    var selected = param["selected"];
    var clear = param["clear"];
    var columnfilter = this.getColumnFilter() as any;

    if (filter) columnfilter[column] = [filter];
    // Jika ada pilihan aktif, konversi ke regex exact match (^nilai$)
    if (selected && selected.length > 0) columnfilter[column] = selected.map((s: any) => "^" + s + "$");
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
    ).pipe(map((res) => res)).subscribe(res => {
      // Kirim hasil ke xfilterService agar dropdown diperbarui
      this.xfilterService.updateItems({ column: column, items: res.items });
    }, () => {});
  }

  private sortMergedData(data: any[]): any[] {
    if (!data || data.length === 0) return data;

    const sortField = this.sort && this.sort.active ? this.sort.active : 'well';
    const isAsc = this.sort && this.sort.direction === 'asc';

    return data.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      // Null selalu di akhir
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return isAsc ? 1 : -1;
      if (bVal == null) return isAsc ? -1 : 1;

      // String: case-insensitive
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        aVal = aVal.toUpperCase();
        bVal = bVal.toUpperCase();
      }

      if (aVal < bVal) return isAsc ? -1 : 1;
      if (aVal > bVal) return isAsc ? 1 : -1;
      return 0;
    });
  }

  /**
   *
   * @param week1Items - array item dari API Week 1 (periode lama)
   * @param week2Items - array item dari API Week 2 (periode baru)
   * @returns array baris merged yang siap ditampilkan di tabel
   */

  private mergeWeeksData(week1Items: any[], week2Items: any[]): any[] {
    const makeKey = (item: any) => `${item.well || ''}||${item.well_string || ''}`;

    // Bangun Map untuk Week 1 
    const week1Map = new Map();
    week1Items.forEach(item => {
      week1Map.set(makeKey(item), item);
    });

    // Bangun Map untuk Week 2
    const week2Map = new Map();
    week2Items.forEach(item => {
      week2Map.set(makeKey(item), item);
    });

    console.log("=== mergeWeeksData DEBUG ===");
    console.log("Week 1 Map size:", week1Map.size);
    console.log("Week 2 Map size:", week2Map.size);

    // Kumpulkan semua key unik dari kedua Map
    const allKeys = new Set([...week1Map.keys(), ...week2Map.keys()]);

    const mergedData = Array.from(allKeys).map(key => {
      // Ambil data dari masing-masing Map; jika tidak ada, gunakan object kosong {}
      const week1 = week1Map.get(key) || {};
      const week2 = week2Map.get(key) || {};

      /**
       * Utamakan data Week 2 (periode baru), fallback ke Week 1 jika Week 2 kosong.
       * Ini memastikan kolom identitas tetap terisi meski salah satu minggu tidak punya data.
       */
      const ref = Object.keys(week2).length > 0 ? week2 : week1;

      return {
        well: ref.well,
        well_string: ref.well_string,
        location: ref.location,

        //data week 1
        fig_curr_gross_prev:  week1.fig_curr_gross  || 0,
        fig_curr_net_prev:    week1.fig_curr_net    || 0,
        wc_prev:              week1.wc              || 0,
        gas_prev:             week1.gas             || 0,
        ds_efficiency_prev:   week1.ds_efficiency   || 0,
        sm_prev:              week1.sm              || 0,

        //data week 2
        fig_curr_gross_today: week2.fig_curr_gross  || 0,
        fig_curr_net_today:   week2.fig_curr_net    || 0,
        wc_today:             week2.wc              || 0,
        gas_today:            week2.gas             || 0,
        ds_efficiency_today:  week2.ds_efficiency   || 0,
        sm_today:             week2.sm              || 0,

        //delta 
        delta_fig_curr_gross: (week2.fig_curr_gross  || 0) - (week1.fig_curr_gross  || 0),
        delta_fig_curr_net:   (week2.fig_curr_net    || 0) - (week1.fig_curr_net    || 0),
        delta_wc:             (week2.wc              || 0) - (week1.wc              || 0),
        delta_gas:            (week2.gas             || 0) - (week1.gas             || 0),
        delta_ds_efficiency:  (week2.ds_efficiency   || 0) - (week1.ds_efficiency   || 0),
        delta_sm:             (week2.sm              || 0) - (week1.sm              || 0),
      };
    });

    console.log("Final merged data count:", mergedData.length);
    return mergedData;
  }

  getColumnFilter() {
    var columnfilter: any = {};

    // Filter identitas
    if (this.date_xSelected.length)         columnfilter["date"]         = this.date_xSelected;
    if (this.well_xSelected.length)         columnfilter["well"]         = this.well_xSelected;
    if (this.well_string_xSelected.length)  columnfilter["well_string"]  = this.well_string_xSelected;  

    // Filter field numerik
    if (this.fig_curr_gross_xSelected.length) columnfilter["fig_curr_gross"]  = this.fig_curr_gross_xSelected;
    if (this.fig_curr_net_xSelected.length)   columnfilter["fig_curr_net"]    = this.fig_curr_net_xSelected;
    if (this.gas_xSelected.length)            columnfilter["gas"]             = this.gas_xSelected;
    if (this.sm_xSelected.length)             columnfilter["sm"]              = this.sm_xSelected;
    if (this.wor_xSelected.length)            columnfilter["wor"]             = this.wor_xSelected;
    if (this.ds_efficiency_xSelected.length)  columnfilter["ds_efficiency"]   = this.ds_efficiency_xSelected;

    // Filter dari parameter route (end_submitDate), dikirim jika ada
    if (this.end_submitDate) columnfilter['end_submitDate'] = this.end_submitDate;

    return columnfilter;
  }

  getDeltaClass(value: number): string {
    if (value > 0) return 'delta-up';
    if (value < 0) return 'delta-down';
    return 'delta-flat';
  }

  

  formatInterval(arr: any[]) {
    return arr.map((a: any) => a.join("-")).join(", ");
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

  loadData(): void {
    const week2Start = this.start_dateControl.value;
    const week2End = this.end_dateControl.value;
    const week1Start = this.weekly_start_dateControl.value;
    const week1End = this.weekly_end_dateControl.value;

    // Validasi: semua 4 tanggal harus tersedia
    if (!week2Start || !week2End || !week1Start || !week1End) {
      console.warn('All dates are required (Week 1 and Week 2)');
      return;
    }

    this.isLoadingResults = true;

    // Request data Week 1 (periode lama)
    const week1$ = this.http.get<any>('/api/pe/daily/delta', {
      params: {
        startDate: new Date(week1Start).toISOString(),
        endDate: new Date(week1End).toISOString(),
        mode: 'weekly_average',
        page: '0',
        pagesize: '200',
        sort: 'well',
        order: 'asc'
      }
    });

    // Request data Week 2 (periode baru)
    const week2$ = this.http.get<any>('/api/pe/daily/delta', {
      params: {
        startDate: new Date(week2Start).toISOString(),
        endDate: new Date(week2End).toISOString(),
        mode: 'weekly_average',
        page: '0',
        pagesize: '200',
        sort: 'well',
        order: 'asc'
      }
    });

    forkJoin([week1$, week2$]).subscribe({
      next: ([week1Res, week2Res]) => {
        // Gabungkan data kedua minggu, hitung delta, lalu sort
        const mergedData = this.mergeWeeksData(week1Res.items || [], week2Res.items || []);
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

  getRepoIssues(
    sort: string, order: string, page: number, pagesize: number = 50,
    filter: string, columnfilter: object, mode: string = "",
    httpOption: object = {}, startDate: Date, endDate: Date
  ): Observable<any> {
    var params: any = {};
    if (sort != null)     params["sort"]     = sort;
    if (order != null)    params["order"]    = order;
    if (page != null)     params["page"]     = page.toString();
    if (pagesize != null) params["pagesize"] = pagesize.toString();
    if (filter != null)   params["filter"]   = filter;
    // Hanya sertakan columnfilter jika ada isinya
    if (Object.keys(columnfilter).length > 0) params["columnfilter"] = JSON.stringify(columnfilter);
    if (mode != null)     params["mode"]     = mode;

    // Tanggal dikirim dalam format ISO 8601 (UTC) agar backend bisa parse dengan benar
    params["startDate"] = startDate.toISOString();
    params["endDate"]   = endDate.toISOString();

    (httpOption as any)["params"] = params;

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