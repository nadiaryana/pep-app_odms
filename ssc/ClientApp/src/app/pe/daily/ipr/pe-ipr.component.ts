import { Component, Input, HostListener, ViewChild, OnInit,ElementRef,} from "@angular/core";
import {FormBuilder,FormGroup,FormControl,Validators,} from "@angular/forms";
import {MatPaginator,MatSort,MatDialog,MatSnackBar,MatDialogRef,MAT_DIALOG_DATA,MatDatepicker,} from "@angular/material";
import { MatStepper } from "@angular/material/stepper";
import { Router, RouterLink } from "@angular/router";
import { Observable, of } from "rxjs";
import { HttpClient, HttpEventType, HttpParams } from "@angular/common/http";
import { TitleService } from "src/app/navigation/title/title.service";
import { SnackbarApi, SnackbarService } from "src/app/snackbar.service";
import { title } from "process";
import {catchError,map,startWith,switchMap,debounceTime,take,mergeAll,timeout,} from "rxjs/operators";
// import { ExampleHttpDao } from '../pe-daily-list.component';
import { xFilterService } from "src/app/xfilter/xfilter.component";
import * as Highcharts from 'highcharts';

// import { PeSonolog }    from './pe-sonolog';
// import { SnackbarService } from './../snackbar.service';
// import { SnackbarApi } from '../../snackbar.service';
// import { DialogService } from '../../dialog.service';

@Component({
  selector: "app-ipr",
  templateUrl: "./pe-ipr.component.html",
  styleUrls: ["./pe-ipr.component.scss"],
})
export class IprComponent implements OnInit {
  wellList: string[] = [];
  selectedWell: string = "";

