import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TitleService } from '../../navigation/title/title.service';
import * as Highcharts from 'highcharts';
import { FormControl } from '@angular/forms';
import { MatDatepicker } from '@angular/material';
import { SnackbarApi, SnackbarService } from 'src/app/snackbar.service';
import html2canvas from 'html2canvas';

// Highcharts Gantt: modul terpisah dari Highcharts core,
// digunakan untuk membuat Gantt chart (timeline horizontal)
declare var require: any;
const HighchartsGantt      = require('highcharts/highcharts-gantt');
const HighchartsExporting  = require('highcharts/modules/exporting');

// Aktifkan modul exporting (download PNG/PDF/SVG via context menu)
if (typeof HighchartsExporting === 'function') {
  HighchartsExporting(HighchartsGantt);
}

@Component({
  selector: 'app-barchart-chart',
  templateUrl: './barchart-chart.component.html',
  styleUrls: ['./barchart.scss']
})
export class BarchartChartComponent implements OnInit, AfterViewInit {

  // ── ViewChild references ──────────────────────────────────────────────────
  @ViewChild('ganttChart', { static: true }) ganttChartEl: ElementRef;
  @ViewChild('start_datePicker', { static: true }) start_datePicker: MatDatepicker<any>;
  @ViewChild('end_datePicker',   { static: true }) end_datePicker:   MatDatepicker<any>;

  // ── Date picker controls ──────────────────────────────────────────────────
  start_dateControl = new FormControl();
  start_dateInput   = '';
  end_dateControl   = new FormControl();
  end_dateInput     = '';

  // ── State flags ───────────────────────────────────────────────────────────
  isLoading:    boolean = false;  // menampilkan spinner saat fetch data
  isCapturing:  boolean = false;  // menyembunyikan UI saat proses screenshot

  // ── Data ──────────────────────────────────────────────────────────────────
  chartData: any[] = [];   // data dari API
  chart:     any;          // instance Highcharts Gantt
  jobLegend: any[] = [];   // list job untuk custom legend di HTML

