import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';
import { merge, Observable, of as observableOf, Subscription, interval } from 'rxjs';
import { catchError, map, startWith, switchMap, debounceTime } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { SelectionModel } from '@angular/cdk/collections';

import { SscTicketService } from './ssc-ticket.service';
import { SscTicket }    from './ssc-ticket';
import { SnackbarService } from '../../snackbar.service';
import { SnackbarApi } from '../../snackbar.service';
import { SscPermissionService } from '../ssc-permission.service';
import { TitleService } from '../../navigation/title/title.service';
import { xFilterService } from '../../xfilter/xfilter.component';
import { CommonService } from '../../common.service';

@Component({
  selector: 'ssc-ticket-open',
  templateUrl: './ssc-ticket-open.component.html',
  styleUrls: ['./ssc-ticket.scss']
})
export class SscTicketOpenComponent implements OnInit {

  displayedColumns: string[] = ["priority", "displayId", "slaStatus", "customer_fullName", "customer_department", "assignee_fullName", "assignee_group", "summary", "status_value", "modifiedDate"];
  exampleDatabase: ExampleHttpDao | null;
  data: SscTicket[] = [];

  //dataSource = new MatTableDataSource<any>(this.data);
  //selection = new SelectionModel<any>(true, []);
  //isEditing:boolean = false;

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  submitting = false;

  start_submitDate: Number;
  end_submitDate: Number;
  group: string;
  status: string;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  filterControl = new FormControl('');

  idFilter = new FormControl('');
  typeFilter = new FormControl('');
  displayIdFilter = new FormControl('');
  summaryFilter = new FormControl('');
  customer_fullNameFilter = new FormControl('');
  customer_companyFilter = new FormControl('');
  customer_siteFilter = new FormControl('');
  customer_paFilter = new FormControl('');
  customer_psaFilter = new FormControl('');
  customer_departmentFilter = new FormControl('');
  assignee_fullNameFilter = new FormControl('');
  assignee_loginIdFilter = new FormControl('');
  assignee_groupFilter = new FormControl('');
  priorityFilter = new FormControl('');
  status_valueFilter = new FormControl('');
  status_reasonFilter = new FormControl('');
  supportGroup_nameFilter = new FormControl('');
  submitDateFilter = new FormControl('');
  completedDateFilter = new FormControl('');
  slaStatusFilter = new FormControl('');
  modifiedDateFilter = new FormControl('');

  id_xSelected = [];
  type_xSelected = [];
  displayId_xSelected = [];
  summary_xSelected = [];
  customer_fullName_xSelected = [];
  customer_company_xSelected = [];
  customer_site_xSelected = [];
  customer_pa_xSelected = [];
  customer_psa_xSelected = [];
  customer_department_xSelected = [];
  assignee_fullName_xSelected = [];
  assignee_loginId_xSelected = [];
  assignee_group_xSelected = [];
  priority_xSelected = [];
  status_value_xSelected = ["Assigned", "In Progress", "Pending"];
  status_reason_xSelected = [];
  supportGroup_name_xSelected = [];
  submitDate_xSelected = [];
  completedDate_xSelected = [];
  slaStatus_xSelected = [];
  modifiedDate_xSelected = [];

  filterSubscription:Subscription;
  selectedSubscription:Subscription;
  listSubscription:Subscription;
  intervalSubscription:Subscription;

  fullWindow:boolean;
  refresh:Observable<any>;

  constructor(
    private http: HttpClient,
    private router: Router,
    public dialog: MatDialog,
    //public snackBar: MatSnackBar,
    private ssc_ticketService: SscTicketService,
    public snackbarService: SnackbarService,
    private sscPermissionService: SscPermissionService,
    private titleService: TitleService,
    private route: ActivatedRoute,
    private xfilterService: xFilterService,
    private commonService: CommonService,
    ) {}