  @ViewChild("well_datePicker", { static: true })
  well_datePicker: MatDatepicker<any>;
  well_dateControl = new FormControl();
  well_dateInput = this.well_dateControl.value
    ? this.well_dateControl.value.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
        day: "numeric",
      })
    : "";

  @ViewChild("start_datePicker", { static: true })
  start_datePicker: MatDatepicker<any>;
  start_dateControl = new FormControl("");
  start_dateInput = this.start_dateControl.value
    ? this.start_dateControl.value.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
        day: "numeric",
      })
    : "";

  @ViewChild("end_datePicker", { static: true })
  end_datePicker: MatDatepicker<any>;
  end_dateControl = new FormControl("");
  end_dateInput = this.end_dateControl.value
    ? this.end_dateControl.value.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
        day: "numeric",
      })
    : "";

  top_perforation_depth = new FormControl("");
  bottom_perforation_depth = new FormControl("");
  zone = new FormControl("");
  interval = new FormControl("");
  perforation_depth_reference = new FormControl("");
  static_fluid_level = new FormControl("");
  dynamic_fluid_level = new FormControl("");
  static_botthomhole_pressure = new FormControl("");
  flowing_bottomhole_pressure = new FormControl("");

  @ViewChild("ipr_chart_el", { static: true }) public ipr_chart_el: ElementRef;
  daily_table_data = [];
  daily_table_columns: string[] = ["status", "count"];

  ipr_chart_options: any;

  daily_chart_options: object = {
    chart: {
      type: "IPR",
      zoomType: "x",
      style: {
        fontFamily: "Roboto, Helvetica Neue, sans-serif",
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
                if (typeof p.y === "number") val = p.y;
                else if (Array.isArray(p.options)) val = p.options[1];
                else if (typeof p.options === "number") val = p.options;
                else if (p.options && typeof p.options.y === "number")
                  val = p.options.y;
                tot += isFinite(val) ? val : 0;
              });
              return tot;
            });
            var order = sums
              .map(function (sum: number, i: number) {
                return { i: i, sum: sum };
              })
              .sort(function (a: any, b: any) {
                return a.sum - b.sum;
              });

            // give smaller-sum series higher zIndex so they're drawn on top
            for (var k = 0; k < order.length; k++) {
              var seriesIdx = order[k].i;
              var z = order.length - k; // smaller sum -> larger zIndex
              if (chart.series[seriesIdx])
                chart.series[seriesIdx].update({ zIndex: z }, false);
            }
            chart.redraw();
          } catch (e) {
            // silent
          }
        },
      },
    },
    title: {
      text: null,
    },
  };

  exampleDatabase: ExampleHttpDao | null;
  well_xSelected = [];

  isLoadingResults: boolean = false;

  daily_data: any[] = [];
  data_pwf: any[] = [];
  data_liquid_rate: any[] = [];

  showChart: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private titleService: TitleService,
    public snackbarService: SnackbarService,
    private xfilterService: xFilterService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.exampleDatabase = new ExampleHttpDao(this.http);

    this.titleService.titleSource.next({
      title: "IPR",
      icon: "show_chart",
      breadcrumbs: [
        { label: "Petroleum Engineering", routerLink: "" },
        { label: "IPR", routerLink: "pe/ipr" },
      ],
    });

    // Panggil untuk pertama kali ambil daftar well
    this.getColumnValues({
      column: "well",
      filter: "",
      selected: [],
      clear: false,
    });

    this.xfilterService.filter.subscribe((res) => {
      this.getColumnValues(res);
    });
    this.xfilterService.selected.subscribe((res) => {
      this[res["column"] + "_xSelected"] = res["selected"];
      // console.log(res["column"] + "_xSelected");
      // console.log(res["selected"]);
      // console.log(this[res["column"] + "_xSelected"]);

      this.getDailyData();
    });

    // this.well_dateControl.valueChanges.subscribe((r) => {
    //   this.refresh_IPR();
    // });

    // this.start_dateControl.valueChanges.subscribe((r) => {
    //   this.refresh_IPR();
    // });
    // this.end_dateControl.valueChanges.subscribe((r) => {
    //   this.refresh_IPR();
    // });
    // this.well_dateControl.valueChanges.subscribe(() => this.getDailyData());
    // this.start_dateControl.valueChanges.subscribe(() => this.refresh_IPR());
    // this.end_dateControl.valueChanges.subscribe(() => this.refresh_IPR());
  }

  getColumnValues(param: any) {
    var column = param["column"];
    var filter = param["filter"];
    var selected = param["selected"];
    var clear = param["clear"];
    var columnfilter = { well: this.well_xSelected.map((s) => "^" + s + "$") };
    if (filter) columnfilter[column] = [filter];
    if (selected && selected.length > 0)
      columnfilter[column] = selected.map((s) => "^" + s + "$");
    if (clear) delete columnfilter[column];

    return this.exampleDatabase!.getRepoIssues(
      "well",
      "asc",
      0,
      0,
      "",
      columnfilter,
      "well"
    )
      .pipe(
        map((res) => {
          return res;
        })
      )
      .subscribe(
        (res) => {
          this.xfilterService.updateItems({ column: "well", items: res.items });
        },
        () => {}
      );
  }

  well_dateChange(evt) {
    this.well_dateInput = evt.value.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
      day: "numeric",
    });

    console.log(this.well_dateInput, "well_dateChange", evt);

    this.getDailyData();
  }

  start_dateChange(evt) {
    this.start_dateInput = evt.value.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
      day: "numeric",
    });

    this.getDailyData();
  }

  end_dateChange(evt) {
    this.end_dateInput = evt.value.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
      day: "numeric",
    });

    this.getDailyData();
  }

  onWellSelectionChange() {
    console.log(this.well_xSelected, "onWellSelectionChange");

    this.getDailyData();
  }

  refresh_IPR() {
    if (!this.well_xSelected.length) return;

    let params = new HttpParams()
      .set("well_date", this.well_dateControl.value.toISOString())
      .set("date", this.start_dateControl.value.toISOString())
      .set("end_date", this.end_dateControl.value.toISOString());

    for (const w of this.well_xSelected) {
      params = params.append("well", w);
      console.log(w);
    }

    this.isLoadingResults = true;

    this.http
      .get<any>("/api/pe/daily/ipr", { params: params })
      .subscribe((res: any) => {
        this.isLoadingResults = false;
        // handle response here, e.g. update chart data
        // }, (err: any) => {
        //   this.isLoadingResults = false;
        //   console.error(err);
      });
  }

  // dailyAverages: { date: string, grossAvg: number, netAvg: number, wcAvg: string }[] = [];
  dailyAverages: {
    well: string;
    grossAvg: number;
    netAvg: number;
    wcAvg: number;
  }[] = [];

  loadingGetDailyData: boolean = false;
  getDailyData() {
    if (!this.start_dateInput || !this.end_dateInput) {
      this.snackbarService.status.next(
        new SnackbarApi(true, "Please select start and end date.", "dismiss", {
          duration: 3000,
        })
      );
      return;
    }

    this.loadingGetDailyData = true;

    let params = new HttpParams();
    // start date
    let startDate = new Date(this.start_dateInput);
    // end date +1 after start date
    let endDate = new Date(this.end_dateInput); // clone
    // endDate.setDate(startDate.getDate());

    if (!this.well_xSelected || this.well_xSelected.length === 0) {
      this.snackbarService.status.next(
        new SnackbarApi(true, "Please select at least one well.", "dismiss", {
          duration: 3000,
        })
      );
      return;
    }

    params = params
      .append("type", "well_performance_daily")
      .append("date", new Date(startDate).toISOString())
      .append("end_date", new Date(endDate).toISOString());

    for (const w of this.well_xSelected) {
      params = params.append("well", w);
      // console.log(w);
    }

    // get api data daily
    this.http
      .get<any>("/api/pe/daily/GetAreaChart", { params: params })
      .subscribe(
        (res) => {
          const allData = res.data || [];

          // Filter hanya data sumur yang dipilih
          const filteredData = allData.filter((d) =>
            this.well_xSelected.includes(d.well)
          );

          // Simpan daily data untuk tabel
          this.daily_data = filteredData;

          // Hitung rata-rata per tanggal untuk gross, net, wc
          this.dailyAverages = this.calculateWellAverages(
            filteredData,
            this.start_dateInput,
            this.end_dateInput
          );

          // order data by date ascending
          const dataSortedDate = filteredData.sort((a, b) => {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
          });
          // get latest zone and interval from data
          const latestData = dataSortedDate[dataSortedDate.length - 1];

          const zone = latestData ? this.formatZone(latestData.zone) : "";
          const interval = latestData
            ? this.formatInterval(latestData.interval)
            : "";

          //ambil zona dari data
          this.zone.setValue(zone);
          // console.log("zone:", zone);
          // console.log("this.zone.value:", this.zone.value);

          //interval
          this.interval.setValue(interval);
          // console.log("interval:", interval);
          // console.log("this.interval.value:", this.interval.value);

          this.loadingGetDailyData = false;
          // fallback: clear loading state and notify user if request takes too long
          setTimeout(() => {
            this.loadingGetDailyData = false;
          }, 2000);
        },
        (err) => {
          this.daily_data = [];
          this.dailyAverages = [];
          this.loadingGetDailyData = false;
        }
      );
  }

  formatInterval(interval: any): string {
    if (!interval || !Array.isArray(interval)) return "-";
    return interval
      .map((iv: any) => (Array.isArray(iv) ? iv.join("-") : iv))
      .join(", ");
  }

  formatZone(zone: any): string {
    if (!zone || !Array.isArray(zone)) return "-";
    return zone.join(", ");
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
      day: "numeric",
    });
  }

  // perforation depth change handler
  perforationChange() {
    // read raw values (string or number)
    const topRaw = this.top_perforation_depth.value;
    const bottomRaw = this.bottom_perforation_depth.value;
    const reference = this.perforation_depth_reference.value;

    // coerce to number safely
    const topDepth = topRaw === null || topRaw === "" ? NaN : Number(topRaw);
    const bottomDepth =
      bottomRaw === null || bottomRaw === "" ? NaN : Number(bottomRaw);

    // console.log("raw:", { topRaw, bottomRaw, reference });
    // console.log("parsed:", { topDepth, bottomDepth });

    if (isNaN(topDepth) || isNaN(bottomDepth)) {
      // handle missing/invalid inputs
      console.warn("Top or bottom depth is not a valid number");
      // optionally update reference control or bail out
      return;
    }

    // (example) set the reference to average:
    const avg = (topDepth + bottomDepth) / 2;
    this.perforation_depth_reference.setValue(avg.toFixed(2));

    // any other logic
    // console.log("Perforation Change:", topDepth, bottomDepth, reference);
  }

  testData() {
    if (!this.start_dateInput || !this.end_dateInput) {
      this.snackbarService.status.next(
        new SnackbarApi(true, "Please select a well date.", "dismiss", {
          duration: 3000,
        })
      );
      return;
    }

    if (!this.static_fluid_level.value || !this.dynamic_fluid_level.value) {
      this.snackbarService.status.next(
        new SnackbarApi(
          true,
          "Please enter static and dynamic fluid levels.",
          "dismiss",
          {
            duration: 3000,
          }
        )
      );
      return;
    }

    console.log("daily data :", this.daily_data);
    const dailyData = this.daily_data;
    // config data
    const topRaw = this.top_perforation_depth.value;
    const bottomRaw = this.bottom_perforation_depth.value;
    const static_fl = this.static_fluid_level.value;
    const dynamic_fl = this.dynamic_fluid_level.value;

    const dailyAverages = this.dailyAverages;

    // ambil per average
    const wcAvg = dailyAverages.length > 0 ? dailyAverages[0].wcAvg : 0;
    const grossAvg = dailyAverages.length > 0 ? dailyAverages[0].grossAvg : 0;

    // 🔹 Hitung PS (sbhp) dan PWF (fbhp)
    const ps = (0.433 * wcAvg/100 + 0.346 * (1 - wcAvg/100)) * (bottomRaw - static_fl) * 3.281;
    this.static_botthomhole_pressure.setValue(ps.toFixed(2));
    const pwf = (0.433 * wcAvg/100 + 0.346 * (1 - wcAvg/100)) * (bottomRaw - dynamic_fl) * 3.281;
    this.flowing_bottomhole_pressure.setValue(pwf.toFixed(2));

    // hitung IPR
    const pi = grossAvg / (ps - pwf);
    const qmax = pi * ps;

    console.log(`pi = ${grossAvg} / ${ps} - ${pwf} = ${pi}`);
    console.log(`qmax = ${pi} * ${ps} = ${qmax}`);

    // get pwf values
    const pwf_values = this.getPwf(this.static_botthomhole_pressure.value);
    console.log("pwf_values:", pwf_values);
    this.data_pwf = pwf_values;

    // get liquid rate values
    const liquid_rate_values = this.getLiquidRate(this.static_botthomhole_pressure.value, qmax );
    this.data_liquid_rate = liquid_rate_values;
    console.log("liquid_rate_values:", liquid_rate_values);

    if(this.data_pwf.length > 0 && this.data_liquid_rate.length > 0){
      this.generateChart();
      this.showChart = true;
    }else{
      // this.showChart = false;
    }
  }

  getPwf(sbhp: any, iteration = 1) {
    const pwf_values = [];

    for (let i = iteration; i >= 0; i -= 0.1) {
      let rounded = parseFloat(i.toFixed(1));

      // Fix floating-point drift: anything near 0 becomes exactly 0
      if (Math.abs(rounded) < 1e-10) {
        rounded = 0;
      }

      const result = rounded * sbhp;
      pwf_values.push(result);
    }

    return pwf_values;
  }

  getLiquidRate(sbhp: any, qmax: any, iteration = 1) {
    const liquid_rates = [];

    for (let i = iteration; i >= 0; i -= 0.1) {
      let rounded = parseFloat(i.toFixed(1));

      const result =
        qmax *
        (1 - 0.2 * ((i * sbhp) / sbhp) - 0.8 *( Math.pow((i * sbhp) / sbhp, 2)));

      liquid_rates.push(result);
    }

    return liquid_rates;
  }

  // generateChart() {
  //   this.ipr_chart_options = {
  //     chart: {
  //       type: "line",
  //       zoomType: "x",
  //       style: {
  //         fontFamily: "Roboto, Helvetica Neue, sans-serif",
  //       },
  //     },
  //     title: {
  //       text: null,
  //     },
  //     series: [
  //       {
  //         name: "Pwf",
  //         data: this.data_pwf.map((y: any, index: number) => {
  //           return { x: index * 0.1, y: y };
  //         }),
  //         color: "#1E88E5",
  //         zIndex: 2,
  //       },
  //       {
  //         name: "Liquid Rate",
  //         data: this.data_liquid_rate.map((q: any, index: number) => {
  //           return { x: index * 0.1, y: q };
  //         }),
  //         color: "#43A047",
  //         zIndex: 1,
  //         type: "line",
  //         marker: { enabled: true, radius: 3 },
  //       },
  //     ],
  //     xAxis: {
  //       title: { text: "Value" },
  //     },
  //     tooltip: {
  //       shared: true,
  //       crosshairs: true,
  //       valueDecimals: 2,
  //     },
  //     yAxis: {
  //       title: { text: "Fraction (relative Pwf)" },
  //       labels: {
  //         formatter: function () {
  //           return this.value.toFixed(1);
  //         },
  //       },
  //     },
  //   };

  //   Highcharts.chart(this.ipr_chart_el.nativeElement, this.ipr_chart_options);
  // }

  generateChart() {
  this.ipr_chart_options = {
    chart: {
      type: "line",
      zoomType: "x",
      style: {
        fontFamily: "Roboto, Helvetica Neue, sans-serif",
      },
    },
    title: {
      text: "IPR Curve",
    },
    series: [
      {
        name: "IPR Curve",
        data: this.data_liquid_rate.map((q: number, i: number) => {
          return { x: q, y: this.data_pwf[i] };
        }),
        color: "#1E88E5",
        marker: {
          enabled: true,
          radius: 3,
        },
        zIndex: 2,
      },
    ],
    xAxis: {
      title: { text: "Qmax (Liquid Rate)" },
    },
    yAxis: {
      title: { text: "Pwf (psi)" },
    },
    tooltip: {
      headerFormat: "",
      pointFormat: "Q: {point.x:.2f} <br>Pwf: {point.y:.2f}",
    },
  };

  Highcharts.chart(this.ipr_chart_el.nativeElement, this.ipr_chart_options);
}





  calculateWellAverages(data: any[], startDate: string, endDate: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // 1️⃣ Filter data sesuai tanggal
    const filtered = data.filter((d) => {
      const date = new Date(d.date);
      return date >= start && date <= end;
    });

    // 2️⃣ Group berdasarkan well
    const grouped: { [well: string]: any[] } = {};
    filtered.forEach((d) => {
      const wellName = d.well;
      if (!grouped[wellName]) grouped[wellName] = [];
      grouped[wellName].push(d);
    });

    // 3️⃣ Hitung average untuk tiap well
    const averages: {
      well: string;
      grossAvg: number;
      netAvg: number;
      wcAvg: number;
    }[] = [];

    Object.keys(grouped).forEach((well) => {
      const items = grouped[well];

      const grossAvg =
        items.reduce((sum, i) => sum + (parseFloat(i.gross) || 0), 0) /
        items.length;
      const netAvg =
        items.reduce((sum, i) => sum + (parseFloat(i.net) || 0), 0) /
        items.length;

      const validWc = items
        .map((i) => {
          const val = i.wc
            ? parseFloat(i.wc.toString().replace("%", "").trim())
            : NaN;
          return val;
        })
        .filter((v) => !isNaN(v));

      const wcAvg =
        validWc.length > 0
          ? validWc.reduce((sum, v) => sum + v, 0) / validWc.length
          : 0;

      // const wcAvg = items.reduce((sum, i) => {
      //   let wcVal = 0;
      //   if (i.wc !== undefined && i.wc !== null) {
      //     if (typeof i.wc === 'string') wcVal = parseFloat(i.wc.replace('%',''));
      //     else wcVal = i.wc;
      //   } else if (i.gross && i.net) {
      //     wcVal = (1 - (i.net / i.gross)) * 100; // auto hitung kalau belum ada
      //   }
      //   return sum + wcVal;
      // }, 0) / items.length;

      averages.push({
        well,
        grossAvg: parseFloat(grossAvg.toFixed(2)),
        netAvg: parseFloat(netAvg.toFixed(2)),
        wcAvg: parseFloat(wcAvg.toFixed(2)),
      });
    });

    return averages;
  }
}

export interface PeWellApi {
  items: any[];
  total_count: number;
}

export class ExampleHttpDao {
  constructor(private http: HttpClient) {}

  getRepoIssues(
    sort: string,
    order: string,
    page: number,
    pagesize: number = 50,
    filter: string,
    columnfilter: object,
    mode: string = "",
    httpOption: object = {}
  ): Observable<PeWellApi> {
    var params = {};
    if (sort != null) params["sort"] = sort;
    if (order != null) params["order"] = order;
    if (page != null) params["page"] = page.toString();
    if (pagesize != null) params["pagesize"] = pagesize.toString();
    if (filter != null) params["filter"] = filter;
    if (Object.keys(columnfilter).length > 0)
      params["columnfilter"] = JSON.stringify(columnfilter);
    if (mode != null) params["mode"] = mode;

    httpOption["params"] = params;

    return this.http.get<PeWellApi>("/api/pe/daily", httpOption);
  }
}
