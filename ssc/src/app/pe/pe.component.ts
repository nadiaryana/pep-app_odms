import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { TitleService } from '../navigation/title/title.service';


@Component({
  selector: 'app-pe',
  templateUrl: './pe.component.html',
  styleUrls: ['./pe.component.scss']
})
export class PeComponent {



  constructor (
	public snackBar: MatSnackBar,
    private titleService: TitleService,
    
  ) {
    
  	this.titleService.titleSource.next({
          title: "PE",
          icon : "",
  		breadcrumbs: []
  	});
  }
}
