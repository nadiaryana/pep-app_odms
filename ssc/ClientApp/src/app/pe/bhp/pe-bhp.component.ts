import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-pe-bhp',
  templateUrl: './pe-bhp.component.html',
  styleUrls: ['./pe-bhp.scss']
})
export class PeBhpComponent { 
  constructor (
	public snackBar: MatSnackBar
  ) {}
}