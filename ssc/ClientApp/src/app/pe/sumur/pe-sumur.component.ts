import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from "@angular/core";
import { TitleService } from "src/app/navigation/title/title.service";
import { HttpClient } from "@angular/common/http";
import * as Highcharts from "highcharts";
import { FormControl } from "@angular/forms";
import { MatDatepicker, MatPaginator, MatSort } from "@angular/material";
import { merge, of as observableOf, Subscription, Subject, Observable } from 'rxjs';
import { catchError, map, startWith, switchMap, debounceTime, takeUntil, tap } from 'rxjs/operators';
import { poll } from "src/app/polling";

// Alat mengirim arus ke ThingSpeak tiap 15 detik
const CHART_POLL_MS = 15000;
const STATUS_POLL_MS = 15000;

interface Well {
  id: number;
  name: string;
  status: "ON" | "OFF" | "UNKNOWN";
  channelId: string;
  apiKey: string;
}

@Component({
  selector: "app-sumur",
  templateUrl: "./pe-sumur.component.html",
  styleUrls: ["./pe-sumur.component.scss"],
})
export class SumurComponent implements OnInit, OnDestroy {
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options | null = null;

  // Polling state
  lastUpdated: Date | null = null;
  private chart: Highcharts.Chart | null = null;
  private lastEntryId: any = null;
  private wellSelected$ = new Subject<Well>();
  private destroy$ = new Subject<void>();

  // Table properties
  displayedColumns: string[] = ["date", "wellName", "entry_id", "field_1", "field_2"];
  data: any[] = [];
  resultsLength = 0;
  isLoadingResults = false;

  // Date filter properties
  dateStartControl = new FormControl(null);
  dateEndControl = new FormControl(null);
  dateRangeError: string = '';

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  private paginatorSubscription: Subscription;
  private sortSubscription: Subscription;

  constructor(private titleService: TitleService, private http: HttpClient) {}
  todayDate: string = new Date().toLocaleDateString("id-ID");

  wells: Well[] = [
    { id: 1, name: "ST-182", status: "UNKNOWN", channelId: "2817240", apiKey: "5QNHFDXBQHSSEMEM" },
    { id: 2, name: "ST-092", status: "UNKNOWN", channelId: "2817838", apiKey: "Y6S3WJA4ZEIG67OA" },
    { id: 3, name: "ST-159", status: "UNKNOWN", channelId: "2826853", apiKey: "VGBBTAVANY97BLWQ" },
    { id: 4, name: "ST-161", status: "UNKNOWN", channelId: "2987295", apiKey: "TRI6GE6UIE89CFQ5" },
    { id: 5, name: "ST-080", status: "UNKNOWN", channelId: "3204961", apiKey: "2AYZPIK6HI2MG8YJ" },
    { id: 6, name: "ST-210", status: "UNKNOWN", channelId: "3204974", apiKey: "8RD7XSL5RYH316QZ" },
    { id: 7, name: "ST-160", status: "UNKNOWN", channelId: "3204973", apiKey: "MQOJ581E85X3R0O2" },
    { id: 8, name: "ST-185", status: "UNKNOWN", channelId: "3204962", apiKey: "ETAFMZF67RMBTPVO" },
    { id: 9, name: "ST-149", status: "UNKNOWN", channelId: "3276849", apiKey: "R418ELYI42WAAARK" },
    { id: 10, name: "ST-206", status: "UNKNOWN", channelId: "3276850", apiKey: "SMCYKUB8AVI6G74Z" },
    { id: 11, name: "ST-082", status: "UNKNOWN", channelId: "3280056", apiKey: "MPR2UKWB9X9YC5B5" },
    { id: 12, name: "ST-016", status: "UNKNOWN", channelId: "3276852", apiKey: "LPXT26CWZJB35D9V" },
    { id: 13, name: "ST-045", status: "UNKNOWN", channelId: "3403165", apiKey: "YMG41QBW0LB7XRIP" },
    { id: 14, name: "ST-168", status: "UNKNOWN", channelId: "3403211", apiKey: "R9V22SKE0TH0X6YN" },
    { id: 15, name: "ST-047", status: "UNKNOWN", channelId: "3405261", apiKey: "DBRAUGY3VQ1J8XAA" },
    { id: 16, name: "ST-179", status: "UNKNOWN", channelId: "3405270", apiKey: "ZSIWN55ZUBFJUKCG" },

  ];