  // ── Warna per job (key = lowercase) ──────────────────────────────────────
  jobColors: { [key: string]: string } = {
    'workover':          '#00B050',
    'reparasi':          '#76933C',
    'well services':     '#ffff00',
    'fracturing':        '#00b0f0',
    'stimulasi':         '#1C4D8D',
    'reaktivasi':        '#f7a35c',
    'eor':               '#C4BD97',
    'optimasi':          '#92D050',
    'injeksi':           '#366092',
    'hoist repair':      '#FF0000',
    'hoist idle':        '#B1A0C7',
    'hoist mobilization':'#E4DFEC',
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
    const { wellSeries, remarkSeries, categories, cellHeight } = this.reformatDataGantt();

    // 1. mapping warna untuk setiap Job sudah ada di jobColors property
    // Tidak perlu mapping ulang karena sudah didefinisikan di class property

    // 2. Simpan reference ke component untuk digunakan di tooltip
    const self = this;

    // 3. Hitung lebar chart berdasarkan range tanggal
    const allDates = [...wellSeries.map(d => d.start), ...wellSeries.map(d => d.end)];
    const minDate = Math.min(...allDates);
    const maxDate = Math.max(...allDates);
    const daysDiff = Math.ceil((maxDate - minDate) / (24 * 3600 * 1000));
    
    // Minimal 30px per hari, agar label tetap terlihat
    const minWidthPerDay = 30;
    const scrollableWidth = Math.max(1200, daysDiff * minWidthPerDay);

    //Gunakan tanggal filter user
    const filterStartDate = this.start_dateControl.value ? Date.UTC(
      this.start_dateControl.value.getFullYear(),
      this.start_dateControl.value.getMonth(),
      this.start_dateControl.value.getDate(),
    ) : minDate;
  
    const filterEndDate = this.end_dateControl.value ? Date.UTC(
      this.end_dateControl.value.getFullYear(),
      this.end_dateControl.value.getMonth(),
      this.end_dateControl.value.getDate(),
    ) + (24 * 60 * 60 * 1000) : maxDate;


    // 4. Buat dan render chart dengan Highcharts Gantt
    this.chart = HighchartsGantt.ganttChart(this.ganttChartEl.nativeElement, {
      
      // Konfigurasi chart container
      chart: {
        // chart.height = jumlah kategori × tinggi baris + overhead untuk header/axis
        height: Math.max(400, categories.length * cellHeight + 300),
        // Full width - ikut container
        width: null,
        scrollablePlotArea: {
          minWidth: scrollableWidth,
          scrollPositionX: 0
        },
        style: {
          fontFamily: 'Roboto, "Helvetica Neue", sans-serif'
        },
        spacingTop: 0,
        // marginTop: 90
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
          top: 150,
          min: filterStartDate,
          max: filterEndDate,

          tickInterval: 24 * 3600 * 1000, // 1 hari = 1 kolom

          labels: {
            y: -2,
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
          top: 145,

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
      
      // Konfigurasi sumbu Y (kategori rig)
      yAxis: {
        top: 180,
        type: 'category',
        categories: categories,
        grid: {
          backgroundColor: "#ffffff",
          columns: [{
            title: {
              text: 'RIG'  // Header kolom
            },
            categories: categories
          }],
          // cellHeight global — berdasarkan rig dengan remarks terpanjang
          cellHeight: cellHeight
        },
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
              <div style="padding: 8px; min-width: 300px;">
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
            <div style="padding: 8px; min-width: 300px;">
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
              // well bar tipis di bagian atas cell
              pointWidth: 35,
              pointPlacement: -0.35,
              borderRadius: 4,
              minPointLength: 10,

              dataLabels: {
                enabled: true,
                align: 'center',
                verticalAlign: 'middle',
                y: 0,
                format: '{point.name}',
                style: {
                  fontSize: '15px',
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
              // remarks bar lebih besar, di bagian bawah cell
              pointWidth: 30,
              pointPlacement: 0.05,
              borderRadius: 0,
              minPointLength: 10,
              dataLabels: {
                verticalAlign: 'middle',
                y: 0,
                enabled: true,
                useHTML: true,
                inside: false,
                allowOverlap: true,
                alignTo: 'plotEdges',

                formatter: function () {
                    const point: any = this.point;
                    const text = point.name || '';

                    // Escape HTML characters untuk keamanan
                    const safe = String(text)
                      .replace(/&/g, '&amp;')
                      .replace(/</g, '&lt;')
                      .replace(/>/g, '&gt;')
                      .replace(/"/g, '&quot;');

                    // Estimasi lebar bar dalam pixel
                    const dayMs = 24 * 3600 * 1000;
                    const estimatedDayPx = 30;
                    const widthPx =
                      point.shapeArgs && point.shapeArgs.width
                      ? point.shapeArgs.width
                      : (point.end && point.start ? Math.max(0, (point.end - point.start) / dayMs * estimatedDayPx) : 0);

                    // Jika bar terlalu sempit, sembunyikan label
                    if (widthPx < 40) {
                      return '';
                    }

                    // Untuk bar sempit: tampilkan full text wrap
                    if (widthPx < 100) {
                      return `
                        <div title="${safe}" style="
                          width: ${Math.max(30, Math.floor(widthPx - 12))}px;
                          overflow: visible;
                          white-space: normal;
                          word-break: break-word;
                          font-size: 13px;
                          color: #333;
                          text-align: center;
                          padding: 0 6px;
                          box-sizing: border-box;">
                          ${safe.replace(/\n/g, '<br>')}
                        </div>`;
                    }

                    // Untuk bar cukup lebar: tampilkan full multi-line tanpa clamp
                    const remarks   = safe.replace(/\n/g, '<br>');
                    const textAlign = text.length > 150 ? 'left' : 'center';
                    return `
                      <div title="${safe}" style="
                        width: ${Math.max(80, Math.floor(widthPx - 16))}px;
                        overflow: visible;
                        font-size: 13px;
                        line-height: 16px;
                        color: #333;
                        text-align: ${textAlign};
                        white-space: normal;
                        word-break: break-word;
                        padding: 0 8px;
                        box-sizing: border-box;
                        margin: 0;">
                        ${remarks}
                      </div>`;
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
        enabled: false,
        series: {
          type: 'gantt',
          pointWidth: 1
        },
        yAxis: {
          reversed: true,
          categories: []
        }
      },

      // Scrollbar horizontal
      scrollbar: {
        enabled: false
      },

      
      // Range selector 
      rangeSelector: {
        enabled: true,
        floating: true,
        
        verticalAlign: 'top',
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
    return this.jobColors[job.trim().toLowerCase()] || '#bfbfbf';
  }

  // ── Screenshot ────────────────────────────────────────────────────────────
  // Capture seluruh area chart (termasuk bagian yang di-scroll) ke PNG.
  // Highcharts Gantt memakai .highcharts-scrolling dengan overflow:hidden
  // sehingga html2canvas perlu "onclone" untuk meng-expand semua container
  // di dokumen tiruan sebelum di-render — tanpa mengubah live DOM.
  screenshotChart() {
    const chartEl = this.ganttChartEl.nativeElement as HTMLElement;

    // Tampilkan loading di tombol, sembunyikan toolbar & legend via [hidden]="isCapturing"
    this.isCapturing = true;

    // Tunggu 300ms agar Angular selesai meng-apply [hidden] ke DOM
    setTimeout(() => {

      // Ambil lebar penuh dari scrollable area Highcharts
      // (lebih lebar dari container karena ada scroll horizontal)
      const scrollingEl = chartEl.querySelector('.highcharts-scrolling') as HTMLElement;
      const fullWidth   = scrollingEl ? scrollingEl.scrollWidth : chartEl.scrollWidth;
      const fullHeight  = chartEl.scrollHeight;

      html2canvas(chartEl, {
        backgroundColor: '#ffffff',
        useCORS:     true,
        allowTaint:  true,
        scale:       2,           // 2x resolusi untuk tampilan lebih tajam
        width:       fullWidth,
        height:      fullHeight,
        windowWidth: fullWidth,
        windowHeight:fullHeight,
        scrollX:     0,
        scrollY:     -window.scrollY,

        // onclone: di sinilah kita expand container Highcharts di dokumen tiruan
        // supaya html2canvas merender seluruh lebar chart, bukan hanya area visible
        onclone: (_doc: Document, clonedEl: HTMLElement) => {
          const expand = (el: HTMLElement | SVGElement | null, isSvg = false) => {
            if (!el) return;
            (el as HTMLElement).style.overflow = 'visible';
            (el as HTMLElement).style.width    = fullWidth + 'px';
            (el as HTMLElement).style.minWidth = fullWidth + 'px';
            (el as HTMLElement).style.maxWidth = 'none';
            // SVG root butuh attribute 'width' tersendiri (bukan hanya CSS)
            if (isSvg) (el as SVGElement).setAttribute('width', String(fullWidth));
          };

          expand(clonedEl.querySelector('.highcharts-scrolling'));
          expand(clonedEl.querySelector('.highcharts-scrolling-parent'));
          expand(clonedEl.querySelector('.highcharts-container'));
          expand(clonedEl.querySelector('.highcharts-root'), true);   // SVG
          expand(clonedEl);  // wrapper paling luar
        }

      }).then((canvas: HTMLCanvasElement) => {
        // Unduh hasilnya sebagai PNG dengan nama berdasarkan tanggal hari ini
        const link      = document.createElement('a');
        link.download   = `barchart-gantt-${new Date().toISOString().slice(0, 10)}.png`;
        link.href       = canvas.toDataURL('image/png');
        link.click();

      }).catch((err: any) => {
        console.error('Screenshot error:', err);

      }).finally(() => {
        // Kembalikan UI ke normal setelah selesai (berhasil maupun gagal)
        this.isCapturing = false;
      });

    }, 300);
  }

  // ── Reformat data untuk Highcharts Gantt ─────────────────────────────────
  private reformatDataGantt() {

    const wellSeries:    any[]   = [];
    const remarkSeries:  any[]   = [];
    const categories:    string[] = [];
    const rigLevels:     { [rig: string]: any[] } = {};
    const grouped:       { [rig: string]: any[] } = {};

    // Konstanta layout baris
    const BASE_HEIGHT    = 50;   // tinggi minimum baris (px)
    const LINE_HEIGHT    = 14;   // tinggi per baris teks remarks (px)
    const CHARS_PER_LINE = 35;   // estimasi karakter per baris (font 13px)

    // Kelompokkan data per nama rig
    this.chartData.forEach(d => {
      if (!d.rig) return;
      if (!grouped[d.rig]) grouped[d.rig] = [];
      grouped[d.rig].push(d);
    });

    // Hitung baris remarks terpanjang per rig untuk menentukan tinggi baris global.
    // Setiap newline dihitung sebagai baris baru, lalu setiap segmen di-wrap
    // berdasarkan estimasi lebar karakter (CHARS_PER_LINE).
    const maxLinesPerRig: { [rig: string]: number } = {};
    Object.keys(grouped).forEach(rig => {
      let maxL = 1;
      grouped[rig].forEach(job => {
        const lines = (job.remarks || '').split('\n').reduce((sum: number, seg: string) =>
          sum + Math.max(1, Math.ceil(seg.length / CHARS_PER_LINE)), 0) || 1;
        if (lines > maxL) maxL = lines;
      });
      maxLinesPerRig[rig] = maxL;
    });

    // cellHeight global — satu nilai untuk semua baris agar grid konsisten
    const globalMaxLines = Math.max(...Object.values(maxLinesPerRig), 1);
    const cellHeight     = BASE_HEIGHT + (globalMaxLines * LINE_HEIGHT);

    // Assign y-index per rig dengan overlap detection.
    // Jika ada 2 job dalam rig yang waktunya bertabrakan, job kedua
    // diletakkan di "level" lebih tinggi (sub-baris baru di rig yang sama).
    let globalIndex = 0;

    Object.keys(grouped).forEach(rig => {
      rigLevels[rig] = [];

      // Sort by start date agar overlap detection deterministik
      const jobs = [...grouped[rig]].sort((a, b) =>
        new Date(a.plan_start).getTime() - new Date(b.plan_start).getTime()
      );

      jobs.forEach(job => {
        // Konversi string tanggal ke UTC midnight agar tidak bergeser karena timezone
        const rawStart  = new Date(job.plan_start);
        const rawEnd    = new Date(job.plan_end);
        const start     = Date.UTC(rawStart.getUTCFullYear(), rawStart.getUTCMonth(), rawStart.getUTCDate());
        const endActual = Date.UTC(rawEnd.getUTCFullYear(),   rawEnd.getUTCMonth(),   rawEnd.getUTCDate());
        const endForBar = endActual + 24 * 3600 * 1000; // +1 hari: bar mencakup seluruh hari terakhir

        // Cari level terendah yang tidak overlap dengan job lain di rig ini
        let level = 0;
        while (rigLevels[rig].find(t => t.level === level && !(endForBar <= t.start || start >= t.end))) {
          level++;
        }
        rigLevels[rig].push({ start, end: endForBar, level });

        const y        = globalIndex + level;  // posisi vertikal di chart
        const jobColor = this.getJobColor(job.job);

        // Well bar — ditampilkan di atas, label = nama sumur
        wellSeries.push({
          name: job.well,
          start, end: endForBar, y,
          color: jobColor,
          custom: { label: job.well, rig: job.rig, job: job.job, remarks: job.remarks, actualEnd: endActual }
        });

        // Remarks bar — ditampilkan di bawah well bar, warna putih (background)
        remarkSeries.push({
          name: job.remarks,
          start, end: endForBar, y,
          color: '#FFFFFF',
          custom: { label: job.remarks, well: job.well, rig: job.rig, job: job.job, actualEnd: endActual }
        });
      });

      // Category: nama rig di slot pertama, string kosong untuk sub-baris overlap
      const maxLevel = Math.max(...rigLevels[rig].map(x => x.level), 0);
      for (let i = 0; i <= maxLevel; i++) {
        categories.push(i === 0 ? rig : '');
      }
      globalIndex += maxLevel + 1;
    });

    return { wellSeries, remarkSeries, categories, cellHeight };
  }
}
