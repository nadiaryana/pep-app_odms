import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { merge, of as observableOf, Subscription } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

import { RodPumpData, RodPumpDataApi } from './rod-pump-data';
import { RodPumpDataService } from './rod-pump-data.service';
import { PePermissionService } from '../pe-permission.service';

@Component({
  selector: 'pe-rod-pump-data-list',
  templateUrl: './pe-rod-pump-data-list.component.html',
  styleUrls: ['./pe-pumping-unit.scss']
})
export class PeRodPumpDataListComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ["select",
    "rod_nomor",
    "plunger_diameter",
    "rod_weight",
    "elastic_constat",
    "freq_factor",
    "rod_string1",
    "rod_string2",
    "rod_string3",
    "rod_string4",
    "rod_string5",
    "rod_string6",
    "rod_string7"
  ];
  headerColumns1: string[] = ["select","rod_nomor","plunger_diameter","rod_weight","elastic_constat","freq_factor","rod_string"];
  headerColumns2: string[] = ["rod_string1","rod_string2","rod_string3","rod_string4","rod_string5","rod_string6","rod_string7"];

  dataSource = new MatTableDataSource<RodPumpData>([]);
  selection = new SelectionModel<RodPumpData>(true, []);
  resultsLength = 0;
  isLoadingResults = true;
  isEditing: boolean = false;

  listSubscription: Subscription;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private service: RodPumpDataService,
    public pePermissionService: PePermissionService,
  ) { }

  ngOnInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    this.listSubscription = merge(
      this.sort.sortChange,
      this.paginator.page,
    ).pipe(
      startWith({}),
      switchMap(() => {
        this.isLoadingResults = true;
        return this.service.getRodPumpData(
          this.sort.active,
          this.sort.direction,
          this.paginator.pageIndex,
          this.paginator.pageSize,
        );
      }),
      map((data: RodPumpDataApi) => {
        this.isLoadingResults = false;
        this.resultsLength = data.total_count;
        return data.items;
      }),
      catchError(() => {
        this.isLoadingResults = false;
        return observableOf([]);
      })
    ).subscribe((data: RodPumpData[]) => {
      this.dataSource.data = data;
      this.selection.clear();
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: RodPumpData): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row._id}`;
  }

  ngOnDestroy() {
    if (this.listSubscription) this.listSubscription.unsubscribe();
  }
}
