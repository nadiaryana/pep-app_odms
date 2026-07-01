import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from "@angular/core";
import { TitleService } from "src/app/navigation/title/title.service";
import { HttpClient } from "@angular/common/http";
import * as Highcharts from "highcharts";
import { FormControl } from "@angular/forms";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";

// Bentuk dokumen di collection "arus" (lihat ArusReading.cs / api/arus).
// API memakai Newtonsoft DefaultContractResolver => nama properti PascalCase.
interface ArusReading {
  Id: string;
  WellId: string;
  Current: number;
  Status: number;        // 1 = ON, 0 = OFF
  RecordedAt: string;
  CreatedAt: string;
}

// Item sumur untuk daftar di kiri (mirip Well di iSRP)
interface IotWell {
  name: string;          // = well_id
  status: "ON" | "OFF" | "UNKNOWN";
  current: number;
  lastUpdate: string;
}

// Baris tabel yang sudah dinormalisasi agar id kolom == nama properti
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
  // Chart dirender langsung via Highcharts.chart() ke elemen div (pola yang dipakai
  // komponen chart PE lainnya), bukan lewat selector highcharts-chart/angular-highcharts.
  @ViewChild("chartContainer", { static: false }) chartContainer: ElementRef;
  private chartRef: Highcharts.Chart | null = null;
  hasChartData: boolean = false;

  // Tabel
  displayedColumns: string[] = ["date", "wellName", "current", "status"];
  dataSource = new MatTableDataSource<ArusRow>([]);
  resultsLength = 0;
  isLoadingResults = false;

  // Filter tanggal
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

  // Kata kunci pencarian sumur
  wellSearch: string = "";

  // Daftar sumur setelah difilter oleh kotak pencarian
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
    this.loadWells();
  }

  ngOnDestroy(): void {
    if (this.chartRef) {
      this.chartRef.destroy();
      this.chartRef = null;
    }
  }

  // Ambil daftar well_id dari collection arus, lalu lengkapi status terakhirnya
  loadWells(): void {
    this.http.get<string[]>("/api/arus/wells").subscribe(
      (ids) => {
        this.wells = (ids || []).map((id) => ({
          name: id,
          status: "UNKNOWN" as const,
          current: 0,
          lastUpdate: "",
        }));
        this.wells.forEach((w) => this.refreshLastStatus(w));
      },
      (err) => console.error("Gagal memuat daftar sumur arus", err)
    );
  }

  // GET /api/arus/laststatus/{wellId}
  refreshLastStatus(well: IotWell): void {
    this.http
      .get<any>(`/api/arus/laststatus/${encodeURIComponent(well.name)}`)
      .subscribe(
        (res) => {
          well.status = res && res.last_status === 1 ? "ON" : "OFF";
          well.current = (res && res.current) || 0;
          well.lastUpdate = (res && res.recorded_at) || "";
        },
        (err) => console.error(`Gagal memuat status ${well.name}`, err)
      );
  }

  selectWell(well: IotWell): void {
    this.selectedWell = well;

    // Reset filter & tabel saat ganti sumur
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

    // Default: tampilkan data terakhir tanpa filter tanggal
    this.loadData();
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

  // Dipanggil tombol "Tampilkan Data" (pakai filter tanggal)
  applyDateFilter(): void {
    if (!this.selectedWell || !this.isDateRangeValid()) return;
    this.loadData(true);
  }

  // Ambil data dari API arus. useRange = pakai endpoint /range
  private loadData(useRange: boolean = false): void {
    if (!this.selectedWell) return;

    const wellId = encodeURIComponent(this.selectedWell.name);
    let url: string;
    let params: any = {};

    if (useRange && this.isDateRangeValid()) {
      const from = new Date(this.dateStartControl.value).toISOString();
      const to = new Date(this.dateEndControl.value).toISOString();
      url = `/api/arus/data/${wellId}/range`;
      params = { from, to };
    } else {
      url = `/api/arus/data/${wellId}`;
      params = { limit: this.defaultLimit.toString() };
    }

    this.isLoadingResults = true;
    this.http.get<ArusReading[]>(url, { params }).subscribe(
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

    // Pasang paginator & sort setelah tabel ter-render (karena pakai *ngIf)
    setTimeout(() => {
      if (this.paginator) this.dataSource.paginator = this.paginator;
      if (this.sort) this.dataSource.sort = this.sort;
    }, 0);
  }

  private buildChart(readings: ArusReading[]): void {
    if (!this.selectedWell) return;

    // Urut menaik berdasarkan waktu agar chart kiri->kanan = lama->baru
    const chartData: [number, number][] = readings
      .slice()
      .sort((a, b) => Date.parse(a.CreatedAt) - Date.parse(b.CreatedAt))
      .map((r) => [Date.parse(r.CreatedAt), r.Current]);

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

    // Render setelah div #chartContainer tersedia di DOM (di dalam *ngIf)
    setTimeout(() => {
      if (this.chartContainer && this.chartContainer.nativeElement) {
        if (this.chartRef) this.chartRef.destroy();
        this.chartRef = Highcharts.chart(this.chartContainer.nativeElement, options);
      }
    }, 0);
  }
}
