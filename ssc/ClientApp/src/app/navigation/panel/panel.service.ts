import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Panel } from './panel';

@Injectable({
  providedIn: 'root'
})

export class PanelService {

	public messageSource = new BehaviorSubject<Panel>(new Panel("", 0, []));
	currentMessage = this.messageSource.asObservable();

	constructor() { }

}
