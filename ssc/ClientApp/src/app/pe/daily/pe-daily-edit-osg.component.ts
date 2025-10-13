import { Component, Input, HostListener, ViewChild, LOCALE_ID, Inject, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { MatPaginator, MatSort, MatDialog, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatStepper } from '@angular/material/stepper';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Router, ActivatedRoute } from "@angular/router";
import { Daily } from './daily';
import { PeDaily } from './pe-daily';
import { SnackbarService } from '../../snackbar.service';
import { SnackbarApi } from '../../snackbar.service';
import { DialogService } from '../../dialog.service';
import { TitleService } from '../../navigation/title/title.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-daily-edit-osg',
  templateUrl: './pe-daily-edit-osg.component.html',
  styleUrls: ['./pe-daily.scss']
})

export class PeDailyEditOsgComponent implements OnInit {
  @Input() locations: Location[];
  //company = ['PT Pertamina EP', 'PT Pertamina (Persero)'];
  loading = false;
  production_id: any;

  isUploading = false;
  isLoading = false;
  isSaving = false;
  modified_count = 0;
  created_count = 0;
  progressPercent: number;
  fileName: string;
  @ViewChild('fileInput', { static: true }) fileInput;
  @ViewChild('stepper', { static: true }) private stepper: MatStepper;

  tmp_id: string;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  data_mode = "all";
  resultsLength = 0;
  dateInput: any;
  data: any[] = [];
  data_error_count: number = 0;

  displayedColumns: string[] = ["info", "date", "operation", "sot", "gas", "gas_sales", "sgt_opr", "sbr_opr", "bd_opr", "sgt_sot", "sbr_sot", "bd_sot", "rkap", "wpnb"];
  headerColumns1: string[] = ["info", "date", "operation", "sot", "gas", "gas_sales", "sgt_opr", "sbr_opr", "bd_opr", "sgt_sot", "sbr_sot", "bd_sot", "rkap", "wpnb"];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private snackbarService: SnackbarService,
    private dialogService: DialogService,
    private titleService: TitleService,
    private http: HttpClient,
    private route: ActivatedRoute,
    @Inject(LOCALE_ID) public locale: string
  ) {

  }

  get productions() { return this.opsogForm.get('productions') }

  opsogForm = this.formBuilder.group({
        date: [''],
        operation: ['', Validators.required],
        sot: ['', Validators.required],
        figure: [''],
        gas: ['', Validators.required],
        gas_sales: ['', Validators.required],
		sgt_opr: ['', Validators.required],
        sbr_opr: ['', Validators.required],
        bd_opr: ['', Validators.required],
        // borderless_nkl_opr: ['', Validators.required],
        // borderless_sbj_opr: ['', Validators.required],
		sgt_sot: ['', Validators.required],
        sbr_sot: ['', Validators.required],
        bd_sot: ['', Validators.required],
        // borderless_nkl_sot: ['', Validators.required],
        // borderless_sbj_sot: ['', Validators.required],
        rkap: ['', Validators.required],
        wpnb: ['', Validators.required],
      });

  ngOnInit() {

    this.titleService.titleSource.next({
      title: "Add Daily OSG",
      icon: "add",
      breadcrumbs: [
        { label: 'Petroleum Engineering', routerLink: '' },
        { label: 'Daily', routerLink: 'pe/daily' },
        { label: 'Add OSG', routerLink: '' },
      ]
    });

    this.production_id = this.route.snapshot.paramMap.get("id");
    this.http.get<any>("/api/pe/production/" + this.production_id).subscribe(res => {
      console.log(res.item)
      this.opsogForm.patchValue({
        date: res.item[0].date,
        operation: res.item[0].operation,
        sot: res.item[0].sot,
        gas: res.item[0].gas,
        gas_sales: res.item[0].gas_sales,
		sgt_opr: res.item[0].sgt_opr,
        sbr_opr: res.item[0].sbr_opr,
        bd_opr: res.item[0].bd_opr,
        // borderless_nkl_opr: res.item[0].borderless_nkl_opr,
        // borderless_sbj_opr: res.item[0].borderless_sbj_opr,
		sgt_sot: res.item[0].sgt_sot,
        sbr_sot: res.item[0].sbr_sot,
        bd_sot: res.item[0].bd_sot,
        // borderless_nkl_sot: res.item[0].borderless_nkl_sot,
        // borderless_sbj_sot: res.item[0].borderless_sbj_sot,
        rkap: res.item[0].rkap,
        wpnb: res.item[0].wpnb
      });
    });
 }




  canDeactivate(): Observable<boolean> | boolean {
    if (this.opsogForm.pristine) {
      return true;
    }
    return this.dialogService.confirm('Discard changes?');
  }

  onSaveOpsog() {
    this.isLoading = true;
    // this.opsogForm.value.productions.map(d => d.date = new Date(d.date).toISOString());
    let params = { productions: [this.opsogForm.value] };
    console.log(params);
    this.http.post('/api/pe/production',params).subscribe(res => {
      console.log(res);
      this.snackbarService.status.next(new SnackbarApi(true, "Data berhasil disimpan !!", 'dismiss'));
      this.isLoading = false;
    });
    this.router.navigateByUrl('/pe/daily/manajemen');
    
  }

  dateChange(evt) {
    this.dateInput = evt.value.toLocaleDateString("id-ID", { month: "short", year: "numeric", day: "numeric" });
  }


  loadData() {
    this.isLoading = true;
    var httpOption = {
      params: {
        _id: this.tmp_id,
        page: this.paginator.pageIndex.toString(),
        pageSize: this.paginator.pageSize.toString(),
        mode: this.data_mode
      }
    }

    this.http.get<any>('/api/pe/daily/Tmp', httpOption).subscribe(res => {
      this.isLoading = false;
      this.data = res['items'];
      this.data_error_count = res['error_count'];
      this.resultsLength = res['total_count'];
      //if(this.data_error_count > 0) this.snackbarService.status.next(new SnackbarApi(true, "There are "+this.data_error_count+" error(s) in your data.", 'dismiss'));
    }, error => {
      this.isLoading = false;
      this.snackbarService.status.next(new SnackbarApi(true, error['message'], 'dismiss'));
      console.log(error);
    });
  }

  saveData() {
    this.isSaving = true;
    this.http.get<any>('/api/pe/daily/SaveData', { params: { _id: this.tmp_id } }).subscribe(res => {
      this.isSaving = false;
      this.modified_count = res["modified_count"];
      this.created_count = res["created_count"];
      this.stepper.selected.completed = true;
      this.stepper.next();
      this.snackbarService.status.next(new SnackbarApi(true, res["total_count"] + " item(s) saved successfully.", 'dismiss'));
    }, error => {
      this.isSaving = false;
      this.snackbarService.status.next(new SnackbarApi(true, error['message'], 'dismiss'));
      console.log(error);
    });
  }

  resetData() {
    this.isUploading = false;
    this.isLoading = false;
    this.isSaving = false;
    this.modified_count = 0;
    this.created_count = 0;
    this.progressPercent = 0;
    this.fileName = null;
    this.data = [];
    this.data_error_count = 0;
    this.resultsLength = 0;
    this.tmp_id = null;
    this.data_mode = "all";
    this.snackbarService.status.next(new SnackbarApi(false));
  }

  formatInterval(arr) {
    return arr.map(a => a.join("-")).join(", ");
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    return this.opsogForm.pristine;
  }

}
