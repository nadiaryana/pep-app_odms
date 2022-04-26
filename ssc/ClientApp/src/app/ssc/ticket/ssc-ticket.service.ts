import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router, RouterStateSnapshot, ActivatedRoute } from '@angular/router';

import { SscTicket } from './ssc-ticket';
import { Ticket } from './ticket';

@Injectable({
  providedIn: 'root'
})

export class SscTicketService {
  
  constructor(
	private http: HttpClient,
  ) { 
	
  }

    add(_ssc_ticket: SscTicket) {
		return this.http.post<any>('Ssc/Ticket/Add', _ssc_ticket)
		.pipe(map(res => {
			return res;
		}));
    }
	
	deleteSscTicket(_ssc_ticket: SscTicket) {
		return this.http.post<any>('Ssc/Ticket/Delete', _ssc_ticket)
		.pipe(map(res => {
			return res;
		}));
	}
	
	editSscTicket(_ssc_ticket: SscTicket) {
		return this.http.post<any>('Ssc/Ticket/Edit', _ssc_ticket)
		.pipe(map(res => {
			return res;
		}));
	}
	
	getOne(_ssc_ticket: SscTicket) : Observable<SscTicket> {
		return this.http.post<any>('Ssc/Ticket/Get', _ssc_ticket)
		.pipe(map(res => { 
			return new SscTicket(res.SSC_TICKET_ID, res.MACHINE_ID, res.PRESENCE_LOCATION_ID, res.DEVICE_ROLE);
		})); 
	}
}
