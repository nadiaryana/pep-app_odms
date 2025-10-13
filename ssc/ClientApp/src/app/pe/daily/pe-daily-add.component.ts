import { Component, Input, HostListener, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { MatPaginator, MatSort, MatDialog, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatStepper } from '@angular/material/stepper';
import { Router } from "@angular/router";
import { Observable, of } from 'rxjs';
import { HttpClient, HttpEventType } from '@angular/common/http';

import { Daily }    from './daily';
import { PeDaily }    from './pe-daily';
import { SnackbarService } from '../../snackbar.service';
import { SnackbarApi } from '../../snackbar.service';
import { DialogService } from '../../dialog.service';
import { TitleService } from '../../navigation/title/title.service';

@Component({
	selector: 'app-daily-add',
	templateUrl: './pe-daily-add.component.html',
	styleUrls: ['./pe-daily.scss']
})

export class PeDailyAddComponent {
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

	data: PeDaily[] = [];
	data_error_count: number = 0;
	
	displayedColumns: string[] = ["info","date","nomor","location","well","well_string","zone","interval","potensi_prod_gross","potensi_prod_net","tes_prod_gross","tes_prod_net",
                                "fig_last_gross","fig_last_net","fig_curr_gross","fig_curr_net","thp_last_fig","thp_potensi","wc","prod_hours","wor","gas","gor","glr",
                                "ls_method","ls_brandtype","ls_prime_mover","ls_hp","ds_bean","ds_whp","ds_fl","ds_casing","ds_separator","ds_spm","ds_size","ds_pump_displace","ds_efficiency",
                              "ds_sl","ds_kd","sm","ds_tgl_pengujian","noted"];
  	headerColumns1: string[] = ["info","date","nomor","location","well","well_string","zone","interval","potensi_prod","tes_prod","fig","thp_last_fig","thp_potensi","wc","prod_hours","wor","gas","gor","glr",
                            	"lifting_status","daftar_sumur","noted"];
  	headerColumns2: string[] = ["potensi_prod_gross","potensi_prod_net","tes_prod_gross","tes_prod_net","fig_last_gross","fig_last_net","fig_curr_gross","fig_curr_net",
                              	"ls_method","ls_brandtype","ls_prime_mover","ls_hp","ds_bean","ds_whp","ds_fl","ds_casing","ds_separator","ds_spm","ds_size","ds_pump_displace","ds_efficiency",
                              	"ds_sl","ds_kd","sm","ds_tgl_pengujian"]
  	headerColumns3: string[] = ["last_test", "current_test"]

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
          title: "Add Daily",
          icon : "add",
	      breadcrumbs: [
	        {label: 'Petroleum Engineering', routerLink: ''}, 
	        {label: 'Daily', routerLink: 'pe/daily'},
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

		this.paginator.page.subscribe(() => this.loadData());
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
		this.router.navigate(['pe', 'daily', 'list']);
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
		this.http.post('/api/pe/daily/UploadFiles', fd, {
			reportProgress: true,
			observe: 'events'
		})
		.subscribe(event => {
			if (event.type === HttpEventType.UploadProgress) {
				this.progressPercent = Math.round((event.loaded / event.total) * 100);
			} else if (event.type === HttpEventType.Response) {
				this.isUploading = false;
				//this.data = event.body['items'];
				this.data_error_count = event.body['error_count'];
				this.tmp_id = event.body['_id'];
				this.stepper.selected.completed = true;
				this.stepper.next();
				this.loadData();
				if(this.data_error_count > 0) this.snackbarService.status.next(new SnackbarApi(true, "There are "+this.data_error_count+" error(s) in your data.", 'dismiss'));
			}
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
		this.http.get<any>('/api/pe/daily/SaveData', {params: {_id: this.tmp_id}}).subscribe(res => {
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
