import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpEventType, HttpParams, HttpResponse, HttpHeaders } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { MatDatepicker } from '@angular/material';
import { FormControl } from '@angular/forms';
import { merge, Observable, of as observableOf, forkJoin } from 'rxjs';
import { catchError, map, startWith, switchMap, debounceTime, take, mergeAll } from 'rxjs/operators';
import { Chart } from 'angular-highcharts';
import * as Highcharts from 'highcharts';
import { TitleService } from '../../navigation/title/title.service';
import { xFilterService } from '../../xfilter/xfilter.component';

import { MatSnackBar } from '@angular/material';


@Component({
  selector: 'app-pe-daily-area-chart',
  templateUrl: './pe-daily-area-chart.component.html',
  styleUrls: ['./pe-daily.scss']
})
export class PeDailyAreaChartComponent implements OnInit {

  private readonly nullFilterToken = 'NULL';
  private readonly emptySelectionToken = '__EMPTY_SELECTION__';

  @ViewChild('daily_chart_el', { static: true }) public daily_chart_el: ElementRef;
  daily_table_data = [];
  daily_table_columns: string[] = ["status", "count"];

  daily_chart_options: object = {
    chart: {
    type: 'area',
      zoomType: 'x',
      style: {
        fontFamily: 'Roboto, Helvetica Neue, sans-serif'
      },
      events: {
        // reorder series so the series with the smaller total value is drawn on top
        load: function () {
          try {
            var chart = this;
            var sums = chart.series.map(function (s: any) {
              var tot = 0;
              s.data.forEach(function (p: any) {
                var val = 0;
                if (typeof p.y === 'number') val = p.y;
                else if (Array.isArray(p.options)) val = p.options[1];
                else if (typeof p.options === 'number') val = p.options;
                else if (p.options && typeof p.options.y === 'number') val = p.options.y;
                tot += (isFinite(val) ? val : 0);
              });
              return tot;
            });
            var order = sums.map(function (sum: number, i: number) { return { i: i, sum: sum }; })
              .sort(function (a: any, b: any) { return a.sum - b.sum; });

            // give smaller-sum series higher zIndex so they're drawn on top
            for (var k = 0; k < order.length; k++) {
              var seriesIdx = order[k].i;
              var z = order.length - k; // smaller sum -> larger zIndex
              if (chart.series[seriesIdx]) chart.series[seriesIdx].update({ zIndex: z }, false);
            }
            chart.redraw();
          } catch (e) {
            // silent
          }
        }
      }
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
      categories: [],
      crosshair: true,
      autoRotation: true,
      labels: {
        // step: 7
      }
    }],
    yAxis: [{ // Primary yAxis
      title: {
        text: 'Gross (bfpd), Water (bwpd), Net (bopd)',
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
    }, { // Secondary yAxis
      gridLineWidth: 0,
      title: {
        text: 'SM (m), Gas (Mscfd), WC (%)',
        style: {
          color: '#666666'
        }
      },
      labels: {
        format: '{value}',
        style: {
          color: '#999999'
        }
      },
      opposite: true
    }],
    tooltip: {
      shared: true
    },
    legend: {
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'top',
      backgroundColor:
        Highcharts.defaultOptions.legend.backgroundColor || // theme
        'rgba(255,255,255,0.25)'
    },
  plotOptions: {
        area: {
            // stacking: 'normal',
      lineWidth: 0,
            marker: {
                enabled: false
            }
        }
    },
    series: [{
      name: 'Gross',
      // type: 'line',
      yAxis: 0,
      data: [],
      color: '#B4846C',
      zIndex: 1,
      tooltip: {
        valueSuffix: ' bfpd',
        valueDecimals: 2
      }

    }, {
      name: 'Water',
      // type: 'line',
      yAxis: 0,
      data: [],
      color: '#5b9bd5',
      zIndex: 2,
      tooltip: {
        valueSuffix: ' bwpd',
        valueDecimals: 2
      }

    }, {
      name: 'Net',
      // type: 'line',
      yAxis: 0,
      data: [],
      color: '#BBD8A3',
      zIndex: 3,
      tooltip: {
        valueSuffix: ' bopd',
        valueDecimals: 2
      }

    }, {
      name: 'SM',
      type: 'line',
      yAxis: 1,
      dashStyle: 'shortdot',
      data: [],
      color: '#5C3E94',
      zIndex: 4,
      tooltip: {
        valueSuffix: ' m',
        valueDecimals: 2
      }
    },
    {
      name: 'Q.Gas',
      type: 'line',
      yAxis: 1,
      // dashStyle: 'shortdot',
      data: [],
      color: '#f45b5b',
      zIndex: 5,
      marker: {
        enabled: false
      },
      tooltip: {
        valueSuffix: 'Mscfd',
        valueDecimals: 0
      }
    },
    {
      name: 'WC',
      type: 'line',
      yAxis: 1,
      data: [],
      color: '#0070C0',
      zIndex: 6,
      marker: {
        enabled: false
      },
      tooltip: {
        valueSuffix: ' %',
        valueDecimals: 2
      }

    },
  ],
  
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
          }, {
            labels: {
              align: 'left',
              x: 0,
              y: -6
            },
            showLastLabel: false
          }, {
            visible: false
          }]
        }
      }]
    }
  }

  @ViewChild('start_datePicker', { static: true }) start_datePicker: MatDatepicker<any>;
  start_dateControl = new FormControl(new Date(new Date().setDate(new Date().getDate() - 4)));
  start_dateInput = this.start_dateControl.value.toLocaleDateString("en-US", { month: "short", year: "numeric", day: "numeric" });

  @ViewChild('end_datePicker', { static: true }) end_datePicker: MatDatepicker<any>;
  end_dateControl = new FormControl(new Date(new Date().setDate(new Date().getDate() - 1)));
  end_dateInput = this.end_dateControl.value.toLocaleDateString("en-US", { month: "short", year: "numeric", day: "numeric" });

  exampleDatabase: ExampleHttpDao | null;
  well_xSelected: any[] = [];
  well_string_xSelected: any[] = [];
  availableWellStringItems: any[] = [];

  isLoadingResults: boolean = false;

  constructor(
    private http: HttpClient,
    private titleService: TitleService,
    private xfilterService: xFilterService,
  ) { }

  ngOnInit() {

    this.exampleDatabase = new ExampleHttpDao(this.http);

    this.titleService.titleSource.next({
      title: "Area Chart",
      icon: "area_chart",
      breadcrumbs: [
        { label: 'Petroleum Engineering', routerLink: '' },
        { label: 'Daily', routerLink: 'pe/daily' },
        { label: 'Area Chart', routerLink: '' }
      ]
    }
    );

    this.xfilterService.filter.subscribe(res => {
      this.getColumnValues(res);
    })
    this.xfilterService.selected.subscribe(res => {
      const column = res["column"];
      let selected = (res["selected"] || []).filter(item => item !== this.emptySelectionToken);

      if (column === "well") {
        this.well_xSelected = selected;
      } else if (column === "well_string") {
        selected = this.normalizeWellStringSelection(selected);
        this.well_string_xSelected = selected;
      }
      
      // Jika well dipilih, reset well_string_xSelected
      if (column === "well") {
        this.well_string_xSelected = [];
        this.availableWellStringItems = [];
      }
      
      this.checkAndRefreshDaily();
    })

    this.start_dateControl.valueChanges.subscribe(r => {
      this.checkAndRefreshDaily();
    })
    this.end_dateControl.valueChanges.subscribe(r => {
      this.checkAndRefreshDaily();
    })
  }
  
  getColumnValues(param: any) {
    var column = param["column"];
    var filter = param["filter"];
    var selected = param["selected"];
    var clear = param["clear"];
    
    // Build column filter berdasarkan column yang sedang di-filter
    var columnfilter: any = {};
    
    // Helper function untuk convert selected values ke regex pattern
    const toRegexPattern = (values: any[]) => {
      return values.map(v => {
        if (v === null || v === undefined || v === "") {
          // Use special marker untuk null/undefined values
          return "Null";
        }
        return "^" + v + "$";
      });
    };
    
    // Jika user filter column "well_string" → include well filter
    if (column === "well_string") {
      // Include well filter dengan handling null
      columnfilter["well"] = toRegexPattern(this.well_xSelected);
    } 
    // Jika user filter column "well" → tidak ada additional filter
    else if (column === "well") {
      columnfilter = {};
    }
    // Untuk column lain → include well dan well_string yang sudah dipilih
    else {
      if (this.well_xSelected.length > 0) {
        columnfilter["well"] = toRegexPattern(this.well_xSelected);
        columnfilter["well_string"] = toRegexPattern(this.well_string_xSelected);
      }
    }
    
    // Apply filter/selected/clear untuk column yang sedang di-filter
    if (filter) columnfilter[column] = [filter];
    if (selected && selected.length > 0) columnfilter[column] = toRegexPattern(selected);
    if (clear) delete columnfilter[column];

    console.log('getColumnValues - column:', column, 'filter:', columnfilter);

    return this.exampleDatabase!.getRepoIssues(
      column,
      "asc",
      0,
      0,
      "",
      columnfilter,
      column
    ).pipe(map((res) => {
      return res;
    })).subscribe(res => {
      console.log('getColumnValues response:', res.items);
      if (column === 'well_string') {
        this.availableWellStringItems = this.normalizeWellStringItems(res.items || []);
        res.items = this.availableWellStringItems;
      }
      this.xfilterService.updateItems({ column: column, items: res.items });
    }, () => {

    });
  }

  start_dateChange(evt) {
    this.start_dateInput = evt.value.toLocaleDateString("en-US", { month: "short", year: "numeric", day: "numeric" });
  }

  end_dateChange(evt) {
    this.end_dateInput = evt.value.toLocaleDateString("en-US", { month: "short", year: "numeric", day: "numeric" });
  }

  onWellChange() {
    console.log('well_xSelected changed:', this.well_xSelected);
    
    // Jika well dipilih, reset well_string_xSelected 
    if (this.well_xSelected.length > 0) {
      this.well_string_xSelected = []; // Reset well string selection
      // Jangan auto-fetch well string list - biarkan user buka filter dialog
    } else {
      // Jika well dikosongkan, kosongkan juga well string list
      this.well_string_xSelected = [];
    }
    
    this.checkAndRefreshDaily();
  }

  checkAndRefreshDaily() {
    // Cek apakah semua field sudah terisi
    const hasWell = this.well_xSelected && this.well_xSelected.length > 0;
    const hasWellString = this.well_string_xSelected && this.well_string_xSelected.length > 0;
    const hasDateRange = this.start_dateControl.value && this.end_dateControl.value;
    
    console.log('checkAndRefreshDaily:', { hasWell, hasWellString, hasDateRange });
    
    // Hanya fetch jika semua field terisi
    if (hasWellString && hasWell && hasDateRange) {
      this.refresh_Daily();
    } else {
      // Clear chart kalau belum semua field terisi
      this.clearChart();
    }
  }

  clearChart() {
    this.daily_chart_options["xAxis"][0]["categories"] = [];
    this.daily_chart_options["series"][0]["data"] = [];
    this.daily_chart_options["series"][1]["data"] = [];
    this.daily_chart_options["series"][2]["data"] = [];
    this.daily_chart_options["series"][3]["data"] = [];
    this.daily_chart_options["series"][4]["data"] = [];
    this.daily_chart_options["series"][5]["data"] = [];
    this.daily_chart_options["title"]["text"] = "Please select well and well string";
    Highcharts.chart(this.daily_chart_el.nativeElement, this.daily_chart_options);
  }

  fetchWellListByWellString() {
    // console.log('Fetching well list for:', this.well_string_xSelected);
    
    // Query 1: Well dengan well_string yang dipilih
    const columnFilter1: any = {
      well_string: this.well_string_xSelected.map(s => s === this.nullFilterToken ? this.nullFilterToken : "^" + s + "$")
    };

    // Query 2: Well dengan well_string kosong/null
    const columnFilter2: any = {
      well_string: [this.nullFilterToken]
    };

    // Execute both queries in parallel
    const query1 = this.exampleDatabase!.getRepoIssues(
      "well_string",
      "asc",
      0,
      0,
      "",
      columnFilter1,
      "well"
    ).pipe(map((res) => res.items || []));

    const query2 = this.exampleDatabase!.getRepoIssues(
      "well_string",
      "asc",
      0,
      0,
      "",
      columnFilter2,
      "well"
    ).pipe(map((res) => res.items || []));

    forkJoin([query1, query2]).subscribe(
      ([items1, items2]) => {
        // Merge dan deduplicate results
        const allItems = [...items1, ...items2];
        const uniqueItems = Array.from(new Set(allItems.map(item => JSON.stringify(item))))
          .map(item => JSON.parse(item));
        
        console.log('Available wells for selected well_string:', uniqueItems);
        
        // Delay emit to ensure dialog is subscribed first
        setTimeout(() => {
          this.xfilterService.updateItems({ column: "well", items: uniqueItems });
        }, 0);
      },
      (error) => {
        console.error('Error fetching well list:', error);
      }
    );
  }

  refresh_Daily() {
    let params = new HttpParams();
    params = params.append("type", "well_performance_daily")
      .append("date", this.start_dateControl.value.toISOString())
      .append("end_date", this.end_dateControl.value.toISOString());
    
    // Append selected wells
    for (const w of this.well_xSelected) {
      params = params.append("well", w || "");
    }
    
    // Append selected well_strings (handle null)
    for (const ws of this.well_string_xSelected) {
      params = params.append("well_string", ws === this.nullFilterToken ? this.nullFilterToken : (ws || ""));
    }

    this.http.get<any>('/api/pe/daily/GetAreaChart', { params: params }).subscribe(res => {
      const data = res["data"] || [];
      
      if (data.length === 0) {
        this.clearChart();
        this.daily_chart_options["title"]["text"] = "No data available";
        Highcharts.chart(this.daily_chart_el.nativeElement, this.daily_chart_options);
        return;
      }

      // Group data by date + well combination
      const groupedData = new Map();
      data.forEach((item: any) => {
        const dateKey = formatDate(item["date"], "dd-MMM-yy", "en-US");
        const well = item["well"] || "UNKNOWN";
        const key = `${dateKey}|${well}`; // Unique key for date+well combination
        
        if (!groupedData.has(key)) {
          groupedData.set(key, {
            date: dateKey,
            well: well,
            gross: 0,
            net: 0,
            water: 0,
            sm: 0,
            gas: 0,
            wc: 0,
            count: 0
          });
        }
        
        const entry = groupedData.get(key);
        const gross = item["gross"] || 0;
        const net = item["net"] || 0;
        const water = gross - net;
        const sm = item["sm"] || 0;
        const gas = (item["gas"] || 0) * 1000;
        const wc = item["wc"] || 0;
        
        // Aggregate (sum) the values for same date+well
        entry.gross += gross;
        entry.net += net;
        entry.water += water;
        entry.sm += sm;
        entry.gas += gas;
        entry.wc += wc;
        entry.count += 1;
      });

      // Convert grouped data to array
      const aggregatedData = Array.from(groupedData.values());

      // Check if we have multiple wells or single well
      const uniqueWells = [...new Set(aggregatedData.map(d => d.well))];
      const wellCount = uniqueWells.length;

      if (wellCount === 1) {
        // Single well - show data as is (grouped by date)
        const sortedData = aggregatedData.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateA.getTime() - dateB.getTime();
        });

        this.daily_chart_options["xAxis"][0]["categories"] = sortedData.map(d => d.date);
        this.daily_chart_options["series"][0]["data"] = sortedData.map(d => d.gross);
        this.daily_chart_options["series"][1]["data"] = sortedData.map(d => d.water);
        this.daily_chart_options["series"][2]["data"] = sortedData.map(d => d.net);
        this.daily_chart_options["series"][3]["data"] = sortedData.map(d => d.sm);
        this.daily_chart_options["series"][4]["data"] = sortedData.map(d => d.gas);
        this.daily_chart_options["series"][5]["data"] = sortedData.map(d => d.wc);
        
      } else {
        // Multiple wells - aggregate by date only (sum all wells for same date)
        const dateMap = new Map();
        aggregatedData.forEach((item: any) => {
          if (!dateMap.has(item.date)) {
            dateMap.set(item.date, {
              date: item.date,
              gross: 0,
              net: 0,
              water: 0,
              sm: 0,
              gas: 0,
              wc: 0,
              count: 0
            });
          }
          
          const entry = dateMap.get(item.date);
          entry.gross += item.gross;
          entry.net += item.net;
          entry.water += item.water;
          entry.sm += item.sm;
          entry.gas += item.gas;
          entry.wc += item.wc;
          entry.count += 1;
        });

        const sortedDates = Array.from(dateMap.keys()).sort((a, b) => {
          const dateA = new Date(a);
          const dateB = new Date(b);
          return dateA.getTime() - dateB.getTime();
        });

        this.daily_chart_options["xAxis"][0]["categories"] = sortedDates;
        this.daily_chart_options["series"][0]["data"] = sortedDates.map(date => dateMap.get(date).gross);
        this.daily_chart_options["series"][1]["data"] = sortedDates.map(date => dateMap.get(date).water);
        this.daily_chart_options["series"][2]["data"] = sortedDates.map(date => dateMap.get(date).net);
        this.daily_chart_options["series"][3]["data"] = sortedDates.map(date => {
          const entry = dateMap.get(date);
          return entry.count > 0 ? entry.sm / entry.count : 0;
        });
        this.daily_chart_options["series"][4]["data"] = sortedDates.map(date => {
          const entry = dateMap.get(date);
          return entry.count > 0 ? entry.gas / entry.count : 0;
        });
        this.daily_chart_options["series"][5]["data"] = sortedDates.map(date => {
          const entry = dateMap.get(date);
          return entry.count > 0 ? entry.wc / entry.count : 0;
        });
      }

      // Update chart title
      this.daily_chart_options["title"]["text"] = this.well_xSelected.length > 0
        ? this.well_xSelected.join(", ")
        : this.well_string_xSelected.join(", ");

      this.daily_chart_options["caption"]["text"] = formatDate(this.start_dateControl.value, 'd MMM y', 'en-US') + " - " + formatDate(this.end_dateControl.value, 'd MMM y', 'en-US');

      Highcharts.chart(this.daily_chart_el.nativeElement, this.daily_chart_options);

    }, error => {
      console.error('Error fetching daily chart data:', error);
    });
  }

  private normalizeWellStringItems(items: any[]): any[] {
    return items.map(item => (item === null || item === undefined || item === '') ? this.nullFilterToken : item);
  }

  private normalizeWellStringSelection(selected: any[]): any[] {
    if (selected.length > 0) {
      return this.normalizeWellStringItems(selected);
    }

    if (this.availableWellStringItems.length === 1 && this.availableWellStringItems[0] === this.nullFilterToken) {
      return [this.nullFilterToken];
    }

    return selected;
  }

  getWellStringSelectionLabel(): string {
    if (!this.well_string_xSelected || this.well_string_xSelected.length === 0) {
      return '';
    }

    return this.well_string_xSelected
      .map(item => item === this.nullFilterToken ? '(Blank)' : item)
      .join(', ');
  }

  getWellStringFilterSelected(): any[] {
    if (!this.well_string_xSelected || this.well_string_xSelected.length === 0) {
      return [this.emptySelectionToken];
    }

    return this.well_string_xSelected;
  }
  
}

export interface PeWellApi {
  items: any[];
  total_count: number;
}

export class ExampleHttpDao {
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

    return this.http.get<PeWellApi>('/api/pe/daily', httpOption);
  }
}