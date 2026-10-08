import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { Observable } from 'rxjs';

import { PeProdWaterfall, PeProdWaterfallKategori, PeProdWaterfallWell } from './pe-prod-waterfall';
import { PeProdWaterfallService } from './pe-prod-waterfall.service';
import { SnackbarService, SnackbarApi } from '../../snackbar.service';
import { DialogService } from '../../dialog.service';
import { TitleService } from '../../navigation/title/title.service';

@Component({
  selector: 'app-pe-prod-waterfall-add',
  templateUrl: './pe-prod-waterfall-add.component.html',
  styleUrls: ['./pe-prod-waterfall.scss']
})
export class PeProdWaterfallAddComponent implements OnInit {

  isLoading = false;
  isSaving = false;

  kategoriList: PeProdWaterfallKategori[] = [];
  selectedKategori = "";

  start_dateControl = new FormControl(new Date());
  start_dateInput = "";

  end_dateControl = new FormControl(new Date());
  end_dateInput = "";

  /** Sumur + delta harian dari API: sumber pilihan dropdown dan auto-isi delta. */
  wells: PeProdWaterfallWell[] = [];
  hideAdded = false;

  /** Form add: satu baris per sumur yang akan disimpan. */
  waterfallForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private service: PeProdWaterfallService,
    private snackbarService: SnackbarService,
    private dialogService: DialogService,
    private titleService: TitleService,
  ) { }

  ngOnInit() {

    this.titleService.titleSource.next({
      title: "Add Production Waterfall",
      icon: "add",
      breadcrumbs: [
        { label: 'Petroleum Engineering', routerLink: '' },
        { label: 'Waterfall', routerLink: 'pe/waterfall' },
        { label: 'Add', routerLink: '' }
      ]
    });

    this.waterfallForm = this.formBuilder.group({
      wells: this.formBuilder.array([this.createWellForm()])
    });

    this.initDate();
    this.loadKategori();
    this.loadWells();
  }

  /** Periode diwarisi dari halaman list (query param), default seminggu terakhir. */
  private initDate() {
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var defStart = new Date(today);
    defStart.setDate(defStart.getDate() - 7);

    this.start_dateControl = new FormControl(defStart);
    this.end_dateControl = new FormControl(today);

    var p_start = this.route.snapshot.queryParamMap.get('start_date');
    var p_end = this.route.snapshot.queryParamMap.get('end_date');
    if (p_start && !isNaN(Date.parse(p_start))) this.start_dateControl.setValue(new Date(p_start));
    if (p_end && !isNaN(Date.parse(p_end))) this.end_dateControl.setValue(new Date(p_end));

    this.start_dateInput = formatDate(this.start_dateControl.value, 'd MMM y', 'en-US');
    this.end_dateInput = formatDate(this.end_dateControl.value, 'd MMM y', 'en-US');
  }

  loadKategori() {
    this.service.getKategori().subscribe(res => {
      this.kategoriList = res;
      if (!this.selectedKategori && res.length > 0) this.selectedKategori = res[0].code;
    });
  }

  loadWells() {
    if (!this.start_dateControl.value || !this.end_dateControl.value) return;

    this.isLoading = true;
    this.service.getWells(this.start_dateControl.value, this.end_dateControl.value).subscribe(res => {
      this.isLoading = false;
      this.wells = res;
    }, error => {
      this.isLoading = false;
      this.snackbarService.status.next(new SnackbarApi(true, error['message'] || 'Gagal memuat data sumur', 'dismiss'));
    });
  }

  start_dateChange(evt) {
    this.start_dateInput = formatDate(evt.value, 'd MMM y', 'en-US');
    this.resetRows();
    this.loadWells();
  }

  end_dateChange(evt) {
    this.end_dateInput = formatDate(evt.value, 'd MMM y', 'en-US');
    this.resetRows();
    this.loadWells();
  }

  get wellsForm(): FormArray {
    return this.waterfallForm.get('wells') as FormArray;
  }

  private createWellForm(): FormGroup {
    return this.formBuilder.group({
      well: ['', Validators.required],
      delta_prod: [null],
      remarks: ['']
    });
  }

  /** Baris kosong baru, seperti tombol add pada form lain. */
  addWellForm() {
    this.wellsForm.push(this.createWellForm());
  }

  removeWellForm(index: number) {
    if (this.wellsForm.length <= 1) return;
    this.wellsForm.removeAt(index);
  }

  /** Baris yang sumurnya sudah dipilih. */
  get filledRows(): FormGroup[] {
    return this.wellsForm.controls.filter(c => (c as FormGroup).get('well').value) as FormGroup[];
  }

  get selectedCount(): number {
    return this.filledRows.length;
  }

  get deltaTotal(): number {
    return this.filledRows.reduce((sum, row) => sum + this.toNumber(row.get('delta_prod').value), 0);
  }

  /** Pilihan dropdown; sumur yang sudah ada di waterfall dapat disembunyikan. */
  get wellOptions(): PeProdWaterfallWell[] {
    return this.wells.filter(w => !this.hideAdded || !w.added);
  }

  private wellValue(index: number): string {
    return (this.wellsForm.at(index) as FormGroup).get('well').value;
  }

  wellInfo(index: number): PeProdWaterfallWell {
    var well = this.wellValue(index);
    if (!well) return null;
    return this.wells.find(w => w.well === well) || null;
  }

  wellBefore(index: number): number {
    var info = this.wellInfo(index);
    return info ? info.before : null;
  }

  wellAfter(index: number): number {
    var info = this.wellInfo(index);
    return info ? info.after : null;
  }

  showWellError(index: number): boolean {
    var control = (this.wellsForm.at(index) as FormGroup).get('well');
    return control.hasError('required') && (control.touched || control.dirty);
  }

  /** Delta harian sumur terpilih dipakai sebagai nilai awal Delta Prod. */
  wellChange(index: number, evt: any) {
    var info = this.wells.find(w => w.well === evt.value) || null;
    (this.wellsForm.at(index) as FormGroup).get('delta_prod').setValue(info ? info.delta_prod : null);
  }

  private resetRows() {
    this.waterfallForm.setControl('wells', this.formBuilder.array([this.createWellForm()]));
  }

  /** Delta dibulatkan 3 desimal agar nilai tersimpan sama dengan yang tampil. */
  roundDelta(value: number): number {
    return Math.round(this.toNumber(value) * 1000) / 1000;
  }

  toNumber(value: any): number {
    if (value === null || value === undefined || value === "") return 0;
    return Number(value);
  }

  resetDelta() {
    this.filledRows.forEach(row => {
      var info = this.wells.find(w => w.well === row.get('well').value);
      if (info) row.get('delta_prod').setValue(info.delta_prod);
    });
  }

  onSave() {
    if (!this.selectedKategori) {
      this.snackbarService.status.next(new SnackbarApi(true, "Pilih kategori terlebih dahulu.", 'dismiss'));
      return;
    }
    if (this.filledRows.length == 0) {
      this.snackbarService.status.next(new SnackbarApi(true, "Pilih minimal satu sumur.", 'dismiss'));
      return;
    }

    var selected = this.filledRows.map(row => row.get('well').value);
    var duplicate = selected.filter((well, i) => selected.indexOf(well) != i);
    if (duplicate.length > 0) {
      this.snackbarService.status.next(new SnackbarApi(true, "Sumur " + duplicate.join(", ") + " dipilih lebih dari sekali.", 'dismiss'));
      return;
    }

    var payload = this.filledRows.map(row => new PeProdWaterfall(
      null,
      this.start_dateControl.value,
      this.end_dateControl.value,
      this.selectedKategori,
      row.get('well').value,
      this.roundDelta(row.get('delta_prod').value),
      row.get('remarks').value || ""
    ));

    this.isSaving = true;
    this.service.add(payload).subscribe(res => {
      this.isSaving = false;
      var message = res["created_count"] + " sumur berhasil ditambahkan.";
      if (res["skipped"] && res["skipped"].length > 0) {
        message += " Dilewati (sudah ada): " + res["skipped"].join(", ") + ".";
      }
      this.snackbarService.status.next(new SnackbarApi(true, message, 'dismiss'));
      // data sudah tersimpan: kosongkan baris agar tidak ada konfirmasi saat pindah halaman
      this.resetRows();
      this.backToList();
    }, error => {
      this.isSaving = false;
      this.snackbarService.status.next(new SnackbarApi(true, error['message'] || 'Gagal menyimpan data', 'dismiss'));
    });
  }

  backToList() {
    this.router.navigate(['pe', 'waterfall', 'list'], {
      queryParams: {
        start_date: this.start_dateControl.value.toISOString(),
        end_date: this.end_dateControl.value.toISOString()
      }
    });
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (this.filledRows.length == 0) return true;
    return this.dialogService.confirm('Data yang dipilih belum disimpan. Tinggalkan halaman?');
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    return this.filledRows.length == 0;
  }
}
