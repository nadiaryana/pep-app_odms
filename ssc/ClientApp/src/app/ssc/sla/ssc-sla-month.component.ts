import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatSnackBar, MatDatepicker } from '@angular/material';
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap, debounceTime } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { Router} from "@angular/router";

import { SscSlaService } from './ssc-sla.service';
import { SscSla }    from './ssc-sla';
import { SnackbarService } from '../../snackbar.service';
import { SnackbarApi } from '../../snackbar.service';
import { SscPermissionService } from '../ssc-permission.service';
import { TitleService } from '../../navigation/title/title.service';

@Component({
  selector: 'ssc-sla-month',
  templateUrl: './ssc-sla-month.component.html',
  styleUrls: ['./ssc-sla.scss']
})
export class SscSlaMonthComponent implements OnInit {

  displayedColumns: string[] = ["no", "group", "met", "missed", "total", "sla"];
  exampleDatabase: ExampleHttpDao | null;
  data: SscSla[] = [];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  submitting = false;

  sla_monthInput;
  @ViewChild('sla_monthPicker', {static: true}) sla_monthDatePicker: MatDatepicker<any>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  filterControl = new FormControl('');
  sla_month = new FormControl('');
  sla_month_input = new FormControl('');

  constructor(
    private http: HttpClient,
    private router: Router,
    public dialog: MatDialog,
    //public snackBar: MatSnackBar,
    private ssc_slaService: SscSlaService,
    public snackbarService: SnackbarService,
    private sscPermissionService: SscPermissionService,
    private titleService: TitleService,
    ) {}

  ngOnInit() {

    this.titleService.titleSource.next({
      title: "SLA", 
      breadcrumbs: [
        {label: 'ICT', routerLink: ''}, 
        {label: 'SLA', routerLink: ''}
      ]}
    );

    this.exampleDatabase = new ExampleHttpDao(this.http);

    this.sla_month.setValue(new Date());
    this.sla_monthDatePicker.select(new Date());
    this.sla_monthInput = new Date().toLocaleDateString("en-US", { month:"short", year:"numeric" });
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(
      this.sort.sortChange, 
      this.paginator.page, 
      this.filterControl.valueChanges.pipe(debounceTime(300)),
      this.sla_month.valueChanges.pipe(debounceTime(300))
    ).pipe(
      startWith({}),
      switchMap(() => {
        this.isLoadingResults = true;

        var columnfilter = {};
        var date:Date;
        if(this.sla_month.value) {
          date = this.sla_month.value;
        } else {
          date = new Date();
        }
        columnfilter['start_submitDate'] = new Date(date.getFullYear(), date.getMonth(), 1).getTime();// - date.getTimezoneOffset()*60*1000;
        columnfilter['duration'] = "month";

        return this.exampleDatabase!.getRepoIssues(
          this.sort.active, 
          this.sort.direction, 
          this.paginator.pageIndex, 
          this.paginator.pageSize, 
          this.filterControl.value,
          columnfilter);
      }),
      map(data => {
        // Flip flag to show that loading has finished.
        this.isLoadingResults = false;
        this.isRateLimitReached = false;
        this.resultsLength = data.total_count;

        return data.items;
      }),
      catchError(() => {
        this.isLoadingResults = false;
        // Catch if the GitHub API has reached its rate limit. Return empty data.
        this.isRateLimitReached = true;
        return observableOf([]);
      })
      ).subscribe(data => this.data = data);
  }

  passPermission(path:String) {
    return this.sscPermissionService.passPermission(path);
  }

  monthChange(evt) {
    this.sla_monthInput = evt.toLocaleDateString("en-US", { month:"short", year:"numeric" });
    this.sla_monthDatePicker.select(evt);
    this.sla_monthDatePicker.close();
  }

  navigateTicket(group?:String, status?:String) {
    var date:Date = this.sla_month.value;
    var start_submitDate = new Date(date.getFullYear(), date.getMonth(), 1).getTime();// - date.getTimezoneOffset()*60*1000;
    var end_submitDate = new Date(date.getFullYear(), date.getMonth()+1, 1).getTime();// - date.getTimezoneOffset()*60*1000;
    var param = {start_submitDate:start_submitDate, end_submitDate:end_submitDate};
    if(group) param["assignee_group"] = group;
    if(status) param["slaStatus"] = status;
    param["status_value"] = "Resolved,Completed,Closed";
    this.router.navigate(['/', 'ssc', 'ticket', 'list', param]);
  }

}

export interface SscSlaApi {
  items: SscSla[];
  total_count: number;
}

/*export interface SscSla {
  SSC_SLA_ID: number;
  ASSET_ID: number;
  ASSET_NAME: string;
}*/

export class MatTableApi {
	constructor(
		public sort: string,
		public order: string,
		public page: number,
		public pagesize: number,
		public filter: string,
    ) {}
}

/** An example database that the data source uses to retrieve data for the table. */
export class ExampleHttpDao {
  constructor(private http: HttpClient) {}

  getRepoIssues(sort: string, order: string, page: number, pagesize: number = 10, filter: string, columnfilter: object): Observable<SscSlaApi> {

    var params = {};
    if(sort!=null) params["sort"] = sort;
    if(order!=null) params["order"] = order;
    if(page!=null) params["page"] = page.toString();
    if(pagesize!=null) params["pagesize"] = pagesize.toString();
    if(filter!=null) params["filter"] = filter;
    if(Object.keys(columnfilter).length > 0) params["columnfilter"] = JSON.stringify(columnfilter);

    return this.http.get<SscSlaApi>('/api/ssc/sla', { params : params });
  }
}