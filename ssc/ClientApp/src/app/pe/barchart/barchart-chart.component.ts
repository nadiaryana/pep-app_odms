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

  @ViewChild('ganttChart', { static: true }) ganttChartEl: ElementRef;
  @ViewChild('start_datePicker', { static: true }) start_datePicker: MatDatepicker<any>;
  @ViewChild('end_datePicker',   { static: true }) end_datePicker:   MatDatepicker<any>;


  start_dateControl = new FormControl();
  start_dateInput   = '';
  end_dateControl   = new FormControl();
  end_dateInput     = '';


  isLoading:    boolean = false;  
  isCapturing:  boolean = false;  // menyembunyikan UI saat proses screenshot

  activeRange: string = '1m';


  chartData: any[] = [];   
  chart:     any;          // instance Highcharts Gantt
  jobLegend: any[] = [];  


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


  ngAfterViewInit() {
    this.loadData();
  }
  

  loadData() {
    if (!this.start_dateControl.value || !this.end_dateControl.value) {
      return;
    }

    this.isLoading = true;

    let params = new HttpParams();
    params = params.append('start_date', this.start_dateControl.value.toISOString());
    params = params.append('end_date', this.end_dateControl.value.toISOString());

    params = params.append('mode', 'chart');

    this.http.get<any>('/api/pe/barchart', {
      params: params
    }).subscribe(
      (res) => {
        this.chartData = res.data || [];

        this.renderGanttChart();
        
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading data:', error);
        this.isLoading = false;
      }
    );
  }

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


  renderGanttChart() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }

    if (!this.chartData || this.chartData.length === 0) {
      this.jobLegend = [];
      return;
    }
    const { wellSeries, remarkSeries, categories, cellHeight } = this.reformatDataGantt();

    const self = this;

    // Hitung lebar chart berdasarkan range tanggal
    const allDates = [...wellSeries.map(d => d.start), ...wellSeries.map(d => d.end)];
    const minDate = Math.min(...allDates);
    const maxDate = Math.max(...allDates);
    const daysDiff = Math.ceil((maxDate - minDate) / (24 * 3600 * 1000));
    
    // Minimal 30px per hari, agar label tetap terlihat
    const minWidthPerDay = 30;
    const scrollableWidth = Math.max(1200, daysDiff * minWidthPerDay);

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


    this.chart = HighchartsGantt.ganttChart(this.ganttChartEl.nativeElement, {

      chart: {
        // chart.height = jumlah kategori × tinggi baris + overhead untuk header/axis
        height: Math.max(400, categories.length * cellHeight + 300),
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
      title: {
        text: 'BARCHART RIG SANGATTA FIELD',
        style: {
          fontSize: '18px',
          fontWeight: 'bold'
        }
      },
      xAxis: [
        {
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
        {
          type: 'datetime',
          linkedTo: 0,
          top: 145,

          tickInterval: 30 * 24 * 3600 * 1000, 
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
          cellHeight: cellHeight
        },
      },
      tooltip: {
        useHTML: true, 
        style: {
          pointerEvents: 'auto'
        },
        formatter() {
          const p: any = this.point;
          const custom = p.custom || {};
          
          const remarks = custom.remarks ? custom.remarks.replace(/\n/g, '<br>') : '';
          const label = custom.label ? custom.label.replace(/\n/g, '<br>') : '';
          
          const displayEnd = custom.actualEnd || (p.end - (24 * 60 * 60 * 1000));
          
          //well
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
          
          // Remarks
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
           //bar well
            {
              name: 'Well',
              pointPadding: 0,
              groupPadding: 0,
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

            //remarks bar
            {
              name: 'Remarks',
              pointPadding: 0,
              groupPadding: 0,
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

                    if (widthPx < 40) {
                      return '';
                    }

                    // tampilkan full text wrap
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

                    // tampilkan full multi-line tanpa clamp
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
      legend: {
        enabled: false  
      },
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
      scrollbar: {
        enabled: false
      },
 
      rangeSelector: {
        enabled: false,
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
      credits: {
        enabled: false
      },
      exporting: {
        enabled: true,
        buttons: {
          contextButton: {
            menuItems: [
              'downloadPNG',   
              'downloadJPEG',  
              'downloadPDF',   
              'downloadSVG'    
            ]
          }
        }
      }
    });
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


  createJobLegend() {
    const jobs = Array.from(new Set(this.chartData.map(item => (item.job || 'Unknown').toString().trim().toLowerCase())));
    this.jobLegend = jobs.map(jobKey => ({
      name: jobKey,
      color: this.getJobColor(jobKey)
    }));
  }

  refreshChart() {
    this.loadData();
  }

  getJobColor(job: string): string {
    if (!job) return '#bfbfbf';
    return this.jobColors[job.trim().toLowerCase()] || '#bfbfbf';
  }

  setRange(range: string) {
    this.activeRange = range;
    if (!this.chart) return;

    const endDate = this.end_dateControl.value
      ? new Date(this.end_dateControl.value)
      : new Date();

    const startDate = this.start_dateControl.value
      ? new Date(this.start_dateControl.value)
      : new Date();

    let zoomStart: number;
    let zoomEnd: number;

    switch (range) {
      case '1m':
        zoomEnd   = Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
        zoomStart = Date.UTC(endDate.getFullYear(), endDate.getMonth() - 1, endDate.getDate());
        break;

      case '2m':
        zoomEnd   = Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
        zoomStart = Date.UTC(endDate.getFullYear(), endDate.getMonth() - 2, endDate.getDate());
        break;

      case '3m':
        zoomEnd   = Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
        zoomStart = Date.UTC(endDate.getFullYear(), endDate.getMonth() - 3, endDate.getDate());
        break;

      case 'all':
      default:
        zoomStart = Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
        zoomEnd   = Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()) 
                    + (24 * 60 * 60 * 1000);
        break;
    }

    // Clamp: jangan keluar dari filter range yang dipilih user
    const filterStart = Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const filterEnd   = Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()) 
                        + (24 * 60 * 60 * 1000);

    zoomStart = Math.max(zoomStart, filterStart);
    zoomEnd   = Math.min(zoomEnd, filterEnd);

    this.chart.xAxis[0].setExtremes(zoomStart, zoomEnd, true, false);
  }

  // screenshotChart() {
  //   const chartEl = this.ganttChartEl.nativeElement as HTMLElement;

  //   this.isCapturing = true;

  //   setTimeout(() => {
  //     const scrollingEl = chartEl.querySelector('.highcharts-scrolling') as HTMLElement;
  //     const fullWidth   = scrollingEl ? scrollingEl.scrollWidth : chartEl.scrollWidth;
  //     const fullHeight  = chartEl.scrollHeight;

  //     const axes = chartEl.querySelectorAll('.highcharts-axis.highcharts-xaxis');
  //     const monthAxis = axes && axes.length > 1 ? axes[1] as HTMLElement : null;
      
  //     let headerTop = 120;

  //     if (monthAxis) {
  //       const rectParent = chartEl.getBoundingClientRect();
  //       const rectAxis   = axes[1].getBoundingClientRect();

  //       headerTop = rectAxis.top - rectParent.top;
  //     }


  //     html2canvas(chartEl, {
  //       backgroundColor: '#ffffff',
  //       useCORS:     true,
  //       allowTaint:  true,
  //       scale:       2,           
  //       width:       fullWidth,
  //       height:      fullHeight - headerTop,
  //       x: 0,
  //       y: headerTop,
  //       windowWidth: fullWidth,
  //       windowHeight:fullHeight,
  //       scrollX:     0,
  //       scrollY:     -window.scrollY,

  //       // onclone: expand container Highcharts di dokumen tiruan
  //       // html2canvas merender seluruh lebar chart
  //       onclone: (_doc: Document, clonedEl: HTMLElement) => {
  //         const expand = (el: HTMLElement | SVGElement | null, isSvg = false) => {
  //           if (!el) return;
  //           (el as HTMLElement).style.overflow = 'visible';
  //           (el as HTMLElement).style.width    = fullWidth + 'px';
  //           (el as HTMLElement).style.minWidth = fullWidth + 'px';
  //           (el as HTMLElement).style.maxWidth = 'none';
  //           if (isSvg) (el as SVGElement).setAttribute('width', String(fullWidth));
  //         };

  //         expand(clonedEl.querySelector('.highcharts-scrolling'));
  //         expand(clonedEl.querySelector('.highcharts-scrolling-parent'));
  //         expand(clonedEl.querySelector('.highcharts-container'));
  //         expand(clonedEl.querySelector('.highcharts-root'), true);   
  //         expand(clonedEl);  

  //         const axisTitles = clonedEl.querySelectorAll('.highcharts-axis-title');
  //         axisTitles.forEach((el) => {
  //           const svgEl = el as SVGTextElement;
  //           const currentY = parseFloat(svgEl.getAttribute('y') || '0');
  //           svgEl.setAttribute('y', String(currentY - headerTop));
  //         });
          
  //       }
        

  //     }).then((canvas: HTMLCanvasElement) => {
  //       const link      = document.createElement('a');
  //       link.download   = `barchart-gantt-${new Date().toISOString().slice(0, 10)}.png`;
  //       link.href       = canvas.toDataURL('image/png');
  //       link.click();

  //     }).catch((err: any) => {
  //       console.error('Screenshot error:', err);

  //     }).finally(() => {
  //       this.isCapturing = false;
  //     });

  //   }, 300);
  // }

  screenshotChart() {
    const chartEl = this.ganttChartEl.nativeElement as HTMLElement;
    this.isCapturing = true;

    setTimeout(() => {
      //Ukur area chart
      const scrollingEl    = chartEl.querySelector('.highcharts-scrolling') as HTMLElement;
      const fullWidth      = scrollingEl ? scrollingEl.scrollWidth : chartEl.scrollWidth;
      const fullHeight     = chartEl.scrollHeight;
      // Posisi kiri area scrollable (= lebar kolom fixed yAxis di sisi kiri)
      const innerOffset    = scrollingEl ? (scrollingEl.offsetLeft || 0) : 0;

      
      const axes      = chartEl.querySelectorAll('.highcharts-axis.highcharts-xaxis');
      const monthAxis = axes && axes.length > 1 ? axes[1] as HTMLElement : null;
      let headerTop   = 120;
      if (monthAxis) {
        const rectParent = chartEl.getBoundingClientRect();
        const rectAxis   = axes[1].getBoundingClientRect();
        headerTop        = rectAxis.top - rectParent.top;
      }

      const cropHeight = fullHeight - headerTop;

      // Lebar kolom RIG (yAxis grid column kiri)
      const yAxisGrid  = chartEl.querySelector('.highcharts-yaxis-grid') as SVGElement;
      const rigColEl   = chartEl.querySelector('.highcharts-grid-line') as SVGElement;

      // Cari lebar kolom RIG dari elemen yAxis label
      let rigColumnWidth = 150; // fallback default
      // const yAxisEl = chartEl.querySelector('.highcharts-yaxis') as SVGElement;
      // if (yAxisEl) {
      //   const yBBox = typeof (yAxisEl as any).getBBox === 'function' 
      //   ? (yAxisEl as any).getBBox() 
      //   : null;
      //   if (yBBox && yBBox.width > 0) rigColumnWidth = Math.ceil(yBBox.width) + 2;
      // }
      const yAxisLabels = chartEl.querySelectorAll('.highcharts-yaxis-labels text');
      if (yAxisLabels && yAxisLabels.length > 0) {
        try {
          const firstLabel = yAxisLabels[0] as SVGTextElement;
          const bbox = firstLabel.getBoundingClientRect();
          const chartRect = chartEl.getBoundingClientRect();
          // Lebar kolom = posisi kanan label + padding
          rigColumnWidth = Math.ceil(bbox.right - chartRect.left) + 10;
        } catch (e) {}
      }

      const gridColumnTitle = chartEl.querySelector('.highcharts-grid-line') as SVGElement;
      if (rigColumnWidth <= 150) {
        try {
          const yAxisEl = chartEl.querySelector('.highcharts-yaxis') as SVGElement;
          const yBBox = typeof (yAxisEl as any).getBBox === 'function'
            ? (yAxisEl as any).getBBox()
            : null;
          if (yBBox && yBBox.width > 0) rigColumnWidth = Math.ceil(yBBox.width) + 20;
        } catch (e) {}
      }

      // Canvas 1: Kolom RIG (fixed left)
      const rigOptions = {
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: true,
        scale: 2,
        width:  rigColumnWidth,
        height: cropHeight,
        x: 0,
        y: headerTop,
        windowWidth: fullWidth,
        windowHeight: fullHeight,
        scrollX: 0,
        scrollY: -window.scrollY,
        onclone: (_doc: Document, clonedEl: HTMLElement) => {
          // Pastikan SVG cukup lebar untuk dirender
          const svg = clonedEl.querySelector('.highcharts-root') as SVGElement;
          if (svg) svg.setAttribute('width', String(fullWidth));
          const container = clonedEl.querySelector('.highcharts-container') as HTMLElement;
          if (container) { container.style.width = fullWidth + 'px'; container.style.overflow = 'visible'; }
          const scrolling = clonedEl.querySelector('.highcharts-scrolling') as HTMLElement;
          if (scrolling) { scrolling.style.overflow = 'visible'; scrolling.style.width = fullWidth + 'px'; }
          // Reset scroll ke posisi 0 (kolom RIG ada di kiri)
          if (scrolling) scrolling.scrollLeft = 0;
        }
      };

      // Canvas 2: Full chart (seluruh lebar scroll) — tanpa yAxis
      const chartOptions = {
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: true,
        scale: 2,
        width:  fullWidth,
        height: cropHeight,
        x: 0,
        y: headerTop,
        windowWidth: fullWidth,
        windowHeight: fullHeight,
        scrollX: 0,
        scrollY: -window.scrollY,
        onclone: (_doc: Document, clonedEl: HTMLElement) => {
          const expand = (el: HTMLElement | SVGElement | null, isSvg = false) => {
            if (!el) return;
            (el as HTMLElement).style.overflow  = 'visible';
            (el as HTMLElement).style.width     = fullWidth + 'px';
            (el as HTMLElement).style.minWidth  = fullWidth + 'px';
            (el as HTMLElement).style.maxWidth  = 'none';
            if (isSvg) (el as SVGElement).setAttribute('width', String(fullWidth));
          };
          expand(clonedEl.querySelector('.highcharts-scrolling'));
          expand(clonedEl.querySelector('.highcharts-scrolling-parent'));
          expand(clonedEl.querySelector('.highcharts-container'));
          expand(clonedEl.querySelector('.highcharts-root'), true);
          expand(clonedEl);

          const axisTitles = clonedEl.querySelectorAll('.highcharts-axis-title');
          axisTitles.forEach((el) => {
            const svgEl     = el as SVGTextElement;
            const currentY  = parseFloat(svgEl.getAttribute('y') || '0');
            svgEl.setAttribute('y', String(currentY - headerTop));
          });

          // Sembunyikan SEMUA elemen yAxis dari KEDUA SVG menggunakan SVG-native display attribute
          // (lebih andal dari CSS visibility:hidden untuk elemen SVG <g>)
          clonedEl.querySelectorAll(
            '.highcharts-yaxis-labels, .highcharts-yaxis-grid, .highcharts-yaxis, .highcharts-yaxis-title'
          ).forEach((el: Element) => {
            (el as SVGElement).setAttribute('display', 'none');
            (el as HTMLElement).style.display = 'none';
          });

          // Reset scrollLeft agar inner SVG tidak ter-offset saat dirender
          const sc = clonedEl.querySelector('.highcharts-scrolling') as HTMLElement;
          if (sc) sc.scrollLeft = 0;
        }
      };

      Promise.all([
        html2canvas(chartEl, rigOptions as any),
        html2canvas(chartEl, chartOptions as any),
      ]).then(([rigCanvas, chartCanvas]) => {

        const scale        = 2;
        const totalWidth   = fullWidth * scale;
        const totalHeight  = cropHeight * scale;

        // Canvas final gabungan
        const finalCanvas  = document.createElement('canvas');
        finalCanvas.width  = totalWidth;
        finalCanvas.height = totalHeight;
        const ctx          = finalCanvas.getContext('2d')!;

        ctx.drawImage(chartCanvas, 0, 0);

        // Tutup area kolom RIG dengan warna putih (hapus konten lama yang mungkin bergeser)
        const coverWidth = (rigColumnWidth + 20) * scale;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, rigColumnWidth * scale, totalHeight);

        // Gambar ulang kolom RIG di atas (dari canvas terpisah yang scroll=0)
        ctx.drawImage(
          rigCanvas,
          0, 0, rigColumnWidth * scale, totalHeight, // source rect dari rigCanvas
          0, 0, rigColumnWidth * scale, totalHeight  // dest rect di finalCanvas
        );

        const link        = document.createElement('a');
        link.download     = `barchart-gantt-${new Date().toISOString().slice(0, 10)}.png`;
        link.href         = finalCanvas.toDataURL('image/png');
        link.click();

      }).catch((err: any) => {
        console.error('Screenshot error:', err);
      }).finally(() => {
        this.isCapturing = false;
      });

    }, 300);
  }

  private reformatDataGantt() {

    const wellSeries:    any[]   = [];
    const remarkSeries:  any[]   = [];
    const categories:    string[] = [];
    const rigLevels:     { [rig: string]: any[] } = {};
    const grouped:       { [rig: string]: any[] } = {};


    const BASE_HEIGHT    = 50;   
    const LINE_HEIGHT    = 14;   
    const CHARS_PER_LINE = 35;   

    // Kelompokkan data per nama rig
    this.chartData.forEach(d => {
      if (!d.rig) return;
      if (!grouped[d.rig]) grouped[d.rig] = [];
      grouped[d.rig].push(d);
    });


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

    const globalMaxLines = Math.max(...Object.values(maxLinesPerRig), 1);
    const cellHeight     = BASE_HEIGHT + (globalMaxLines * LINE_HEIGHT);

    let globalIndex = 0;

    Object.keys(grouped).forEach(rig => {
      rigLevels[rig] = [];

      const jobs = [...grouped[rig]].sort((a, b) =>
        new Date(a.plan_start).getTime() - new Date(b.plan_start).getTime()
      );

      jobs.forEach(job => {

        const rawStart  = new Date(job.plan_start);
        const rawEnd    = new Date(job.plan_end);
        const start     = Date.UTC(rawStart.getUTCFullYear(), rawStart.getUTCMonth(), rawStart.getUTCDate());
        const endActual = Date.UTC(rawEnd.getUTCFullYear(),   rawEnd.getUTCMonth(),   rawEnd.getUTCDate());
        const endForBar = endActual + 24 * 3600 * 1000; 


        let level = 0;
        while (rigLevels[rig].find(t => t.level === level && !(endForBar <= t.start || start >= t.end))) {
          level++;
        }
        rigLevels[rig].push({ start, end: endForBar, level });

        const y        = globalIndex + level;  //posisi vertikal
        const jobColor = this.getJobColor(job.job);

        // Well bar 
        wellSeries.push({
          name: job.well,
          start, end: endForBar, y,
          color: jobColor,
          custom: { label: job.well, rig: job.rig, job: job.job, remarks: job.remarks, actualEnd: endActual }
        });

        // Remarks bar 
        remarkSeries.push({
          name: job.remarks,
          start, end: endForBar, y,
          color: '#FFFFFF',
          custom: { label: job.remarks, well: job.well, rig: job.rig, job: job.job, actualEnd: endActual }
        });
      });

      const maxLevel = Math.max(...rigLevels[rig].map(x => x.level), 0);
      for (let i = 0; i <= maxLevel; i++) {
        categories.push(i === 0 ? rig : '');
      }
      globalIndex += maxLevel + 1;
    });

    return { wellSeries, remarkSeries, categories, cellHeight };
  }
}
