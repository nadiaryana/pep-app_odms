import { Component, OnInit } from "@angular/core";
import { TitleService } from "src/app/navigation/title/title.service";
import { HttpClient } from "@angular/common/http";
import * as Highcharts from "highcharts";

interface Well {
  id: number;
  name: string;
  status: "ON" | "OFF" | "UNKNOWN";
  channelId: string;
  apiKey: string;
}

@Component({
  selector: "app-sumur",
  templateUrl: "./pe-sumur.component.html",
  styleUrls: ["./pe-sumur.component.scss"],
})
export class SumurComponent implements OnInit {
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options | null = null;

  constructor(private titleService: TitleService, private http: HttpClient) {}
  todayDate: string = new Date().toLocaleDateString("id-ID");

  wells: Well[] = [
    { id: 1, name: "ST-182", status: "UNKNOWN", channelId: "2817240", apiKey: "5QNHFDXBQHSSEMEM" },
    { id: 2, name: "ST-092", status: "UNKNOWN", channelId: "2817838", apiKey: "Y6S3WJA4ZEIG67OA" },
    { id: 3, name: "ST-159", status: "UNKNOWN", channelId: "2826853", apiKey: "VGBBTAVANY97BLWQ" },
    { id: 4, name: "ST-161", status: "UNKNOWN", channelId: "2987295", apiKey: "TRI6GE6UIE89CFQ5" },
  ];

  selectedWell: Well | null = null;

  ngOnInit(): void {
    // refresh statuses on init
    this.refreshAllWellStatuses();
  }

  private evaluateStatusFromValue(value: number): "ON" | "OFF" {
    return value > 1 ? "ON" : "OFF";
  }

  // Fetch latest field1 value from ThingSpeak and update the well status.
  // Uses the same rule: ON if field1 > 1, OFF if field1 <= 1.
  fetchLatestField1FromThingSpeak(well: Well): void {
    const url = `https://api.thingspeak.com/channels/${well.channelId}/fields/1.json?results=1&api_key=${well.apiKey}`;
    this.http.get<any>(url).subscribe(
      (res: any) => {
        const feeds = (res && res.feeds) || [];
        const latestField = feeds.length ? parseFloat(feeds[feeds.length - 1].field1) || 0 : 0;
        const newStatus = this.evaluateStatusFromValue(latestField);
        well.status = newStatus;
        if (this.selectedWell && this.selectedWell.id === well.id) {
          this.selectedWell.status = newStatus;
        }
      },
      (err: any) => {
        console.error(`Failed to fetch latest field1 for ${well.name}`, err);
      }
    );
  }

  // Convenience: refresh statuses for all wells (call this from ngOnInit if desired)
  refreshAllWellStatuses(): void {
    this.wells.forEach((w: Well) => this.fetchLatestField1FromThingSpeak(w));
  }

  selectWell(well: Well): void {
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
      (res: any) => {
        const feeds = (res && res.feeds) || [];

        const chartData: [number, number][] = feeds.map((f: any) => {
          const ts = Date.parse(f.created_at);
          const val = parseFloat(f.field1) || 0;
          return [ts, val];
        });

        // set well status based on latest field1 value (>1 => ON, <=1 => OFF)
        if (chartData.length > 0) {
          const latestVal = chartData[chartData.length - 1][1];
          if (latestVal > 1) {
            well.status = "ON";
          } else {
            // <= 1: treat as OFF
            well.status = "OFF";
          }

          if (this.selectedWell && this.selectedWell.id === well.id) {
            this.selectedWell.status = well.status as "ON" | "OFF";
          }
        }

        // Uncomment and set this.chartOptions if you want to render the chart with Highcharts
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
      (err: any) => {
        console.error(`Failed to fetch data for ${well.name}`, err);
      }
    );
  }
}
