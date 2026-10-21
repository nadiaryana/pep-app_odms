import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from "@angular/core";
import { TitleService } from "src/app/navigation/title/title.service";
import { HttpClient } from "@angular/common/http";
import * as Highcharts from "highcharts";
import { FormControl } from "@angular/forms";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import { Observable, Subject, Subscription, EMPTY, of } from "rxjs";
import { catchError, map, switchMap, takeUntil, tap } from "rxjs/operators";
import { poll } from "src/app/polling";

const STATUS_POLL_MS = 15000;
const CHART_POLL_MS = 15000;


interface ArusReading {
  Id: string;
  WellId: string;
  Current: number;
  Status: number;        // 1 = ON, 0 = OFF
  RecordedAt: string;
  CreatedAt: string;
}

interface IotWell {
  name: string;          // = well_id
  status: "ON" | "OFF" | "UNKNOWN";
  current: number;
  lastUpdate: string;
}

interface ArusRow {
  date: string;
  wellName: string;
  current: number;
  status: number;
  recorded_at: string;
}

@Component({
  selector: "app-pe-iot",
  templateUrl: "./pe-iot.component.html",
  styleUrls: ["./pe-iot.component.scss"],
})
export class PeIotComponent implements OnInit, OnDestroy {

  @ViewChild("chartContainer", { static: false }) chartContainer: ElementRef;
  private chartRef: Highcharts.Chart | null = null;
  hasChartData: boolean = false;


  displayedColumns: string[] = ["date", "wellName", "current", "status"];
  dataSource = new MatTableDataSource<ArusRow>([]);
  resultsLength = 0;
  isLoadingResults = false;

  dateStartControl = new FormControl(null);
  dateEndControl = new FormControl(null);
  dateRangeError: string = "";

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  todayDate: string = new Date().toLocaleDateString("id-ID");

  // Berapa banyak data terakhir yang diambil saat tidak memakai filter tanggal
  defaultLimit: number = 200;

  wells: IotWell[] = [];
  selectedWell: IotWell | null = null;

  wellSearch: string = "";

  // Polling state
  lastUpdated: Date | null = null;
  chartPaused: boolean = false;   // true saat chart menampilkan rentang tanggal
  private lastReadingId: string | null = null;
  // Sumur yang chart-nya dipolling; null = polling chart dijeda
  private chartWell$ = new Subject<IotWell | null>();
  private destroy$ = new Subject<void>();
  private rangeSub: Subscription;


  get filteredWells(): IotWell[] {
    const q = this.wellSearch.trim().toLowerCase();
    if (!q) return this.wells;
    return this.wells.filter((w) => w.name.toLowerCase().indexOf(q) !== -1);
  }

  constructor(private titleService: TitleService, private http: HttpClient) {}

  ngOnInit(): void {
    this.titleService.titleSource.next({
      title: "Monitoring IoT Arus",
      icon: "bolt",
      breadcrumbs: [],
    });
    // Daftar sumur + status dipolling selama halaman terbuka
    poll(() => this.refreshStatuses(), { intervalMs: STATUS_POLL_MS })
      .pipe(takeUntil(this.destroy$))
      .subscribe();

    // Chart sumur terpilih dipolling; switchMap membatalkan polling sumur sebelumnya,
    // null (filter tanggal dipakai) menjeda polling sampai sumur diklik ulang
    this.chartWell$.pipe(
      switchMap((well) => well
        ? poll(() => this.fetchLatestReadings(well), { intervalMs: CHART_POLL_MS }).pipe(
            map((readings, i) => ({ readings, first: i === 0 }))
          )
        : EMPTY
      ),
      takeUntil(this.destroy$)
    ).subscribe(({ readings, first }) => this.applyLiveReadings(readings, first));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.rangeSub) this.rangeSub.unsubscribe();