  selectedWell: Well | null = null;

  wellSearch: string = "";
  
  get filteredWells(): Well[] {
    const q = this.wellSearch.trim().toLowerCase();
    if (!q) return this.wells;
    return this.wells.filter((w) => w.name.toLowerCase().indexOf(q) !== -1);
  }

  ngOnInit(): void {
    this.titleService.titleSource.next({
      title: "ISRP",
      icon: "waves",
      breadcrumbs: []
    });
    // Status semua sumur dipolling selama halaman terbuka
    poll(() => this.refreshAllWellStatuses(), { intervalMs: STATUS_POLL_MS })
      .pipe(takeUntil(this.destroy$))
      .subscribe();

    // Chart sumur terpilih dipolling; switchMap membatalkan polling sumur sebelumnya
    this.wellSelected$.pipe(
      switchMap((well) => poll(() => this.fetchWellFeeds(well), { intervalMs: CHART_POLL_MS }).pipe(
        map((res) => ({ well, res }))
      )),
      takeUntil(this.destroy$)
    ).subscribe(({ well, res }) => this.applyWellFeeds(well, res));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    // Unsubscribe to prevent memory leaks
    if (this.paginatorSubscription) {
      this.paginatorSubscription.unsubscribe();
    }
    if (this.sortSubscription) {
      this.sortSubscription.unsubscribe();
    }
  }

  setupPaginationAndSort(): void {
    // Setup pagination and sort subscriptions after table is rendered
    // This is called from loadTableData() after data is loaded
    
    // Only setup once - check if already subscribed
    if (this.paginatorSubscription && this.sortSubscription) {
      return; // Already setup
    }

    // Wait for next tick to ensure paginator and sort are available
    setTimeout(() => {
      if (this.paginator && !this.paginatorSubscription) {
        this.paginatorSubscription = this.paginator.page.subscribe(() => {
          this.loadTableData();
        });
      }

      if (this.sort && !this.sortSubscription) {
        this.sortSubscription = this.sort.sortChange.subscribe(() => {
          if (this.paginator) {
            this.paginator.pageIndex = 0;
          }
          this.loadTableData();
        });
      }
    }, 0);
  }

  isDateRangeValid(): boolean {
    const startDate = this.dateStartControl.value;
    const endDate = this.dateEndControl.value;

    // Both dates must be filled
    if (!startDate || !endDate) {
      this.dateRangeError = 'Pilih tanggal mulai dan tanggal akhir';
      return false;
    }

    // End date must not be before start date
    if (new Date(endDate) < new Date(startDate)) {
      this.dateRangeError = 'Tanggal akhir tidak boleh kurang dari tanggal mulai';
      return false;
    }

    this.dateRangeError = '';
    return true;
  }

  private getTableData() {
    if (!this.selectedWell || !this.isDateRangeValid()) {
      return observableOf({ items: [], total_count: 0 });
    }

    this.isLoadingResults = true;

    const columnfilter = JSON.stringify({
      wellName: [this.selectedWell.name],
      date: [
        {
          log: 'and',
          opr: 'gte',
          val: this.dateStartControl.value.toISOString()
        },
        {
          log: 'and',
          opr: 'lte',
          val: this.dateEndControl.value.toISOString()
        }
      ]
    });

    const params = {
      sort: this.sort ? this.sort.active || 'date' : 'date',
      order: this.sort ? this.sort.direction || 'desc' : 'desc',
      page: this.paginator ? this.paginator.pageIndex.toString() : '0',
      pagesize: this.paginator ? this.paginator.pageSize.toString() : '10',
      filter: '',
      columnfilter: columnfilter
    };

    return this.http.get<any>('/api/pe/sumur', { params });
  }

