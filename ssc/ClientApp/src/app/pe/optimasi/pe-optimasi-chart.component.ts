import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpEventType, HttpParams, HttpResponse, HttpHeaders } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { MatDatepicker, MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { FormControl } from '@angular/forms';
import { merge, Observable, of as observableOf, forkJoin, Subscription } from 'rxjs';
import { catchError, map, startWith, switchMap, debounceTime, take, mergeAll } from 'rxjs/operators';
import { Chart } from 'angular-highcharts';
import * as Highcharts from 'highcharts';

// import { annotations } from 'highcharts/modules/annotations';

import { MatSnackBar } from '@angular/material';

import { TitleService } from '../../navigation/title/title.service';
import { xFilterService } from '../../xfilter/xfilter.component';

import { Export } from '../exporting.js';
import { OfflineExport } from '../offline-exporting.js';
import { ExampleHttpDao, PeDailyOptimasiDeleteDialogComponent } from './pe-optimasi-list.component';
import { CommonService } from 'src/app/common.service';
import { SelectionModel } from '@angular/cdk/collections';
import { SnackbarApi, SnackbarService } from 'src/app/snackbar.service';
import { AfterViewInit } from '@angular/core';
import { PePermissionService } from '../pe-permission.service';

@Component({
  selector: 'app-pe-optimasi-chart',
  templateUrl: './pe-optimasi-chart.component.html',
  styleUrls: ['./pe-optimasi.scss']
})
export class PeOptimasiChartComponent implements OnInit, AfterViewInit{

  displayedColumns: string[] = ['well', 'avg_sm', 'avg_ds_efficiency', 'remarks', 'action'];

  headerColumns1: string[] = ["well", "avg_sm", "avg_ds_efficiency", 'remarks', 'action'];
  resultsLength = 0;
  isEditing: boolean = false;
  selection = new SelectionModel<any>(true, []);
  
  @ViewChild('quadrant_chart_el', { static: true }) public quadrant_chart_el: ElementRef;
  quadrant_table_data = [];
  quadrant_table_columns: string[] = ["status", "count"];

  
  // quadrant_chart_options:
  isLoadingResults: boolean = false;

  xAxisMax: number = 200;
  yAxisMax: number = 200;
  chart: Highcharts.Chart;
  public quadrantX: number = 50;
  public quadrantY: number = 25;


  quadrant_chart_options: any = {
    chart: {
      type: 'scatter',
      zoomType: 'xy',
      style: {
        fontFamily: 'Roboto, Helvetica Neue, sans-serif'
      }
    },

    title: { text: 'Quadrant Chart' },

    xAxis: {
      title: { text: 'Submergence (m)' },
      min: 0,
      max: 200,
      endOnTick: false,  // Jangan auto-adjust max value
      startOnTick: true,  // Mulai dari 0
      tickInterval: 5,  // Interval tetap 5
      plotLines: []   
    },

    yAxis: {
      title: { text: 'Pump Efficiency (%)' },
      min: 0,
      max: this.yAxisMax,
      endOnTick: false,  // Jangan auto-adjust max value
      startOnTick: true,  // Mulai dari 0
      tickInterval: 5,  // Interval tetap 5
      plotLines: []   
    },

    tooltip: {
      formatter: function () {
        return `
          <b>${this.point.name}</b><br/>
          SM: ${this.x}<br/>
          Efficiency: ${this.y.toFixed(2)} %
        `;
      }
    },

    legend: {
      align: 'center',
      verticalAlign: 'top'
    },

    plotOptions: {
      scatter: {
        dataLabels: {
          enabled: true,
          formatter: function () {
            return this.point.name;
          },
        marker: {
          radius: 6,
          symbol: 'circle',
        } 
        }
      }
    },

    series: [{
      name: 'Well',
      data: []
    }]
  };

  @ViewChild('start_datePicker', { static: true }) start_datePicker: MatDatepicker<any>;
    start_dateControl = new FormControl();
    start_dateInput = this.start_dateControl.value
      ? this.start_dateControl.value.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
          day: "numeric",
        })
      : "";  

  @ViewChild('end_datePicker', { static: true }) end_datePicker: MatDatepicker<any>;
  end_dateControl = new FormControl();
  end_dateInput = this.end_dateControl.value
    ? this.end_dateControl.value.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
        day: "numeric",
      })
    : "";

  exampleDatabase: ExampleHttpDao | null;
  well_xSelected = [];

  selectedArea: string = 'all';
  allItems: any[] = [];
  dataSource = new MatTableDataSource<any>(this.allItems);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  wellFilter = new FormControl('');
  dateFilter = new FormControl('');
  avg_wcFilter = new FormControl('');
  avg_smFilter = new FormControl('');
  avg_ds_efficiencyFilter = new FormControl('');

  date_xSelected = [];
  avg_wc_xSelected = [];
  avg_sm_xSelected = [];
  avg_ds_efficiency_xSelected = [];

  filterSubscription: Subscription;
  selectedSubscription: Subscription;
  listSubscription: Subscription;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  filterControl = new FormControl('');
  isRateLimitReached = false;

  constructor(
        private http: HttpClient,
        private titleService: TitleService,
        private xfilterService: xFilterService,
        public commonService: CommonService,
        public dialog: MatDialog,
        public snackBar: MatSnackBar,
        public snackbarService: SnackbarService,
        public pePermissionService: PePermissionService,
  ) { }

  ngOnInit() {
    this.titleService.titleSource.next({
      title: 'Quadrant Chart',
      icon: 'auto_graph',
      breadcrumbs: [
        { label: 'Petroleum Engineering', routerLink: '' },
        { label: 'Daily', routerLink: 'pe/daily' },
        { label: 'Quadrant', routerLink: '' }
      ]
    });

    // this.refreshQuadrant();

    this.start_dateControl.valueChanges.subscribe(() => this.refreshQuadrant());
    this.end_dateControl.valueChanges.subscribe(() => this.refreshQuadrant());
    
      // this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

      this.filterSubscription = this.xfilterService.filter.subscribe(res => {
        if (res) this.getColumnValues(res);
      })
      
      merge(
        this.start_dateControl.valueChanges,
        this.end_dateControl.valueChanges,
      ).pipe(debounceTime(300)).subscribe(() => {
        this.refreshQuadrant();
      });

      this.selectedSubscription = this.xfilterService.selected.subscribe(res => {
        this[res["column"] + "_xSelected"] = res["selected"];
        this.applyAreaFilter(); // ← filter dari data lokal, tidak perlu API
      })
  }

  ngOnDestroy() {
    this.filterSubscription.unsubscribe();
    this.selectedSubscription.unsubscribe();
    // hapus this.listSubscription.unsubscribe()
  }

  onAreaChange() {
    if (this.allItems.length > 0) {
      this.applyAreaFilter();
    } else {
      this.refreshQuadrant();
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sortingDataAccessor = (item: any, property: string) => {
      const val = item[property];
      if (val == null) return '';
      if (typeof val === 'number') return val;
      return String(val).toLowerCase();
    };
  }

  applyAreaFilter() {
    let filteredItems = this.allItems;

    if (this.selectedArea === 'SBR') {
      const sbrPrefixes = ['SBR', 'KRM', 'SBT', 'SD', 'SLR'];
      filteredItems = filteredItems.filter(x =>
        x.well && sbrPrefixes.some(p => x.well.toUpperCase().startsWith(p))
      );
    } else if (this.selectedArea === 'SGT') {
      const sgtPrefixes = ['ST-', 'TPH', 'UKM'];
      filteredItems = filteredItems.filter(x =>
        x.well && sgtPrefixes.some(p => x.well.toUpperCase().startsWith(p))
      );
    }

    // xSelected filters
    if (this.well_xSelected.length > 0) {
      filteredItems = filteredItems.filter(x => this.well_xSelected.includes(x.well));
    }
    if (this.avg_sm_xSelected.length > 0) {
      filteredItems = filteredItems.filter(x =>
        this.avg_sm_xSelected.includes(x.avg_sm)
      );
    }
    if (this.avg_ds_efficiency_xSelected.length > 0) {
      filteredItems = filteredItems.filter(x =>
        this.avg_ds_efficiency_xSelected.includes(x.avg_ds_efficiency)
      );
    }

    // ✅ Update data saja, JANGAN recreate MatTableDataSource
    this.dataSource.data = filteredItems;
    this.resultsLength = filteredItems.length;
    this.selection.clear();

    // Update chart
    const points = filteredItems.map(x => ({
      name: x.well,
      x: x.avg_sm,
      y: x.avg_ds_efficiency
    }));

    this.quadrant_chart_options.series[0].data = points;
    this.quadrant_chart_options.xAxis.plotLines = [{
      value: this.quadrantX,
      color: 'red',
      dashStyle: 'Dash',
      width: 2,
      label: { text: `X = ${this.quadrantX}`, align: 'right' }
    }];
    this.quadrant_chart_options.yAxis.plotLines = [{
      value: this.quadrantY,
      color: 'red',
      dashStyle: 'Dash',
      width: 2,
      label: { text: `Y = ${this.quadrantY}%`, align: 'right' }
    }];

    if (this.chart) {
      // ✅ Update chart existing, jangan recreate
      this.chart.series[0].setData(points, true);
      this.chart.xAxis[0].update({ plotLines: this.quadrant_chart_options.xAxis.plotLines }, false);
      this.chart.yAxis[0].update({ plotLines: this.quadrant_chart_options.yAxis.plotLines }, true);
    } else {
      // Pertama kali, baru create
      this.chart = Highcharts.chart(
        this.quadrant_chart_el.nativeElement,
        this.quadrant_chart_options
      );
    }
  }
  
  formatDate(date: Date): string {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
      day: 'numeric'
    });
  }
  start_dateChange(event: any) {
  if (!event.value) return;

  this.start_dateControl.setValue(event.value);
  this.start_dateInput = this.formatDate(event.value);

  // this.refreshQuadrant();
  }

  end_dateChange(event: any) {
    if (!event.value) return;

    this.end_dateControl.setValue(event.value);
    this.end_dateInput = this.formatDate(event.value);

    // this.refreshQuadrant();
  }

  refreshQuadrant() {
    if (!this.start_dateControl.value || !this.end_dateControl.value) {
      return;
    }
    this.isLoadingResults = true;

  const params = new HttpParams()
    .append('startDate', this.start_dateControl.value.toISOString())
    .append('endDate', this.end_dateControl.value.toISOString())
    .append('mode', 'optimasi_chart');
  
  forkJoin([
    this.http.get<any>('/api/pe/daily/optimasi', { params }),
    this.http.get<any>('/api/pe/daily/optimasi/quadrant-remark')
  ]).subscribe(([optimasi, remarks]) => {

    // Buat map well -> remark untuk merge
    const remarkMap: Record<string, string> = {};
    (remarks.items || []).forEach(r => remarkMap[r.well] = r.remark);

    this.allItems = (optimasi.items || []).map(item => ({
      ...item,
      quadrant_remark: remarkMap[item.well] || ''
    }));

    this.applyAreaFilter();
    this.isLoadingResults = false;
  }, _ => this.isLoadingResults = false);

  // this.http.get('/api/pe/daily/optimasi', { params })
  //   .subscribe((res: any) => {

  //     this.allItems = res.items || [];
  //     this.applyAreaFilter();
  //     this.isLoadingResults = false;
  //   }, _ => this.isLoadingResults = false);
  }

  savingRows: Set<string> = new Set();

  editRemark(row: any) {
    row._remarkBackup = row.quadrant_remark; // backup sebelum edit
    row.isRemarkEdit = true;
  }

  cancelRemark(row: any) {
    row.quadrant_remark = row._remarkBackup;  // restore backup
    row.isRemarkEdit = false;
  }

  saveRemark(row: any) {
    if (!row.well) return;
    this.savingRows.add(row.well);

    this.http.post('/api/pe/daily/optimasi/quadrant-remark', {
      well: row.well,
      remark: row.quadrant_remark
    }).subscribe({
      next: () => {
        this.savingRows.delete(row.well);
        row.isRemarkEdit = false;
        delete row._remarkBackup;
        this.snackbarService.status.next(
          new SnackbarApi(true, `Remark ${row.well} saved.`, 'dismiss')
        );
      },
      error: () => {
        this.savingRows.delete(row.well);
        this.cancelRemark(row); // rollback jika gagal
        this.snackbarService.status.next(
          new SnackbarApi(true, 'Failed to save remark.', 'dismiss')
        );
      }
    });
  }