    if (this.chartRef) {
      this.chartRef.destroy();
      this.chartRef = null;
    }
  }

  // GET /api/arus/status: data terakhir semua sumur dalam satu request.
  // Objek well yang sudah ada diperbarui di tempat (selectedWell tetap menunjuk ke objek yang sama),
  // sumur baru ditambahkan ke daftar.
  refreshStatuses(): Observable<any[]> {
    return this.http.get<any[]>("/api/arus/status").pipe(
      tap((items) => (items || []).forEach((res) => {
        let well = this.wells.find((w) => w.name === res.well_id);
        if (!well) {
          well = { name: res.well_id, status: "UNKNOWN", current: 0, lastUpdate: "" };
          this.wells.push(well);
        }
        well.status = res.last_status === 1 ? "ON" : "OFF";
        well.current = res.current || 0;
        well.lastUpdate = res.recorded_at || "";
      }))
    );
  }

  selectWell(well: IotWell): void {
    this.selectedWell = well;

    this.dataSource.data = [];
    this.resultsLength = 0;
    this.dateStartControl.setValue(null);
    this.dateEndControl.setValue(null);
    this.dateRangeError = "";
    this.hasChartData = false;
    if (this.chartRef) {
      this.chartRef.destroy();
      this.chartRef = null;
    }

    // Batalkan request rentang tanggal yang masih berjalan, lalu mulai polling live
    if (this.rangeSub) this.rangeSub.unsubscribe();
    this.chartPaused = false;
    this.lastReadingId = null;
    this.lastUpdated = null;
    this.isLoadingResults = true;
    this.chartWell$.next(well);
  }

  // Validasi rentang tanggal (mirip iSRP)
  isDateRangeValid(): boolean {
    const start = this.dateStartControl.value;
    const end = this.dateEndControl.value;

    if (!start || !end) {
      this.dateRangeError = "Pilih tanggal mulai dan tanggal akhir";
      return false;
    }
    if (new Date(end) < new Date(start)) {
      this.dateRangeError = "Tanggal akhir tidak boleh kurang dari tanggal mulai";
      return false;
    }
    this.dateRangeError = "";
    return true;
  }


  // Filter tanggal: chart & tabel ikut rentang tanggal, polling chart dijeda
  // sampai sumur diklik ulang
  applyDateFilter(): void {
    if (!this.selectedWell || !this.isDateRangeValid()) return;
    this.chartWell$.next(null);
    this.chartPaused = true;
    this.loadRangeData();
  }

  // GET /api/arus/data/{wellId}?limit=  (data live terakhir)
  // Error dikembalikan sebagai null supaya tampilan pertama tetap bisa menutup spinner.
  private fetchLatestReadings(well: IotWell): Observable<ArusReading[] | null> {
    const wellId = encodeURIComponent(well.name);
    return this.http
      .get<ArusReading[]>(`/api/arus/data/${wellId}`, { params: { limit: this.defaultLimit.toString() } })
      .pipe(
        catchError((err) => {
          console.error("Gagal memuat data arus", err);
          return of(null);
        })
      );
  }

  // Hasil polling live: tabel hanya diisi pada fetch pertama (tidak dipolling),
  // chart diperbarui setiap ada data baru
  private applyLiveReadings(readings: ArusReading[] | null, first: boolean): void {
    if (first) {
      this.isLoadingResults = false;
    }
    if (!readings) {
      if (first) {
        this.dataSource.data = [];
        this.resultsLength = 0;
      }
      return;
    }

    this.lastUpdated = new Date();
    if (first) {
      this.populateTable(readings);
    }

    // Data API urut terbaru dulu; tidak ada data baru -> chart tidak perlu digambar ulang
    const latestId = readings.length ? readings[0].Id : null;
    if (!first && latestId === this.lastReadingId) {
      return;
    }
    this.lastReadingId = latestId;

    // Chart sudah ada -> cukup ganti datanya
    if (this.chartRef && readings.length) {
      this.chartRef.series[0].setData(this.toChartData(readings));
      return;
    }
    this.buildChart(readings);
  }

  // GET /api/arus/data/{wellId}/range?from=&to=
  private loadRangeData(): void {
    if (!this.selectedWell) return;

    const wellId = encodeURIComponent(this.selectedWell.name);
    const from = new Date(this.dateStartControl.value).toISOString();
    const to = new Date(this.dateEndControl.value).toISOString();

    if (this.rangeSub) this.rangeSub.unsubscribe();
    this.isLoadingResults = true;
    this.rangeSub = this.http.get<ArusReading[]>(`/api/arus/data/${wellId}/range`, { params: { from, to } }).subscribe(
      (readings) => {
        this.isLoadingResults = false;
        const list = readings || [];
        this.populateTable(list);
        this.buildChart(list);
      },
      (err) => {
        this.isLoadingResults = false;
        console.error("Gagal memuat data arus", err);
        this.dataSource.data = [];
        this.resultsLength = 0;
      }
    );
  }

  private populateTable(readings: ArusReading[]): void {
    const rows: ArusRow[] = readings.map((r) => ({
      date: r.CreatedAt,
      wellName: r.WellId,
      current: r.Current,
      status: r.Status,
      recorded_at: r.RecordedAt,
    }));

    this.dataSource.data = rows;
    this.resultsLength = rows.length;

    setTimeout(() => {
      if (this.paginator) this.dataSource.paginator = this.paginator;
      if (this.sort) this.dataSource.sort = this.sort;
    }, 0);
  }

  // Urut menaik berdasarkan waktu agar chart kiri->kanan = lama->baru
  private toChartData(readings: ArusReading[]): [number, number][] {
    return readings
      .slice()
      .sort((a, b) => Date.parse(a.CreatedAt) - Date.parse(b.CreatedAt))
      .map((r) => [Date.parse(r.CreatedAt), r.Current] as [number, number]);
  }

  private buildChart(readings: ArusReading[]): void {
    if (!this.selectedWell) return;

    const chartData = this.toChartData(readings);

    this.hasChartData = chartData.length > 0;
    if (!this.hasChartData) {
      if (this.chartRef) {
        this.chartRef.destroy();
        this.chartRef = null;
      }
      return;
    }

    const options: Highcharts.Options = {
      chart: { type: "line", backgroundColor: "#fff" },
      title: { text: this.selectedWell.name },
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

    setTimeout(() => {
      if (this.chartContainer && this.chartContainer.nativeElement) {
        if (this.chartRef) this.chartRef.destroy();
        this.chartRef = Highcharts.chart(this.chartContainer.nativeElement, options);
      }
    }, 0);
  }
}
