declare var require: any;

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
import { formatDate } from '@angular/common';
// import * as html2canvas from 'html2canvas';

const html2canvas = require('html2canvas');


// import { PeSonolog }    from './pe-sonolog';
// import { SnackbarService } from './../snackbar.service';
// import { SnackbarApi } from '../../snackbar.service';
// import { DialogService } from '../../dialog.service';

@Component({
  selector: "app-one-slide",
  templateUrl: "./pe-one-slide.component.html",
  styleUrls: ["./pe-one-slide.component.scss"],
})
export class OneSlideComponent implements OnInit {
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

  @ViewChild('daily_chart_el', { static: false })
  public daily_chart_el!: ElementRef;

  @ViewChild('daily_chart_daily_el', { static: false })
  public daily_chart_daily_el!: ElementRef;

  @ViewChild('screenshotArea', { static: false })
  screenshotArea!: ElementRef;




  top_perforation_depth = new FormControl("");
  bottom_perforation_depth = new FormControl("");
  zone = new FormControl("");
  interval = new FormControl("");
  sm = new FormControl("");
  sm2 = new FormControl("");
  qmax = new FormControl("");
  ls_method = new FormControl("");
  ds_kd = new FormControl("");
  ds_kd2 = new FormControl("");
  ds_sl = new FormControl("");
  ds_spm = new FormControl("");
  size  = new FormControl("");
  lifting_capacity = new FormControl("");  
  prod_ratio = new FormControl("");  
  prod_reservoir = new FormControl(""); 
  factor_corr = new FormControl(""); 
  q_design = new FormControl("");
    

  grossAvg = new FormControl("");  
  gross = new FormControl("");  
  wc = new FormControl("");  
  gas = new FormControl("");  
  

  perforation_depth_reference = new FormControl("");
  static_fluid_level = new FormControl("");
  dynamic_fluid_level = new FormControl("");
  static_botthomhole_pressure = new FormControl("");
  flowing_bottomhole_pressure = new FormControl("");
  flowing_bottomhole_pressure2 = new FormControl("");

  @ViewChild("ipr_chart_el", { static: true }) public ipr_chart_el: ElementRef;
  daily_table_data = [];
  daily_table_columns: string[] = ["status", "count"];

  ipr_chart_options: any;
  

  daily_chart_options: object = {
    chart: {
      type: "IPR",
      zoomType: "x",
      // plotOptions: {
      //   line: {
      //     marker: {
      //       enabled: false
      //     }
      //   },
      //   area: {
      //     marker: {
      //       enabled: false
      //     }
      //   }
      // },
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
    // Sembunyikan credit Highcharts
    credits: {
      enabled: false
    },
  };

  daily_chart_options_daily: any = JSON.parse(JSON.stringify(this.daily_chart_options));

  exampleDatabase: ExampleHttpDao | null;
  well_xSelected = [];

  isLoadingResults: boolean = false;
  isCapturingScreenshot: boolean = false;

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
      title: "One Slide",
      icon: "camera",
      breadcrumbs: [
        { label: "Petroleum Engineering", routerLink: "" },
        { label: "One Slide", routerLink: "pe/one-slide" },
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
      // if res["selected"] is array and more than 1 then reset selected
      if (Array.isArray(res["selected"]) && res["selected"].length > 1) {
        this.well_xSelected = [];
        // error message
        this.snackbarService.status.next(
          new SnackbarApi(
            true,
            "Please select only one well at a time.",
            "dismiss",
            { duration: 3000 }
          )
        );
      } else {
        this[res["column"] + "_xSelected"] = res["selected"];
        this.getDailyData();
      }

    });


    this.start_dateControl.valueChanges.subscribe(() => {
    if (this.end_dateControl.value && this.well_xSelected.length > 0) {
      this.getDailyData();
      }
    });

    this.end_dateControl.valueChanges.subscribe(() => {
      if (this.start_dateControl.value && this.well_xSelected.length > 0) {
        this.getDailyData();
      }
    });

