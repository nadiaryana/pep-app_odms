import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-pe-daily',
  templateUrl: './pe-daily.component.html',
  styleUrls: ['./pe-daily.scss']
})
export class PeDailyComponent { 
  constructor (
	public snackBar: MatSnackBar
  ) {}
}