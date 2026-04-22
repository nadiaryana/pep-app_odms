import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-pe-suspended-well',
  templateUrl: './pe-suspended-well.component.html',
  styleUrls: ['./pe-suspended-well.scss']
})
export class PeWellDatabaseComponent { 
  constructor (
  public snackBar: MatSnackBar
  ) {}
}