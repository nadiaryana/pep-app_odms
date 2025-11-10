import { HttpClient, HttpParams, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';
import { merge, Observable, of as observableOf, Subscription } from 'rxjs';
import { catchError, map, startWith, switchMap, debounceTime } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { SelectionModel } from '@angular/cdk/collections';
import { SnackbarService } from '../../snackbar.service';
import { SnackbarApi } from '../../snackbar.service';
import { PePermissionService } from '../pe-permission.service';
import { TitleService } from '../../navigation/title/title.service';
import { xFilterService } from '../../xfilter/xfilter.component';
import { CommonService } from '../../common.service';
import { User } from '../../user';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'pe-daily-manajemen',
  templateUrl: './pe-daily-manajemen.component.html',
  styleUrls: ['./pe-daily.scss']
})
export class PeDailyManajemenComponent implements OnInit {

  currentUser: User;

  displayedColumns: string[] = ["settings", "date","sot","operation","figure",  "gas", "gas_sales", "sgt_sot", "sbr_sot", "bd_sot","sgt_opr", "sbr_opr", "bd_opr", "sgt_fig", "sbr_fig", "bd_fig","rkap_oil", "wpnb_oil", "rkap_gas", "wpnb_gas"];
  headerColumns1: string[] = ["settings", "date","sot","operation","figure",  "gas", "gas_sales", "sgt_sot", "sbr_sot", "bd_sot","sgt_opr", "sbr_opr", "bd_opr", "sgt_fig", "sbr_fig", "bd_fig","rkap_oil", "wpnb_oil", "rkap_gas", "wpnb_gas"];
  // displayedColumns: string[] = ["date","operation","figure", "sot", "gas", "gas_sales", "sgt_opr", "settings"];
  // headerColumns1: string[] = ["date", "operation", "figure", "sot", "gas", "gas_sales", "sgt_opr", "settings"];
  exampleDatabase: ExampleHttpDao | null;
  data = [];
  completedData = [];
  // dataSource = new MatTableDataSource<any>(this.data);
  selection = new SelectionModel<any>(true, []);
  isEditing: boolean = false;

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  submitting = false;

  start_submitDate: Number;
  end_submitDate: Number;
  group: string;
  status: string;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  filterControl = new FormControl('');
  dateFilter = new FormControl('');
 
  date_xSelected = [];


  filterSubscription: Subscription;
  selectedSubscription: Subscription;
  listSubscription: Subscription;

  constructor(
    private http: HttpClient,
    private router: Router,
    public dialog: MatDialog,
    //public snackBar: MatSnackBar,
    public snackbarService: SnackbarService,
    public pePermissionService: PePermissionService,
    private titleService: TitleService,
    private route: ActivatedRoute,
    private xfilterService: xFilterService,
    public commonService: CommonService,
    private authService: AuthService,
  ) {
    this.authService.currentUser.subscribe(res => {
      this.currentUser = res;
      console.log(this.currentUser);
    });

  }