  ngOnInit() {

    this.titleService.titleSource.next({
      title: "Open Tickets", 
      breadcrumbs: [
        {label: 'ICT', routerLink: ''}, 
        {label: 'Ticket', routerLink: ''},
        {label: 'Open', routerLink: ''}
      ]}
    );

    if(this.route.snapshot.paramMap.get('fullWindow') != null) {
      this.fullWindow = true;
      this.commonService.messageFs.next(true);
    }
    if(!isNaN(parseInt(this.route.snapshot.paramMap.get('refresh')))) {
      this.refresh = interval(parseInt(this.route.snapshot.paramMap.get('refresh'))*1000);
    } else {
      this.refresh = observableOf({});
    }

    var p_start_submitDate = this.route.snapshot.paramMap.get('start_submitDate');
    if(p_start_submitDate != null && p_start_submitDate.length > 0) {
      //this.start_submitDate = isNaN(Number(p_start_submitDate)) ? new Date(Date.parse(p_start_submitDate)) : new Date(Number(p_start_submitDate));
      this.start_submitDate = Number(p_start_submitDate);
      console.log(this.start_submitDate);
    }
    var p_end_submitDate = this.route.snapshot.paramMap.get('end_submitDate');
    if(p_end_submitDate != null && p_end_submitDate.length > 0) {
      //this.end_submitDate = isNaN(Number(p_end_submitDate)) ? new Date(Date.parse(p_end_submitDate)) : new Date(Number(p_end_submitDate));
      this.end_submitDate = Number(p_end_submitDate);
      console.log(this.end_submitDate);
    }
    this.group = this.route.snapshot.paramMap.get('group');
    if(this.group != null) this.assignee_group_xSelected = [this.group];
    this.status = this.route.snapshot.paramMap.get('status');

    this.exampleDatabase = new ExampleHttpDao(this.http);

    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    this.filterSubscription = this.xfilterService.filter.subscribe(res => {
      if(res) this.getColumnValues(res);
    })
    this.selectedSubscription = this.xfilterService.selected.subscribe(res => {
      this[res["column"] + "_xSelected"] = res["selected"];
    })

    this.listSubscription = merge(
      this.sort.sortChange, 
      this.paginator.page, 
      this.filterControl.valueChanges.pipe(debounceTime(300)),
      this.idFilter.valueChanges.pipe(debounceTime(300)),
      this.typeFilter.valueChanges.pipe(debounceTime(300)),
      this.displayIdFilter.valueChanges.pipe(debounceTime(300)),
      this.summaryFilter.valueChanges.pipe(debounceTime(300)),
      this.customer_fullNameFilter.valueChanges.pipe(debounceTime(300)),
      this.customer_companyFilter.valueChanges.pipe(debounceTime(300)),
      this.customer_siteFilter.valueChanges.pipe(debounceTime(300)),
      this.customer_paFilter.valueChanges.pipe(debounceTime(300)),
      this.customer_psaFilter.valueChanges.pipe(debounceTime(300)),
      this.customer_departmentFilter.valueChanges.pipe(debounceTime(300)),
      this.assignee_fullNameFilter.valueChanges.pipe(debounceTime(300)),
      this.assignee_loginIdFilter.valueChanges.pipe(debounceTime(300)),
      this.assignee_groupFilter.valueChanges.pipe(debounceTime(300)),
      this.priorityFilter.valueChanges.pipe(debounceTime(300)),
      this.status_valueFilter.valueChanges.pipe(debounceTime(300)),
      this.status_reasonFilter.valueChanges.pipe(debounceTime(300)),
      this.supportGroup_nameFilter.valueChanges.pipe(debounceTime(300)),
      this.submitDateFilter.valueChanges.pipe(debounceTime(300)),
      this.completedDateFilter.valueChanges.pipe(debounceTime(300)),
      this.slaStatusFilter.valueChanges.pipe(debounceTime(300)),
      this.modifiedDateFilter.valueChanges.pipe(debounceTime(300)),
      this.xfilterService.selected,
      this.refresh.pipe(debounceTime(300)),
    ).pipe(
      startWith({}),
      switchMap(() => {
        this.isLoadingResults = true;
        var columnfilter = this.getColumnFilter(); 

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

  ngOnDestroy() {
    this.filterSubscription.unsubscribe();
    this.selectedSubscription.unsubscribe();
    this.listSubscription.unsubscribe();
  }

  passPermission(path:String) {
    return this.sscPermissionService.passPermission(path);
  }

  getColumnValues(param:any) {
    var column = param["column"];
    var filter = param["filter"];
    var selected = param["selected"]
    var clear = param["clear"];
    var columnfilter = this.getColumnFilter();
    if(filter) columnfilter[column] = [filter];
    if(selected && selected.length > 0) columnfilter[column] = selected.map(s => "^"+s+"$");
    if(clear) delete columnfilter[column];

    return this.exampleDatabase!.getRepoIssues(
      this.sort.active, 
      this.sort.direction, 
      this.paginator.pageIndex, 
      this.paginator.pageSize, 
      this.filterControl.value,
      columnfilter,
      column
    ).pipe(map((res) => {
      return res;
    })).subscribe(res => {
      this.xfilterService.updateItems({column: column, items: res.items});
    }, () => {
      
    });
  }

  getColumnFilter() {
    var columnfilter = {};
    if(this.id_xSelected.length) columnfilter["id"] = this.id_xSelected;
    if(this.type_xSelected.length) columnfilter["type"] = this.type_xSelected;
    if(this.displayId_xSelected.length) columnfilter["displayId"] = this.displayId_xSelected;
    if(this.summary_xSelected.length) columnfilter["summary"] = this.summary_xSelected;
    if(this.customer_fullName_xSelected.length) columnfilter["customer_fullName"] = this.customer_fullName_xSelected;
    if(this.customer_company_xSelected.length) columnfilter["customer_company"] = this.customer_company_xSelected;
    if(this.customer_site_xSelected.length) columnfilter["customer_site"] = this.customer_site_xSelected;
    if(this.customer_pa_xSelected.length) columnfilter["customer_pa"] = this.customer_pa_xSelected;
    if(this.customer_psa_xSelected.length) columnfilter["customer_psa"] = this.customer_psa_xSelected;
    if(this.customer_department_xSelected.length) columnfilter["customer_department"] = this.customer_department_xSelected;
    if(this.assignee_fullName_xSelected.length) columnfilter["assignee_fullName"] = this.assignee_fullName_xSelected;
    if(this.assignee_loginId_xSelected.length) columnfilter["assignee_loginId"] = this.assignee_loginId_xSelected;
    if(this.assignee_group_xSelected.length) columnfilter["assignee_group"] = this.assignee_group_xSelected;
    if(this.priority_xSelected.length) columnfilter["priority"] = this.priority_xSelected;
    if(this.status_value_xSelected.length) columnfilter["status_value"] = this.status_value_xSelected;
    if(this.status_reason_xSelected.length) columnfilter["status_reason"] = this.status_reason_xSelected;
    if(this.supportGroup_name_xSelected.length) columnfilter["supportGroup_name"] = this.supportGroup_name_xSelected;
    if(this.submitDate_xSelected.length) columnfilter["submitDate"] = this.submitDate_xSelected;
    if(this.completedDate_xSelected.length) columnfilter["completedDate"] = this.completedDate_xSelected;
    if(this.slaStatus_xSelected.length) columnfilter["slaStatus"] = this.slaStatus_xSelected;
    if(this.modifiedDate_xSelected.length) columnfilter["modifiedDate"] = this.modifiedDate_xSelected;
    
    //if(this.start_submitDate != null) columnfilter["start_submitDate"] = this.start_submitDate;
    //if(this.end_submitDate != null) columnfilter["end_submitDate"] = this.end_submitDate;
    //if(this.group != null) columnfilter["assignee_group"] = [this.group];
    //if(this.status != null) columnfilter["status"] = this.status;
    
    return columnfilter;
  }

}

export interface SscTicketApi {
  items: SscTicket[];
  total_count: number;
}

/*export interface SscTicket {
  SSC_TICKET_ID: number;
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

  getRepoIssues(sort: string, order: string, page: number, pagesize: number = 10, filter: string, columnfilter: object, mode: string = "", httpOption: object = {}): Observable<SscTicketApi> {

    var params = {};
    if(sort!=null) params["sort"] = sort;
    if(order!=null) params["order"] = order;
    if(page!=null) params["page"] = page.toString();
    if(pagesize!=null) params["pagesize"] = pagesize.toString();
    if(filter!=null) params["filter"] = filter;
    if(Object.keys(columnfilter).length > 0) params["columnfilter"] = JSON.stringify(columnfilter);
    if(mode != null) params["mode"] = mode;

    httpOption["params"] = params;

    return this.http.get<SscTicketApi>('/api/ssc/tickets', httpOption);
  }
}