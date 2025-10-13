import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-pe-sensor',
  templateUrl: './pe-sensor.component.html',
  styleUrls: ['./pe-sensor.scss']
})
export class PeSensorComponent { 
  constructor (
	public snackBar: MatSnackBar
  ) {}
}