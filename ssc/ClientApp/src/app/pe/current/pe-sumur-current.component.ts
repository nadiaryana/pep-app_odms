import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-pe-sumur-current',
  templateUrl: './pe-sumur-current.component.html',
  styleUrls: ['./pe-current.scss']
})
export class PeSumurCurrentComponent { 
  constructor (
	public snackBar: MatSnackBar
  ) {}
}