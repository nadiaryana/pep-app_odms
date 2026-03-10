import { Component, Input, HostListener, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatPaginator, MatSort, MatDialog, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatStepper } from '@angular/material/stepper';
import { Router } from "@angular/router";
import { Observable, of, Subscription, interval } from 'rxjs';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { takeWhile, switchMap } from 'rxjs/operators';

//import { Sensor }    from './sensor';
import { PeSumur }    from './pe-sumur';
import { SnackbarService } from '../../snackbar.service';
import { SnackbarApi } from '../../snackbar.service';
import { DialogService } from '../../dialog.service';
import { TitleService } from '../../navigation/title/title.service';

@Component({
    selector: 'app-current-add',
    templateUrl: './pe-sumur-current-add.component.html',
    styleUrls: ['./pe-current.scss']
})

export class PeSumurCurrentAddComponent implements OnDestroy {

    @Input() locations: Location[];
        //company = ['PT Pertamina EP', 'PT Pertamina (Persero)'];
        loading = false;
        sumurForm: FormGroup;
        
        isUploading = false;
        isLoading = false;
        isSaving = false;
        isProcessing = false;
        processingStatus = '';
        modified_count = 0;
        created_count = 0;
        progressPercent: number;
        fileName: string;
        selectedWell: string = '';
        @ViewChild('fileInput', {static: true}) fileInput;
        @ViewChild('stepper', {static: true}) private stepper: MatStepper;
    
        tmp_id: string;
        @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
        @ViewChild(MatSort, {static: true}) sort: MatSort;
        data_mode = "all";
        resultsLength = 0;
    
        data: PeSumur[] = [];
        data_error_count: number = 0;
        displayedColumns: string[] = ["info", "date", "wellName", "entry_id", "field_1", "field_2"];
        headerColumns1: string[] = ["info", "date", "wellName", "entry_id", "field_1", "field_2"];

        // data untuk well selection
        wells = [
            { name: 'ST-092', value: 'ST-092' },
            { name: 'ST-182', value: 'ST-182' },
            { name: 'ST-159', value: 'ST-159' },
            { name: 'ST-161', value: 'ST-161' },
            { name: 'ST-080', value: 'ST-080' },
            { name: 'ST-185', value: 'ST-185' },
            { name: 'ST-160', value: 'ST-160' },
            { name: 'ST-210', value: 'ST-210' },
        ];

        private statusPollSubscription: Subscription;
    
        constructor(
            private formBuilder: FormBuilder,
            private router: Router,
            private snackbarService: SnackbarService,
            private dialogService: DialogService,
            private titleService: TitleService,
            private http: HttpClient,
            ) { }
    
        ngOnDestroy() {
            if (this.statusPollSubscription) {
                this.statusPollSubscription.unsubscribe();
            }
        }

        onSubmit() { 
            this.loading = true;
            //this.snackBar.dismiss();
            this.snackbarService.status.next(new SnackbarApi(false));
            this.sumurForm.disable();
        }
    
        get f() { return this.sumurForm.controls; }
    
        ngOnInit() { 
    
            this.titleService.titleSource.next({
              title: "Add iSRP PCM",
              icon:"add",
              breadcrumbs: [
                {label: 'Petroleum Engineering', routerLink: ''}, 
                {label: 'iSRP PCM', routerLink: 'pe/sumur'},
                {label: 'Add', routerLink: ''}, 
              ]}
            );
    
            this.sumurForm = this.formBuilder.group({
                //sensor_id: ['', Validators.required],
                location_id: [''],
                is_anchor: [''],
                wellName: ['', Validators.required], // Ubah ke wellName dengan validasi required
            });
    
            this.paginator.page.subscribe(() => this.loadData());
            //this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
        };
    
        listSumur() {
            this.router.navigate(['pe', 'sumur', 'list']);
        }
    
