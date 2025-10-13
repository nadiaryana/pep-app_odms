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

  // Pilihan kolom
  xColumns: string[] = ["date"];
  yColumns: string[] = ["ds_pump_displace", "ds_kd", "ds_sl", "fig_curr_gross", "fig_curr_net", "fig_last_gross", "fig_last_net"];

  selectedX: string = "date";
  selectedY1: string = "ds_pump_displace";
  selectedY2: string = "ds_kd";

  
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

    this.updateChart();
  }

updateChart() {
  const url = `/api/pe/chart/dynamic?x=${this.selectedX}&y1=${this.selectedY1}&y2=${this.selectedY2}`;
  this.http.get<any>(url).subscribe(res => {
    this.chartOptions = res.options;
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
