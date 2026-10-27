import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
  isAddingKategori = false;
  showAddKategori = false;

  kategoriList: PeProdWaterfallKategori[] = [];
  selectedKategori = "";
  kategoriForm: FormGroup;

  start_dateControl = new FormControl(null);
  start_dateInput = "";
  end_dateControl = new FormControl(null);
  end_dateInput = "";
  period2_start_dateControl = new FormControl(null);
  period2_start_dateInput = "";
  period2_end_dateControl = new FormControl(null);
  period2_end_dateInput = "";


  wells: PeProdWaterfallWell[] = [];
  hideAdded = false;

  /** Form add: satu baris per sumur yang akan disimpan. */
  waterfallForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
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
    this.kategoriForm = this.formBuilder.group({
      code: ['', [Validators.required, Validators.maxLength(10)]],
      name: ['', [Validators.required, Validators.maxLength(100)]]
    });

    this.loadKategori();
    this.loadWells();
  }

  loadKategori() {
    this.service.getKategori().subscribe(res => {
      this.kategoriList = res;
      if (!this.selectedKategori && res.length > 0) this.selectedKategori = res[0].code;
    });
  }

  addKategori() {
    if (this.kategoriForm.invalid || this.isAddingKategori) {
      this.kategoriForm.markAsTouched();
      return;
    }

    var code = this.kategoriForm.get('code').value.trim().toUpperCase();
    var name = this.kategoriForm.get('name').value.trim();
    if (!code || !name) {
      this.snackbarService.status.next(new SnackbarApi(true, "Kode dan nama kategori wajib diisi.", 'dismiss'));
      return;
    }
    if (this.kategoriList.some(k => k.code.toLowerCase() === code.toLowerCase())) {
      this.snackbarService.status.next(new SnackbarApi(true, "Kode kategori sudah digunakan.", 'dismiss'));
      return;
    }

    this.isAddingKategori = true;
    this.service.addKategori(code, name).subscribe(kategori => {
      this.isAddingKategori = false;
      this.kategoriList = this.kategoriList.concat([kategori]).sort((a, b) => a.order - b.order);
      this.selectedKategori = kategori.code;
      this.kategoriForm.reset();
      this.showAddKategori = false;
      this.snackbarService.status.next(new SnackbarApi(true, "Kategori berhasil ditambahkan.", 'dismiss'));
    }, error => {
      this.isAddingKategori = false;
      var message = error.error && error.error.message || error.message || 'Gagal menambahkan kategori';
      this.snackbarService.status.next(new SnackbarApi(true, message, 'dismiss'));
    });
  }

  cancelAddKategori() {
    this.showAddKategori = false;
    this.kategoriForm.reset();
  }

  loadWells() {
    this.wells = [];

    this.isLoading = true;
    this.service.getWells(
      this.start_dateControl.value,
      this.end_dateControl.value,
      this.period2_start_dateControl.value,
      this.period2_end_dateControl.value
    ).subscribe(res => {
      this.isLoading = false;
      this.wells = res;
    }, error => {
      this.isLoading = false;
      this.snackbarService.status.next(new SnackbarApi(true, error['message'] || 'Gagal memuat data sumur', 'dismiss'));
    });
  }

  private dateRangesValid(): boolean {
    var start1 = this.start_dateControl.value;
    var end1 = this.end_dateControl.value;
    var start2 = this.period2_start_dateControl.value;
    var end2 = this.period2_end_dateControl.value;
    return !!start1 && !!end1 && !!start2 && !!end2 &&
      start1.getTime() <= end1.getTime() &&
      start2.getTime() <= end2.getTime();
  }

  start_dateChange(evt) {
    this.start_dateInput = evt.value ? formatDate(evt.value, 'd MMM y', 'en-US') : "";
    this.resetRows();
    this.loadWells();
  }

  end_dateChange(evt) {
    this.end_dateInput = evt.value ? formatDate(evt.value, 'd MMM y', 'en-US') : "";
    this.resetRows();
    this.loadWells();
  }

  period2_start_dateChange(evt) {
    this.period2_start_dateInput = evt.value ? formatDate(evt.value, 'd MMM y', 'en-US') : "";
    this.resetRows();
    this.loadWells();
  }

  period2_end_dateChange(evt) {
    this.period2_end_dateInput = evt.value ? formatDate(evt.value, 'd MMM y', 'en-US') : "";
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
    this.wellSearch.splice(index, 1);
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


  /** Kata kunci pencarian pada dropdown Select Well, satu per baris. */
  wellSearch: string[] = [];

  get wellOptions(): PeProdWaterfallWell[] {
    return this.wells.filter(w => !this.hideAdded || !w.added);
  }

  /** Pilihan dropdown baris ke-index, disaring oleh kata kunci pencarian baris itu. */
  wellOptionsFor(index: number): PeProdWaterfallWell[] {
    var keyword = (this.wellSearch[index] || "").trim().toLowerCase();
    if (!keyword) return this.wellOptions;
    return this.wellOptions.filter(w => w.well.toLowerCase().indexOf(keyword) >= 0);
  }

  onWellSearch(index: number, keyword: string) {
    this.wellSearch[index] = keyword;
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
    return info ? info.average_net_period1 : null;
  }

  wellAfter(index: number): number {
    var info = this.wellInfo(index);
    return info ? info.average_net_period2 : null;
  }

  showWellError(index: number): boolean {
    var control = (this.wellsForm.at(index) as FormGroup).get('well');
    return control.hasError('required') && (control.touched || control.dirty);
  }

  /** Selisih rata-rata net kedua periode dipakai sebagai nilai awal Delta Prod. */
  wellChange(index: number, evt: any) {
    // pencarian dikosongkan agar daftar penuh tampil lagi saat dropdown dibuka ulang
    this.wellSearch[index] = "";
    var info = this.wells.find(w => w.well === evt.value) || null;
    (this.wellsForm.at(index) as FormGroup).get('delta_prod').setValue(info ? info.delta_prod : null);
  }

  private resetRows() {
    this.waterfallForm.setControl('wells', this.formBuilder.array([this.createWellForm()]));
    this.wellSearch = [];
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
    if (!this.dateRangesValid()) {
      this.snackbarService.status.next(new SnackbarApi(true, "Tanggal awal harus sebelum atau sama dengan tanggal akhir pada setiap periode.", 'dismiss'));
      return;
    }
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
      row.get('remarks').value || "",
      this.period2_start_dateControl.value,
      this.period2_end_dateControl.value
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
        start_date: this.start_dateControl.value ? this.start_dateControl.value.toISOString() : null,
        end_date: this.end_dateControl.value ? this.end_dateControl.value.toISOString() : null,
        period2_start_date: this.period2_start_dateControl.value ? this.period2_start_dateControl.value.toISOString() : null,
        period2_end_date: this.period2_end_dateControl.value ? this.period2_end_dateControl.value.toISOString() : null
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