  loadTableData(): void {
    if (!this.selectedWell || !this.isDateRangeValid()) {
      // Clear data if validation fails
      this.data = [];
      this.resultsLength = 0;
      return;
    }

    this.getTableData().subscribe(
      (response) => {
        this.isLoadingResults = false;
        this.data = response.items || [];
        this.resultsLength = response.total_count || 0;
        
        // Setup pagination and sort after data is loaded and table is rendered
        this.setupPaginationAndSort();
      },
      (error) => {
        this.isLoadingResults = false;
        console.error('Failed to load table data', error);
        this.data = [];
        this.resultsLength = 0;
      }
    );
  }

  // Status ON/OFF semua sumur dihitung backend dari field1 terakhir ThingSpeak,
  // satu request untuk semua sumur. Status null (gagal ambil) -> status lama dipertahankan.
  refreshAllWellStatuses(): Observable<any> {
    const body = this.wells.map((w: Well) => ({ wellName: w.name, channelId: w.channelId, apiKey: w.apiKey }));
    return this.http.post<any[]>('/api/pe/sumur/status', body).pipe(
      tap((items: any[]) => (items || []).forEach((item: any) => {
        const well = this.wells.find((w: Well) => w.name === item.wellName);
        if (well && item.status) {
          well.status = item.status;
        }
      }))
    );
  }

  selectWell(well: Well): void {
    this.selectedWell = well;

    // Clear table data and reset date filters
    this.data = [];
    this.resultsLength = 0;
    this.dateStartControl.setValue(null);
    this.dateEndControl.setValue(null);
    this.dateRangeError = '';
    
    // Reset pagination to first page when selecting a new well
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }

    // Reset chart supaya chart sumur sebelumnya tidak tampil, lalu mulai polling sumur ini
    this.chartOptions = null;
    this.chart = null;
    this.lastEntryId = null;
    this.lastUpdated = null;
    this.wellSelected$.next(well);
  }

  onChartInstance(chart: Highcharts.Chart): void {
    this.chart = chart;
  }

  // Call backend instead of full ThingSpeak API
  private fetchWellFeeds(well: Well): Observable<any> {
    const httpOptions = {
      params: {
        channelId: well.channelId,
        apiKey: well.apiKey,
        wellName: well.name,
      },
    };
    return this.http.get<any>(`/api/pe/sumur/fetch`, httpOptions);
  }

  private applyWellFeeds(well: Well, res: any): void {
    const feeds = (res && res.feeds) || [];
    this.lastUpdated = new Date();

    const chartData: [number, number][] = feeds.map((f: any) => {
      const ts = Date.parse(f.created_at);
      const val = parseFloat(f.field1) || 0;
      return [ts, val];
    });

    // Status ON/OFF diurus refreshAllWellStatuses() (dihitung backend), bukan dari data chart

    // Tidak ada data baru sejak polling sebelumnya -> chart tidak perlu digambar ulang
    const latestEntryId = feeds.length ? feeds[feeds.length - 1].entry_id : null;
    if (this.chartOptions && latestEntryId === this.lastEntryId) {
      return;
    }
    this.lastEntryId = latestEntryId;

    // Chart sudah ada -> cukup ganti datanya
    if (this.chart) {
      this.chart.series[0].setData(chartData);
      return;
    }

    this.chartOptions = {
      chart: { type: "line", backgroundColor: "#fff" },
      title: { text: well.name },
      time: { useUTC: false },
      xAxis: { type: "datetime" },
      yAxis: { title: { text: "Arus (A)" } },
      tooltip: { valueSuffix: " A" },
      legend: { enabled: false },
      series: [
        {
          type: "line",
          name: "Arus",
          data: chartData,
        },
      ],
    };
  }

  @ViewChild('start_datePicker', { static: true }) start_datePicker: MatDatepicker<any>;
    start_dateControl = new FormControl(new Date(new Date().setDate(new Date().getDate() - 4)));
    start_dateInput = this.start_dateControl.value.toLocaleDateString("en-US", { month: "short", year: "numeric", day: "numeric" });
  
  @ViewChild('end_datePicker', { static: true }) end_datePicker: MatDatepicker<any>;
  end_dateControl = new FormControl(new Date(new Date().setDate(new Date().getDate() - 1)));
  end_dateInput = this.end_dateControl.value.toLocaleDateString("en-US", { month: "short", year: "numeric", day: "numeric" });

  dailyCurrent(){

  }
}
