import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-pe-lab',
  templateUrl: './pe-lab.component.html',
  styleUrls: ['./pe-lab.scss']
})
export class PeLabComponent { 
  constructor (
	public snackBar: MatSnackBar
  ) {}
}