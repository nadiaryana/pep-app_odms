import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TitleService } from '../../navigation/title/title.service';
import { Subscription } from 'rxjs';
import { xFilterService } from '../../xfilter/xfilter.component';
import * as Highcharts from 'highcharts';
import PatternFill from 'highcharts/modules/pattern-fill';
PatternFill(Highcharts);


@Component({
  selector: 'app-monitoring-rk-chart',
  templateUrl: './monitoring-rk-chart.component.html',
  styleUrls: ['./monitoring-rk.scss']
})
export class MonitoringRKChartComponent implements OnInit {

  @ViewChild('columnChart', { static: false }) columnChartEl: ElementRef;
  @ViewChild('selisihChart', { static: false }) selisihChartEl: ElementRef;
  

  isLoading: boolean = false;
  chartReady: boolean = false;

  chartData: any[] = [];
  chart: any;
  selisihChart: any;
  // filterMessage: string = 'Silakan pilih Chart Type, Well, Start Date, dan End Date';

  // Dropdown chart type
  chartTypes: { value: string; label: string }[] = [
    { value: 'rig', label: 'Rig' },
    { value: 'rigless',     label: 'Non-Rig' },
  ];
  selectedChartType: string = 'rig';

  // Filter Well (via xFilter)
  wellList: string[] = [];
  well_xSelected: any[] = [];
  private wellSelectedSub: Subscription;
  private wellFilterSub: Subscription;

  // Filter Date Range (pop field via xFilter)
  pop_xSelected: any[] = [];
  popList: string[] = [];
  private popSelectedSub: Subscription;
  private popFilterSub: Subscription;

  constructor(
    private titleService: TitleService,
    private http: HttpClient,
    private xfilterService: xFilterService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.titleService.titleSource.next({
      title: "Monitoring RK Chart",
      icon: "bar_chart",
      breadcrumbs: [
        { label: 'Petroleum Engineering', routerLink: '' },
        { label: 'Monitoring RK', routerLink: 'pe/monitoring-rk' },
        { label: 'Chart', routerLink: '' }
      ]
    });

    // Subscribe ke xFilter selected untuk pop
    this.popSelectedSub = this.xfilterService.selected.subscribe(res => {
      if (res && res["column"] === "pop") {
        this.pop_xSelected = res["selected"] || [];
        this.checkAndRefreshChart();
      }
    });

    // Subscribe ke xFilter filter — saat dialog pop dibuka, kirim items
    this.popFilterSub = this.xfilterService.filter.subscribe(res => {
      if (res && res["column"] === "pop") {
        if (res["clear"]) {
          if (this.popList.length > 0) {
            this.xfilterService.updateItems({ column: "pop", items: this.popList });
          } else {
            this.fetchPopDates();
          }
      return;
        }
        const filterText = (res["filter"] || '').toString().trim().toLowerCase();
        if (!filterText) {
          if (this.popList.length > 0) {
            setTimeout(() => {
              this.xfilterService.updateItems({ column: "pop", items: this.popList });
            }, 0);
          } else {
            this.fetchPopDates();
          }
        } else {
          const filtered = this.popList.filter(p =>
            p.toLowerCase().includes(filterText)
          );
          setTimeout(() => {
            this.xfilterService.updateItems({ column: "pop", items: filtered });
          }, 0);
        }
      }
    });

    // Subscribe ke xFilter selected untuk well
    this.wellSelectedSub = this.xfilterService.selected.subscribe(res => {
      if (res && res["column"] === "well") {
        this.well_xSelected = res["selected"] || [];

        this.pop_xSelected = [];
        this.popList = [];
        this.xfilterService.updateSelected({ column: "pop", selected: [] });

        // Ambil ulang pop dates sesuai well yang baru dipilih
        this.fetchPopDates();
        this.checkAndRefreshChart();
      }
    });

    // Subscribe ke xFilter filter — saat dialog well dibuka, kirim items
    this.wellFilterSub = this.xfilterService.filter.subscribe(res => {
      if (res && res["column"] === "well") {

        if (res["clear"]) {
          this.xfilterService.updateItems({ column: "well", items: this.wellList });
          return;
        }

        const filterText = (res["filter"] || '').toString().trim().toLowerCase();

        if (!filterText) {
          if (this.wellList.length > 0) {
            setTimeout(() => {
              this.xfilterService.updateItems({ column: "well", items: this.wellList });
            }, 0);
          } else {
            this.fetchWellList(); 
          }
        } else {
          const filtered = this.wellList.filter(w =>
            w.toLowerCase().includes(filterText)
          );
          // Delay emit to ensure dialog is subscribed first
          setTimeout(() => {
            this.xfilterService.updateItems({ column: "well", items: filtered });
          }, 0);
        }
      }
    });

    // Fetch well list saja — chart belum muncul sampai semua filter terisi
    this.fetchWellList();
    this.fetchPopDates(); 
    this.checkAndRefreshChart();
  }

