import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-pe-pumping-unit',
  templateUrl: './pe-suspended-well.component.html',
  styleUrls: ['./pe-suspended-well.scss']
})
export class PeSuspendedWellComponent { 
  constructor (
  public snackBar: MatSnackBar
  ) {}
}