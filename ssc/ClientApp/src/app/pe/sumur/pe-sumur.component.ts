import { Component, OnInit } from "@angular/core";
import { TitleService } from "src/app/navigation/title/title.service";
import { HttpClient } from "@angular/common/http";
import * as Highcharts from "highcharts";

@Component({
  selector: "app-sumur",
  templateUrl: "./pe-sumur.component.html",
  styleUrls: ["./pe-sumur.component.scss"],
})
export class SumurComponent implements OnInit {
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options | null = null;


  todayDate: string = new Date().toLocaleDateString("id-ID");

  // list sumur
  wells = [
    {
      id: 1,
      name: "ST-182",
      status: "ON",
      channelId: "2817240",
      apiKey: "5QNHFDXBQHSSEMEM",
    },
    {
      id: 2,
      name: "ST-092",
      status: "ON",
      channelId: "2817838",
      apiKey: "Y6S3WJA4ZEIG67OA",
    },
    {
      id: 3,
      name: "ST-159",
      status: "OFF",
      channelId: "2826853",
      apiKey: "VGBBTAVANY97BLWQ",
    },
    {
      id: 4,
      name: "ST-161",
      status: "ON",
      channelId: "2987295",
      apiKey: "TRI6GE6UIE89CFQ5",
    },
  ];

  selectedWell: { id: number; name: string; status: "ON" | "OFF" } | null = null;

  constructor(private titleService: TitleService, private http: HttpClient) {}

  ngOnInit() {
    this.titleService.titleSource.next({
      title: "Sumur",
      icon: "waves",
      breadcrumbs: [
        { label: "Petroleum Engineering", routerLink: "" },
        { label: "Dashboard", routerLink: "" },
      ],
    });
  }

  selectWell(well: any) {
    this.selectedWell = well;

    // Call backend instead of full ThingSpeak API
    const backendUrl = `/api/pe/sumur/fetch`;
    const httpOptions = {
      params: {
        channelId: well.channelId,
        apiKey: well.apiKey,
        wellName: well.name,
      },
    };

    this.http.get<any>(backendUrl, httpOptions).subscribe(
      (res) => {
        const feeds = res.feeds;

        const chartData: [number, number][] = feeds.map((f) => {
          const ts = Date.parse(f.created_at);
          const val = parseFloat(f.field1) || 0;
          return [ts, val];
        });

        this.chartOptions = {
          chart: { type: "line", backgroundColor: "#fff" },
          title: { text: well.name },
          time: { useUTC: false },
          xAxis: { type: "datetime" },
          yAxis: { title: { text: "Arus (A)" } },
          tooltip: { valueSuffix: " A" },
          legend: { enabled: false },
          series: [
            {
              type: "line",
              name: "Arus",
              data: chartData,
            },
          ],
        };
      },
      (error) => {
        console.error(error);
      }
    );

    // Tetap ambil data langsung ke ThingSpeak untuk chart
    const url = `https://api.thingspeak.com/channels/${well.channelId}/fields/1.json?api_key=${well.apiKey}&results=100`;
    this.http.get<any>(url).subscribe(res => {
    const feeds = res.feeds;

    const chartData: [number, number][] = feeds.map(f => {
      const ts = Date.parse(f.created_at);
      const val = parseFloat(f.field1) || 0;
      return [ts, val];
    });

    this.chartOptions = {
      chart: { type: 'line', backgroundColor: '#fff' },
      title: { text: well.name },
      time: { useUTC: false },
      xAxis: { type: 'datetime' },
      yAxis: { title: { text: 'Arus (A)' } },
      tooltip: { valueSuffix: ' A' },
      legend: { enabled: false },
      series: [{
        type: 'line',
        name: 'Arus',
        data: chartData
      }]
    };
    });
  }
  // Dummy dataset
  // dataset = [
  //   { date: "2025-09-01", oil: 120, gas: 80, water: 20 },
  //   { date: "2025-09-02", oil: 150, gas: 60, water: 30 },
  //   { date: "2025-09-03", oil: 180, gas: 90, water: 40 },
  //   { date: "2025-09-04", oil: 100, gas: 70, water: 25 },
  //   { date: "2025-09-05", oil: 200, gas: 100, water: 50 },
  // ];

  // columns = ["date", "oil", "gas", "water"];
  // selectedX = "date";
  // selectedY = "oil";

  // // chart dari dropdown
  // updateChart() {
  //   const categories = this.dataset.map(
  //     (d) => d[this.selectedX as keyof typeof d].toString()
  //   );
  //   const values = this.dataset.map(
  //     (d) => Number(d[this.selectedY as keyof typeof d])
  //   );

  //   this.chartOptions = {
  //     chart: { type: "line", backgroundColor: "#fff" },
  //     title: { text: `${this.selectedY} vs ${this.selectedX}` },
  //     xAxis: { categories, title: { text: this.selectedX } },
  //     yAxis: { title: { text: this.selectedY } },
  //     series: [{ type: "line", name: this.selectedY, data: values }],
  //   };
}