  ngOnDestroy() {
    if (this.popSelectedSub) this.popSelectedSub.unsubscribe();
    if (this.popFilterSub) this.popFilterSub.unsubscribe();
    if (this.wellSelectedSub) this.wellSelectedSub.unsubscribe();
    if (this.wellFilterSub) this.wellFilterSub.unsubscribe();
  }

  /** Ambil daftar well dari API (sesuai chart_type rig/rigless) dan kirim ke xFilter */
  fetchWellList() {
    let params = new HttpParams()
      .append('mode', 'chart')
      .append('chart_type', this.selectedChartType);

    this.http.get<any>('/api/pe/MonitoringRK', { params: params }).subscribe(
      (res: any) => {
        const wells = res.distinct_wells || [];
        this.wellList = wells;
        this.xfilterService.updateItems({ column: "well", items: wells });
      },
      (err: any) => console.error('Error fetching well list:', err)
    );
  }

  onChartTypeChange() {
    // Reset well selection
    this.well_xSelected = [];
    this.xfilterService.updateSelected({ column: "well", selected: [] });
    // Reset pop selection
    this.pop_xSelected = [];
    this.xfilterService.updateSelected({ column: "pop", selected: [] });
    this.popList = [];
    this.fetchWellList();
    this.fetchPopDates();
    this.checkAndRefreshChart();
  }

  /** Ambil daftar pop dates dari API (sesuai chart_type + wells yang dipilih) */
  fetchPopDates() {
    let params = new HttpParams()
      .append('mode', 'chart')
      .append('chart_type', this.selectedChartType);

    if (this.well_xSelected && this.well_xSelected.length > 0) {
      params = params.append('wells', this.well_xSelected.join(','));
    }

    this.http.get<any>('/api/pe/MonitoringRK', { params: params }).subscribe(
      (res: any) => {
        // Simpan dalam format YYYY-MM-DD berdasarkan timezone LOKAL browser.
        // Jangan pakai toISOString() karena itu mengembalikan tanggal UTC, padahal pop
        // di database tersimpan sebagai UTC (mis. 2026-08-07T17:00:00Z = 8 Agu WIB).
        // Akibatnya dropdown jadi mundur 1 hari dari tampilan list (Angular date pipe lokal).
        const dates = (res.distinct_pop_dates || []).map((d: string) => {
          const dt = new Date(d);
          if (isNaN(dt.getTime())) return d;
          return this.toLocalDateString(dt);
        });
        this.popList = dates;
        this.xfilterService.updateItems({ column: "pop", items: dates });
      },
      (err: any) => console.error('Error fetching pop dates:', err)
    );
  }

  /** Cek apakah semua filter sudah terisi, baru render chart */
  checkAndRefreshChart() {
    console.log('chartType:', this.selectedChartType, 'wells:', this.well_xSelected, 'pop:', this.pop_xSelected)
    const hasChartType = !!this.selectedChartType;
    const hasWells = this.well_xSelected && this.well_xSelected.length > 0;
    const hasPop = this.pop_xSelected && this.pop_xSelected.length > 0;

    if (hasChartType && hasWells && hasPop) {
      this.loadData();
    } else {
      // Destroy chart jika ada
      if (this.chart) { this.chart.destroy(); this.chart = null; }
      if (this.selisihChart) { this.selisihChart.destroy(); this.selisihChart = null; }
      this.chartData = [];
      this.chartReady = false;
    }
  }

