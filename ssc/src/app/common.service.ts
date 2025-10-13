import { Injectable, HostListener } from '@angular/core';
import { HttpClient, HttpEventType, HttpParams, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { PanelService } from './navigation/panel/panel.service';

@Injectable({
  providedIn: 'root'
})

export class CommonService {

	fullWindow:boolean;

	public messageFs = new BehaviorSubject<boolean>(false);
	fsMessage = this.messageFs.asObservable();

	screenWidth: number;
	screenHeight: number;
	public messageSw = new BehaviorSubject<number>(window.innerWidth);
	public messageSh = new BehaviorSubject<number>(window.innerHeight);
	swMessage = this.messageSw.asObservable();
	shMessage = this.messageSh.asObservable();

	@HostListener('window:resize', ['$event'])
	onResize(event) {
		this.messageSw.next(event.target.innerWidth);
      this.messageSh.next(event.target.innerHeight);
	}

	constructor(
		private http: HttpClient,
		private panelService: PanelService,
	) { 

		this.fsMessage.subscribe(res => {
          this.fullWindow = res;
	    });

		window.addEventListener('resize', (event) => {
			this.messageSw.next(window.innerWidth);
          this.messageSh.next(window.innerHeight);
          console.log(window.innerWidth)
          console.log(window.innerHeight)
	    });
	    
	    this.swMessage.subscribe(width => {
          this.screenWidth = width;
          console.log(width)
	    });
	    this.shMessage.subscribe(height => {
          this.screenHeight = height;
          console.log(height)
	    });
	}

	convertUTCtoLocal (date) {
		var newDate = new Date(date.getTime() - date.getTimezoneOffset()*60*1000);
		return newDate;
	}

	toggleFullwindow() {
		this.messageFs.next(!this.fullWindow);
	}

	isFullWindow():boolean {
		return this.fullWindow;
	}

	getGridData(url: string, sort: string, order: string, page: number, pagesize: number = 50, filter: string, columnfilter: object, mode: string = "", httpOption: object = {}): Observable<any> {
		var params = {};
		if(sort!=null) params["sort"] = sort;
		if(order!=null) params["order"] = order;
		if(page!=null) params["page"] = page.toString();
		if(pagesize!=null) params["pagesize"] = pagesize.toString();
		if(filter!=null) params["filter"] = filter;
		if(Object.keys(columnfilter).length > 0) params["columnfilter"] = JSON.stringify(columnfilter);
		if(mode != null) params["mode"] = mode;
		httpOption["params"] = params;
		return this.http.get<any>(url, httpOption);
	}

	get Math() {
  		return Math;
	}
}
