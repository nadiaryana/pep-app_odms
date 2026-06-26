import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TitleService } from '../../navigation/title/title.service';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-monitoring-rk-chart',
  templateUrl: './monitoring-rk-chart.component.html',
  styleUrls: ['./monitoring-rk.scss']
})
export class MonitoringRKChartComponent implements OnInit {

  @ViewChild('columnChart', { static: true }) columnChartEl: ElementRef;
  @ViewChild('selisihChart', { static: true }) selisihChartEl: ElementRef;

  isLoading: boolean = false;

  chartData: any[] = [];
  chart: any;
  selisihChart: any;

  // Dropdown chart type
  chartTypes: { value: string; label: string }[] = [
    { value: 'non-rigless', label: 'Non-Rigless' },
    { value: 'rigless',     label: 'Rigless' },
  ];
  selectedChartType: string = 'non-rigless';

  constructor(
    private titleService: TitleService,
    private http: HttpClient,
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

    this.loadData();
  }

  onChartTypeChange() {
    this.refreshChart();
  }

  loadData() {
    this.isLoading = true;

    let params = new HttpParams();
    params = params.append('mode', 'chart');
    params = params.append('chart_type', this.selectedChartType);

    this.http.get<any>('/api/pe/MonitoringRK', {
      params: params
    }).subscribe(
      (res) => {
        this.chartData = res.data || [];
        this.renderColumnChart();
        this.isLoading = false;
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

    const chartTypeLabel = this.selectedChartType === 'rigless' ? 'Rigless' : 'Non-Rigless';

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
      tooltip: {
        shared: true,
        valueDecimals: 2
      },
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
            linearGradient: [0, 0, 0, 300],
            stops: [
              [0, '#81D4FA'],
              [1, '#406AAF']
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
          color: '#03A9F4',
          dataLabels: { 
            enabled: true, 
            format: '⛽<br>{y} mmscfd', 
            style: { fontSize: '10px' }, 
            // rotation: 90, 
            y: -5 
          }
        },
        {
          name: 'Realisasi Oil', 
          data: realisasiOilData, 
          color: '#659287',
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
          color: '#8BC34A',
          dataLabels: { 
            enabled: true, 
            format: '⛽<br>{y} mmscfd', 
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
      tooltip: {
        shared: true,
        valueDecimals: 2,
        valueSuffix: '%'
      },
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
          color: '#26A69A',
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
          color: '#7132CA',
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

  refreshChart() {
    this.loadData();
  }

}
