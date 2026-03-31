import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-pe-map',
  templateUrl: './pe-map.component.html',
  styleUrls: ['./pe-map.scss']
})
export class PeMapComponent { 
  constructor (
	public snackBar: MatSnackBar
  ) {}
}