  loadData() {
    this.isLoading = true;

    let params = new HttpParams();
    params = params.append('mode', 'chart');
    params = params.append('chart_type', this.selectedChartType);

    // Filter well (dari xFilter)
    if (this.well_xSelected && this.well_xSelected.length > 0) {
      params = params.append('wells', this.well_xSelected.join(','));
    }

    // Filter date range by pop — interpretasikan tanggal pilihan sebagai kalender LOKAL
    // (awal & akhir hari waktu lokal), lalu kirim sebagai ISO UTC ke backend.
    // Ini agar cocok dengan pop di database yang tersimpan sebagai UTC.
    if (this.pop_xSelected && this.pop_xSelected.length > 0) {
      const sortedDates = this.pop_xSelected
        .map((p: string) => this.parseLocalDate(p))
        .filter((d: Date | null): d is Date => !!d && !isNaN(d.getTime()))
        .sort((a: Date, b: Date) => a.getTime() - b.getTime());
      if (sortedDates.length > 0) {
        const start = sortedDates[0];
        start.setHours(0, 0, 0, 0);
        params = params.append('start_date', start.toISOString());

        const end = sortedDates[sortedDates.length - 1];
        end.setHours(23, 59, 59, 999);
        params = params.append('end_date', end.toISOString());
      }
    }

    this.http.get<any>('/api/pe/MonitoringRK', {
      params: params
    }).subscribe(
      (res) => {
        try {
          this.chartData = res.data || [];
          if (res.distinct_wells) {
            this.wellList = res.distinct_wells;
            this.xfilterService.updateItems({ column: "well", items: res.distinct_wells });
          }
          this.chartReady = true;
          this.isLoading = false;
          this.cdr.detectChanges();
          // Gunakan setTimeout untuk memastikan DOM dan ViewChild sudah tersedia
          setTimeout(() => {
            try {
              this.renderColumnChart();
            } catch (e) {
              console.error('Error rendering chart (async):', e);
            }
          });
        } catch (e) {
          console.error('Error rendering chart:', e);
          this.isLoading = false;
        }
      },
      (error) => {
        console.error('Error loading data:', error);
        this.isLoading = false;
      }
    );
  }

