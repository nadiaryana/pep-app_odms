import {
  Component,
  Input,
  HostListener,
  ViewChild,
  OnInit,
  ElementRef,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import {
  MatPaginator,
  MatSort,
  MatDialog,
  MatSnackBar,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDatepicker,
} from "@angular/material";
import { MatStepper } from "@angular/material/stepper";
import { Router, RouterLink } from "@angular/router";
import { Observable, of } from "rxjs";
import { HttpClient, HttpEventType, HttpParams } from "@angular/common/http";
import { TitleService } from "src/app/navigation/title/title.service";
import { SnackbarApi, SnackbarService } from "src/app/snackbar.service";
import { title } from "process";
import {
  catchError,
  map,
  startWith,
  switchMap,
  debounceTime,
  take,
  mergeAll,
  timeout,
} from "rxjs/operators";
// import { ExampleHttpDao } from '../pe-daily-list.component';
import { xFilterService } from "src/app/xfilter/xfilter.component";

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
  start_dateControl = new FormControl(
    new Date(new Date().setDate(new Date().getDate() - 4))
  );
  start_dateInput = this.start_dateControl.value.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
    day: "numeric",
  });

  @ViewChild("end_datePicker", { static: true })
  end_datePicker: MatDatepicker<any>;
  end_dateControl = new FormControl(
    new Date(new Date().setDate(new Date().getDate() - 1))
  );
  end_dateInput = this.end_dateControl.value.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
    day: "numeric",
  });

  top_perforation_depth = new FormControl("");
  bottom_perforation_depth = new FormControl("");
  perforation_depth_reference = new FormControl("");

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
  }

  end_dateChange(evt) {
    this.end_dateInput = evt.value.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
      day: "numeric",
    });
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

  loadingGetDailyData: boolean = false;
  getDailyData() {
    // if (this.well_xSelected.length == null || this.well_xSelected.length != 1) {
    //   this.daily_data = [];
    //   this.snackbarService.status.next(
    //     new SnackbarApi(true, "Please select at least one well.", "dismiss", {
    //       duration: 3000,
    //     })
    //   );
    //   return;
    // }

    if (!this.well_dateInput) {
      this.snackbarService.status.next(
        new SnackbarApi(true, "Please select a well date.", "dismiss", {
          duration: 3000,
        })
      );
      return;
    }
    this.loadingGetDailyData = true;

    let params = new HttpParams();
    // start date
    let startDate = new Date(this.well_dateInput);
    // end date +1 after start date
    const endDate = new Date(startDate); // clone
    endDate.setDate(startDate.getDate());

    params = params
      .append("type", "well_performance_daily")
      .append("date", new Date(startDate).toISOString())
      .append("end_date", new Date(endDate).toISOString());

    for (const w of this.well_xSelected) {
      params = params.append("well", w);
      console.log(w);
    }

    this.http
      .get<any>("/api/pe/daily/GetAreaChart", { params: params })
      .subscribe((res) => {
        this.daily_data = res.data;

        this.loadingGetDailyData = false;
        // fallback: clear loading state and notify user if request takes too long
        setTimeout(() => {
          this.loadingGetDailyData = false;
        }, 2000);
      });
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

    // now safe to use topDepth and bottomDepth
    // (example) set the reference to average:
    const avg = (topDepth + bottomDepth) / 2;
    this.perforation_depth_reference.setValue(avg);

    // any other logic
    // console.log("Perforation Change:", topDepth, bottomDepth, reference);
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
