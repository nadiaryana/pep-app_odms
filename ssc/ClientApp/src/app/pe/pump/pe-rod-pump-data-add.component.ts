import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { MatStepper } from '@angular/material/stepper';
import { Router } from "@angular/router";
import { HttpClient, HttpEventType } from '@angular/common/http';

import { RodPumpData } from './rod-pump-data';
import { SnackbarService } from '../../snackbar.service';
import { SnackbarApi } from '../../snackbar.service';
import { TitleService } from '../../navigation/title/title.service';

@Component({
	selector: 'app-rod-pump-data-add',
	templateUrl: './pe-rod-pump-data-add.component.html',
	styleUrls: ['./pe-pumping-unit.scss']
})

export class PeRodPumpDataAddComponent {

	isUploading = false;
	isLoading = false;
	isSaving = false;
	progressPercent: number;
	fileName: string;
	created_count = 0;
	duplicate_count = 0;
	@ViewChild('fileInput', {static: true}) fileInput;
	@ViewChild('stepper', {static: true}) private stepper: MatStepper;

	tmp_id: string;
	@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
	data_mode = "all";
	resultsLength = 0;

	data: RodPumpData[] = [];
	data_error_count: number = 0;

	rodColumns = [
		{ field: 'rod_string1', label: '1 1/4"' },
		{ field: 'rod_string2', label: '1 1/8"' },
		{ field: 'rod_string3', label: '1"' },
		{ field: 'rod_string4', label: '7/8"' },
		{ field: 'rod_string5', label: '3/4"' },
		{ field: 'rod_string6', label: '5/8"' },
		{ field: 'rod_string7', label: '1/2"' },
	];
	displayedColumns: string[] = ["info", "rod_nomor", "plunger_diameter", "rod_weight", "elastic_constat", "freq_factor",
		"rod_string1", "rod_string2", "rod_string3", "rod_string4", "rod_string5", "rod_string6", "rod_string7"];

	constructor(
		private router: Router,
		private snackbarService: SnackbarService,
		private titleService: TitleService,
		private http: HttpClient,
		) { }

	ngOnInit() {
		this.titleService.titleSource.next({
			title: "Upload Rod Pump Data",
			icon: "add",
			breadcrumbs: [
				{label: 'Petroleum Engineering', routerLink: ''},
				{label: 'PU', routerLink: 'pe/pump'},
				{label: 'Upload Rod Pump', routerLink: ''},
			]}
		);

		this.paginator.page.subscribe(() => this.loadData());
	}

	handleFile(event) {
		this.progressPercent = null;
		this.fileName = event.target.files[0].name;
	}

	onUpload() {
		const fd = new FormData();
		this.isUploading = true;
		fd.append('files', this.fileInput.nativeElement.files[0]);
		this.http.post('/api/pe/RodPumpData/UploadFiles', fd, {
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
				if(this.data_error_count > 0) this.snackbarService.status.next(new SnackbarApi(true, "There are "+this.data_error_count+" error(s) in your data.", 'dismiss'));
			}
		}, error => {
			this.isUploading = false;
			this.snackbarService.status.next(new SnackbarApi(true, error['message'], 'dismiss'));
		});
	}

	loadData() {
		this.isLoading = true;
		var httpOption = {
			params: {
				_id: this.tmp_id,
				page: this.paginator.pageIndex.toString(),
				pagesize: (this.paginator.pageSize || 50).toString(),
				mode: this.data_mode
			}
		}

		this.http.get<any>('/api/pe/RodPumpData/Tmp', httpOption).subscribe(res => {
			this.isLoading = false;
			this.data = res['items'];
			this.data_error_count = res['error_count'];
			this.resultsLength = res['total_count'];
		}, error => {
			this.isLoading = false;
			this.snackbarService.status.next(new SnackbarApi(true, error['message'], 'dismiss'));
		});
	}

	saveData() {
		this.isSaving = true;
		this.http.get<any>('/api/pe/RodPumpData/SaveData', {params: {_id: this.tmp_id}}).subscribe(res => {
			this.isSaving = false;
			this.created_count = res["created_count"];
			this.duplicate_count = res["duplicate_count"];
			this.stepper.selected.completed = true;
			this.stepper.next();
			this.snackbarService.status.next(new SnackbarApi(true, res["created_count"] + " item(s) saved successfully.", 'dismiss'));
		}, error => {
			this.isSaving = false;
			this.snackbarService.status.next(new SnackbarApi(true, error['message'], 'dismiss'));
		});
	}

	resetData() {
		this.isUploading = false;
		this.isLoading = false;
		this.isSaving = false;
		this.created_count = 0;
		this.duplicate_count = 0;
		this.progressPercent = 0;
		this.fileName = "";
		this.fileInput.nativeElement.value = '';
		this.data = [];
		this.data_error_count = 0;
		this.resultsLength = 0;
		this.tmp_id = null;
		this.data_mode = "all";
		this.snackbarService.status.next(new SnackbarApi(false));
	}

	// 0.000000997 -> "0,997 × 10⁻⁶"
	formatElastic(value: number): string {
		if (value == null) return '-';
		return (value * 1000000).toFixed(3).replace('.', ',') + ' × 10⁻⁶';
	}

	listRodPump() {
		// balik ke list dan langsung buka tab Rod Pump Data
		this.router.navigate(['pe', 'pump', 'list'], { queryParams: { tab: 'rod' } });
	}
}