getColumnValues(param: any) {
  const column = param["column"];
  const filter = param["filter"];

  let sourceItems = this.allItems;

  if (filter && filter.trim() !== '') {
    sourceItems = sourceItems.filter(item =>
      item[column] != null &&
      String(item[column]).toLowerCase().includes(filter.toLowerCase())
    );
  }

  const uniqueValues: any[] = Array.from(
    new Set(sourceItems.map(item => item[column]).filter(v => v != null))
  );

  const payload = { column: column, items: uniqueValues };

  // Emit langsung (untuk kasus filter teks di dialog yang sudah subscribe)
  this.xfilterService.updateItems(payload);

  // Emit lagi setelah delay (untuk kasus pertama kali dialog dibuka,
  // subscription belum aktif saat emit pertama)
  setTimeout(() => {
    this.xfilterService.updateItems(payload);
  }, 100);
}
getColumnFilter() {
  var columnfilter = {};
  if (this.date_xSelected.length) columnfilter["date"] = this.date_xSelected;
  if (this.well_xSelected.length) columnfilter["well"] = this.well_xSelected;//.map(s => "^"+s+"$");
  if (this.avg_sm_xSelected.length) columnfilter["avg_sm"] = this.avg_sm_xSelected;
  if (this.avg_ds_efficiency_xSelected.length) columnfilter["avg_ds_efficiency"] = this.avg_ds_efficiency_xSelected;
  
  return columnfilter;

}
updateXAxis(event?: any) {
  if (!this.chart) return;
  // update xAxisMax dari event target value (HTML range input)
  if (event && event.target && event.target.value) {
    this.xAxisMax = Number(event.target.value);
  }

  this.chart.xAxis[0].update({
    min: 0,
    max: this.xAxisMax,
    endOnTick: false,  // Jangan auto-adjust tick terakhir
    startOnTick: true,  // Mulai dari 0 dengan tick
    tickInterval: 5  // Interval tetap 5
  });
}

