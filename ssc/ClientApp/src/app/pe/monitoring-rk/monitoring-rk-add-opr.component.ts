import { Component, HostListener, Inject, LOCALE_ID } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Router } from "@angular/router";
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { SnackbarService, SnackbarApi } from '../../snackbar.service';
import { DialogService } from '../../dialog.service';
import { TitleService } from '../../navigation/title/title.service';

/**
 * Halaman tambah data Monitoring RK Rigless.
 * Model/layout-nya meniru halaman "Add Actual Operation" (pe-actual-add-opr):
 * baris input yang bisa ditambah/hapus + tombol save, lalu POST array ke backend.
 * Data rigless disimpan terpisah (rig = "Rigless"), tidak berhubungan dengan tabel Rig/barchart.
 */
@Component({
  selector: 'app-monitoring-rk-add-opr',
  templateUrl: './monitoring-rk-add-opr.component.html',
  styleUrls: ['./monitoring-rk.scss']
})
export class MonitoringRKAddOprComponent {

  isLoading = false;
  rkForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private snackbarService: SnackbarService,
    private dialogService: DialogService,
    private titleService: TitleService,
    private http: HttpClient,
    @Inject(LOCALE_ID) public locale: string
  ) { }

  /** Getter untuk FormArray items */
  get items(): FormArray {
    return this.rkForm.get('items') as FormArray;
  }

  ngOnInit() {
    // Set judul & breadcrumbs
    this.titleService.titleSource.next({
      title: "Add Monitoring RK Rigless",
      icon: "add",
      breadcrumbs: [
        { label: 'Petroleum Engineering', routerLink: '' },
        { label: 'Monitoring RK', routerLink: 'pe/monitoring-rk/list' },
        { label: 'Add Rigless', routerLink: '' },
      ]
    });

    // Inisialisasi form dengan satu baris kosong
    this.rkForm = this.formBuilder.group({
      items: this.formBuilder.array([this.createItemForm()])
    });
  }

  /** Buat satu FormGroup untuk satu item rigless (well, pop, before, after, remarks) */
  createItemForm(): FormGroup {
    return this.formBuilder.group({
      well: ['', Validators.required],
      pop: [''],
      before: [''],
      after: [''],
      remarks: ['']
    });
  }

  /** Tambah baris input baru */
  addRow() {
    this.items.push(this.createItemForm());
  }

  /** Hapus baris input (minimal 1 baris) */
  removeRow(index: number) {
    if (this.items.length > 1) {
      this.items.removeAt(index);
    }
  }

  /** Kembali ke halaman list (buka tab rigless) */
  backToList() {
    this.router.navigate(['pe', 'monitoring-rk', 'list'], { state: { tab: 'rigless' } });
  }

  /** Cek apakah form boleh ditinggalkan (pristine = aman) */
  canDeactivate(): Observable<boolean> | boolean {
    if (this.rkForm.pristine) {
      return true;
    }
    return this.dialogService.confirm('Discard changes?');
  }

  /** Simpan semua item ke koleksi monitoring_rk_rigless via POST /api/pe/MonitoringRK/rigless */
  onSave() {
    this.isLoading = true;

    // Tetap memakai model MonitoringRK (rig = "Rigless"), tapi disimpan ke koleksi khusus monitoring_rk_rigless
    var payload = this.rkForm.value.items.map((item: any) => ({
      rig: 'Rigless',
      well: item.well,
      pop: (item.pop && item.pop !== '') ? item.pop : null,
      before: (item.before === '' || item.before == null) ? null : Number(item.before),
      after: (item.after === '' || item.after == null) ? null : Number(item.after),
      remarks: item.remarks || null
    }));

    this.http.post('/api/pe/MonitoringRK/rigless', payload).subscribe(
      res => {
        this.isLoading = false;
        this.snackbarService.status.next(new SnackbarApi(true, "Data rigless berhasil disimpan!", 'dismiss'));
        this.router.navigate(['pe', 'monitoring-rk', 'list'], { state: { tab: 'rigless' } });
      },
      error => {
        this.isLoading = false;
        this.snackbarService.status.next(new SnackbarApi(true, error['message'] || 'Gagal menyimpan data', 'dismiss'));
      }
    );
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    return this.rkForm.pristine;
  }

}