    this.sm2.valueChanges.subscribe(() => {
      if (this.showChart) {
        this.testData();
      }
    });

    this.ds_kd2.valueChanges.subscribe(() => {
      if (this.showChart) {
        this.testData();
      }
    });

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
      });
  }


  dailyAverages: {
    well: string;
    grossAvg: number;
    netAvg: number;
    wcAvg: number;
    gasAvg: number;
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
    let startDate = new Date(this.start_dateControl.value);
    // end date +1 after start date
    let endDate = new Date(this.end_dateControl.value); // clone
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

          const grossAvg =
          this.dailyAverages.length > 0
            ? this.dailyAverages[0].grossAvg
            : 0;

          const wcAvg =
          this.dailyAverages.length > 0
            ? this.dailyAverages[0].wcAvg
            : 0;

          const gasAvg =
            this.dailyAverages.length > 0
              ? this.dailyAverages[0].gasAvg
              : 0;


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
          
          const smAvg = this.calculateAverageSM(filteredData);

          //Method
          const ls_method = latestData ? latestData.ls_method : "";
          console.log("latestData full:", latestData);

          //KD
          const ds_kd = latestData ? latestData.ds_kd : "";

          //SL dan SPM
          const ds_sl = latestData ? latestData.ds_sl : "";
          const ds_spm = latestData ? latestData.ds_spm : "";

          //Size
          const size = latestData ? latestData.size : "";
          this.size.setValue(size);
          
          //Lifting Capacity
          const lifting_capacity =
            latestData && latestData.lifting_capacity != null
              ? Number(latestData.lifting_capacity)
              : 0;

          this.lifting_capacity.setValue(
            lifting_capacity > 0 ? lifting_capacity : "-"
          );

          //Production to lifting capacity ratio
          let prod_ratio = "-";
          if (lifting_capacity && lifting_capacity > 0) {
            prod_ratio = Math.round((grossAvg / lifting_capacity) * 100).toString();
          }
          this.prod_ratio.setValue(prod_ratio);


          //ambil zona dari data
          this.zone.setValue(zone);
          // console.log("zone:", zone);
          // console.log("this.zone.value:", this.zone.value);

          //interval
          this.interval.setValue(interval);
          // console.log("interval:", interval);
          // console.log("this.interval.value:", this.interval.value);

          //SM
          this.sm.setValue(smAvg.toFixed(2));

          //Method
          this.ls_method.setValue(ls_method);

          //KD
          this.ds_kd.setValue(ds_kd);

          //SL dan SPM
          this.ds_sl.setValue(ds_sl);
          this.ds_spm.setValue(ds_spm);

          //WC
           this.wc.setValue(wcAvg.toFixed(2));

          
           //Gas
           this.gas.setValue(gasAvg.toFixed(2));

            //Gross
           this.gross.setValue(grossAvg.toFixed(2));

          // setelah daily_data diisi
          this.daily_data = filteredData;

          this.loadDailyChartLikeDailyPage();


          this.loadingGetDailyData = false;
          // fallback: clear loading state and notify user if request takes too long
          setTimeout(() => {
            this.renderDailyChart(this.daily_data);
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

  calculateAverageSM(data: any[]): number {
  const validSM = data
    .map(d => Number(d.sm))
    .filter(v => !isNaN(v));

  if (validSM.length === 0) return 0;

  const total = validSM.reduce((sum, val) => sum + val, 0);
  return total / validSM.length;
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

    if (!this.start_dateControl.value || !this.end_dateControl.value) {
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
    const factor_corr = this.factor_corr.value;
    

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
    const pi = (grossAvg / (ps - pwf)) * factor_corr; // *factor correction
    const qmax = pi * ps;

    //nilai qmax
    this.qmax.setValue(qmax.toFixed(2));

    console.log(`pi = ${grossAvg} / ${ps} - ${pwf} * ${factor_corr}= ${pi}`);
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

    let prod_reservoir = "-";

    if (qmax > 0 && grossAvg > 0) {
      prod_reservoir = Math.round(grossAvg / qmax).toString();
    }

    this.prod_reservoir.setValue(prod_reservoir);

    // OPERATING DESIGN (GUARD)
    const sm2_raw = this.sm2.value;
    const kd2_raw = this.ds_kd2.value;

    // 🔒 STOP jika belum diisi
    if (
      sm2_raw === null || sm2_raw === "" ||
      kd2_raw === null || kd2_raw === ""
    ) {
      console.log("Operating Design belum diinput → dilewati");
      return;
    }

    const sm2 = Number(sm2_raw);
    const ds_kd2 = Number(kd2_raw);

    // safety check
    if (isNaN(sm2) || isNaN(ds_kd2)) {
      console.warn("Operating Design input tidak valid");
      return;
    }

    // HITUNG OPERATING DESIGN
    const dfl2 = ds_kd2 - sm2
    const pwf2 = ((0.433 * wcAvg/100) + (0.346 * (1 - wcAvg/100))) * (bottomRaw - dfl2) * 3.281;

    this.flowing_bottomhole_pressure2.setValue(pwf2.toFixed(2));

    const q_design = qmax * (1 - 0.2 * (pwf2 / ps) - 0.8 * (Math.pow(pwf2 / ps, 2)));
    this.q_design.setValue(q_design.toFixed(2));

    console.log(`Operating Design:
      Pwf_design = ${pwf2}
      q_design   = ${q_design}`);   

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

  renderDailyChart(data: any[]) {
      if (!this.daily_chart_el) return;

      const categories = data.map(d =>
      formatDate(d.date, 'dd-MMM-yy', 'en-US')
    );


      const gross = data.map(d => d.gross || 0);
      const water = data.map(d => d.wc || 0);
      const net = data.map(d => d.net || 0);
      const gas = data.map(d => d.gas || 0);
      // const sm = data.map(d => d.sm < 0 ? 0 : d.sm);

      this.daily_chart_options = {
        chart: {
          // type: 'area',
          zoomType: 'x',
        },
        title: {
          text: 'Well Production Performance of ' + this.well_xSelected.join(', '),
          style: {
            fontSize: '23px',
            // fontWeight: '600'
          }
        },
        caption: {
          text:
            this.start_dateInput +
            ' - ' +
            this.end_dateInput,
          align: 'center',
        },
        xAxis: {
          categories: categories,
          crosshair: true
        },
        yAxis: [{
          title: { text: 'Liquid (bfpd), Oil (bopd)' }
        }, {
          title: { text: 'WC (%), Gas (MMscfd)' },
          opposite: true
        }],
        tooltip: {
          shared: true
        },
        plotOptions: {
          area: {
            lineWidth: 0,
            marker: { enabled: false }
          }
        },
        series: [
          { name: 'Liquid Rate', data: gross, type: 'line', color: '#000000', 
            marker: {
                enabled: false
              }, },
          { name: 'Water Cut', data: water, type: 'line', color: '#0070C0', 
            marker: {
                enabled: false
              },
          },
          { name: 'Oil Rate', data: net, type: 'area', color: '#acc52b', 
            marker: {
                enabled: false
              },
          },
          {
            name: 'Gas Rate',
            type: 'line',
            yAxis: 1,
            dashStyle: 'ShortDot',
            color: '#af6a33',
            data: gas,
            marker: {
                enabled: false
              },
          }
        ],
        // Sembunyikan credit Highcharts
      credits: {
        enabled: false
      },
      };
      

        Highcharts.chart(
          this.daily_chart_el.nativeElement,
          this.daily_chart_options
        );

  }

  renderDailyChartFromDailyPage(res: any) {
    if (!this.daily_chart_daily_el) return;

    const data = res.data || [];

   const categories = data.map(d =>
  formatDate(d.date, 'dd-MMM-yy', 'en-US')
);


    const smFixed = data.map(d => d.sm < 0 ? 0 : d.sm);

    this.daily_chart_options_daily = {
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
          text: 'Well Operation Parameter of ' + this.well_xSelected.join(', '),
          style: {
            fontSize: '23px',
            // fontWeight: '600'
          }
        },
        caption: {
          text: null,
          align: 'center',
          verticalAlign: 'bottom'
        },
        xAxis: [{
          categories: [],
          crosshair: true,
          autoRotation: true,
          labels: {
            // step: 7
          }//,
        }],
        yAxis: [{ // Primary yAxis
          title: {
            text: 'WHP (m), EOT/PSD (m), SM (m), SL (in)',
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
            text: 'SPM/Freq, OD Pump (in)',
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
        }
      ],
        tooltip: {
          shared: true
        },
        legend: {
          layout: 'horizontal',
          align: 'center',
          verticalAlign: 'bottom',
          backgroundColor:
            Highcharts.defaultOptions.legend.backgroundColor || // theme
            'rgba(255,255,255,0.25)'
        },	
        series: [{
          name: 'WHP',
          type: 'line',
          yAxis: 0,
          data: [],
          color: '#5b9bd5',
          zIndex: 6,
          marker: {
            enabled: false
          },
          tooltip: {
            valueSuffix: ' psi',
            valueDecimals: 2
          },
        // visible: false
    
        },{
          name: 'KD',
          type: 'line',
          yAxis: 0,
          data: [],
          color: '#000000',
          zIndex: 5,
          marker: {
            enabled: false
          },
          tooltip: {
            valueSuffix: ' Hz',
            valueDecimals: 2
          },
        // visible: false
        
        },{
          name: 'SM',
          type: 'line',
          yAxis: 0,
          data: [],
          color: '#acc52b',
          zIndex: 4,
          marker: {
            enabled: false
          },
          tooltip: {
            valueSuffix: ' m',
            valueDecimals: 2
          },
        // visible: false
        
        },{
          name: 'SL',
          type: 'line',
          yAxis: 0,
          data: [],
          color: '#FEB05D',
          zIndex: 3,
          marker: {
            enabled: false
          },
          tooltip: {
            valueSuffix: ' inch',
            valueDecimals: 2
          },
        // visible: false
    
        }, {
          name: 'SPM',
          type: 'line',
          yAxis: 1,
          data: [],
          color: '#D34E4E',
          zIndex: 2,
          marker: {
            enabled: false
          },
          tooltip: {
            valueSuffix: ' SPM',
            valueDecimals: 2
          },
        // visible: false
        
        }, {
          name: 'Pump Diameter',
          type: 'line',
          yAxis: 1,
          data: [],
          color: '#800080',
          zIndex: 1,
          marker: {
            enabled: false
          },tooltip: {
            valueSuffix: ' inch',
            valueDecimals: 2
          }
    
        }, 
      ],
      // Sembunyikan credit Highcharts
      credits: {
        enabled: false
      },
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

    this.daily_chart_options_daily.caption.text =
      `${this.start_dateInput} - ${this.end_dateInput}`;

    this.daily_chart_options_daily.xAxis[0].categories = categories;

    this.daily_chart_options_daily.series[0].data = data.map(d => d.whp);
    this.daily_chart_options_daily.series[1].data = data.map(d => d.kd);
    this.daily_chart_options_daily.series[2].data = smFixed
    this.daily_chart_options_daily.series[3].data = data.map(d => d.sl);
    this.daily_chart_options_daily.series[4].data = data.map(d => d.spm);
    this.daily_chart_options_daily.series[5].data = data.map(d => d.size);

    Highcharts.chart(
      this.daily_chart_daily_el.nativeElement,
      this.daily_chart_options_daily
    );
  }

  loadDailyChartLikeDailyPage() {
  let params = new HttpParams()
    .append("type", "well_performance")
    .append("date", this.start_dateControl.value.toISOString())
    .append("end_date", this.end_dateControl.value.toISOString());

  for (const w of this.well_xSelected) {
    params = params.append("well", w);
  }

  this.http
    .get<any>('/api/pe/daily/GetChart', { params })
    .subscribe(res => {
      this.renderDailyChartFromDailyPage(res);
    });
}



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
      text: "Inflow Performance Relationship of " + (this.well_xSelected.length > 0 ? this.well_xSelected[0] : ""),
      style: {
            fontSize: '23px',
            // fontWeight: '500'
          }
    },
    series: [
      {
        name: "IPR (Vogel Equation)",
        data: this.data_liquid_rate.map((q: number, i: number) => {
          return { x: q, y: this.data_pwf[i] };
        }),
        color: "#1E88E5",
        marker: {
          enabled: false,
          radius: 3,
        },
        zIndex: 2,
      },
      {
        name: "Operating Point",
        type: "scatter",
        data: [
          {
            x: Number(this.q_design.value),
            y: Number(this.flowing_bottomhole_pressure2.value),
          },
        ],
        color: "#E53935",
        marker: {
          radius: 6,
          symbol: "circle",
        },
        zIndex: 5,
      },
      {
        name: "Q_design",
        type: "line",
        data: [
          { x: Number(this.q_design.value), y: 0 },
          { x: Number(this.q_design.value), y: Number(this.static_botthomhole_pressure.value) },
        ],
        dashStyle: "Dash",
        color: "#E53935",
        marker: { enabled: false },
        enableMouseTracking: false,
        zIndex: 1,
      },
      {
        name: "Pwf_design",
        type: "line",
        data: [
          { x: 0, y: Number(this.flowing_bottomhole_pressure2.value) },
          { x: Number(this.qmax.value), y: Number(this.flowing_bottomhole_pressure2.value) },
        ],
        dashStyle: "Dash",
        color: "#E53935",
        marker: { enabled: false },
        enableMouseTracking: false,
        zIndex: 1,
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
    // Sembunyikan credit Highcharts
    credits: {
      enabled: false
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
      gasAvg: number;
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

      const gasAvg =
        items.reduce((sum, i) => sum + (parseFloat(i.gas) || 0), 0) /
        items.length;

      averages.push({
        well,
        grossAvg: parseFloat(grossAvg.toFixed(2)),
        netAvg: parseFloat(netAvg.toFixed(2)),
        wcAvg: parseFloat(wcAvg.toFixed(2)),
        gasAvg: parseFloat(gasAvg.toFixed(2)),
      });
    });

    return averages;
  }

  

  private loadingOverlay: HTMLElement = null;

  private showLoadingOverlay() {
    // Create overlay element and append to body
    this.loadingOverlay = document.createElement('div');
    this.loadingOverlay.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.6);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 999999;
      ">
        <div style="
          background-color: white;
          padding: 30px 50px;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        ">
          <div style="
            border: 4px solid #f3f3f3;
            border-top: 4px solid #3f51b5;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            animation: spin 1s linear infinite;
          "></div>
          <p style="margin-top: 20px; font-size: 16px; color: #333; font-weight: 500;">
            Preparing screenshot, please wait...
          </p>
        </div>
      </div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `;
    document.body.appendChild(this.loadingOverlay);
  }

  private hideLoadingOverlay() {
    if (this.loadingOverlay && this.loadingOverlay.parentNode) {
      this.loadingOverlay.parentNode.removeChild(this.loadingOverlay);
      this.loadingOverlay = null;
    }
  }

  captureScreenshot() {
    
    if (!this.screenshotArea) {
      console.error('Capture area not found');
      return;
    }
    
    // Show loading indicator
    this.isCapturingScreenshot = true;
    this.showLoadingOverlay();
    
    const el = this.screenshotArea.nativeElement;

    html2canvas(el, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true
    }).then((canvas: HTMLCanvasElement) => {
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = 'production_ipr_operation.png';
      link.click();
      
      // Hide loading indicator
      this.isCapturingScreenshot = false;
      this.hideLoadingOverlay();
    }).catch((error: any) => {
      console.error('Screenshot capture failed:', error);
      this.isCapturingScreenshot = false;
      this.hideLoadingOverlay();
    });
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
