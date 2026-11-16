import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import * as Highcharts from 'highcharts';
import exporting from 'highcharts/modules/exporting';
import offline from 'highcharts/modules/offline-exporting';

exporting(Highcharts);
offline(Highcharts);

import { TitleService } from '../../navigation/title/title.service';

interface IotChartPoint {
  date: string;
  arus: number;
}

@Component({
  selector: 'app-pe-iot-chart',
  templateUrl: './pe-iot-chart.component.html',
  styleUrls: ['./pe-iot-chart.component.scss']
})
export class PeIotChartComponent implements OnInit, OnDestroy {

  @ViewChild('iot_chart_el', { static: false }) public iotChartEl: ElementRef;
  chart: Highcharts.Chart | null = null;
  private renderToken = 0;

  wells: string[] = [];
  wellControl = new FormControl(null);
  startDateControl = new FormControl(this.startOfDay(new Date()));
  endDateControl = new FormControl(this.endOfDay(new Date()));

  isLoadingResults = false;
  errorMessage = '';
  totalPoints = 0;

  constructor(
    private http: HttpClient,
    private titleService: TitleService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.titleService.titleSource.next({
      title: 'Current IoT Chart',
      icon: 'bar_chart',
      breadcrumbs: [
        { label: 'Petroleum Engineering', routerLink: '' },
        { label: 'Monitoring IoT Arus', routerLink: 'pe/iot' },
        { label: 'Chart', routerLink: '' }
      ]
    });

    this.wellControl.valueChanges.subscribe(() => this.loadChart());
    this.startDateControl.valueChanges.subscribe(() => this.loadChart());
    this.endDateControl.valueChanges.subscribe(() => this.loadChart());

    this.loadWells();
  }

  ngOnDestroy() {
    this.destroyChart();
  }

 
  private loadWells() {
    this.http.get<string[]>('/api/arus/wells').subscribe(
      (wells) => {
        this.wells = (wells || []).slice().sort();
        if (this.wells.length) {
          // Sumur yang sedang dibuka di tabel dikirim lewat query param
          const requested = this.route.snapshot.queryParamMap.get('well');
          const selected = requested && this.wells.indexOf(requested) !== -1 ? requested : this.wells[0];
          // setValue memicu loadChart lewat valueChanges
          this.wellControl.setValue(selected);
        } else {
          this.errorMessage = 'Belum ada data dari perangkat IoT.';
        }
      },
      (err) => {
        this.errorMessage = 'Gagal memuat daftar sumur.';
        console.error('Gagal memuat daftar sumur IoT', err);
      }
    );
  }


  loadChart() {
    const well = this.wellControl.value;
    const start = this.startDateControl.value;
    const end = this.endDateControl.value;

    if (!well || !start || !end) { return; }

    if (this.endOfDay(end) < this.startOfDay(start)) {
      this.errorMessage = 'Tanggal akhir tidak boleh kurang dari tanggal mulai.';
      this.resetChart();
      return;
    }
    this.errorMessage = '';

    // Dikirim sebagai instant (UTC) supaya seluruh hari pada tanggal lokal ikut terambil
    const params = new HttpParams()
      .set('well', well)
      .set('date', this.startOfDay(start).toISOString())
      .set('end_date', this.endOfDay(end).toISOString());

    this.isLoadingResults = true;
    this.http.get<{ data: IotChartPoint[] }>('/api/arus/GetIotChart', { params }).subscribe(
      (res) => {
        this.isLoadingResults = false;
        this.renderChart(res && res.data ? res.data : []);
      },
      (err) => {
        this.isLoadingResults = false;
        this.errorMessage = 'Gagal memuat data chart.';
        console.error('Gagal memuat chart IoT arus', err);
        this.resetChart();
      }
    );
  }

  private renderChart(data: IotChartPoint[]) {
    const points = (data || [])
      .filter((point) => point && point.date)
      .map((point) => [Date.parse(point.date), point.arus] as [number, number])
      .filter((point) => !isNaN(point[0]))
      .sort((a, b) => a[0] - b[0]);

    this.totalPoints = points.length;
    this.destroyChart();
    if (!points.length) { return; }

    // Kontainer chart baru ada setelah change detection (div *ngIf totalPoints > 0),
    // jadi chart digambar pada tick berikutnya
    const token = this.renderToken;
    setTimeout(() => {
      if (token !== this.renderToken || !this.iotChartEl) { return; }

      this.chart = Highcharts.chart(this.iotChartEl.nativeElement, {
        chart: {
          type: 'line',
          zoomType: 'x',
          backgroundColor: '#fff',
          style: { fontFamily: 'Roboto, Helvetica Neue, sans-serif' }
        },
        exporting: { fallbackToExportServer: false },
        title: { text: 'Arus - ' + this.wellControl.value },
        xAxis: {
          type: 'datetime',
          crosshair: true,
          title: { text: 'Date' }
        },
        yAxis: {
          min: 0,
          title: { text: 'Arus (A)' }
        },
        tooltip: {
          xDateFormat: '%d %b %Y %H:%M:%S',
          valueSuffix: ' A'
        },
        legend: { enabled: false },
        time: { useUTC: false },
        series: [{
          type: 'line',
          name: 'Arus',
          data: points,
          color: '#1A312C',
          marker: { enabled: false, radius: 3 }
        }]
      } as any);
    }, 0);
  }

  private resetChart() {
    this.totalPoints = 0;
    this.destroyChart();
  }

  private destroyChart() {
    this.renderToken++;
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }

  private startOfDay(value: Date): Date {
    return new Date(value.getFullYear(), value.getMonth(), value.getDate(), 0, 0, 0, 0);
  }

  private endOfDay(value: Date): Date {
    return new Date(value.getFullYear(), value.getMonth(), value.getDate(), 23, 59, 59, 999);
  }
}
