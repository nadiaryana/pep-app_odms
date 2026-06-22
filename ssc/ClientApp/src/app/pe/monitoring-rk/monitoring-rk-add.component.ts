import { Component, HostListener, Inject, LOCALE_ID } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Router } from "@angular/router";
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { MonitoringRK } from './monitoring-rk';
import { SnackbarService, SnackbarApi } from '../../snackbar.service';
import { DialogService } from '../../dialog.service';
import { TitleService } from '../../navigation/title/title.service';

@Component({
  selector: 'app-monitoring-rk-add',
  templateUrl: './monitoring-rk-add.component.html',
  styleUrls: ['./monitoring-rk.scss']
})
export class MonitoringRKAddComponent {

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
      title: "Add Monitoring RK",
      icon: "add",
      breadcrumbs: [
        { label: 'Petroleum Engineering', routerLink: '' },
        { label: 'Monitoring RK', routerLink: 'pe/monitoring-rk' },
        { label: 'Add', routerLink: '' },
      ]
    });

    // Inisialisasi form dengan satu baris kosong
    this.rkForm = this.formBuilder.group({
      items: this.formBuilder.array([this.createItemForm()])
    });
  }

  /** Buat satu FormGroup untuk satu item Monitoring RK */
  createItemForm(): FormGroup {
    return this.formBuilder.group({
      well: ['', Validators.required],
      job: ['', Validators.required],
      rig: ['', Validators.required],
      plan_start: [''],
      plan_end: [''],
      pop: [''],
      target_oil: [''],
      target_gas: [''],
      realisasi_oil: [''],
      realisasi_gas: [''],
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

  /** Kembali ke halaman list */
  backToList() {
    this.router.navigate(['pe', 'monitoring-rk', 'list']);
  }

  /** Cek apakah form boleh ditinggalkan (pristine = aman) */
  canDeactivate(): Observable<boolean> | boolean {
    if (this.rkForm.pristine) {
      return true;
    }
    return this.dialogService.confirm('Discard changes?');
  }

  /** Simpan semua item ke database via POST /api/pe/monitoring-rk */
  onSave() {
    this.isLoading = true;
    var payload = this.rkForm.value.items;

    this.http.post('/api/pe/MonitoringRK', payload).subscribe(
      res => {
        this.isLoading = false;
        this.snackbarService.status.next(new SnackbarApi(true, "Data berhasil disimpan!", 'dismiss'));
        this.router.navigateByUrl('/pe/monitoring-rk/list');
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
