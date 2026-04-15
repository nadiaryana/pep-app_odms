import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-pe-pumping-unit',
  templateUrl: './pe-pumping-unit.component.html',
  styleUrls: ['./pe-pumping-unit.scss']
})
export class PePumpingUnitComponent { 
  constructor (
	public snackBar: MatSnackBar
  ) {}
}