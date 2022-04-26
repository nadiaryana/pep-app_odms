import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-ssc-ticket',
  templateUrl: './ssc-ticket.component.html',
  styleUrls: ['./ssc-ticket.scss']
})
export class SscTicketComponent { 
  constructor (
	public snackBar: MatSnackBar
  ) {}
}