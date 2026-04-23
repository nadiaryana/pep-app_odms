import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-pe-well-database',
  templateUrl: './pe-well-database.component.html',
  styleUrls: ['./pe-well-database.scss']
})
export class PeWellDatabaseComponent { 
  constructor (
  public snackBar: MatSnackBar
  ) {}
}