import { Component, Input, HostListener, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatPaginator, MatSort, MatDialog, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatStepper } from '@angular/material/stepper';
import { Router } from "@angular/router";
import { Observable, of } from 'rxjs';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { SnackbarService } from '../../snackbar.service';
import { SnackbarApi } from '../../snackbar.service';
import { DialogService } from '../../dialog.service';
import { TitleService } from '../../navigation/title/title.service';
import { PePermissionService } from '../pe-permission.service';
import { PeMap } from './pe-map';

@Component({
	selector: 'app-map-add',
	templateUrl: './pe-map-add.component.html',
	styleUrls: ['./pe-map.scss']
})

export class PeMapAddComponent {
	@Input() locations: Location[];
	//company = ['PT Pertamina EP', 'PT Pertamina (Persero)'];
	loading = false;
	mapForm: FormGroup;
	
	isUploading = false;
	isLoading = false;
	isSaving = false;
	modified_count = 0;
	created_count = 0;
	progressPercent: number | null = null; 
	fileName: string;
	@ViewChild('fileInput', {static: true}) fileInput!: ElementRef;;
	@ViewChild('stepper', {static: true}) private stepper: MatStepper;

	tmp_id: string;
	@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  	@ViewChild(MatSort, {static: true}) sort: MatSort;
  	data_mode = "all";
  	resultsLength = 0;

	data: PeMap[] = [];
	data_error_count: number = 0;
	displayedColumns: string[] = ["info", "wellName", "lat", "lng", 'status','station',"Actions"];

	constructor(
		private formBuilder: FormBuilder,
		private router: Router,
		public pePermissionService: PePermissionService,
		private snackbarService: SnackbarService,
		private dialogService: DialogService,
		private titleService: TitleService,
		private http: HttpClient,
		) { }

	onSubmit() { 
		this.loading = true;
		//this.snackBar.dismiss();
		this.snackbarService.status.next(new SnackbarApi(false));
		this.mapForm.disable();
	}

	get f() { return this.mapForm.controls; }

	ngOnInit() { 

		this.titleService.titleSource.next({
          title: "Add Map",
          icon:"add",
	      breadcrumbs: [
	        {label: 'Petroleum Engineering', routerLink: ''}, 
	        {label: 'Map', routerLink: 'pe/map'},
	        {label: 'Add', routerLink: ''}, 
	      ]}
	    );

		this.mapForm = this.formBuilder.group({
			//sensor_id: ['', Validators.required],
			location_id: [''],
			is_anchor: [''],
		});

		this.paginator.page.subscribe(() => this.loadData());
		//this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
	};

	listMap() {
		this.router.navigate(['pe', 'map', 'list']);
	}

	canDeactivate(): Observable<boolean> | boolean {
		if (this.mapForm.pristine) {
			return true;
		}
		return this.dialogService.confirm('Discard changes?');
	}

	handleFile(event : any) {
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
		this.http.post('/api/pe/map/UploadFiles', fd, {
			reportProgress: true,
			observe: 'events'
		})
		.subscribe(event => {
			if (event.type === HttpEventType.UploadProgress && event.total) {
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
		console.log('tmp_id:', this.tmp_id);
		this.isLoading = true;
		var httpOption = {
			params: {
				_id: this.tmp_id,
				page: this.paginator.pageIndex.toString(),
				pagesize: this.paginator.pageSize.toString(), 
				mode: this.data_mode
			}
		}
		
		this.http.get<any>('/api/pe/map/Tmp', httpOption).subscribe(res => {
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
		this.http.get<any>('/api/pe/map/SaveData', {params: {_id: this.tmp_id}}).subscribe(res => {
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
		return this.mapForm.pristine;
	}

}
