import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { TitleService } from '../navigation/title/title.service';

@Component({
  selector: 'app-ssc',
  templateUrl: './ssc.component.html',
  styleUrls: ['./ssc.component.scss']
})
export class SscComponent { 
  constructor (
	public snackBar: MatSnackBar,
	private titleService: TitleService,
  ) {
  	this.titleService.titleSource.next({
  		title: "ICT",
  		breadcrumbs: []
  	});
  }
}