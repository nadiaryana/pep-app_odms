import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class TitleService {

	public titleSource = new BehaviorSubject<titleSet>({
      title: "",
      icon : "",
		breadcrumbs: []
	});
	currentTitle = this.titleSource.asObservable();

	constructor() { }

}

export class titleSet {
  title: string;
  icon: string;
	breadcrumbs: bcItem[] = [];
}

export class bcItem {
    label: string;
    routerLink: string = '';
}
