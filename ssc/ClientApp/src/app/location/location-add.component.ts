import { Component, Input, HostListener, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatPaginator, MatSort, MatDialog, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatStepper } from '@angular/material/stepper';
import { Router } from "@angular/router";
import { Observable, of } from 'rxjs';
import { HttpClient, HttpEventType } from '@angular/common/http';

//import { Location }    from './location';
import { SnackbarService } from '../snackbar.service';
import { SnackbarApi } from '../snackbar.service';
import { DialogService } from '../dialog.service';
import { TitleService } from '../navigation/title/title.service';

@Component({
	selector: 'app-location-add',
	templateUrl: './location-add.component.html',
	styleUrls: ['./location.scss']
})

export class LocationAddComponent {
	@Input() locations: any[];
	//company = ['PT Pertamina EP', 'PT Pertamina (Persero)'];
	loading = false;
	locationForm: FormGroup;
	
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

	data: Location[] = [];
	data_error_count: number = 0;
	displayedColumns: string[] = ["info", "id", "name", "parent_id", "path", "type"];

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
		this.locationForm.disable();
	}

	get f() { return this.locationForm.controls; }

	ngOnInit() { 

		this.titleService.titleSource.next({
	      title: "Add Location", 
	      breadcrumbs: [
	        {label: 'Location', routerLink: ''}, 
	        {label: 'Add', routerLink: ''}, 
	      ]}
	    );

		this.locationForm = this.formBuilder.group({
			//location_id: ['', Validators.required],
			location_id: [''],
			is_anchor: [''],
		});

		this.paginator.page.subscribe(() => this.loadData());
		//this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
	};

	listLocation() {
		this.router.navigate(['location', 'list']);
	}

	canDeactivate(): Observable<boolean> | boolean {
		if (this.locationForm.pristine) {
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
		this.http.post('/api/location/UploadFiles', fd, {
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
		
		this.http.get<any>('/api/location/Tmp', httpOption).subscribe(res => {
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
		this.http.get<any>('/api/location/SaveData', {params: {_id: this.tmp_id}}).subscribe(res => {
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
		this.fileName = "";
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
		return this.locationForm.pristine;
	}

}