updateYAxis(event?: any) {
  if (!this.chart) return;
  // update yAxisMax dari event target value 
  if (event && event.target && event.target.value) {
    this.yAxisMax = Number(event.target.value);
  }

  this.chart.yAxis[0].update({
    min: 0,
    max: this.yAxisMax,
    endOnTick: false,  // Jangan auto-adjust tick terakhir
    startOnTick: true,  // Mulai dari 0 dengan tick
    tickInterval: 5  // Interval tetap 5
  }, true);
}
  updateQuadrantLines() {
    if (!this.chart) return;

    // Update plot lines untuk X Axis
    this.chart.xAxis[0].update({
      plotLines: [{
        value: this.quadrantX,
        color: 'red',
        dashStyle: 'Dash',
        width: 2,
        label: {
          text: `X = ${this.quadrantX}`,
          align: 'right'
        }
      }]
    }, false); // false = tidak redraw dulu

    // Update plot lines untuk Y Axis
    this.chart.yAxis[0].update({
      plotLines: [{
        value: this.quadrantY,
        color: 'red',
        dashStyle: 'Dash',
        width: 2,
        label: {
          text: `Y = ${this.quadrantY}%`,
          align: 'right'
        }
      }]
    }, true); // true = redraw sekarang

  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.allItems.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.allItems.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.presence_user_workday_cycle_id}`;
  }

  deleteSelected() {
    this.snackbarService.status.next(new SnackbarApi(false));

    const dialogRef = this.dialog.open(PeDailyOptimasiDeleteDialogComponent, {
      width: '250px',
      data: this.selection.selected.length
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoadingResults = true;
        this.snackbarService.status.next(new SnackbarApi(false));
        this.http.delete<any>('/api/pe/daily', {
          headers: new HttpHeaders({
            'Content-Type': 'application/json'
          }),
          params: {
            _ids: this.selection.selected.map<any>(s => s._id)
          }
        }).subscribe(res => {
          this.isLoadingResults = false;
          this.snackbarService.status.next(new SnackbarApi(true, res["deleted_count"] + " item(s) deleted successfully.", "dismiss"));
          this.paginator._changePageSize(this.paginator.pageSize);
        },
          error => {
            this.isLoadingResults = false;
            this.snackbarService.status.next(new SnackbarApi(true, error['message'], "dismiss"));
          })
      }
    });
  }

  // saveRemark(row: any) {
  //   this.http.post('/api/pe/optimasi/quadrant-remark', {
  //     well: row.well,
  //     remark: row.quadrant_remark
  //   }).subscribe(res => {
  //     this.snackbarService.status.next(
  //       new SnackbarApi(true, 'Remark saved', 'dismiss')
  //     );
  //   }, err => {
  //     this.snackbarService.status.next(
  //       new SnackbarApi(true, 'Failed to save remark', 'dismiss')
  //     );
  //   });
  // }
}


