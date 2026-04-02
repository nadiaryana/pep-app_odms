import { Component, OnInit } from '@angular/core';
import { TitleService } from "src/app/navigation/title/title.service";
import * as Highcharts from "highcharts";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-pe-grafik',
  templateUrl: './pe-grafik.component.html',
  styleUrls: ['./pe-grafik.component.scss']
})
export class PeGrafikComponent implements OnInit {
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options | null = null;

  constructor(private titleService: TitleService, private http: HttpClient) {}

  // Mapping antara Display Name dan Actual Field Name di MongoDB
  fieldMapping: { [key: string]: string } = {
    'Pump Displace': 'ds_pump_displace',
    'KD': 'ds_kd',
    'Stroke Length': 'ds_sl',
    'Current Gross': 'fig_curr_gross',
    'Current Net': 'fig_curr_net',
    'Last Gross': 'fig_last_gross',
    'Last Net': 'fig_last_net',
    'SPM': 'ds_spm',
    'WHP': 'ds_whp',
    'FL': 'ds_fl',
    'Casing': 'ds_casing',
    'Separator': 'ds_separator',
    'Efficiency': 'ds_efficiency',
    'WC': 'wc',
    'WOR': 'wor',
    'GOR': 'gor',
    'GLR': 'glr',
    'SM': 'sm',
  };

  // Display names untuk dropdown 
  yColumns: string[] = Object.keys(this.fieldMapping);

  selectedX: string = "date";
  selectedY1: string = "Pump Displace";      // Display name
  selectedY2: string = "KD";                 // Display name
  startDate?: string | Date;
  endDate?: string | Date;

  dynamicChartOptions: Highcharts.Options = {};


  ngOnInit() {
    this.titleService.titleSource.next({
      title: "Diagnostic Chart",
      icon: "assessment",
      breadcrumbs: [
        { label: "Petroleum Engineering", routerLink: "" },
        { label: "Dashboard", routerLink: "" },
      ],
    });

    // set startDate default value first day of current month
    const now = new Date();
    this.startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    this.endDate = now;
    this.updateChart();
  }
  // updateChart(): void {
  //   // alert if startDate or endDate is empty
  //   if (!this.startDate || !this.endDate) {
  //     alert("Please select both start date and end date.");
  //     return;
  //   }

  //   const params = new URLSearchParams();
  //   // removed x parameter — only send y1, y2 and optional date range
  //   params.set("y1", this.selectedY1);
  //   params.set("y2", this.selectedY2);

  //   const formatDate = (d?: string | Date) => {
  //     if (!d) return null;
  //     if (d instanceof Date) return d.toISOString();
  //     return d;
  //   };

  //   const s = formatDate(this.startDate);
  //   const e = formatDate(this.endDate);
  //   if (s) params.set("startDate", s);
  //   if (e) params.set("endDate", e);

  //   const url = `/api/pe/chart/dynamic?${params.toString()}`;
  //   this.http.get<any>(url).subscribe({
  //     next: (res) => {
  //       this.chartOptions = res.options;
  //     },
  //     error: (err) => {
  //       // console.error("Gagal ambil data chart", err.error);
  //       alert("Terjadi kesalahan: " + err.error);
  //       this.chartOptions = null;
  //     },
  updateChart(): void {
    if (!this.startDate || !this.endDate) {
      alert("Please select both start date and end date.");
      return;
    }

    // Ambil actual field names dari mapping
    const y1FieldName = this.fieldMapping[this.selectedY1];
    const y2FieldName = this.fieldMapping[this.selectedY2];

    if (!y1FieldName || !y2FieldName) {
      alert("Invalid field selection");
      return;
    }

    const params = new URLSearchParams();
    // Kirim actual field names ke backend
    params.set("y1", y1FieldName);
    params.set("y2", y2FieldName);

    const formatDate = (d?: string | Date) => {
      if (!d) return null;
      if (d instanceof Date) return d.toISOString();
      return d;
    };

    const s = formatDate(this.startDate);
    const e = formatDate(this.endDate);
    if (s) params.set("startDate", s);
    if (e) params.set("endDate", e);

    const url = `/api/pe/chart/DynamicChart?${params.toString()}`;

    this.http.get<any>(url).subscribe({
      next: (res) => {
        this.chartOptions = {
          chart: { type: 'line', zoomType: 'x' },
          // Gunakan display names dari selectedY1 dan selectedY2
          title: { text: `${this.selectedY1} & ${this.selectedY2}` },
          xAxis: { type: 'datetime' },
          yAxis: [{
            title: { text: this.selectedY1 }
          },{
            title: { text: this.selectedY2 },
            opposite: true
          }],
          plotOptions: {
            series: {
              marker: { enabled: false },
              lineWidth: 1,
              turboThreshold: 50000
            }
          },
          series: [{
            type: 'line',
            name: this.selectedY1,
            data: res.series1,
            yAxis: 0,
          },{
            type: 'line',
            name: this.selectedY2,
            data: res.series2,
            yAxis: 1,
          }]
        };
      },
      error: (err) => {
        alert("Terjadi kesalahan: " + err.error);
        this.chartOptions = null;
      },
    });
  }