  private renderColumnChart() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }

    if (!this.chartData || this.chartData.length === 0) {
      return;
    }

    // Aggregate data by well: sum target_oil, target_gas, realisasi_oil, realisasi_gas per well
    const wellAgg: { [well: string]: { target_oil: number; target_gas: number; realisasi_oil: number; realisasi_gas: number } } = {};
    for (const item of this.chartData) {
      if (!item.well) continue;
      if (!wellAgg[item.well]) {
        wellAgg[item.well] = { target_oil: 0, target_gas: 0, realisasi_oil: 0, realisasi_gas: 0 };
      }
      const agg = wellAgg[item.well];
      agg.target_oil      += Number(item.target_oil)      || 0;
      agg.target_gas      += Number(item.target_gas)      || 0;
      agg.realisasi_oil   += Number(item.realisasi_oil)   || 0;
      agg.realisasi_gas   += Number(item.realisasi_gas)   || 0;
    }

    const wells = Object.keys(wellAgg);
    const targetOilData    = wells.map(w => wellAgg[w].target_oil);
    const targetGasData    = wells.map(w => wellAgg[w].target_gas);
    const realisasiOilData = wells.map(w => wellAgg[w].realisasi_oil);
    const realisasiGasData = wells.map(w => wellAgg[w].realisasi_gas);

    const chartTypeLabel = this.selectedChartType === 'rigless' ? 'Rigless' : 'Rig';

    this.chart = Highcharts.chart({
      chart: {
        type: 'column',
        renderTo: this.columnChartEl.nativeElement,
        backgroundColor: '#ffffff',
        style: { fontFamily: 'Roboto, sans-serif' }
      },
      title: {
        text: `Summary Pencapaian Produksi RK — ${chartTypeLabel}`,
        style: { fontSize: '16px', fontWeight: '500', color: '#333' }
      },
      xAxis: {
        categories: wells,
        labels: { 
          style: { 
            fontSize: '11px' 
          } 
        }
      },
      yAxis: {
        min: 0,
        title: { text: '' }
      },
      // tooltip: {
      //   shared: true,
      //   valueDecimals: 2
      // },
      plotOptions: {
        column: {
          grouping: true,
          pointPadding: 0.05,
          groupPadding: 0.1,
          borderWidth: 0
        }
      },
      series: [
        {
          name: 'Target Oil', 
          data: targetOilData, 
          color: 
          {
            linearGradient: [0, 0, 0, 500],
            stops: [
              [0, '#C8AAAA'],
              [1, '#9F8383']
            ]
          },
          dataLabels: { 
            enabled: true, 
            format: '{y} bopd', 
            style: { fontSize: '10px' }, 
            // rotation: 90, 
            y: -5 
          }
        },
        {
          name: 'Target Gas', 
          data: targetGasData, 
          color: {
            linearGradient: [0, 0, 0, 500],
            stops: [
              [0, '#FF9D9D'],
              [1, '#92003A']
            ]
          },
        //   color: {
        //   pattern: {
        //     path: {
        //       d: 'M 0 0 L 16 16 M -4 4 L 12 20 M 4 -4 L 20 12 M 0 8 L 8 16 M 8 0 L 16 8',
        //       stroke: '#8B1E1E',
        //       strokeWidth: 1.2,
        //       fill: 'none'
        //     },
        //     width: 16,
        //     height: 16,
        //     color: '#D25353',
        //     backgroundColor: '#D25353'
        //   }
        // },
          dataLabels: { 
            enabled: true, 
            format: '{y} mmscfd', 
            style: { fontSize: '10px' }, 
            // rotation: 90, 
            y: -5 
          }
        },
        {
          name: 'Realisasi Oil', 
          data: realisasiOilData, 
          color: '#735557',
          dataLabels: { 
            enabled: true, 
            format: '{y} bopd', 
            style: { fontSize: '10px' }, 
            // rotation: 90, 
            y: -5 
          }
        },
        { 
          name: 'Realisasi Gas', 
          data: realisasiGasData, 
          // color: {
          //   linearGradient: [0, 0, 0, 500],
          //   stops: [
          //     [0, '#FF9D9D'],
          //     [1, '#92003A']
          //   ]
          // },
          color: {
          pattern: {
            path: {
              d: 'M 0 0 L 16 16 M -4 4 L 12 20 M 4 -4 L 20 12 M 0 8 L 8 16 M 8 0 L 16 8',
              stroke: '#8B1E1E',
              strokeWidth: 1.2,
              fill: 'none'
            },
            width: 16,
            height: 16,
            color: '#D25353',
            backgroundColor: '#D25353'
          }
        },
          dataLabels: { 
            enabled: true, 
            format: '{y} mmscfd', 
            style: { fontSize: '10px' }, 
            // rotation: 90, 
            y: -5 
          }
        }
      ],
      credits: { enabled: false }
    } as Highcharts.Options);

    // Chart Selisih 
    this.renderSelisihChart(wells, wellAgg, chartTypeLabel);
  }

  private renderSelisihChart(wells: string[], wellAgg: any, chartTypeLabel: string) {
    if (this.selisihChart) {
      this.selisihChart.destroy();
      this.selisihChart = null;
    }

    // Hitung persentase selisih per well
    const oilSelisih = wells.map(w => {
      const t = wellAgg[w].target_oil;
      const r = wellAgg[w].realisasi_oil;
      return t ? (r - t) / t : 0;
    });
    const gasSelisih = wells.map(w => {
      const t = wellAgg[w].target_gas;
      const r = wellAgg[w].realisasi_gas;
      return t ? (r - t) / t : 0;
    });

    this.selisihChart = Highcharts.chart({
      chart: {
        type: 'column',
        renderTo: this.selisihChartEl.nativeElement,
        backgroundColor: '#ffffff',
        style: { 
          fontFamily: 'Roboto, sans-serif' 
        },
        
        
      },
      title: {
        text: `Persentase Pencapaian Produksi RK ${chartTypeLabel}`,
        style: { fontSize: '16px', fontWeight: '500', color: '#333' }
      },
      xAxis: {
        categories: wells,
        labels: { style: { fontSize: '11px' } }
      },
      yAxis: {
        title: { text: 'Persentase' },
        labels: { format: '{value}%' }
      },
      // tooltip: {
      //   shared: true,
      //   valueDecimals: 2,
      //   valueSuffix: '%'
      // },
      plotOptions: {
        column: {
          grouping: true,
          pointPadding: 0.05,
          groupPadding: 0.1,
          borderWidth: 0
        },
      },
      series: [
        {
          name: 'Oil',
          data: oilSelisih.map(v => Math.round(v * 10000) / 100),
          color: '#735557',
          // negativeColor: '#EF5350',
          borderRadius: 8,
          dataLabels: {
            enabled: true,
            format: '{y}%',
            style: { fontSize: '10px' },
            y: -5
          }
        },
        {
          name: 'Gas',
          data: gasSelisih.map(v => Math.round(v * 10000) / 100),
          color: '#b53f3f',
          // negativeColor: '#EF5350',
          borderRadius: 8,
          dataLabels: {
            enabled: true,
            format: '{y}%',
            style: { fontSize: '10px' },
            y: -5
          }
        }
      ],
      credits: { enabled: false }
    } as Highcharts.Options);
  }

  /** Format Date ke YYYY-MM-DD berdasarkan timezone lokal browser (konsisten dgn list) */
  private toLocalDateString(dt: Date): string {
    const y = dt.getFullYear();
    const m = String(dt.getMonth() + 1).padStart(2, '0');
    const day = String(dt.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  /** Parse string YYYY-MM-DD sebagai tengah malam waktu lokal (bukan UTC) */
  private parseLocalDate(s: string): Date | null {
    const parts = s.split('-').map(Number);
    if (parts.length !== 3 || parts.some(n => isNaN(n))) return null;
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }

  refreshChart() {
    this.checkAndRefreshChart();
  }

}
