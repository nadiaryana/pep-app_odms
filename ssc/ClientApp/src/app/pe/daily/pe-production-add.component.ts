import { Component, Input, HostListener, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { MatPaginator, MatSort, MatDialog, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatStepper } from '@angular/material/stepper';
import { Router } from "@angular/router";
import { Observable, of } from 'rxjs';
import { HttpClient, HttpEventType } from '@angular/common/http';

import { Daily }    from './daily';
import { PeProduction}    from './pe-production';
import { SnackbarService } from '../../snackbar.service';
import { SnackbarApi } from '../../snackbar.service';
import { DialogService } from '../../dialog.service';
import { TitleService } from '../../navigation/title/title.service';

@Component({
	selector: 'app-production-add',
	templateUrl: './pe-production-add.component.html',
	// styleUrls: ['./pe-production-add.component.scss']
})

export class PeProductionAddComponent {
	@Input() locations: Location[];
	//company = ['PT Pertamina EP', 'PT Pertamina (Persero)'];
	loading = false;
  dailyForm: FormGroup;
  opsogForm: FormGroup;
  
	isUploading = false;
	isLoading = false;
	isSaving = false;
	modified_count = 0;
	created_count = 0;
	progressPercent: number;
	fileName: string;
	@ViewChild('fileInput', {static: true}) fileInput;
	@ViewChild('stepper', {static: true}) private stepper: MatStepper;

	tmp_id: string;
	@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  	@ViewChild(MatSort, {static: true}) sort: MatSort;
  	data_mode = "all";
  	resultsLength = 0;

	data: PeProduction[] = [];
	data_error_count: number = 0;
	
	displayedColumns: string[] = ["info","date","sot","operation","figure",  "gas", "gas_sales", "sgt_sot", "sbr_sot", "bd_sot","sgt_opr", "sbr_opr", "bd_opr", "sgt_fig", "sbr_fig", "bd_fig","rkap", "wpnb"];
  	headerColumns1: string[] = ["info","date","sot","operation","figure",  "gas", "gas_sales", "sgt_sot", "sbr_sot", "bd_sot","sgt_opr", "sbr_opr", "bd_opr", "sgt_fig", "sbr_fig", "bd_fig","rkap", "wpnb"];

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
		//this.snackBar.dismiss();
		this.snackbarService.status.next(new SnackbarApi(false));
		this.dailyForm.disable();
	}

  get f() { return this.dailyForm.controls; }
  get opsog_array() { return this.opsogForm.get('opsog_array') }

	ngOnInit() { 

		this.titleService.titleSource.next({
          title: "Add Production",
          icon : "add",
	      breadcrumbs: [
	        {label: 'Petroleum Engineering', routerLink: ''}, 
	        {label: 'Production', routerLink: 'pe/production'},
	        {label: 'Add', routerLink: ''}, 
	      ]}
	    );

		this.dailyForm = this.formBuilder.group({
			//daily_id: ['', Validators.required],
			location_id: [''],
			is_anchor: [''],
        });

      this.opsogForm = this.formBuilder.group({
        opsog_array: this.formBuilder.array([
          this.formBuilder.group({
            date: [''],
            operation: [''],
            sot: [''],
            gas: [''],
          }),
        ])
      });

	  this.paginator.page.subscribe(() => {
			if (this.tmp_id) this.loadData();
		});
		// this.paginator.page.subscribe(() => this.loadData());
		//this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
  };

  addOpsogForm() {
    let addForm = this.opsogForm.get('opsog_array') as FormArray;
    addForm.push(this.formBuilder.group({
      date: [''],
      operation: [''],
      sot: [''],
      gas: [''],
    }));
  }

  removeOpsogForm(index) {
    let removeForm = this.opsogForm.get('opsog_array') as FormArray;
    removeForm.removeAt(index);
  }

	listDaily() {
		this.router.navigate(['pe', 'production', 'list']);
	}

	canDeactivate(): Observable<boolean> | boolean {
		if (this.dailyForm.pristine) {
			return true;
		}
		return this.dialogService.confirm('Discard changes?');
	}

	handleFile(event) {
		this.progressPercent = null;
		this.fileName = event.target.files[0].name;
		const reader = new FileReader();
		// tslint:disable-next-line:no-shadowed-variable
		reader.onload = (event: any) => {
			//this.image = event.target.result;
		};
		reader.readAsDataURL(event.target.files[0]);
	}

	onUpload() {
		const fd = new FormData();
		this.isUploading = true;
		fd.append('files', this.fileInput.nativeElement.files[0]);
		this.http.post('/api/pe/production/UploadFilesProduction', fd, {
			reportProgress: true,
			observe: 'events'
		})
		.subscribe(event => {
			console.log(event);
			console.log(this.data_error_count);
			if (event.type === HttpEventType.UploadProgress) {
				this.progressPercent = Math.round((event.loaded / event.total) * 100);
				console.log("njbh");
			} else if (event.type === HttpEventType.Response) {
				this.isUploading = false;
				this.tmp_id = event.body['tmp_id']; 
				console.log("Upload selesai, tmp_id:", this.tmp_id);
				this.data_error_count = event.body['error_count'];
				this.data = event.body['items'];
				//this.data = event.body['items'];
				// this.data_error_count = event.body['error_count'];
				// this.tmp_id = event.body['_id'];
				this.stepper.selected.completed = true;
				this.stepper.next();
				if (this.tmp_id) {
					this.loadData();
				}
				if(this.data_error_count > 0) this.snackbarService.status.next(
					new SnackbarApi(true, "There are "+this.data_error_count+" error(s) in your data.", 'dismiss')
				);
			}
			console.log(this.data_error_count);
    }, error => {
      if (error) {
        this.isUploading = false;
        this.resetData();
        this.snackbarService.status.next(new SnackbarApi(true, "Wrong template file!", 'dismiss'));
      }
    });
    }

  onSaveOpsog() {
    this.isUploading = true;

  // this.http.post('/api/pe/daily/UploadFiles', this.opsogForm.value, {});

   this.isUploading = false;
   this.stepper.selected.completed = true;
   this.stepper.next();
   this.stepper.selected.completed = true;
   this.stepper.next();
   this.stepper.selected.completed = true;
   this.stepper.next();
  }

	loadData() {
		if (!this.tmp_id || this.tmp_id === 'undefined') {
				console.error('⚠️ tmp_id belum tersedia, skip loadData()');
				this.isLoading = false;
				return;
		}

		this.isLoading = true;
		var httpOption = {
			params: {
				_id: this.tmp_id,
				page: this.paginator.pageIndex.toString(),
				pageSize: this.paginator.pageSize.toString(), 
				mode: this.data_mode
			}
		}
		
		this.http.get<any>('/api/pe/production/Tmp', httpOption).subscribe(res => {
			this.isLoading = false;
			this.data = res['items'];
			this.data_error_count = res['error_count'];
			this.resultsLength = res['total_count'];
			console.log('tmp_id:', this.tmp_id);
			console.log('error_count:', this.data_error_count);


			//if(this.data_error_count > 0) this.snackbarService.status.next(new SnackbarApi(true, "There are "+this.data_error_count+" error(s) in your data.", 'dismiss'));
		}, error => {
			this.isLoading = false;
			this.snackbarService.status.next(new SnackbarApi(true, error['message'], 'dismiss'));
			console.log(error);
		});
	}

	saveData() {
		this.isSaving = true;
		console.log('Saving data with tmp_id:', this.tmp_id);
		this.http.get<any>(`/api/pe/production/SaveDataProduction?tmp_id=${this.tmp_id}`)
			.subscribe(res => {
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
		return this.dailyForm.pristine;
	}

}
