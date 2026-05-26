import { Component, Input, HostListener, ViewChild, LOCALE_ID, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { MatPaginator, MatSort, MatDialog, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatStepper } from '@angular/material/stepper';
import { Router } from "@angular/router";
import { Observable, of } from 'rxjs';
import { HttpClient, HttpEventType } from '@angular/common/http';

import { Daily } from '../daily/daily';
import { PeDaily } from '../daily/pe-daily';
import { SnackbarService } from '../../snackbar.service';
import { SnackbarApi } from '../../snackbar.service';
import { DialogService } from '../../dialog.service';
import { TitleService } from '../../navigation/title/title.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-actual-add-opr',
  templateUrl: './pe-actual-add-opr.component.html',
  styleUrls: ['./pe-actual.scss']
})

export class PeActualAddOprComponent {
  @Input() locations: Location[];
  //company = ['PT Pertamina EP', 'PT Pertamina (Persero)'];
  loading = false;
  opsogForm: FormGroup;

  isUploading = false;
  isLoading = false;
  isSaving = false;
  modified_count = 0;
  created_count = 0;
  progressPercent = 0;
  fileName: string | null = null;
  @ViewChild('stepper', { static: true }) private stepper: MatStepper;

  tmp_id: string | null = null;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  data_mode = "all";
  resultsLength = 0;
  dateInput: string | null = null;
  data: PeDaily[] = [];
  data_error_count: number = 0;

  displayedColumns: string[] = ["info", "date", "total_opr", "sgt_mgs", "sbr_opr", "bd_opr"];
  headerColumns1: string[] = ["info", "date", "total_opr", "sgt_mgs", "sbr_opr", "bd_opr"];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private snackbarService: SnackbarService,
    private dialogService: DialogService,
    private titleService: TitleService,
    private http: HttpClient,
    @Inject(LOCALE_ID) public locale: string
  ) {

  }

  get productions(): FormArray {
    return this.opsogForm.get('productions') as FormArray;
  }

  ngOnInit() {

    this.titleService.titleSource.next({
      title: "Add Actual Operation",
      icon: "add",
      breadcrumbs: [
        { label: 'Petroleum Engineering', routerLink: '' },
        { label: 'Actual', routerLink: 'pe/actual' },
        { label: 'Add Actual Operation', routerLink: '' },
      ]
    }
    );


    this.opsogForm = this.formBuilder.group({
      productions: this.formBuilder.array([
        this.formBuilder.group({
          date: ['', Validators.required],
          total_opr: ['', Validators.required],
          sgt_mgs: ['', Validators.required],
          sbr_opr: ['', Validators.required],
          bd_opr: ['', Validators.required],
          // gas_sales: ['', Validators.required],
        }),
      ])
    });
  };

  addOpsogForm(): void {
    const addForm = this.opsogForm.get('productions') as FormArray;
    addForm.push(this.formBuilder.group({
      date: ['', Validators.required],
      total_opr: ['', Validators.required],
      sgt_mgs: ['', Validators.required],
      sbr_opr: ['', Validators.required],
      bd_opr: ['', Validators.required],
      // gas_sales: ['', Validators.required],
    }));
  }

  removeOpsogForm(index: number): void {
    const removeForm = this.opsogForm.get('productions') as FormArray;
    removeForm.removeAt(index);
  } 

  listActual(): void {
    this.router.navigate(['pe', 'actual', 'list']);
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (this.opsogForm.pristine) {
      return true;
    }
    return this.dialogService.confirm('Discard changes?');
  }

  onSaveActualOpr(): void {
    if (this.opsogForm.invalid) {
      this.opsogForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const params = {
      actuals: this.opsogForm.getRawValue().productions.map((item: any) => ({
        date: item.date,
        total_opr: item.total_opr,
        sgt_mgs: item.sgt_mgs,
        sbr_nsop: item.sbr_opr,
        bd: item.bd_opr
      }))
    };
    console.log(params);
    this.http.post('/api/pe/actual',params).subscribe(res => {
      console.log(res);
      this.snackbarService.status.next(new SnackbarApi(true, "Data berhasil disimpan !!", 'dismiss'));
      this.isLoading = false;
      this.opsogForm.markAsPristine();
      this.router.navigateByUrl('/pe/actual');
    }, error => {
      this.isLoading = false;
      const errorMessage = error && error.error && error.error.message
        ? error.error.message
        : (error && error.message ? error.message : 'Gagal menyimpan data.');
      this.snackbarService.status.next(new SnackbarApi(true, errorMessage, 'dismiss'));
      console.log(error);
    });
  }

  dateChange(evt: any): void {
    this.dateInput = evt.value.toLocaleDateString("id-ID", { month: "short", year: "numeric", day: "numeric" });
  }


  loadData(): void {
    this.isLoading = true;
    const tmpId = this.tmp_id ? this.tmp_id : '';
    const httpOption = {
      params: {
        _id: tmpId,
        page: this.paginator.pageIndex.toString(),
        pageSize: this.paginator.pageSize.toString(),
        mode: this.data_mode
      }
    };

    this.http.get<any>('/api/pe/actual/Tmp', httpOption).subscribe(res => {
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

  saveData(): void {
    this.isSaving = true;
    const tmpId = this.tmp_id ? this.tmp_id : '';
    this.http.get<any>('/api/pe/actual/SaveData', { params: { _id: tmpId } }).subscribe(res => {
      this.isSaving = false;
      this.modified_count = res["modified_count"];
      this.created_count = res["created_count"];
      if (this.stepper) {
        this.stepper.selected.completed = true;
        this.stepper.next();
      }
      this.snackbarService.status.next(new SnackbarApi(true, res["total_count"] + " item(s) saved successfully.", 'dismiss'));
    }, error => {
      this.isSaving = false;
      this.snackbarService.status.next(new SnackbarApi(true, error['message'], 'dismiss'));
      console.log(error);
    });
  }

  resetData(): void {
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

  formatInterval(arr: any[]): string {
    return arr.map((a: any[]) => a.join("-")).join(", ");
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    return this.opsogForm.pristine;
  }

}
