import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TitleService } from '../../navigation/title/title.service';
import * as Highcharts from 'highcharts';
import { FormControl } from '@angular/forms';
import { MatDatepicker } from '@angular/material';

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
  rigLegend: any[] = [];

  // Setiap rig akan mendapat warna berbeda=
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

  constructor(
    private titleService: TitleService,
    private http: HttpClient,
  ) { }
  
  // run pertama kali
  ngOnInit() {
    this.titleService.titleSource.next({
      title: "Gantt Chart - Well Planning",
      icon: "bar_chart",
      breadcrumbs: [
        { label: 'Petroleum Engineering', routerLink: '' },
        { label: 'Barchart', routerLink: 'pe/barchart' },
        { label: 'Gantt Chart', routerLink: '' }
      ]
    });

    // refresh chart saat tanggal diubah
    this.start_dateControl.valueChanges.subscribe(value => {
      if (value) {
        this.start_dateInput = value.toLocaleDateString("en-US", { month: "short", year: "numeric", day: "numeric" });
        this.refreshChart();
      }
    });

    this.end_dateControl.valueChanges.subscribe(value => {
      if (value) {
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
      this.rigLegend = [];
      return;
    }
    const { wellSeries, remarkSeries, categories } = this.reformatDataGantt();

    // 1. mapping warna untuk setiap Rig
    const rigColors = {};
    // Ambil daftar rig unik dari data
    const uniqueRigs = [...new Set(this.chartData.map(item => item.rig || 'Unknown'))];
    // Assign warna untuk setiap rig
    uniqueRigs.forEach((rig, index) => {
      // Gunakan modulo agar warna berulang jika rig > jumlah warna
      rigColors[rig as string] = this.colors[index % this.colors.length];
    });

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
        color: rigColors[item.rig || 'Unknown'], // Warna berdasarkan rig
        
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
        text: 'Well Planning Gantt Chart',
        style: {
          fontSize: '18px',
          fontWeight: 'bold'
        }
      },
      
      // Sub judul
      subtitle: {
        text: 'Plan Start to Plan End by Well'
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

          currentDateIndicator: {
            enabled: true,
            color: 'red',
            width: 2
          }
        },
        { // label format bulan & tahun
          type: 'datetime',
          linkedTo: 0,

          tickInterval: 30 * 24 * 3600 * 1000, // kira-kira per bulan
          labels: {
            style: {
              fontSize: '13px',
              fontWeight: 'bold'
            },
            formatter: function () {
              return Highcharts.dateFormat('%B %Y', this.value as number);
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
          }]
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
          
          // Convert newline (\n) ke <br> untuk HTML
          const remarks = custom.remarks ? custom.remarks.replace(/\n/g, '<br>') : '';
          const label = custom.label ? custom.label.replace(/\n/g, '<br>') : '';
          
          // End date untuk display (kurangi 1 hari karena kita tambahkan 1 hari untuk bar)
          const displayEnd = p.end - (24 * 60 * 60 * 1000);
          
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
              pointWidth: 14,             // Ukuran bar well (lebih kecil)
              pointPlacement: -0.20,      // Posisi bar di atas
              borderRadius: 3,

              dataLabels: {
            enabled: true,
            align: 'center',
            verticalAlign: 'middle',
            format: '{point.name}',
            style: {
              fontSize: '10px',
              fontWeight: 'bold',
              textOutline: 'none',
              color: '#000000'
            }
              },

              data: wellSeries
            },

            /* === REMARKS BAR (BAWAH) === */
            {
              name: 'Remarks',
              pointPadding: 0,
              groupPadding: 0,
              pointWidth: 24,             // Ukuran bar remarks lebih besar
              pointPlacement: 0.18,       // Posisi bar di bawah
              borderRadius: 0,

              dataLabels: {
            enabled: true,
            align: 'center',
            verticalAlign: 'middle',
            formatter: function() {
              const point: any = this.point;
              const text = point.name || '';
              
              // Calculate bar width in pixels based on date range
              const msPerDay = 24 * 3600 * 1000;
              const daysDiff = (point.end - point.start) / msPerDay;
              
              // Approximate character width (adjust based on font size 9px)
              const charWidth = 5;
              const barWidth = daysDiff * 20; // Approximate pixels per day
              const maxChars = Math.floor(barWidth / charWidth) - 2; // Leave some padding
              
              if (maxChars <= 0) {
              return '';
              }
              
              if (text.length > maxChars) {
              return text.substring(0, maxChars - 1) + '…';
              }
              
              return text;
            },
            style: {
              fontSize: '9px',
              textOutline: 'none',
              color: '#333333'
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

    // 7. Buat custom legend untuk rig
    this.createRigLegend(rigColors);
  }

  // fungsi membuat custom legend rig
  createRigLegend(rigColors: any) {
    // Konversi object ke array untuk di-loop di template
    this.rigLegend = Object.keys(rigColors).map(rig => ({
      name: rig,
      color: rigColors[rig]
    }));
  }

  // fungsi untuk refresh chart (dipanggil dari tombol Refresh)
  refreshChart() {
    this.loadData();
  }

  // fungsi reformat data dari API ke series Highcharts
  private reformatDataGantt() {
    const wellSeries: any[] = [];
    const remarkSeries: any[] = [];
    const categories: string[] = [];

    this.chartData.forEach((d, index) => {

      // label kiri (rig)
      categories.push(d.rig);

      // Parse tanggal dan set ke awal hari (00:00:00) agar bar mulai tepat di tanggal
      const startDate = new Date(d.plan_start);
      const start = Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate());
      
      const endDate = new Date(d.plan_end);
      // Tambah 1 hari ke end agar bar mencakup sampai akhir tanggal tersebut
      // Karena Highcharts Gantt menggunakan exclusive end (bar berhenti sebelum end date)
      let end = Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate()) + (24 * 60 * 60 * 1000);

      /* === BARIS ATAS (WELL NAME) === */
      wellSeries.push({
        name: d.well,
        start,
        end,
        y: index,
        color: '#B4A7D6',
        custom: {
          label: d.well,
          rig: d.rig,
          job: d.job,
          remarks: d.remarks
        }
      });

      /* === BARIS BAWAH (REMARKS) === */
      remarkSeries.push({
        name: d.remarks,
        start,
        end,
        y: index, // PENTING: y sama → visually connected
        color: '#FFD966',
        custom: {
          label: d.remarks,
          well: d.well,
          rig: d.rig,
          job: d.job
        }
      });
    });

    return { wellSeries, remarkSeries, categories };
  }

}
