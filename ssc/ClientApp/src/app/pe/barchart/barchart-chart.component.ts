import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TitleService } from '../../navigation/title/title.service';
import * as Highcharts from 'highcharts';

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
  }

  // dipanggil setelah view selesai di-render
  ngAfterViewInit() {
    this.loadData();
  }
  
  // ngambil data dari backend API
  loadData() {
    // Tampilkan loading spinner
    this.isLoading = true;
    
    // Request ke API dengan parameter sorting dan pagination
    this.http.get<any>('/api/pe/barchart', {
      params: {
        sort: 'plan_start',  // Urutkan berdasarkan tanggal mulai
        order: 'asc',        // Ascending (terlama ke terbaru)
        pagesize: '1000'     // Ambil maksimal 1000 data
      }
    }).subscribe(
      (res) => {
        // Simpan data dari response
        this.chartData = res.items || [];
        
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

  // fungsi konversi tanggal string ke timestamp dengan timezone lokal
  parseLocalDate(dateString: string): number {
    if (!dateString) return null;
    
    // Buat object Date dari string
    const date = new Date(dateString);
    
    // Extract komponen tanggal (year, month, day)
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    
    // Buat Date baru dengan waktu lokal tengah hari (12:00:00)
    // Ini memastikan tanggal tidak bergeser karena timezone
    return new Date(year, month, day, 12, 0, 0).getTime();
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
    // Jika tidak ada data, tidak perlu render chart
    if (!this.chartData || this.chartData.length === 0) {
      return;
    }

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
      // Parse tanggal dengan mempertahankan timezone lokal
      // Ini menghindari masalah tanggal berkurang 1 hari
      const startDate = item.plan_start ? this.parseLocalDate(item.plan_start) : null;
      const endDate = item.plan_end ? this.parseLocalDate(item.plan_end) : null;
      
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
          plan_start: item.plan_start,
          plan_end: item.plan_end
        }
      };
    }).filter(item => item.start && item.end); // Filter data yang tidak punya tanggal

    // 3. Siapkan kategori untuk sumbu Y (daftar well)
    const categories = seriesData.map(item => item.name);

    // 4. Simpan reference ke component untuk digunakan di tooltip
    const self = this;

    // 5. Buat dan render chart dengan Highcharts Gantt
    this.chart = HighchartsGantt.ganttChart(this.ganttChartEl.nativeElement, {
      
      // Konfigurasi chart container
      chart: {
        // Tinggi chart dinamis berdasarkan jumlah data
        // Minimal 400px, atau 35px per baris + 100px untuk header/footer
        height: Math.max(400, seriesData.length * 35 + 100),
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
      xAxis: [{
        type: 'datetime',
        
        // Tampilkan garis indikator tanggal hari ini
        currentDateIndicator: {
          enabled: true,
          color: '#FF0000',
          width: 2,
          label: {
            format: 'Hari ini: %d %b %Y'
          }
        },
        
        // Format label tanggal di sumbu X
        dateTimeLabelFormats: {
          day: '%e %b',      // Format: "15 Jan"
          week: '%e %b',     // Format: "15 Jan"
          month: '%b \'%y'   // Format: "Jan '26"
        },
        
        // Tinggi cell grid
        grid: {
          cellHeight: 30
        }
      }],
      
      // Konfigurasi sumbu Y (kategori well)
      yAxis: {
        type: 'category',
        categories: categories,
        grid: {
          columns: [{
            title: {
              text: 'Well'  // Header kolom
            },
            categories: categories
          }]
        }
      },
      
      // Konfigurasi tooltip (muncul saat hover)
      tooltip: {
        useHTML: true,  // Gunakan HTML untuk formatting
        
        // Custom formatter untuk tooltip
        formatter: function() {
          const point = this.point as any;
          const custom = point.custom || {};
          
          // Format tanggal menggunakan helper function
          const startDate = point.start ? self.formatDateLocal(point.start) : '-';
          const endDate = point.end ? self.formatDateLocal(point.end) : '-';
          
          // Hitung durasi dalam hari
          const duration = point.start && point.end ? 
            Math.ceil((point.end - point.start) / (1000 * 60 * 60 * 24)) : 0;
          
          // Return HTML tooltip
          return `
            <div style="padding: 8px;">
              <b style="font-size: 14px;">${custom.well || point.name}</b><br/>
              <table style="margin-top: 5px;">
                <tr><td style="padding: 2px 8px 2px 0;"><b>Job:</b></td><td>${custom.job || '-'}</td></tr>
                <tr><td style="padding: 2px 8px 2px 0;"><b>Rig:</b></td><td>${custom.rig || '-'}</td></tr>
                <tr><td style="padding: 2px 8px 2px 0;"><b>Start:</b></td><td>${startDate}</td></tr>
                <tr><td style="padding: 2px 8px 2px 0;"><b>End:</b></td><td>${endDate}</td></tr>
                <tr><td style="padding: 2px 8px 2px 0;"><b>Duration:</b></td><td>${duration} hari</td></tr>
              </table>
            </div>
          `;
        }
      },
      
      // Konfigurasi legend (keterangan)
      legend: {
        enabled: false  // Kita gunakan custom legend di HTML
      },
      
      // Konfigurasi tampilan series/bar
      plotOptions: {
        series: {
          borderRadius: 3,  // Sudut rounded pada bar
          
          // Data labels di dalam bar
          dataLabels: {
            enabled: true,
            format: '{point.custom.job}',  // Tampilkan nama job
            style: {
              fontSize: '10px',
              fontWeight: 'normal',
              textOutline: '1px white'  // Outline putih agar terbaca
            }
          }
        }
      },
      
      // Data series
      series: [{
        name: 'Well Planning',
        data: seriesData
      }],
      
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

    // 6. Buat custom legend untuk rig
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
}
