import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-pe-sonolog',
  templateUrl: './pe-sonolog.component.html',
  styleUrls: ['./pe-sonolog.scss']
})
export class PeSonologComponent { 
  constructor (
	public snackBar: MatSnackBar
  ) {}
}