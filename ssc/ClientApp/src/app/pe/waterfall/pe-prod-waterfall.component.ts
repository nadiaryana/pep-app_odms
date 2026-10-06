import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-pe-prod-waterfall',
  templateUrl: './pe-prod-waterfall.component.html',
  styleUrls: ['./pe-prod-waterfall.scss']
})
export class PeProdWaterfallComponent { 
  constructor (
	public snackBar: MatSnackBar
  ) {}
}