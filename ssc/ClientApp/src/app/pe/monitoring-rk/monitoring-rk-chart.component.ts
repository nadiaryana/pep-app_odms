import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TitleService } from '../../navigation/title/title.service';
import * as Highcharts from 'highcharts';
import { FormControl } from '@angular/forms';
import { MatDatepicker } from '@angular/material';
import { SnackbarApi, SnackbarService } from 'src/app/snackbar.service';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-monitoring-rk-chart',
  templateUrl: './monitoring-rk-chart.component.html',
  styleUrls: ['./monitoring-rk.scss']
})
export class MonitoringRKChartComponent implements OnInit, AfterViewInit {

  @ViewChild('ganttChart', { static: true }) ganttChartEl: ElementRef;
  @ViewChild('start_datePicker', { static: true }) start_datePicker: MatDatepicker<any>;
  @ViewChild('end_datePicker',   { static: true }) end_datePicker:   MatDatepicker<any>;


  start_dateControl = new FormControl();
  start_dateInput   = '';
  end_dateControl   = new FormControl();
  end_dateInput     = '';

  isLoading:    boolean = false;  

  activeRange: string = '1m';


  chartData: any[] = [];   
  chart:     any;


  constructor(
    private titleService: TitleService,
    private http: HttpClient,
    private snackbarService: SnackbarService,
  ) { }
  
  ngOnInit() {
    this.titleService.titleSource.next({
      title: "MonitoringRK",
      icon: "bar_chart",
      breadcrumbs: [
        { label: 'Petroleum Engineering', routerLink: '' },
        { label: 'MonitoringRK', routerLink: 'pe/monitoring-rk' },
        { label: 'MonitoringRK', routerLink: '' }
      ]
    });

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

    this.http.get<any>('/api/pe/MonitoringRK', {
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

  refreshChart() {
    this.loadData();
  }

}