  onXYChange() {
    this.updateChart();
  }

  // updateChart() {
  //   const xItem = this.xDataSets.find((d) => d.name === this.selectedX);
  //   const yItem = this.yDataSets.find((d) => d.name === this.selectedY);

  //   const xData = xItem ? xItem.values : [];
  //   const yData = yItem ? yItem.values : [];

  //   const combinedData: [number, number][] = xData.map((x, i) => [
  //     x,
  //     yData[i] ? yData[i] : null,
  //   ]);

  //   this.dynamicChartOptions = {
  //     chart: { type: "scatter", zoomType: "xy" },
  //     title: { text: `X${this.selectedX + 1} vs Y${this.selectedY + 1}` },
  //     xAxis: { title: { text: "X Value" } },
  //     yAxis: { title: { text: "Y Value" } },
  //     series: [
  //       {
  //         type: "scatter",
  //         name: "Selected Dataset",
  //         data: combinedData,
  //       },
  //     ],
  //   }
  // }


//  updateChart() {
//   const categories = this.dataset.map(d => d[this.selectedX as keyof typeof d].toString());
//   const values = this.dataset.map(d => Number(d[this.selectedY as keyof typeof d]));

//   this.chartOptions = {
//     title: { text: `${this.selectedY} vs ${this.selectedX}` },
//     xAxis: { categories, title: { text: this.selectedX } },
//     yAxis: { title: { text: this.selectedY } },
//     series: [
//       {
//         type: 'line',
//         name: this.selectedY,
//         data: values
//       }
//     ]
//   };
// }

//   onYChange() {
//     this.updateChart();
//   }
// }

// import { Component, OnInit } from '@angular/core';
// import { TitleService } from "src/app/navigation/title/title.service";
// import * as Highcharts from "highcharts";
// import { HttpClient } from "@angular/common/http";

// @Component({
//   selector: 'app-pe-grafik',
//   templateUrl: './pe-grafik.component.html',
//   styleUrls: ['./pe-grafik.component.scss']
// })
// export class PeGrafikComponent implements OnInit {
//   Highcharts: typeof Highcharts = Highcharts;
//   chartOptions: Highcharts.Options | null = null;

//   constructor(private titleService: TitleService, private http: HttpClient) {}

//   // Pilihan kolom dari database Daily
//   xColumns: string[] = ["date"]; 
//   yColumns: string[] = ["last_prod_hours", "last_prod_gross", "last_prod_net"];

//   selectedX: string = "date";
//   selectedY: string = "last_prod_gross";

//   ngOnInit() {
//     this.titleService.titleSource.next({
//       title: "Diagnostic Chart",
//       icon: "assessment",
//       breadcrumbs: [
//         { label: "Petroleum Engineering", routerLink: "" },
//         { label: "Dashboard", routerLink: "" },
//       ],
//     });

//     this.updateChart();
//   }

//   updateChart() {
//     const url = `/api/pe/chart/dynamic?x=${this.selectedX}&y=${this.selectedY}`;
//     this.http.get<any>(url).subscribe({
//       next: (res) => {
//         this.chartOptions = res.options;
//       },
//       error: (err) => {
//         console.error("Gagal ambil data chart", err);
//       }
//     });
//   }

//   onXChange() {
//     this.updateChart();
//   }

//   onYChange() {
//     this.updateChart();
//   }
// }
}
