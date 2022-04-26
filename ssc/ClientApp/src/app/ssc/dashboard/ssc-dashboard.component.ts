import { Component, ViewChild, ElementRef } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from "@angular/router";

import { CommonService } from '../../common.service';
import { TitleService } from '../../navigation/title/title.service';

@Component({
  selector: 'app-ssc-dashboard',
  templateUrl: './ssc-dashboard.component.html',
  styleUrls: ['./ssc-dashboard.scss']
})
export class SscDashboardComponent { 

  @ViewChild('pandora', { static: true }) pandora: ElementRef;
  @ViewChild('nms1', { static: true }) nms1: ElementRef;
  @ViewChild('nms2', { static: true }) nms2: ElementRef;
  @ViewChild('nms_util1', { static: true }) nms_util1: ElementRef;
  @ViewChild('nms_util2', { static: true }) nms_util2: ElementRef;
  @ViewChild('nms_util3', { static: true }) nms_util3: ElementRef;
  @ViewChild('nms_util4', { static: true }) nms_util4: ElementRef;
  @ViewChild('nms_util5', { static: true }) nms_util5: ElementRef;
  @ViewChild('nms_util6', { static: true }) nms_util6: ElementRef;
  @ViewChild('ipthermo', { static: true }) ipthermo: ElementRef;

  fullWindow: boolean;

  constructor (
	  public snackBar: MatSnackBar,
    private route: ActivatedRoute,
    public commonService: CommonService,
    private titleService: TitleService,
  ) {

  }

  ngOnInit() {

    this.titleService.titleSource.next({
      title: "Dashboard", 
      breadcrumbs: [
        {label: 'ICT', routerLink: ''}, 
        {label: 'Dashboard', routerLink: ''}
      ]}
    );
  }

  onLoad(elm) {
  	//var frame:HTMLIFrameElement = document.getElementsByClassName('nms')[0];
    this.pandora.nativeElement.contentWindow.scrollTo(60,310);

    this.nms1.nativeElement.contentWindow.scrollTo(20,100);
    this.nms2.nativeElement.contentWindow.scrollTo(20,100);

    this.nms_util1.nativeElement.contentWindow.scrollTo(11,84);
    this.nms_util2.nativeElement.contentWindow.scrollTo(11,84);
    this.nms_util3.nativeElement.contentWindow.scrollTo(11,84);
    this.nms_util4.nativeElement.contentWindow.scrollTo(11,84);
    this.nms_util5.nativeElement.contentWindow.scrollTo(11,84);
    this.nms_util6.nativeElement.contentWindow.scrollTo(11,84);

    this.ipthermo.nativeElement.contentWindow.scrollTo(0,160);
  	/*console.log(elm["className"]);
  	if(elm["className"] == "nms") {
  		elm["contentWindow"].scrollTo(20,100);
  	} else if (elm["className"] == "pandora") {
  		elm["contentWindow"].scrollTo(60,310);
  	} else if (elm["className"] == "ipthermo") {
  		elm["contentWindow"].scrollTo(0,160);
  	} else if (elm["className"] == "nms_util") {
      elm["contentWindow"].scrollTo(11,84);
    }*/
  }
}