import { HttpClient, HttpParams, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild, Inject, OnDestroy, ElementRef, AfterViewInit } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA, MatDatepicker } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';
import { merge, Observable, of as observableOf, Subscription, forkJoin, Subject } from 'rxjs';
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


  activeTab = 'weekly';
  indicatorLeft = 0;
  indicatorWidth = 0;

  private activeTabChange = new Subject<string>();

  viewMode: string = 'well';

  //kolom dinamis
  displayedColumns: string[] = [];
  headerColumns1: string[] = [];
  headerColumns2: string[] = [];

  // DATE PICKERS — Monthly
  @ViewChild('month1Picker', { static: true }) month1Picker: MatDatepicker<any> = null!;
  month1Control = new FormControl(new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1));
  month1Input: string = '';

  @ViewChild('month2Picker', { static: true }) month2Picker: MatDatepicker<any> = null!;
  month2Control = new FormControl(new Date());
  month2Input: string = '';

  // DATE PICKERS — Weekly 
  @ViewChild('weekly_start_datePicker', { static: true }) weekly_start_datePicker: MatDatepicker<any> = null!;
  weekly_start_dateControl = new FormControl(new Date(new Date(new Date().setDate(new Date().getDate() - 7)).setHours(0, 0, 0, 0))); //7 hari lalu
  weekly_start_dateInput = '';

  @ViewChild('weekly_end_datePicker', { static: true }) weekly_end_datePicker: MatDatepicker<any> = null!;
  weekly_end_dateControl = new FormControl(new Date(new Date(new Date().setDate(new Date().getDate() - 7)).setHours(0, 0, 0, 0)));
  weekly_end_dateInput = '';

  @ViewChild('start_datePicker', { static: true }) start_datePicker: MatDatepicker<any> = null!;
  start_dateControl = new FormControl(new Date(new Date(new Date().setDate(new Date().getDate() - 1)).setHours(0, 0, 0, 0))); //1 hari lalu
  start_dateInput = '';

  @ViewChild('end_datePicker', { static: true }) end_datePicker: MatDatepicker<any> = null!;
  end_dateControl = new FormControl(new Date(new Date(new Date().setDate(new Date().getDate() - 1)).setHours(0, 0, 0, 0)));
  end_dateInput = '';

  // DATE PICKERS — Daily
  @ViewChild('daily1StartPicker', { static: true }) daily1StartPicker: MatDatepicker<any> = null!;
  daily1StartControl = new FormControl(new Date(new Date().setDate(new Date().getDate() - 2)));
  daily1StartInput: string = '';

  @ViewChild('daily1EndPicker', { static: true }) daily1EndPicker: MatDatepicker<any> = null!;
  daily1EndControl = new FormControl(new Date(new Date().setDate(new Date().getDate() - 2)));
  daily1EndInput: string = '';

  @ViewChild('daily2StartPicker', { static: true }) daily2StartPicker: MatDatepicker<any> = null!;
  daily2StartControl = new FormControl(new Date(new Date().setDate(new Date().getDate() - 1)));
  daily2StartInput: string = '';

  @ViewChild('daily2EndPicker', { static: true }) daily2EndPicker: MatDatepicker<any> = null!;
  daily2EndControl = new FormControl(new Date(new Date().setDate(new Date().getDate() - 1)));
  daily2EndInput: string = '';

  // DATE PICKERS — Annual
  year1Control = new FormControl(new Date().getFullYear() - 1);
  year2Control = new FormControl(new Date().getFullYear());

  @ViewChild('annualTab', { read: ElementRef, static: false })
  annualTab: ElementRef;

  @ViewChild('monthlyTab', { read: ElementRef, static: false })
  monthlyTab: ElementRef;

  @ViewChild('weeklyTab', { read: ElementRef, static: false })
  weeklyTab: ElementRef;

  @ViewChild('dailyTab', { read: ElementRef, static: false })
  dailyTab: ElementRef;


  exampleDatabase: ExampleHttpDao | null = null;
  data: any[] = [];
  dataSource = new MatTableDataSource<any>(this.data);
  selection = new SelectionModel<any>(true, []);
  isEditing: boolean = false;

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  submitting = false;

  start_submitDate: Number = 0;
  end_submitDate: Number = 0;
  group: string = '';
  status: string = '';

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = null!;
  @ViewChild(MatSort, { static: true }) sort: MatSort = null!;

  filterControl = new FormControl('');

  start_dateFilter = new FormControl('');
  end_dateFilter = new FormControl('');
  wellFilter = new FormControl('');
  well_stringFilter = new FormControl('');
  fig_curr_grossFilter = new FormControl('');
  fig_curr_netFilter = new FormControl('');
  wcFilter = new FormControl('');
  gasFilter = new FormControl('');
  ds_efficiencyFilter = new FormControl('');
  smFilter = new FormControl('');
  
  date_xSelected: any[] = [];
  well_xSelected: any[] = [];
  well_string_xSelected: any[] = [];   
  fig_curr_gross_xSelected: any[] = [];
  fig_curr_net_xSelected: any[] = [];
  wc_xSelected: any[] = [];
  gas_xSelected: any[] = [];
  ds_efficiency_xSelected: any[] = [];
  sm_xSelected: any[] = [];

  
  // filterSubscription: Subscription = null!;
  private filterSubscription: any = null;
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
    this.titleService.titleSource.next({
      title: "Aggregate",
      icon: "change_history",
      breadcrumbs: [
        { label: 'Petroleum Engineering', routerLink: '' },
        { label: 'Aggregate', routerLink: '' }
      ]
    });

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
    this.updateDisplayedColumns();
    this.updateDateInputs();

    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);


    this.xfilterService.filter.subscribe(res => {
      // Cancel previous request jika masih ada
      if (this.filterSubscription) {
        this.filterSubscription.unsubscribe();
        this.filterSubscription = null;
      }
      this.filterSubscription = this.getColumnValues(res);
    });
    this.selectedSubscription = this.xfilterService.selected.subscribe(res => {
      (this as any)[res["column"] + "_xSelected"] = res["selected"];
    });

    this.listSubscription = merge(
      this.sort.sortChange,
      this.paginator.page,
      this.filterControl.valueChanges.pipe(debounceTime(300)),
      this.activeTabChange,
      // Weekly
      this.start_dateControl.valueChanges.pipe(debounceTime(300)),
      this.end_dateControl.valueChanges.pipe(debounceTime(300)),
      this.weekly_start_dateControl.valueChanges.pipe(debounceTime(300)),
      this.weekly_end_dateControl.valueChanges.pipe(debounceTime(300)),
      // Monthly
      this.month1Control.valueChanges.pipe(debounceTime(300)),
      this.month2Control.valueChanges.pipe(debounceTime(300)),
      // Daily
      this.daily1StartControl.valueChanges.pipe(debounceTime(300)),
      this.daily1EndControl.valueChanges.pipe(debounceTime(300)),
      this.daily2StartControl.valueChanges.pipe(debounceTime(300)),
      this.daily2EndControl.valueChanges.pipe(debounceTime(300)),
      // Annual
      this.year1Control.valueChanges.pipe(debounceTime(300)),
      this.year2Control.valueChanges.pipe(debounceTime(300)),
      // Filters
      this.wellFilter.valueChanges.pipe(debounceTime(300)),
      this.well_stringFilter.valueChanges.pipe(debounceTime(300)),
      this.xfilterService.selected,
    ).pipe(
      startWith({}),
      switchMap(() => {
        this.isLoadingResults = true;

        // Tentukan tanggal berdasarkan tab aktif
        const dates = this.getPeriodDates();
        if (!dates) {
          return observableOf({ items: [], total_count: 0 });
        }

        const { period1Start, period1End, period2Start, period2End, mode } = dates;

        // ── Request Period 1 ──
        const period1Obs = this.exampleDatabase!.getRepoIssues(
          this.sort.active, this.sort.direction,
          0, 9999,
          this.filterControl.value, this.getColumnFilter(),
          mode + '_period1', {},
          period1Start, period1End
        );

        // ── Request Period 2 ──
        const period2Obs = this.exampleDatabase!.getRepoIssues(
          this.sort.active, this.sort.direction,
          0, 9999,
          this.filterControl.value, this.getColumnFilter(),
          mode + '_period2', {},
          period2Start, period2End
        );

        return forkJoin([period1Obs, period2Obs]).pipe(
          map(([p1Data, p2Data]) => {
            const mergedData = this.mergeWeeksData(p1Data.items || [], p2Data.items || []);
            return { items: mergedData, total_count: mergedData.length };
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
      let filtered = this.sortMergedData(data);
      console.log("Aggregate Data:", this.data);

      //well filter
      if (this.well_xSelected.length > 0) {
        filtered = filtered.filter(row => this.well_xSelected.includes(row.well));
      }
      if (this.well_string_xSelected.length > 0) {
        filtered = filtered.filter(row => this.well_string_xSelected.includes(row.well_string));
      }

      this.data = filtered;
      this.dataSource = new MatTableDataSource<any>(this.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.selection.clear();
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    this.updateDisplayedColumns();      // kolom beda per tab, refresh juga
    this.paginator.pageIndex = 0;       // reset halaman
    this.updateDateInputs();            // pastikan label tanggal tersinkron
    this.activeTabChange.next(tab);
  }

  //animasi UI
  getIndicatorTransform(): string {

    switch (this.activeTab) {
        case 'annual':
            return 'translateX(0%)';

        case 'monthly':
            return 'translateX(100%)';

        case 'weekly':
            return 'translateX(200%)';

        case 'daily':
            return 'translateX(300%)';

        default:
            return 'translateX(0%)';
    }
}

  setViewMode(mode: string) {
    this.viewMode = mode;
    this.updateDisplayedColumns();
    this.paginator.pageIndex = 0;
    this.loadData();
  }

  get gainLossField(): string {
    return (this.activeTab === 'weekly' || this.activeTab === 'daily') ? 'gain_loss_gross' : 'gain_loss_net';
  }

  get gainLossLabel(): string {
    return (this.activeTab === 'weekly' || this.activeTab === 'daily') ? 'Gross' : 'Net';
  }


  // DYNAMIC COLUMNS
  updateDisplayedColumns() {
    const firstCol = this.viewMode === 'well' ? 'well' : 'station';

    const isGrossFirst = this.activeTab === 'weekly' || this.activeTab === 'daily';
    const p1 = isGrossFirst
      ? ['period1_gross', 'period1_net', 'period1_wc', 'period1_gas', 'period1_ds_efficiency', 'period1_sm']
      : ['period1_net', 'period1_wc', 'period1_gross', 'period1_gas', 'period1_ds_efficiency', 'period1_sm'];
    const p2 = isGrossFirst
      ? ['period2_gross', 'period2_net', 'period2_wc', 'period2_gas', 'period2_ds_efficiency', 'period2_sm']
      : ['period2_net', 'period2_wc', 'period2_gross', 'period2_gas', 'period2_ds_efficiency', 'period2_sm'];

    const gainLoss = isGrossFirst
    ? ['gain_loss_gross', 'gain_loss_net', 'gain_loss_wc', 'gain_loss_gas', 'gain_loss_ds_efficiency', 'gain_loss_sm']
    : ['gain_loss_net', 'gain_loss_wc', 'gain_loss_gross', 'gain_loss_gas', 'gain_loss_ds_efficiency', 'gain_loss_sm'];

    this.displayedColumns = [firstCol, 'well_string', ...p1, ...p2, ...gainLoss];
    this.headerColumns1 = [firstCol, 'well_string', 'period1_group', 'period2_group', 'gain_loss_group'];
    this.headerColumns2 = [...p1, ...p2, ...gainLoss];
  }


  formatDate(date: Date): string {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      month: 'short', year: 'numeric', day: 'numeric'
    });
  }

  formatMonth(date: Date): string {
    if (!date) return '';
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }

  getISOWeekNumber(date: Date): number {
    if (!date) return 0;
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7); //hari kamis sebagai minggu pertama
    const week1 = new Date(d.getFullYear(), 0, 4); //4 januari selalu ada di week 1 (standar ISO)
    return 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
  }

  getPeriod1Label(): string {
    switch (this.activeTab) {
      case 'annual': return `Year ${this.year1Control.value || ''}`;
      case 'monthly': return this.month1Input || 'Period 1';
      case 'weekly': return `Week ${this.getISOWeekNumber(this.weekly_start_dateControl.value)}`;
      case 'daily': return `${this.formatDate(this.daily1StartControl.value)} - ${this.formatDate(this.daily1EndControl.value)}`;
      default: return 'Period 1';
    }
  }

  getPeriod2Label(): string {
    switch (this.activeTab) {
      case 'annual': return `Year ${this.year2Control.value || ''}`;
      case 'monthly': return this.month2Input || 'Period 2';
      case 'weekly': return `Week ${this.getISOWeekNumber(this.start_dateControl.value)}`;
      case 'daily': return `${this.formatDate(this.daily2StartControl.value)} - ${this.formatDate(this.daily2EndControl.value)}`;
      default: return 'Period 2';
    }
  }

  //penentuan rentang tanggal
  getPeriodDates(): { period1Start: Date, period1End: Date, period2Start: Date, period2End: Date, mode: string } | null {
    let period1Start: Date, period1End: Date, period2Start: Date, period2End: Date;
    let mode: string;

    switch (this.activeTab) {
      case 'monthly': {
        period1Start = new Date(this.month1Control.value);
        period1Start.setDate(1);
        period1End = new Date(period1Start);
        period1End.setMonth(period1End.getMonth() + 1);
        period1End.setDate(0);

        period2Start = new Date(this.month2Control.value);
        period2Start.setDate(1);
        period2End = new Date(period2Start);
        period2End.setMonth(period2End.getMonth() + 1);
        period2End.setDate(0);
        mode = 'monthly_average';
        break;
      }
      case 'weekly': {
        if (!this.weekly_start_dateControl.value || !this.weekly_end_dateControl.value ||
            !this.start_dateControl.value || !this.end_dateControl.value) return null;
        period1Start = this.weekly_start_dateControl.value;
        period1End = this.weekly_end_dateControl.value;
        period2Start = this.start_dateControl.value;
        period2End = this.end_dateControl.value;
        mode = 'weekly_average';
        break;
      }
      case 'daily': {
        if (!this.daily1StartControl.value || !this.daily1EndControl.value ||
            !this.daily2StartControl.value || !this.daily2EndControl.value) return null;
        period1Start = this.daily1StartControl.value;
        period1End = this.daily1EndControl.value;
        period2Start = this.daily2StartControl.value;
        period2End = this.daily2EndControl.value;
        mode = 'daily_average';
        break;
      }
      case 'annual': {
        period1Start = new Date(this.year1Control.value, 0, 1);  //1 januari
        period1End = new Date(this.year1Control.value, 11, 31); //31 desember
        period2Start = new Date(this.year2Control.value, 0, 1);
        period2End = new Date(this.year2Control.value, 11, 31);
        mode = 'annual_average';
        break;
      }
      default:
        return null;
    }

    return { period1Start, period1End, period2Start, period2End, mode };
  }

  updateDateInputs() {
    this.month1Input = this.formatMonth(this.month1Control.value);
    this.month2Input = this.formatMonth(this.month2Control.value);
    this.weekly_start_dateInput = this.formatDate(this.weekly_start_dateControl.value);
    this.weekly_end_dateInput = this.formatDate(this.weekly_end_dateControl.value);
    this.start_dateInput = this.formatDate(this.start_dateControl.value);
    this.end_dateInput = this.formatDate(this.end_dateControl.value);
    this.daily1StartInput = this.formatDate(this.daily1StartControl.value);
    this.daily1EndInput = this.formatDate(this.daily1EndControl.value);
    this.daily2StartInput = this.formatDate(this.daily2StartControl.value);
    this.daily2EndInput = this.formatDate(this.daily2EndControl.value);
  }

  //handler perubahan monthly
  chosenMonthHandler(normalizedMonth: Date, datepicker: MatDatepicker<any>, which: 1 | 2): void {
    const d = new Date(normalizedMonth);
    d.setDate(1);
    d.setHours(0, 0, 0, 0);

    if (which === 1) {
      this.month1Control.setValue(d);
      this.month1Input = this.formatMonth(d);
    } else {
      this.month2Control.setValue(d);
      this.month2Input = this.formatMonth(d);
    }

    datepicker.close();
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

  daily1StartChange(event: any) {
    if (!event.value) return;
    const d = new Date(event.value); d.setHours(0, 0, 0, 0);
    this.daily1StartControl.setValue(d);
    this.daily1StartInput = this.formatDate(d);
  }

  daily1EndChange(event: any) {
    if (!event.value) return;
    const d = new Date(event.value); d.setHours(0, 0, 0, 0);
    this.daily1EndControl.setValue(d);
    this.daily1EndInput = this.formatDate(d);
  }

  daily2StartChange(event: any) {
    if (!event.value) return;
    const d = new Date(event.value); d.setHours(0, 0, 0, 0);
    this.daily2StartControl.setValue(d);
    this.daily2StartInput = this.formatDate(d);
  }

  daily2EndChange(event: any) {
    if (!event.value) return;
    const d = new Date(event.value); d.setHours(0, 0, 0, 0);
    this.daily2EndControl.setValue(d);
    this.daily2EndInput = this.formatDate(d);
  }

  year1Change() {
    this.loadData();
  }

  year2Change() {
    this.loadData();
  }

  ngOnDestroy() {
    if (this.filterSubscription) this.filterSubscription.unsubscribe();
    if (this.selectedSubscription) this.selectedSubscription.unsubscribe();
    if (this.listSubscription) this.listSubscription.unsubscribe();
  }

  passPermission(path: String) {
    return this.pePermissionService.passPermission(path);
  }


  // Nama file export disesuaikan dengan tab aktif
  private getExportFilename(): string {
    const tabLabel = this.activeTab.charAt(0).toUpperCase() + this.activeTab.slice(1);
    return `${tabLabel}_Aggregate.xlsx`;
  }

  exportExcel() {
    const dates = this.getPeriodDates();

    if (!dates) {
      this.snackbarService.status.next(
        new SnackbarApi(true, 'Please complete all date fields before exporting.', 'dismiss')
      );
      return;
    }

    const { period1Start, period1End, period2Start, period2End, mode } = dates;

    const httpOption: Object = {
      observe: 'response',
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      responseType: 'arraybuffer',
    };

    this.isLoadingResults = true;
    const columnfilter = this.getColumnFilter();


    const params: any = {
      sort: this.sort.active,
      order: this.sort.direction,
      page: this.paginator.pageIndex.toString(),
      pagesize: this.paginator.pageSize.toString(),
      filter: this.filterControl.value || '',
      mode: 'excel',
      aggregateMode: mode,
      groupBy: this.viewMode === 'station' ? 'station' : 'well',
      period1Start: new Date(period1Start).toISOString(),
      period1End: new Date(period1End).toISOString(),
      period2Start: new Date(period2Start).toISOString(),
      period2End: new Date(period2End).toISOString(),
      startDate: new Date(period2Start).toISOString(),
      endDate: new Date(period2End).toISOString(),
    };

    if (Object.keys(columnfilter).length > 0) {
      params.columnfilter = JSON.stringify(columnfilter);
    }

    (httpOption as any)['params'] = params;

    const filename = this.getExportFilename();

    this.http.get('/api/pe/daily/delta', httpOption).pipe(
      map((res: any) => {
        this.isLoadingResults = false;
        return {
          filename,
          data: new Blob(
            [res['body']],
            { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
          ),
        };
      })
    ).subscribe(res => {
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

      //ref = info identitas dari week2 jika ada
      const ref = Object.keys(week2).length > 0 ? week2 : week1;

      const p1Gross = week1.fig_curr_gross || 0;
      const p1Net   = week1.fig_curr_net   || 0;
      const p1Wc    = week1.wc             || 0;
      const p2Gross = week2.fig_curr_gross || 0;
      const p2Net   = week2.fig_curr_net   || 0;
      const p2Wc    = week2.wc             || 0;

      return {
        // Field identitas 
        well: ref.well,
        well_string: ref.well_string,
        location: ref.location,

        // ── Field existing (untuk kompatibilitas) ──
        fig_curr_gross_prev:  p1Gross,
        fig_curr_net_prev:    p1Net,
        wc_prev:              p1Wc,
        gas_prev:             week1.gas             || 0,
        ds_efficiency_prev:   week1.ds_efficiency   || 0,
        sm_prev:              week1.sm              || 0,

        fig_curr_gross_today: p2Gross,
        fig_curr_net_today:   p2Net,
        wc_today:             p2Wc,
        gas_today:            week2.gas             || 0,
        ds_efficiency_today:  week2.ds_efficiency   || 0,
        sm_today:             week2.sm              || 0,

        delta_fig_curr_gross: p2Gross - p1Gross,
        delta_fig_curr_net:   p2Net   - p1Net,
        delta_wc:             p2Wc    - p1Wc,
        delta_gas:            (week2.gas || 0) - (week1.gas || 0),
        delta_ds_efficiency:  (week2.ds_efficiency || 0) - (week1.ds_efficiency || 0),
        delta_sm:             (week2.sm || 0) - (week1.sm || 0),
        

        // ── Field baru (UI) ──
        station: ref.station || ref.well || key,

        period1_gross: p1Gross,
        period1_net:   p1Net,
        period1_wc:    p1Wc,
        period1_gas:            week1.gas           || 0,   
        period1_ds_efficiency:  week1.ds_efficiency || 0,   
        period1_sm:             week1.sm            || 0,
        

        period2_gross: p2Gross,
        period2_net:   p2Net,
        period2_wc:    p2Wc,
        period2_gas:            week2.gas           || 0,   
        period2_ds_efficiency:  week2.ds_efficiency || 0,   
        period2_sm:             week2.sm            || 0,

        gain_loss_gross: p2Gross - p1Gross,
        gain_loss_net:   p2Net   - p1Net,
        gain_loss_wc:    p2Wc    - p1Wc,
        gain_loss_gas:            (week2.gas || 0) - (week1.gas || 0),           
        gain_loss_ds_efficiency:  (week2.ds_efficiency || 0) - (week1.ds_efficiency || 0), 
        gain_loss_sm:             (week2.sm || 0) - (week1.sm || 0),
      };
    });

    console.log("Final merged data count:", mergedData.length);
    return mergedData;
  }

  getColumnFilter() {
    var columnfilter: any = {};

    // Filter identitas
    if (this.date_xSelected.length)         columnfilter["date"]         = this.date_xSelected;
    // if (this.well_xSelected.length)         columnfilter["well"]         = this.well_xSelected;
    // if (this.well_string_xSelected.length)  columnfilter["well_string"]  = this.well_string_xSelected;  

    // Filter field numerik
    if (this.fig_curr_gross_xSelected.length) columnfilter["fig_curr_gross"]  = this.fig_curr_gross_xSelected;
    if (this.fig_curr_net_xSelected.length)   columnfilter["fig_curr_net"]    = this.fig_curr_net_xSelected;
    if (this.gas_xSelected.length)            columnfilter["gas"]             = this.gas_xSelected;
    if (this.wc_xSelected.length)             columnfilter["wc"]              = this.wc_xSelected;
    if (this.sm_xSelected.length)            columnfilter["sm"]             = this.sm_xSelected;
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
    const dates = this.getPeriodDates();
    if (!dates) {
      console.warn('Required dates are missing');
      return;
    }

    const { period1Start, period1End, period2Start, period2End, mode } = dates;
    this.isLoadingResults = true;

    // ── All tabs: comparison (period1 vs period2) ──
    const period1$ = this.http.get<any>('/api/pe/daily/delta', {
      params: {
        startDate: new Date(period1Start).toISOString(),
        endDate: new Date(period1End).toISOString(),
        mode: mode + '_period1',
        page: '0', pagesize: '200',
        sort: 'well', order: 'asc',
        groupBy: this.viewMode === 'station' ? 'station' : 'well'
      }
    });

    const period2$ = this.http.get<any>('/api/pe/daily/delta', {
      params: {
        startDate: new Date(period2Start).toISOString(),
        endDate: new Date(period2End).toISOString(),
        mode: mode + '_period2',
        page: '0', pagesize: '200',
        sort: 'well', order: 'asc',
        groupBy: this.viewMode === 'station' ? 'station' : 'well'
      }
    });

    forkJoin([period1$, period2$]).subscribe({
      next: ([p1Res, p2Res]) => {
        const mergedData = this.mergeWeeksData(p1Res.items || [], p2Res.items || []);
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
  template: '<h1 mat-dialog-title>Confirm Delete</h1><div mat-dialog-content>  <p>Confirm delete {{data}} selected item ?</p></div><div mat-dialog-actions>  <button mat-button (click)="onYesClick()" cdkFocusInitial>Yes</button> <button mat-button (click)="onNoClick()">No</button> </div>',
  // styleUrls: ['./pe-daily.scss']
})

export class PeDailyAggregateDeleteDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<PeDailyAggregateDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number) { }

  onNoClick(): void {
    this.dialogRef.close(0);
  }

  onYesClick(): void {
    this.dialogRef.close(1);
  }

}