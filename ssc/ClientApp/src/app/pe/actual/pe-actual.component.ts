import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-pe-actual',
  templateUrl: './pe-actual.component.html',
  styleUrls: ['./pe-actual.scss']
})
export class PeActualComponent{ 
  constructor (
	public snackBar: MatSnackBar
  ) {}
}