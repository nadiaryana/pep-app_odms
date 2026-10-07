import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { formatDate } from '@angular/common';
import * as Highcharts from 'highcharts';

import { PeProdWaterfallChart } from './pe-prod-waterfall';
import { PeProdWaterfallService } from './pe-prod-waterfall.service';
import { SnackbarService, SnackbarApi } from '../../snackbar.service';
import { TitleService } from '../../navigation/title/title.service';

/** Baris pada tabel breakdown di bawah chart. */
interface WaterfallTableRow {
  type: 'category' | 'well' | 'subtotal' | 'grandtotal' | 'others';
  label: string;
  no?: number;
  delta?: number;
  remarks?: string;
}

@Component({
  selector: 'app-pe-waterfall-chart',
  templateUrl: './pe-waterfall-chart.component.html',
  styleUrls: ['./pe-prod-waterfall.scss']
})

export class PeWaterfallChartComponent implements OnInit {

  @ViewChild('waterfall_chart_el', { static: true }) public waterfall_chart_el: ElementRef;

  isLoadingResults = false;

  start_dateControl = new FormControl(new Date());
  start_dateInput = "";

  end_dateControl = new FormControl(new Date());
  end_dateInput = "";

  chart_title = "";
  chart_subtitle = "";
  tabel_breakdown: WaterfallTableRow[] = [];

  total_start = 0;
  total_end = 0;
  total_delta = 0;
  others = 0;
  total_kategori = 0;

