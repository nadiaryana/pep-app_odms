import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.scss']
})
export class LocationComponent { 
  constructor (
	public snackBar: MatSnackBar
  ) {}
}