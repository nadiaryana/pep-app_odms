import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TitleService } from '../../navigation/title/title.service';
import * as Highcharts from 'highcharts';
import { FormControl } from '@angular/forms';
import { MatDatepicker } from '@angular/material';
import { style } from '@angular/animations';
import { SnackbarApi, SnackbarService } from 'src/app/snackbar.service';

// ============================================
// Import Highcharts Gantt module
// Gantt chart adalah jenis chart untuk menampilkan 
// timeline/jadwal dengan bar horizontal
// ============================================
declare var require: any;
const HighchartsGantt = require('highcharts/highcharts-gantt');
const HighchartsExporting = require('highcharts/modules/exporting');

// Inisialisasi modul exporting untuk fitur export chart
if (typeof HighchartsExporting === 'function') {
  HighchartsExporting(HighchartsGantt);
}

@Component({
  selector: 'app-barchart-chart',
  templateUrl: './barchart-chart.component.html',
  styleUrls: ['./barchart.scss']
})
export class BarchartChartComponent implements OnInit, AfterViewInit {

  // Reference ke element HTML untuk render chart
  @ViewChild('ganttChart', { static: true }) ganttChartEl: ElementRef;
  @ViewChild('start_datePicker', { static: true }) start_datePicker: MatDatepicker<any>;
  start_dateControl = new FormControl();
  start_dateInput = this.start_dateControl.value
    ? this.start_dateControl.value.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
        day: "numeric",
      })
    : "";  @ViewChild('end_datePicker', { static: true }) end_datePicker: MatDatepicker<any>;
  end_dateControl = new FormControl();
  end_dateInput = this.end_dateControl.value
    ? this.end_dateControl.value.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
        day: "numeric",
      })
    : "";
  
  // Flag untuk menampilkan loading spinner
  isLoading: boolean = false;
  
  // Array untuk menyimpan data dari API
  chartData: any[] = [];
  
  // Instance Highcharts chart
  chart: any;

  // Array untuk menyimpan data legend rig
  jobLegend: any[] = [];


  colors = [
    '#7cb5ec', // Biru muda
    '#434348', // Abu-abu gelap
    '#90ed7d', // Hijau muda
    '#f7a35c', // Orange
    '#8085e9', // Ungu
    '#f15c80', // Pink
    '#e4d354', // Kuning
    '#2b908f', // Teal
    '#f45b5b', // Merah
    '#91e8e1'  // Cyan
  ];

  jobColors: { [key: string]: string } = {
    'workover': '#00B050',
    'reparasi': '#76933C',
    'well services': '#ffff00',
    'fracturing': '#00b0f0',
    'stimulasi': '#1C4D8D',
    'reaktivasi': '#f7a35c',

    'eor': '#C4BD97',
    'optimasi': '#92D050',
    'injeksi': '#366092',

    'hoist repair': '#FF0000',
    'hoist idle': '#B1A0C7',
    'hoist mobilization': '#E4DFEC',
    'komplesi lanjutan': '#C0504D',
  };



  constructor(
    private titleService: TitleService,
    private http: HttpClient,
    private snackbarService: SnackbarService,
  ) { }
  
  // run pertama kali
  ngOnInit() {
    this.titleService.titleSource.next({
      title: "Barchart",
      icon: "bar_chart",
      breadcrumbs: [
        { label: 'Petroleum Engineering', routerLink: '' },
        { label: 'Barchart', routerLink: 'pe/barchart' },
        { label: 'BarChart', routerLink: '' }
      ]
    });

    // refresh chart saat tanggal diubah
    this.start_dateControl.valueChanges.subscribe(value => {
      if (value) {
        // prevent end_date < start_date
        if (this.end_dateControl.value && this.end_dateControl.value < value) {
          this.end_dateControl.setValue(value);
          this.snackbarService.status.next(new SnackbarApi(true, 'End Date cannot be earlier than Start Date', "dismiss", { duration: 3000 }),);
        }

        this.start_dateInput = value.toLocaleDateString("en-US", { month: "short", year: "numeric", day: "numeric" });
        this.refreshChart();
      }
    });

    this.end_dateControl.valueChanges.subscribe(value => {
      if (value) {
        // prevent end_date < start_date
        if (this.start_dateControl.value && this.start_dateControl.value > value) {
          this.start_dateControl.setValue(value);
          this.snackbarService.status.next(new SnackbarApi(true, 'Start Date cannot be longer than End Date', "dismiss", { duration: 3000 }),);
        }
        this.end_dateInput = value.toLocaleDateString("en-US", { month: "short", year: "numeric", day: "numeric" });
        this.refreshChart();
      }
    });
  }
  
  start_dateChange(evt) {
    this.start_dateInput = evt.value.toLocaleDateString("en-US", { month: "short", year: "numeric", day: "numeric" });
  }

  end_dateChange(evt) {
    this.end_dateInput = evt.value.toLocaleDateString("en-US", { month: "short", year: "numeric", day: "numeric" });
  }

  // dipanggil setelah view selesai di-render
  ngAfterViewInit() {
    this.loadData();
  }
  
  // ngambil data dari backend API
  loadData() {
    // Cek apakah kedua tanggal sudah dipilih
    if (!this.start_dateControl.value || !this.end_dateControl.value) {
      return;
    }

    // Tampilkan loading spinner
    this.isLoading = true;

    let params = new HttpParams();
    // send parameter date range dalam format ISO agar bisa di-parse oleh .NET DateTime
    params = params.append('start_date', this.start_dateControl.value.toISOString());
    params = params.append('end_date', this.end_dateControl.value.toISOString());

    // mode chart untuk get data Gantt Chart dengan filter date range
    params = params.append('mode', 'chart');

    // Request ke API
    this.http.get<any>('/api/pe/barchart', {
      params: params
    }).subscribe(
      (res) => {
        // Simpan data dari response (response format: { data: [...] })
        this.chartData = res.data || [];
        
        // Render chart dengan data yang didapat
        this.renderGanttChart();
        
        // Sembunyikan loading spinner
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading data:', error);
        this.isLoading = false;
      }
    );
  }

  // fungsi format tanggal ke string lokal "DD MMM YYYY"
  formatDateLocal(timestamp: number): string {
    if (!timestamp) return '-';
    
    const date = new Date(timestamp);
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    };
    return date.toLocaleDateString('id-ID', options);
  }

  // fungsi render Gantt Chart dengan Highcharts Gantt
  renderGanttChart() {
    // Destroy chart lama jika ada
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }

    // Jika tidak ada data, clear legend dan return
    if (!this.chartData || this.chartData.length === 0) {
      this.jobLegend = [];
      return;
    }
    const { wellSeries, remarkSeries, categories } = this.reformatDataGantt();

    // 1. mapping warna untuk setiap Job sudah ada di jobColors property
    // Tidak perlu mapping ulang karena sudah didefinisikan di class property

    // 2. Persiapkan data series untuk chart
    const seriesData = this.chartData.map((item, index) => {
      // Parse tanggal menggunakan toLocaleDateString (tanggal lokal, tanpa timezone issue)
      const startDate = item.plan_start ? Date.parse(new Date(item.plan_start).toLocaleDateString("en-US", { month: "short", year: "numeric", day: "numeric" })) : null;
      const endDate = item.plan_end ? Date.parse(new Date(item.plan_end).toLocaleDateString("en-US", { month: "short", year: "numeric", day: "numeric" })) : null;
      
      return {
        name: item.well || 'Unknown Well',  // Nama well untuk label
        id: 'task-' + index,                 // ID unik untuk setiap bar
        start: startDate,                    // Tanggal mulai (timestamp)
        end: endDate,                        // Tanggal selesai (timestamp)
        y: index,                            // Posisi vertikal (baris ke-n)
        color: this.getJobColor(item.job), // Warna berdasarkan job
        
        // Data custom untuk ditampilkan di tooltip
        custom: {
          well: item.well,
          job: item.job,
          rig: item.rig,
          plan_start: Date.parse(new Date(item.plan_start).toLocaleDateString("en-US", { month: "short", year: "numeric", day: "numeric" })),
          plan_end: Date.parse(new Date(item.plan_end).toLocaleDateString("en-US", { month: "short", year: "numeric", day: "numeric" }))
        }
      };
    }).filter(item => item.start && item.end); // Filter data yang tidak punya tanggal

    // 3. Siapkan kategori untuk sumbu Y (daftar well)
    // const categories = seriesData.map(item => item.name);

    // 4. Simpan reference ke component untuk digunakan di tooltip
    const self = this;

    // 5. Hitung lebar chart berdasarkan range tanggal
    const allDates = [...wellSeries.map(d => d.start), ...wellSeries.map(d => d.end)];
    const minDate = Math.min(...allDates);
    const maxDate = Math.max(...allDates);
    const daysDiff = Math.ceil((maxDate - minDate) / (24 * 3600 * 1000));
    
    // Minimal 30px per hari, agar label tetap terlihat
    const minWidthPerDay = 30;
    const scrollableWidth = Math.max(1200, daysDiff * minWidthPerDay);

    // 6. Buat dan render chart dengan Highcharts Gantt
    this.chart = HighchartsGantt.ganttChart(this.ganttChartEl.nativeElement, {
      
      // Konfigurasi chart container
      chart: {
        // Tinggi chart dinamis berdasarkan jumlah data
        // Minimal 400px, atau 50px per baris + 150px untuk header/footer (2 bar per baris)
        height: Math.max(400, seriesData.length * 50 + 150),
        // Full width - ikut container
        width: null,
        scrollablePlotArea: {
          minWidth: scrollableWidth,
          scrollPositionX: 0
        },
        style: {
          fontFamily: 'Roboto, "Helvetica Neue", sans-serif'
        }
      },
      
      // Judul chart
      title: {
        text: 'BARCHART RIG SANGATTA FIELD',
        style: {
          fontSize: '18px',
          fontWeight: 'bold'
        }
      },
      
      // Konfigurasi sumbu X (timeline horizontal)
      xAxis: [
        { // tanggal perhari
          type: 'datetime',

          tickInterval: 24 * 3600 * 1000, // 1 hari = 1 kolom

          labels: {
            style: {
              fontSize: '11px'
            },
            formatter: function () {
              return Highcharts.dateFormat('%e', this.value as number);
            }
          },

          grid: {
            enabled: true,
            cellHeight: 30
          },

          // currentDateIndicator: {
          //   enabled: true,
          //   color: 'red',
          //   width: 2
          // }
        },
        { // label format bulan & tahun
          type: 'datetime',
          linkedTo: 0,

          tickInterval: 30 * 24 * 3600 * 1000, // kira-kira per bulan
          labels: {
            style: {
              fontSize: '13px',
              fontWeight: 'bold',
            },
            formatter: function () {
              return Highcharts.dateFormat('%B %Y', this.value as number).toUpperCase();
            }
          },

          grid: {
            enabled: true
          }
        },
      ],
      
      // Konfigurasi sumbu Y (kategori well)
      yAxis: {
        type: 'category',
        categories: categories,
        grid: {
          columns: [{
            title: {
              text: 'RIG'  // Header kolom
            },
            categories: categories
          }],
          cellHeight: 100  
        }
      },
      
      // Konfigurasi tooltip (muncul saat hover)
      tooltip: {
        useHTML: true,  // Gunakan HTML untuk formatting
        style: {
          pointerEvents: 'auto'
        },
        formatter() {
          const p: any = this.point;
          const custom = p.custom || {};
          
          // Convert newline ( n) ke <br> untuk HTML
          const remarks = custom.remarks ? custom.remarks.replace(/\n/g, '<br>') : '';
          const label = custom.label ? custom.label.replace(/\n/g, '<br>') : '';
          
          // End date untuk display (gunakan actualEnd yang disimpan)
          const displayEnd = custom.actualEnd || (p.end - (24 * 60 * 60 * 1000));
          
          // Jika ini bar Well
          if (this.series.name === 'Well') {
            return `
              <div style="padding: 8px; max-width: 300px;">
                <b style="font-size: 14px; color: #333;">${custom.label || 'N/A'}</b><br>
                <table style="margin-top: 6px; font-size: 12px;">
                  <tr><td style="color: #666; padding-right: 8px;">Rig:</td><td><b>${custom.rig || '-'}</b></td></tr>
                  <tr><td style="color: #666; padding-right: 8px;">Job:</td><td>${custom.job || '-'}</td></tr>
                  <tr><td style="color: #666; padding-right: 8px;">Start:</td><td>${Highcharts.dateFormat('%e %b %Y', p.start)}</td></tr>
                  <tr><td style="color: #666; padding-right: 8px;">End:</td><td>${Highcharts.dateFormat('%e %b %Y', displayEnd)}</td></tr>
                </table>
                ${remarks ? `<hr style="margin: 8px 0; border: none; border-top: 1px solid #ddd;">
                <div style="color: #555;"><b>Remarks:</b><br><span style="white-space: pre-wrap;">${remarks}</span></div>` : ''}
              </div>
            `;
          }
          
          // Jika ini bar Remarks
          return `
            <div style="padding: 8px; max-width: 300px;">
              <b style="font-size: 13px; color: #333;">${custom.well || 'Remarks'}</b><br>
              <div style="margin-top: 6px; font-size: 12px; color: #555; white-space: pre-wrap;">${label || '-'}</div>
              <div style="margin-top: 6px; font-size: 11px; color: #888;">
                ${Highcharts.dateFormat('%e %b %Y', p.start)} - ${Highcharts.dateFormat('%e %b %Y', displayEnd)}
              </div>
            </div>
          `;
        },
      },

          series: [
            /* === WELL BAR (ATAS) === */
            {
              name: 'Well',
              pointPadding: 0,
              groupPadding: 0,
              pointWidth: 28,             // Ukuran bar well (lebih kecil)
              pointPlacement: -0.22,      // Posisi bar di atas
              borderRadius: 4,

              dataLabels: {
                enabled: true,
                align: 'center',
                verticalAlign: 'middle',
                format: '{point.name}',
                style: {
                  fontSize: '16px',
                  fontWeight: 'bold',
                  textOutline: 'none',
                },
                formatter: function () {
                  const p: any = this.point;
                  return `
                    <span style="
                      color: #000;
                      font-weight: bold;
                      background:${p.color};
                      padding:4px 8px;
                      border-radius:4px;
                      display:inline-block;
                    ">
                      ${p.name}
                    </span>
                  `;
                },
                useHTML: true
              },

              data: wellSeries
            },

            /* === REMARKS BAR (BAWAH) === */
            {
              name: 'Remarks',
              pointPadding: 0,
              groupPadding: 0,
              pointWidth: 25,             // Ukuran bar remarks lebih besar
              pointPlacement: 0.18,       // Posisi bar di bawah
              borderRadius: 0,
              dataLabels: {
                verticalAlign: 'top',
                y: -15,
                enabled: true,
                useHTML: true,
                inside: true,
                allowOverlap: true,

                formatter: function () {
                    // Limit to 2 lines, show ellipsis if overflow
                    const point: any = this.point;
                    const text = point.name || '';

                    // sanitize text for title attribute
                    const safe = String(text)
                      .replace(/&/g, '&amp;')
                      .replace(/</g, '&lt;')
                      .replace(/>/g, '&gt;')
                      .replace(/"/g, '&quot;');

                    // try to get rendered bar width; fallback to estimate (days * 30px)
                    const dayMs = 24 * 3600 * 1000;
                    const estimatedDayPx = 30;
                    const widthPx =
                      point.shapeArgs && point.shapeArgs.width
                      ? point.shapeArgs.width
                      : (point.end && point.start ? Math.max(0, (point.end - point.start) / dayMs * estimatedDayPx) : 0);

                    // If bar is extremely narrow, hide label to avoid overlap
                    if (widthPx < 40) {
                      return '';
                    }

                    // For small bars show single-line truncated text with tooltip
                    // If bar is extremely narrow, hide label to avoid overlap
                    if (widthPx < 40) {
                      return '';
                    }

                    // For narrow bars show single-line truncated text with tooltip
                    if (widthPx < 100) {
                      const short = text.length > 30 ? text.substr(0, 30) + '…' : text;
                      return `
                        <div title="${safe}"
                             style="
                               width: ${Math.max(30, Math.floor(widthPx))}px;
                               white-space: nowrap;
                               overflow: hidden;
                               text-overflow: ellipsis;
                               font-size: 14px;
                               color: #333;
                               text-align: center;
                             ">
                          ${short}
                        </div>
                      `;
                    }

                    // For wider bars allow up to 4 lines with ellipsis
                    const maxLines = 10;
                    const remarks = safe.replace(/\n/g, '<br>');
                    // if text length is more than 200 chars text allign left
                    let textAlign = 'center';
                    if (text.length > 200) {
                      textAlign = 'left';
                    }
                    return `
                      <div title="${safe}"
                      style="
                        width: ${Math.max(80, Math.floor(widthPx))}px;
                        font-size: 14px;
                        line-height: 14px;
                        color: #333;
                        text-align: ${textAlign};
                        display: -webkit-box;
                        -webkit-line-clamp: ${maxLines};
                        -webkit-box-orient: vertical;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: normal;
                      ">
                      ${remarks}
                      </div>
                    `;
                }
              },

              data: remarkSeries
            }
          ],
            
      // Konfigurasi legend (keterangan)
      legend: {
        enabled: false  // Kita gunakan custom legend di HTML
      },
      
      // Navigator untuk scroll horizontal
      navigator: {
        enabled: true,
        series: {
          type: 'gantt',
          pointWidth: 1
        },
        yAxis: {
          min: 0,
          max: 1,
          reversed: true,
          categories: []
        }
      },

      // Scrollbar horizontal
      scrollbar: {
        enabled: true
      },

      // Range selector (optional - bisa pilih range cepat)
      rangeSelector: {
        enabled: true,
        selected: 0,
        buttons: [{
          type: 'month',
          count: 1,
          text: '1m'
        }, {
          type: 'month',
          count: 2,
          text: '2m'
        }, {
          type: 'month',
          count: 3,
          text: '3m'
        }, {
          type: 'all',
          text: 'All'
        }]
      },
      
      // Sembunyikan credit Highcharts
      credits: {
        enabled: false
      },
      
      // Konfigurasi fitur export
      exporting: {
        enabled: true,
        buttons: {
          contextButton: {
            menuItems: [
              'downloadPNG',   // Export ke PNG
              'downloadJPEG',  // Export ke JPEG
              'downloadPDF',   // Export ke PDF
              'downloadSVG'    // Export ke SVG
            ]
          }
        }
      }
    });

    // 7. Buat custom legend untuk job
    this.createJobLegend();
  }

  private utcToLocalMidnight(dateStr: string): number {
  const d = new Date(dateStr);

  // shift ke WIB
  const local = new Date(d.getTime() + (7 * 60 * 60 * 1000));

  // set ke local midnight
  return new Date(
    local.getFullYear(),
    local.getMonth(),
    local.getDate(),
    0, 0, 0, 0
  ).getTime();
}


  // fungsi membuat custom legend job
  createJobLegend() {
    // Konversi object ke array untuk di-loop di template
    // Build legend based on jobs (not rigs) and use jobColors to set colors per job
    const jobs = Array.from(new Set(this.chartData.map(item => (item.job || 'Unknown').toString().trim().toLowerCase())));
    this.jobLegend = jobs.map(jobKey => ({
      name: jobKey,
      color: this.getJobColor(jobKey)
    }));
  }

  // fungsi untuk refresh chart (dipanggil dari tombol Refresh)
  refreshChart() {
    this.loadData();
  }

  getJobColor(job: string): string {
    if (!job) return '#bfbfbf';

    const key = job.trim().toLowerCase();
    return this.jobColors[key] || '#bfbfbf';
  }



  // fungsi reformat data dari API ke series Highcharts
  // private reformatDataGantt() {
  //   const wellSeries: any[] = [];
  //   const remarkSeries: any[] = [];
  //   const categories: string[] = [];

  //   this.chartData.forEach((d, index) => {

  //     // label kiri (rig)
  //     categories.push(d.rig);

  //     // Parse tanggal dan set ke awal hari (00:00:00) agar bar mulai tepat di tanggal
  //     const startDate = new Date(d.plan_start);
  //     const start = Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate());
      
  //     const endDate = new Date(d.plan_end);
  //     // Tambah 1 hari ke end agar bar mencakup sampai akhir tanggal tersebut
  //     // Karena Highcharts Gantt menggunakan exclusive end (bar berhenti sebelum end date)
  //     let end = Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate()) + (24 * 60 * 60 * 1000);

  //     /* === BARIS ATAS (WELL NAME) === */
  //     wellSeries.push({
  //       name: d.well,
  //       start,
  //       end,
  //       y: index,
  //       color: '#B4A7D6',
  //       custom: {
  //         label: d.well,
  //         rig: d.rig,
  //         job: d.job,
  //         remarks: d.remarks
  //       }
  //     });

  //     /* === BARIS BAWAH (REMARKS) === */
  //     remarkSeries.push({
  //       name: d.remarks,
  //       start,
  //       end,
  //       y: index, // PENTING: y sama → visually connected
  //       color: '#FFD966',
  //       custom: {
  //         label: d.remarks,
  //         well: d.well,
  //         rig: d.rig,
  //         job: d.job
  //       }
  //     });
  //   });

  //   return { wellSeries, remarkSeries, categories };
  // }

  private reformatDataGantt() {

  const wellSeries: any[] = [];
  const remarkSeries: any[] = [];
  const categories: string[] = [];

  const rigMap = new Map<string, number>();
  let rigIndex = 0;

  this.chartData.forEach((d) => {

    if (!d.rig) return;

    // === GROUP BY RIG ===
    if (!rigMap.has(d.rig)) {
      rigMap.set(d.rig, rigIndex);
      categories[rigIndex] = d.rig;
      rigIndex++;
    }

    const y = rigMap.get(d.rig);

    // === TANGGAL FIX - Ambil tanggal lokal dari UTC ===
    const rawStart = new Date(d.plan_start);
    const rawEnd   = new Date(d.plan_end);

    // Ambil tanggal tanpa timezone offset
    const start = Date.UTC(
      rawStart.getUTCFullYear(),
      rawStart.getUTCMonth(),
      rawStart.getUTCDate(),
      0, 0, 0, 0
    );

    // End date: tanggal sebenarnya (untuk display di tooltip)
    const endActual = Date.UTC(
      rawEnd.getUTCFullYear(),
      rawEnd.getUTCMonth(),
      rawEnd.getUTCDate(),
      0, 0, 0, 0
    );

    // End date untuk bar: tambah 1 hari agar bar mencakup sampai akhir end date
    const endForBar = endActual + (24 * 60 * 60 * 1000);
    const jobColor = this.getJobColor(d.job);

    // === WELL BAR ===
    wellSeries.push({
      name: d.well,
      start,
      end: endForBar,  // Bar sampai akhir end date
      y,
      color: jobColor,
      custom: {
        label: d.well,
        rig: d.rig,
        job: d.job,
        remarks: d.remarks,
        actualEnd: endActual  // Simpan end date sebenarnya untuk tooltip
      }
    });

    // === REMARK BAR ===
    remarkSeries.push({
      name: d.remarks,
      start,
      end: endForBar,  // Bar sampai akhir end date
      y,
      color: '#FFFFFF',
      custom: {
        label: d.remarks,
        well: d.well,
        rig: d.rig,
        job: d.job,
        actualEnd: endActual  // Simpan end date sebenarnya untuk tooltip
      }
    });
  });

  return { wellSeries, remarkSeries, categories };
}


}
