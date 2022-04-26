import { Component } from '@angular/core';

import { TitleService, titleSet, bcItem } from './title.service';
import { CommonService } from '../../common.service';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.scss'],
})

export class TitleComponent {

	title: string;
	breadcrumbs: bcItem[];
	fullWindow:boolean;

	constructor(
		private titleService: TitleService,
		private commonService: CommonService,
	) {
		this.titleService.currentTitle.subscribe(res => {
			if(res != null) {
				this.title = res.title;
	    		this.breadcrumbs = res.breadcrumbs;
			} else {
				this.title = null;
				this.breadcrumbs = [];
			}
	    });

	    this.commonService.fsMessage.subscribe(res => {
	    	this.fullWindow = res;
	    })
	}

	ngOnInit() {

  	}
}