import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { Observable } from 'rxjs';

import { PeProdWaterfall, PeProdWaterfallKategori, PeProdWaterfallWell } from './pe-prod-waterfall';
import { PeProdWaterfallService } from './pe-prod-waterfall.service';
import { SnackbarService, SnackbarApi } from '../../snackbar.service';
import { DialogService } from '../../dialog.service';
import { TitleService } from '../../navigation/title/title.service';

/** Baris sumur pada halaman add; delta & remarks masih dapat diubah sebelum disimpan. */
type WaterfallWellRow = PeProdWaterfallWell & {
  selected: boolean;
  delta_input: number;
  remarks: string;
};

@Component({
  selector: 'app-pe-prod-waterfall-add',
  templateUrl: './pe-prod-waterfall-add.component.html',
  styleUrls: ['./pe-prod-waterfall.scss']
})
export class PeProdWaterfallAddComponent implements OnInit {

  isLoading = false;
  isSaving = false;

  displayedColumns: string[] = ["select", "well", "before", "after", "delta_prod", "remarks"];

  kategoriList: PeProdWaterfallKategori[] = [];
  selectedKategori = "";

  start_dateControl = new FormControl(new Date());
  start_dateInput = "";

  end_dateControl = new FormControl(new Date());
  end_dateInput = "";

  wells: WaterfallWellRow[] = [];
  wellFilter = new FormControl('');
  hideAdded = false;

  constructor(
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
      this.wells = res.map(w => ({
        ...w,
        selected: false,
        delta_input: w.delta_prod,
        remarks: ""
      }));
    }, error => {
      this.isLoading = false;
      this.snackbarService.status.next(new SnackbarApi(true, error['message'] || 'Gagal memuat data sumur', 'dismiss'));
    });
  }

  start_dateChange(evt) {
    this.start_dateInput = formatDate(evt.value, 'd MMM y', 'en-US');
    this.loadWells();
  }

  end_dateChange(evt) {
    this.end_dateInput = formatDate(evt.value, 'd MMM y', 'en-US');
    this.loadWells();
  }

  get filteredWells(): WaterfallWellRow[] {
    var filter = (this.wellFilter.value || "").toLowerCase();
    return this.wells.filter(w =>
      (!this.hideAdded || !w.added) &&
      (!filter || w.well.toLowerCase().indexOf(filter) != -1)
    );
  }

  get selectedWells(): WaterfallWellRow[] {
    return this.wells.filter(w => w.selected);
  }

  get selectedDelta(): number {
    return this.selectedWells.reduce((sum, w) => sum + this.toNumber(w.delta_input), 0);
  }

  /** Delta dibulatkan 3 desimal agar nilai tersimpan sama dengan yang tampil. */
  roundDelta(value: number): number {
    return Math.round(this.toNumber(value) * 1000) / 1000;
  }

  toNumber(value: any): number {
    if (value === null || value === undefined || value === "") return 0;
    return Number(value);
  }

  toggle(row: WaterfallWellRow) {
    if (row.added) return;
    row.selected = !row.selected;
  }

  selectAllVisible(selected: boolean) {
    this.filteredWells.forEach(w => {
      if (!w.added) w.selected = selected;
    });
  }

  get allVisibleSelected(): boolean {
    var selectable = this.filteredWells.filter(w => !w.added);
    return selectable.length > 0 && selectable.every(w => w.selected);
  }

  resetDelta() {
    this.selectedWells.forEach(w => w.delta_input = w.delta_prod);
  }

  onSave() {
    if (!this.selectedKategori) {
      this.snackbarService.status.next(new SnackbarApi(true, "Pilih kategori terlebih dahulu.", 'dismiss'));
      return;
    }
    if (this.selectedWells.length == 0) {
      this.snackbarService.status.next(new SnackbarApi(true, "Pilih minimal satu sumur.", 'dismiss'));
      return;
    }

    var payload = this.selectedWells.map(w => new PeProdWaterfall(
      null,
      this.start_dateControl.value,
      this.end_dateControl.value,
      this.selectedKategori,
      w.well,
      this.roundDelta(w.delta_input),
      w.remarks
    ));

    this.isSaving = true;
    this.service.add(payload).subscribe(res => {
      this.isSaving = false;
      var message = res["created_count"] + " sumur berhasil ditambahkan.";
      if (res["skipped"] && res["skipped"].length > 0) {
        message += " Dilewati (sudah ada): " + res["skipped"].join(", ") + ".";
      }
      this.snackbarService.status.next(new SnackbarApi(true, message, 'dismiss'));
      // data sudah tersimpan: bersihkan pilihan agar tidak ada konfirmasi saat pindah halaman
      this.wells.forEach(w => w.selected = false);
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
    if (this.selectedWells.length == 0) return true;
    return this.dialogService.confirm('Data yang dipilih belum disimpan. Tinggalkan halaman?');
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    return this.selectedWells.length == 0;
  }
}