  ngOnInit() {

    this.titleService.titleSource.next({
      title: "Daily Manajemen",
      icon: "list",
      breadcrumbs: [
        { label: 'Petroleum Engineering', routerLink: '' },
        { label: 'Manajemen', routerLink: '' }
      ]
    }
    );

    this.exampleDatabase = new ExampleHttpDao(this.http);

    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    this.filterSubscription = this.xfilterService.filter.subscribe(res => {
      if (res) this.getColumnValues(res);
    })
    this.selectedSubscription = this.xfilterService.selected.subscribe(res => {
      this[res["column"] + "_xSelected"] = res["selected"];
    })

    this.listSubscription = merge(
      this.sort.sortChange,
      this.paginator.page,
      this.filterControl.valueChanges.pipe(debounceTime(300)),
      this.dateFilter.valueChanges.pipe(debounceTime(300)),
      this.xfilterService.selected,
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
          columnfilter,
        );
      }),
      map(data => {
        // Flip flag to show that loading has finished.
        this.isLoadingResults = false;
        this.isRateLimitReached = false;
        this.resultsLength = data.total_count;
        console.log(data.items)
        return data.items;
      }),
      catchError(() => {
        this.isLoadingResults = false;
        // Catch if the GitHub API has reached its rate limit. Return empty data.
        this.isRateLimitReached = true;
        return observableOf([]);
      })
    ).subscribe(data => {
      this.data = data;
      // this.dataSource = new MatTableDataSource<any>(this.data);
      this.selection.clear();
    });


  }

  ngOnDestroy() {
    this.filterSubscription.unsubscribe();
    this.selectedSubscription.unsubscribe();
    this.listSubscription.unsubscribe();
  }

  passPermission(path: String) {
    return this.pePermissionService.passPermission(path);
  }
  
  exportExcel() {

    const httpOption: Object = {
      observe: 'response',
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: 'arraybuffer'
    };
    this.isLoadingResults = true;
    var columnfilter = this.getColumnFilter();

    this.exampleDatabase!.getRepoIssues(
      this.sort.active, 
      this.sort.direction, 
      this.paginator.pageIndex, 
      this.paginator.pageSize, 
      this.filterControl.value,
      columnfilter,
      "excel",
      httpOption
    ).pipe(map((res) => {
      this.isLoadingResults = false;
      return {
        filename: 'Production.xlsx',
        data: new Blob(
          [res['body']],
          { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}
        ),
      };
    })).subscribe(res => {
      if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(res.data, res.filename);
      } else {
        const link = window.URL.createObjectURL(res.data);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = link;
        a.download = res.filename;
        a.click();
        window.URL.revokeObjectURL(link);
        a.remove();
      }
    }, error => {
      this.isLoadingResults = false;
      this.snackbarService.status.next(new SnackbarApi(true, error['message'], 'dismiss'));
      console.log(error);
    }, () => {
      console.log('Completed file download.');
    });
  }

  getColumnValues(param: any) {
    var column = param["column"];
    var filter = param["filter"];
    var selected = param["selected"]
    var clear = param["clear"];
    var columnfilter = this.getColumnFilter();
    if (filter) columnfilter[column] = [filter];
    if (selected && selected.length > 0) columnfilter[column] = selected.map(s => "^" + s + "$");
    if (clear) delete columnfilter[column];

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
      this.xfilterService.updateItems({ column: column, items: res.items });
    }, () => {

    });
  }

  getColumnFilter() {
    var columnfilter = {};

    if (this.date_xSelected.length) columnfilter["date"] = this.date_xSelected;

    return columnfilter;
  }


  deleteSelected() {
    this.snackbarService.status.next(new SnackbarApi(false));

   /* const dialogRef = this.dialog.open(PeLabDeleteDialogComponent, {
      width: '250px',
      data: this.selection.selected.length
    }); 

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoadingResults = true;
        this.snackbarService.status.next(new SnackbarApi(false));
        this.http.delete<any>('/api/pe/labreport', {
          headers: new HttpHeaders({
            'Content-Type': 'application/json'
          }),
          params: {
            _ids: this.selection.selected.map<any>(s => s._id)
          }
        }).subscribe(res => {
          this.isLoadingResults = false;
          this.snackbarService.status.next(new SnackbarApi(true, res["deleted_count"] + " item(s) deleted successfully.", "dismiss"));
          this.paginator._changePageSize(this.paginator.pageSize);
        },
          error => {
            this.isLoadingResults = false;
            this.snackbarService.status.next(new SnackbarApi(true, error['message'], "dismiss"));
          })
      }
    });
    */
  }

  alert(x) {
    window.alert(x);
  }


}


/*export interface PeDaily {
  PE_TICKET_ID: number;
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
  ) { }
}

/** An example database that the data source uses to retrieve data for the table. */
export class ExampleHttpDao {
  constructor(private http: HttpClient) { }

  getRepoIssues(sort: string, order: string, page: number, pagesize: number = 10, filter: string, columnfilter: object, mode: string = "", httpOption: object = {}): Observable<any> {
    var params = {};
    sort != null? params["sort"] = sort : params["sort"] = 'date';
    if (order != null) params["order"] = order;
    if (page != null) params["page"] = page.toString();
    if (pagesize != null) params["pagesize"] = pagesize.toString();
    if (filter != null) params["filter"] = filter;
    if(Object.keys(columnfilter).length > 0) params["columnfilter"] = JSON.stringify(columnfilter);
	if(mode != null) params["mode"] = mode;

    httpOption["params"] = params;

    return this.http.get<any>('/api/pe/production', httpOption);
  }

}

/*

@Component({
  selector: 'app-lab-delete-dialog',
  template: '<h1 mat-dialog-title>Confirm Delete</h1><div mat-dialog-content>  <p>Confirm delete {{data}} selected item ?</p></div><div mat-dialog-actions>  <button mat-button [mat-dialog-close]="1" >Yes</button> <button mat-button [mat-dialog-close]="0" cdkFocusInitial>No</button> </div>',
  styleUrls: ['./pe-lab.scss']
})
export class PeLabDeleteDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<PeLabDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {
    this.dialogRef.close();
  }

}*/
