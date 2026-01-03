import { Component, Input, HostListener, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { MatPaginator, MatSort, MatDialog, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatStepper } from '@angular/material/stepper';
import { Router } from "@angular/router";
import { Observable, of } from 'rxjs';
import { HttpClient, HttpEventType } from '@angular/common/http';

import { Barchart, BarchartTmp } from './barchart';
import { SnackbarService } from '../../snackbar.service';
import { SnackbarApi } from '../../snackbar.service';
import { DialogService } from '../../dialog.service';
import { TitleService } from '../../navigation/title/title.service';

@Component({
  selector: 'app-barchart-add',
  templateUrl: './barchart-add.component.html',
  styleUrls: ['./barchart.scss']
})

export class BarchartAddComponent {
  loading = false;
  barchartForm: FormGroup;

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

  data: BarchartTmp[] = [];
  data_error_count: number = 0;

  displayedColumns: string[] = ["info", "well", "job", "rig", "plan_start", "plan_end"];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private snackbarService: SnackbarService,
    private dialogService: DialogService,
    private titleService: TitleService,
    private http: HttpClient,
  ) { }

  onSubmit() {
    this.loading = true;
    this.snackbarService.status.next(new SnackbarApi(false));
    this.barchartForm.disable();
  }

  get f() { return this.barchartForm.controls; }

  ngOnInit() {

    this.titleService.titleSource.next({
      title: "Add Barchart",
      icon: "add",
      breadcrumbs: [
        { label: 'Petroleum Engineering', routerLink: '' },
        { label: 'Barchart', routerLink: 'pe/barchart' },
        { label: 'Add', routerLink: '' },
      ]
    }
    );

    this.barchartForm = this.formBuilder.group({
      location_id: [''],
      is_anchor: [''],
    });

    this.paginator.page.subscribe(() => this.loadData());
  };

  listBarchart() {
    this.router.navigate(['pe', 'barchart', 'list']);
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (this.barchartForm.pristine) {
      return true;
    }
    return this.dialogService.confirm('Discard changes?');
  }

  handleFile(event) {
    this.progressPercent = null;
    this.fileName = event.target.files[0].name;
    const reader = new FileReader();
    reader.onload = (event: any) => {
      //this.image = event.target.result;
    };
    reader.readAsDataURL(event.target.files[0]);
  }

  onUpload() {
    const fd = new FormData();
    this.isUploading = true;
    fd.append('files', this.fileInput.nativeElement.files[0]);
    this.http.post('/api/pe/barchart/UploadFiles', fd, {
      reportProgress: true,
      observe: 'events'
    })
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progressPercent = Math.round((event.loaded / event.total) * 100);
        } else if (event.type === HttpEventType.Response) {
          this.isUploading = false;
          this.data_error_count = event.body['error_count'];
          this.tmp_id = event.body['_id'];
          this.stepper.selected.completed = true;
          this.stepper.next();
          this.loadData();
          if (this.data_error_count > 0) this.snackbarService.status.next(new SnackbarApi(true, "There are " + this.data_error_count + " error(s) in your data.", 'dismiss'));
        }
      }, error => {
        if (error) {
          this.isUploading = false;
          this.resetData();
          this.snackbarService.status.next(new SnackbarApi(true, "Wrong template file!", 'dismiss'));
        }
      });
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

    this.http.get<any>('/api/pe/barchart/Tmp', httpOption).subscribe(res => {
      this.isLoading = false;
      this.data = res['items'];
      this.data_error_count = res['error_count'];
      this.resultsLength = res['total_count'];
    }, error => {
      this.isLoading = false;
      this.snackbarService.status.next(new SnackbarApi(true, error['message'], 'dismiss'));
      console.log(error);
    });
  }

  saveData() {
    this.isSaving = true;
    this.http.get<any>('/api/pe/barchart/SaveData', { params: { _id: this.tmp_id } }).subscribe(res => {
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

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    return this.barchartForm.pristine;
  }

}
