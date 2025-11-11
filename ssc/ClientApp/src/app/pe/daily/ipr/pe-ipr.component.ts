import { Component, Input, HostListener, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatPaginator, MatSort, MatDialog, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatStepper } from '@angular/material/stepper';
import { Router, RouterLink } from "@angular/router";
import { Observable, of } from 'rxjs';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { TitleService } from 'src/app/navigation/title/title.service';
import { SnackbarService } from 'src/app/snackbar.service';
import { title } from 'process';

// import { PeSonolog }    from './pe-sonolog';
// import { SnackbarService } from '../../snackbar.service';
// import { SnackbarApi } from '../../snackbar.service';
// import { DialogService } from '../../dialog.service';

@Component({
  selector: 'app-ipr',
  templateUrl: './pe-ipr.component.html',
  styleUrls: ['./pe-ipr.component.scss']
})
export class IprComponent{
  // @Input() locations: Location[];
	//company = ['PT Pertamina EP', 'PT Pertamina (Persero)'];
	// loading = false;
	// // sonologForm: FormGroup;
	
	// isUploading = false;
	// isLoading = false;
	// isSaving = false;
	// modified_count = 0;
	// created_count = 0;
	// progressPercent: number;
	// fileName: string;
	// @ViewChild('fileInput', {static: true}) fileInput;
	// @ViewChild('stepper', {static: true}) private stepper: MatStepper;

	// tmp_id: string;
	// @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  // 	@ViewChild(MatSort, {static: true}) sort: MatSort;
  // 	data_mode = "all";
  // 	resultsLength = 0;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private titleService: TitleService,
    public snackbarService: SnackbarService,
    private http: HttpClient,
){ }

  // onSubmit() { 
  //     this.loading = true;
  //     //this.snackBar.dismiss();
  //     // this.snackbarService.status.next(new SnackbarApi(false));
  //   }

  ngOnInit() {
    this.titleService.titleSource.next({
      title: "IPR",
      icon: "show_chart",
      breadcrumbs: [
        { label: "Petroleum Engineering", routerLink: ""},
        { label: "IPR", routerLink: "pe/ipr"}
      ]}
    )
  }

}