  constructor(
    private service: PeProdWaterfallService,
    private titleService: TitleService,
    private snackbarService: SnackbarService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {

    this.titleService.titleSource.next({
      title: "Waterfall Chart",
      icon: "waterfall_chart",
      breadcrumbs: [
        { label: 'Petroleum Engineering', routerLink: '' },
        { label: 'Waterfall', routerLink: 'pe/waterfall' },
        { label: 'Chart', routerLink: '' }
      ]
    });

    this.initDate();

    this.start_dateControl.valueChanges.subscribe(() => this.refresh());
    this.end_dateControl.valueChanges.subscribe(() => this.refresh());

    this.refresh();
  }

  private initDate() {
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var defStart = new Date(today);
    defStart.setDate(defStart.getDate() - 7);

    this.start_dateControl.setValue(defStart, { emitEvent: false });
    this.end_dateControl.setValue(today, { emitEvent: false });

    var p_start = this.route.snapshot.queryParamMap.get('start_date');
    var p_end = this.route.snapshot.queryParamMap.get('end_date');
    if (p_start && !isNaN(Date.parse(p_start))) this.start_dateControl.setValue(new Date(p_start), { emitEvent: false });
    if (p_end && !isNaN(Date.parse(p_end))) this.end_dateControl.setValue(new Date(p_end), { emitEvent: false });

    this.start_dateInput = formatDate(this.start_dateControl.value, 'd MMM y', 'en-US');
    this.end_dateInput = formatDate(this.end_dateControl.value, 'd MMM y', 'en-US');
  }

  start_dateChange(evt) {
    this.start_dateInput = formatDate(evt.value, 'd MMM y', 'en-US');
  }

  end_dateChange(evt) {
    this.end_dateInput = formatDate(evt.value, 'd MMM y', 'en-US');
  }

  refresh() {
    this.isLoadingResults = true;
    this.service.getChart(this.start_dateControl.value, this.end_dateControl.value).subscribe(res => {
      this.isLoadingResults = false;
      this.render(res);
    }, error => {
      this.isLoadingResults = false;
      this.snackbarService.status.next(new SnackbarApi(true, error['message'] || 'Gagal memuat data waterfall', 'dismiss'));
    });
  }

  private render(data: PeProdWaterfallChart) {

    this.total_start = this.toNumber(data.total_start);
    this.total_end = this.toNumber(data.total_end);
    this.others = this.round(this.toNumber(data.others));
    this.total_delta = this.round(this.total_end - this.total_start);
    this.total_kategori = this.round(data.categories.reduce((sum, c) => sum + this.toNumber(c.delta_prod), 0));

    this.chart_title = "Waterfall Chart";
    this.chart_subtitle = this.start_dateInput + " - " + this.end_dateInput;

    this.buildTable(data);
    this.buildChart(data);
  }

  private buildTable(data: PeProdWaterfallChart) {

    var rows: WaterfallTableRow[] = [];

    data.categories.forEach(cat => {
      rows.push({ type: 'category', label: cat.label, delta: this.toNumber(cat.delta_prod) });

      var wells = data.items.filter(i => i.kategori == cat.kategori).slice().sort((a, b) => a.well.localeCompare(b.well));
      wells.forEach((w, i) => rows.push({
        type: 'well',
        no: i + 1,
        label: w.well,
        delta: this.toNumber(w.delta_prod),
        remarks: w.remarks
      }));

      if (wells.length == 0) {
        rows.push({ type: 'well', label: "(belum ada sumur)", remarks: "" });
      } else {
        rows.push({ type: 'subtotal', label: "Total " + cat.label, delta: this.toNumber(cat.delta_prod) });
      }
    });

    rows.push({ type: 'grandtotal', label: "TOTAL", delta: this.total_kategori });

    if (this.others != 0) {
      rows.push({ type: 'others', label: "Others (tidak terjelaskan)", delta: this.others });
    }

    this.tabel_breakdown = rows;
  }

  private buildChart(data: PeProdWaterfallChart) {

    // Waterfall dibangun dari dua seri column bertumpuk: seri pertama berisi
    // tinggi dasar (transparan) dan seri kedua berisi delta yang tampak. Modul
    // 'waterfall' tidak tersedia pada build highcharts di repo ini.
    var categories: string[] = ["Start"];
    var base: any[] = [0];
    var values: any[] = [];

    var total_start = this.toNumber(data.total_start);
    var total_end = this.toNumber(data.total_end);

    values.push({
      y: total_start,
      color: '#3aa84c',
      custom: { delta: total_start, is_total: true }
    });

    var running = total_start;

    data.categories.forEach(cat => {
      var delta = this.round(this.toNumber(cat.delta_prod));
      categories.push(cat.label);
      base.push(Math.min(running, this.round(running + delta)));
      values.push({
        y: Math.abs(delta),
        color: delta >= 0 ? '#2f7ed8' : '#e53935',
        custom: { delta: delta }
      });
      running = this.round(running + delta);
    });

    if (this.others != 0) {
      categories.push("Others");
      base.push(Math.min(running, this.round(running + this.others)));
      values.push({
        y: Math.abs(this.others),
        color: '#9e9e9e',
        custom: { delta: this.others }
      });
      running = this.round(running + this.others);
    }

    categories.push("End");
    base.push(0);
    values.push({
      y: total_end,
      color: '#3aa84c',
      custom: { delta: total_end, is_total: true }
    });

    var options: any = {
      chart: {
        type: 'column',
        zoomType: 'xy',
        style: { fontFamily: 'Roboto, Helvetica Neue, sans-serif' }
      },
      title: { text: this.chart_title, align: 'center' },
      subtitle: { text: this.chart_subtitle, align: 'center' },
      xAxis: {
        categories: categories,
        labels: { autoRotation: [-20], style: { fontSize: '11px' } },
        tickmarkPlacement: 'on'
      },
      yAxis: {
        min: 0,
        title: { text: 'BOPD' },
        labels: { format: '{value:,.0f}' }
      },
      legend: { enabled: false },
      tooltip: {
        formatter: function () {
          var point: any = this.point;
          var delta = (point.custom && point.custom.delta !== undefined) ? point.custom.delta : point.y;
          return '<b>' + point.category + '</b><br/>' + Highcharts.numberFormat(delta, 3) + ' BOPD';
        }
      },
      series: [
        {
          // tinggi dasar agar bar delta "mengambang" pada level kumulatif
          name: 'base',
          type: 'column',
          stacking: 'normal',
          color: 'rgba(0,0,0,0)',
          borderWidth: 0,
          enableMouseTracking: false,
          showInLegend: false,
          dataLabels: { enabled: false },
          data: base
        },
        {
          name: 'Delta Prod',
          type: 'column',
          stacking: 'normal',
          borderWidth: 1,
          borderColor: '#ffffff',
          data: values,
          dataLabels: {
            enabled: true,
            useHTML: true,
            formatter: function () {
              var point: any = this.point;
              var delta = (point.custom && point.custom.delta !== undefined) ? point.custom.delta : this.y;
              var isTotal = point.custom && point.custom.is_total;
              var color = delta < 0 ? '#e53935' : '#333333';
              var text = isTotal ? Highcharts.numberFormat(delta, 0) : (delta > 0 ? '+' : '') + Highcharts.numberFormat(delta, 0);
              return '<span style="color:' + color + '">' + text + '</span>';
            },
            style: { fontSize: '11px', fontWeight: 'normal', textOutline: 'none' }
          }
        }
      ]
    };

    Highcharts.chart(this.waterfall_chart_el.nativeElement, options);
  }

  toNumber(value: any): number {
    if (value === null || value === undefined || value === "") return 0;
    return Number(value);
  }

  round(value: number): number {
    return Math.round(this.toNumber(value) * 1000) / 1000;
  }
}
