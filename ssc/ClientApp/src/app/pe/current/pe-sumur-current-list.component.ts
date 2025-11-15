import { HttpClient, HttpParams, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA, MatDatepicker } from '@angular/material';
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
import { PeSumur } from './pe-sumur';

@Component({
  selector: 'app-pe-sumur-current',
  templateUrl: './pe-sumur-current-list.component.html',
  styleUrls: ['./pe-sumur-current-list.component.scss']
})
export class PeSumurCurrentListComponent implements OnInit {

    displayedColumns: string[] = ["select", "date","entry_id", "field_1", "field_2"];
    headerColumns1: string[] = ['select','date','entry_id','field_1','field_2'];
    exampleDatabase: ExampleHttpDao | null;
    data: PeSumur[] = [];
  
    dataSource = new MatTableDataSource<any>(this.data);
    selection = new SelectionModel<any>(true, []);
    isEditing:boolean = false;
  
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
  
    dateFilter = new FormControl('');
    entry_idFilter = new FormControl('');
    field_1Filter = new FormControl('');
    field_2Filter = new FormControl('');
  
    date_xSelected = [];
    entry_id_xSelected = [];
    field_1_xSelected = [];
    field_2_xSelected = [];
  
    filterSubscription:Subscription;
    selectedSubscription:Subscription;
    listSubscription:Subscription;

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
  ) {}

  ngOnInit() {
    this.titleService.titleSource.next({
      title: "Daily Current",
      icon: "table_chart",
      breadcrumbs: [
        {label: 'Petroleum Engineering', routerLink: ''}, 
        {label: 'Daily Current', routerLink: ''}
      ]}
    );

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
      this.dateFilter.valueChanges.pipe(debounceTime(300)),
      this.entry_idFilter.valueChanges.pipe(debounceTime(300)),
      this.field_1Filter.valueChanges.pipe(debounceTime(300)),
      this.field_2Filter.valueChanges.pipe(debounceTime(300)),
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
        this.dataSource = new MatTableDataSource<any>(this.data);
        this.selection.clear();
      });
  }
  ngOnDestroy() {
      this.filterSubscription.unsubscribe();
      this.selectedSubscription.unsubscribe();
      this.listSubscription.unsubscribe();
    }
  
    passPermission(path:String) {
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
          filename: 'Sumur.xlsx',
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
      if(this.date_xSelected.length) columnfilter["date"] = this.date_xSelected;
      // if(this.well_xSelected.length) columnfilter["well"] = this.well_xSelected;//.map(s => "^"+s+"$");
      if(this.entry_id_xSelected.length) columnfilter["entry_id"] = this.entry_id_xSelected;
      if(this.field_1_xSelected.length) columnfilter["field_1"] = this.field_1_xSelected;
      if(this.field_2_xSelected.length) columnfilter["field_2"] = this.field_2_xSelected;
  
      //if(this.start_submitDate) columnfilter['start_submitDate'] = this.start_submitDate;// - date.getTimezoneOffset()*60*1000;//.getTime();
      //if(this.end_submitDate) columnfilter['end_submitDate'] = this.end_submitDate;// - date.getTimezoneOffset()*60*1000;//.getTime();
      //if(this.group) columnfilter['group'] = this.group;
      //if(this.status) columnfilter['status'] = this.status;
      return columnfilter;
    }
  
    formatInterval(arr) {
      return arr.map(a => a.join("-")).join(", ");
    }
  
    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSource.data.length;
      return numSelected === numRows;
    }
  
    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
      this.isAllSelected() ?
          this.selection.clear() :
          this.dataSource.data.forEach(row => this.selection.select(row));
    }
  
    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: any): string {
      if (!row) {
          return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
      }
      return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.presence_user_workday_cycle_id}`;
    }
  
    deleteSelected() {
      this.snackbarService.status.next(new SnackbarApi(false));
  
      const dialogRef = this.dialog.open(PeSumurDeleteDialogComponent, {
        width: '250px',
        data: this.selection.selected.length
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if(result) {
          this.isLoadingResults = true; 
          this.snackbarService.status.next(new SnackbarApi(false));
          this.http.delete<any>('/api/pe/sumur', {
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
  }

}

export interface PeCurrentApi {
  items: PeSumur[];
  total_count: number;
}

/*export interface PeSonolog {
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
    ) {}
}

/** An example database that the data source uses to retrieve data for the table. */
export class ExampleHttpDao {
  constructor(private http: HttpClient) {}

  getRepoIssues(sort: string, order: string, page: number, pagesize: number = 50, filter: string, columnfilter: object, mode: string = "", httpOption: object = {}): Observable<PeCurrentApi> {

    var params = {};
    if(sort!=null) params["sort"] = sort;
    if(order!=null) params["order"] = order;
    if(page!=null) params["page"] = page.toString();
    if(pagesize!=null) params["pagesize"] = pagesize.toString();
    if(filter!=null) params["filter"] = filter;
    if(Object.keys(columnfilter).length > 0) params["columnfilter"] = JSON.stringify(columnfilter);
    if(mode != null) params["mode"] = mode;

    httpOption["params"] = params;

    return this.http.get<PeCurrentApi>('/api/pe/sumur', httpOption);
  }
}

@Component({
  selector: 'app-sumur-delete-dialog',
  template: '<h1 mat-dialog-title>Confirm Delete</h1><div mat-dialog-content>  <p>Confirm delete {{data}} selected item ?</p></div><div mat-dialog-actions>  <button mat-button [mat-dialog-close]="1" >Yes</button> <button mat-button [mat-dialog-close]="0" cdkFocusInitial>No</button> </div>',
  styleUrls: ['./pe-current.scss']
})
export class PeSumurDeleteDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<PeSumurDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
  
  onYesClick(): void {
    this.dialogRef.close();
  }

}

