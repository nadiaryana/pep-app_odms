import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-ssc-sla',
  templateUrl: './ssc-sla.component.html',
  styleUrls: ['./ssc-sla.scss']
})
export class SscSlaComponent { 
  constructor (
	public snackBar: MatSnackBar
  ) {}
}