        canDeactivate(): Observable<boolean> | boolean {
            if (this.sumurForm.pristine) {
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
            // Validasi wellName selection
            if (!this.sumurForm.get('wellName').value) {
                this.snackbarService.status.next(new SnackbarApi(true, "Please select a well first!", 'dismiss'));
                return;
            }

            const file = this.fileInput.nativeElement.files[0];

            if (!file) {
                this.snackbarService.status.next(new SnackbarApi(true, "No file selected.", 'dismiss'));
                return;
            }

            const allowed = ['.xlsx'];
            const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

            if (!allowed.includes(ext)) {
                this.snackbarService.status.next(new SnackbarApi(true, "Invalid file type. Only .xlsx allowed.", 'dismiss'));
                return;
            }

            const fd = new FormData();
            this.isUploading = true;
            this.isProcessing = false;
            this.processingStatus = '';
            this.selectedWell = this.sumurForm.get('wellName').value;
            fd.append('files', file);
            fd.append('wellName', this.selectedWell);
            this.http.post('/api/pe/sumur/UploadFiles', fd, {
                reportProgress: true,
                observe: 'events'
            })
            .subscribe(event => {
                if (event.type === HttpEventType.UploadProgress) {
                    this.progressPercent = Math.round((event.loaded / event.total) * 100);
                } else if (event.type === HttpEventType.Response) {
                    // File uploaded, now start polling for processing status
                    this.tmp_id = event.body['_id'];
                    this.isUploading = false;
                    this.isProcessing = true;
                    this.processingStatus = 'Processing file...';
                    this.startStatusPolling();
                }
            }, error => {
                if (error) {
                    this.isUploading = false;
                    this.isProcessing = false;
                    this.resetData();
                    this.snackbarService.status.next(new SnackbarApi(true, "Wrong template file!", 'dismiss'));
                }
            });
        }

        startStatusPolling() {
            let isPolling = true;
            this.statusPollSubscription = interval(2000).pipe(
                takeWhile(() => isPolling),
                switchMap(() => this.http.get<any>('/api/pe/sumur/UploadStatus', { params: { _id: this.tmp_id } }))
            ).subscribe(
                res => {
                    this.processingStatus = res.message || 'Processing...';

                    if (res.status === 'done') {
                        isPolling = false;
                        this.isProcessing = false;
                        this.data_error_count = res.error_count;
                        this.stepper.selected.completed = true;
                        this.stepper.next();
                        this.loadData();
                        if (this.data_error_count > 0) {
                            this.snackbarService.status.next(new SnackbarApi(true, "There are " + this.data_error_count + " error(s) in your data.", 'dismiss'));
                        }
                    } else if (res.status === 'failed') {
                        isPolling = false;
                        this.isProcessing = false;
                        this.resetData();
                        this.snackbarService.status.next(new SnackbarApi(true, "Processing failed: " + res.message, 'dismiss'));
                    }
                },
                error => {
                    isPolling = false;
                    this.isProcessing = false;
                    this.snackbarService.status.next(new SnackbarApi(true, "Error checking status: " + error.message, 'dismiss'));
                }
            );
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
            
            this.http.get<any>('/api/pe/sumur/Tmp', httpOption).subscribe(res => {
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
            this.http.get<any>('/api/pe/sumur/SaveData', {
                params: { _id: this.tmp_id, wellName: this.selectedWell }
            }).subscribe(res => {
                this.isSaving = false;
                this.modified_count = res['modified_count'];
                this.created_count  = res['created_count'];
                this.stepper.selected.completed = true;
                this.stepper.next();
                this.snackbarService.status.next(new SnackbarApi(true, res['total_count'] + ' item(s) saved successfully.', 'dismiss'));
            }, error => {
                this.isSaving = false;
                this.snackbarService.status.next(new SnackbarApi(true, error['error'] ? error['error'].message : 'Save failed', 'dismiss'));
            });
        }
    
        resetData() {
            if (this.statusPollSubscription) {
                this.statusPollSubscription.unsubscribe();
            }
            this.isUploading = false;
            this.isLoading = false;
            this.isSaving = false;
            this.isProcessing = false;
            this.processingStatus = '';
            this.modified_count = 0;
            this.created_count = 0;
            this.progressPercent = 0;
            this.fileName = null;
            this.selectedWell = "";
            this.sumurForm.get('wellName').setValue(''); // Reset wellName selection
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
            return this.sumurForm.pristine;
        }
}