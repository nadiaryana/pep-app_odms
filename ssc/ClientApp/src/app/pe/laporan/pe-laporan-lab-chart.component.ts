import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { FormControl } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Chart } from 'angular-highcharts';
import * as Highcharts from 'highcharts';
import exporting from 'highcharts/modules/exporting';
import offline from 'highcharts/modules/offline-exporting';

exporting(Highcharts);
offline(Highcharts);

import { TitleService } from '../../navigation/title/title.service';
import { xFilterService } from '../../xfilter/xfilter.component';

@Component({
  selector: 'app-pe-laporan-lab-chart',
  templateUrl: './pe-laporan-lab-chart.component.html',
  styleUrls: ['../daily/pe-daily.scss']
})
export class PeLaporanLabChartComponent implements OnInit {

  @ViewChild('laporan_chart_el', { static: true }) public laporan_chart_el: ElementRef;

  isLoadingResults = false;
  well_xSelected: string[] = [];
  start_dateInput: string = "";
  end_dateInput: string = "";

  start_dateControl = new FormControl(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  end_dateControl = new FormControl(new Date());

  laporan_chart_options: object = {
    chart: {
      zoomType: 'x',
      style: {
        fontFamily: 'Roboto, Helvetica Neue, sans-serif'
      }
    },
    exporting: {
      fallbackToExportServer: false
    },
    title: {
      text: null,
    },
    caption: {
      text: null,
      align: 'center',
      verticalAlign: 'top'
    },
    xAxis: [{
      type: 'datetime',
      crosshair: true,
      labels: {
        format: '{value:%d %b}'
      }
    }],
    yAxis: [{
      title: {
        text: 'Water (bbl)',
        style: {
          color: '#666666'
        }
      },
      labels: {
        format: '{value}',
        style: {
          color: '#999999'
        }
      }
    }],
    tooltip: {
      formatter: function () {
        return `
          <b>${Highcharts.dateFormat('%d %b %Y', this.x)}</b><br/>
          ${this.series.name}: ${this.y} bbl
        `;
      }
    },
    legend: {
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'top',
      backgroundColor: Highcharts.defaultOptions.legend.backgroundColor || 'rgba(255,255,255,0.25)'
    },
    series: [{
      name: 'Water (Laporan)',
      type: 'scatter',
      yAxis: 0,
      data: [],
      color: '#1f77b4',
      zIndex: 9,
      marker: {
        enabled: true,
        symbol: 'star',
      },
      tooltip: {
        valueSuffix: ' bbl',
        valueDecimals: 2
      }
    }, {
      name: 'Water (Daily)',
      type: 'line',
      yAxis: 0,
      data: [],
      color: '#ff7f0e',
      zIndex: 8,
      marker: {
        enabled: true
      },
      tooltip: {
        valueSuffix: ' bbl',
        valueDecimals: 2
      }
    }],
    responsive: {
      rules: [{
        condition: {
          maxWidth: 500
        },
        chartOptions: {
          legend: {
            floating: false,
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom',
            x: 0,
            y: 0
          },
          yAxis: [{
            labels: {
              align: 'right',
              x: 0,
              y: -6
            },
            showLastLabel: false
          }]
        }
      }]
    }
  };

  chart: Chart;

  exampleDatabase: LaporanHttpDao | null;

  constructor(
    private http: HttpClient,
    private xfilterService: xFilterService,
    private titleService: TitleService
  ) { }

  ngOnInit() {
    this.exampleDatabase = new LaporanHttpDao(this.http);
    
    this.titleService.titleSource.next({
      title: "Laporan Lab Chart",
      icon: "bar_chart",
      breadcrumbs: [
        { label: 'Petroleum Engineering', routerLink: '' },
        { label: 'Daily', routerLink: 'pe/laporan' },
        { label: 'Chart', routerLink: '' }
      ]
    });

    this.well_xSelected = [];
    this.start_dateInput = formatDate(this.start_dateControl.value, "MMM d, y", "en-US");
    this.end_dateInput = formatDate(this.end_dateControl.value, "MMM d, y", "en-US");

    this.xfilterService.filter.subscribe(res => {
      this.getColumnValues(res);
    });

    this.xfilterService.selected.subscribe(res => {
      this[res["column"] + "_xSelected"] = res["selected"];
      this.refresh_Chart();
    });

    this.start_dateControl.valueChanges.subscribe(r => {
      this.refresh_Chart();
    });

    this.end_dateControl.valueChanges.subscribe(r => {
      this.refresh_Chart();
    });
  }

  start_dateChange(evt) {
    this.start_dateInput = evt.value.toLocaleDateString("en-US", { month: "short", year: "numeric", day: "numeric" });
  }

  end_dateChange(evt) {
    this.end_dateInput = evt.value.toLocaleDateString("en-US", { month: "short", year: "numeric", day: "numeric" });
  }

  refresh_Chart() {
    if (!this.well_xSelected || this.well_xSelected.length === 0) {
      return;
    }

    this.isLoadingResults = true;

    let laporanParams = new HttpParams()
      .append("start_date", this.start_dateControl.value.toISOString())
      .append("end_date", this.end_dateControl.value.toISOString());

    for (const w of this.well_xSelected) {
      laporanParams = laporanParams.append("well", w);
    }

    let dailyParams = new HttpParams()
      .append("type", "well_performance")
      .append("date", this.start_dateControl.value.toISOString())
      .append("end_date", this.end_dateControl.value.toISOString());

    for (const w of this.well_xSelected) {
      dailyParams = dailyParams.append("well", w);
    }

    forkJoin([
      this.http.get('/api/pe/laporan/GetChart', { params: laporanParams }),
      this.http.get('/api/pe/daily/GetChart', { params: dailyParams })
    ]).subscribe(
      ([laporanRes, dailyRes]: any[]) => {
        this.isLoadingResults = false;

        console.log('Laporan Response:', laporanRes);
        console.log('Daily Response:', dailyRes);

        // Prepare laporan data
        // let laporanData = laporanRes.data || [];
        // let laporanMap = new Map();

        // console.log('Laporan Data Length:', laporanData.length);

        // for (const item of laporanData) {
        //   const dateStr = formatDate(item.date, "dd-MMM-yy", "en-US");
        //   const well = item.well;
        //   const key = `${dateStr}_${well}`;
        //   laporanMap.set(key, item.water);
        //   console.log('Laporan item:', { date: dateStr, well, water: item.water, key });
        // }

        // // Prepare daily data
        // let dailyData = dailyRes.data || [];
        // let dailyMap = new Map();

        // console.log('Daily Data Length:', dailyData.length);

        // for (const item of dailyData) {
        //   const dateStr = formatDate(item.date, "dd-MMM-yy", "en-US");
        //   const well = item.well;
        //   const key = `${dateStr}_${well}`;
        //   dailyMap.set(key, item.wc);
        //   console.log('Daily item:', { date: dateStr, well, wc: item.wc, key });
        // }

        // // Combine dates and wells
        // let allKeys = new Set();
        // for (const key of laporanMap.keys()) {
        //   allKeys.add(key);
        // }
        // for (const key of dailyMap.keys()) {
        //   allKeys.add(key);
        // }

        // let sortedKeys = Array.from(allKeys).sort() as string[];

        // console.log('Sorted Keys:', sortedKeys);

        // // Extract categories and series data
        // let categories = [];
        // let laporanSeries = [];
        // let dailySeries = [];

        // for (const key of sortedKeys) {
        //   const parts = (key as string).split('_');
        //   const dateStr = parts[0];
        //   const well = parts[1];
        //   categories.push(`${dateStr}\n${well}`);
        //   laporanSeries.push(laporanMap.get(key) || null);
        //   dailySeries.push(dailyMap.get(key) || null);
        // }

        // console.log('Categories:', categories);
        // console.log('Laporan Series:', laporanSeries);
        // console.log('Daily Series:', dailySeries);

        // // Update chart
        // this.laporan_chart_options["xAxis"][0]["categories"] = categories;

        let laporanData = laporanRes.data || [];
        let dailyData = dailyRes.data || [];

        // convert laporan ke format [timestamp, value]
        let laporanSeries = laporanData.map(item => [
        new Date(item.date).getTime(),
        item.water
        ]);

        // convert daily ke format [timestamp, value]
        let dailySeries = dailyData.map(item => [
        new Date(item.date).getTime(),
        item.wc
        ]);

        // urutkan berdasarkan tanggal (WAJIB!)
        laporanSeries.sort((a, b) => a[0] - b[0]);
        dailySeries.sort((a, b) => a[0] - b[0]);

        // set range sesuai filter
        this.laporan_chart_options["xAxis"][0]["min"] =
        new Date(this.start_dateControl.value).getTime();

        this.laporan_chart_options["xAxis"][0]["max"] =
        new Date(this.end_dateControl.value).getTime();

        // update title
        this.laporan_chart_options["title"]["text"] =
        this.well_xSelected.join(", ");

        // update caption
        this.laporan_chart_options["caption"]["text"] =
        formatDate(this.start_dateControl.value, 'd MMM y', 'en-US')
        + " - " +
        formatDate(this.end_dateControl.value, 'd MMM y', 'en-US');

        // update series
        this.laporan_chart_options["series"][0]["data"] = laporanSeries;
        this.laporan_chart_options["series"][1]["data"] = dailySeries;

        // render ulang
        Highcharts.chart(this.laporan_chart_el.nativeElement, this.laporan_chart_options);

        // this.laporan_chart_options["title"]["text"] = this.well_xSelected.join(", ");
        // this.laporan_chart_options["caption"]["text"] = formatDate(this.start_dateControl.value, 'd MMM y', 'en-US') + " - " + formatDate(this.end_dateControl.value, 'd MMM y', 'en-US');
        // this.laporan_chart_options["series"][0]["data"] = laporanSeries;
        // this.laporan_chart_options["series"][1]["data"] = dailySeries;

        console.log('Chart Options Updated:', this.laporan_chart_options);

        // Render chart to the element
        // Highcharts.chart(this.laporan_chart_el.nativeElement, this.laporan_chart_options);
        console.log('Chart Rendered to element');
      },
      error => {
        this.isLoadingResults = false;
        console.error('Error loading chart data:', error);
      }
    );
  }

  getColumnValues(param: any) {
    var column = param["column"];
    var filter = param["filter"];
    var selected = param["selected"]
    var clear = param["clear"];
    var columnfilter = { well: this.well_xSelected.map(s => "^" + s + "$") };
    if (filter) columnfilter[column] = [filter];
    if (selected && selected.length > 0) columnfilter[column] = selected.map(s => "^" + s + "$");
    if (clear) delete columnfilter[column];

    return this.exampleDatabase!.getRepoIssues(
      "well",
      "asc",
      0,
      0,
      "",
      columnfilter,
      "well"
    ).pipe(map((res) => {
      return res;
    })).subscribe(res => {
      this.xfilterService.updateItems({ column: "well", items: res.items });
    }, () => {

    });
  }
}

interface PeWellApi {
  items: any;
}

export class LaporanHttpDao {
  constructor(private http: HttpClient) { }

  getRepoIssues(sort: string, order: string, page: number, pagesize: number = 50, filter: string, columnfilter: object, mode: string = "", httpOption: object = {}): Observable<PeWellApi> {

    var params = {};
    if (sort != null) params["sort"] = sort;
    if (order != null) params["order"] = order;
    if (page != null) params["page"] = page.toString();
    if (pagesize != null) params["pagesize"] = pagesize.toString();
    if (filter != null) params["filter"] = filter;
    if (Object.keys(columnfilter).length > 0) params["columnfilter"] = JSON.stringify(columnfilter);
    if (mode != null) params["mode"] = mode;

    httpOption["params"] = params;

    return this.http.get<PeWellApi>('/api/pe/laporan', httpOption);
  }
}
