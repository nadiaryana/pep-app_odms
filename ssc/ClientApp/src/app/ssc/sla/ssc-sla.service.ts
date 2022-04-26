import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router, RouterStateSnapshot, ActivatedRoute } from '@angular/router';

import { SscSla } from './ssc-sla';
import { Sla } from './sla';

@Injectable({
  providedIn: 'root'
})

export class SscSlaService {
  
  constructor(
	private http: HttpClient,
  ) { 
	
  }

    add(_ssc_sla: SscSla) {
		return this.http.post<any>('Ssc/Sla/Add', _ssc_sla)
		.pipe(map(res => {
			return res;
		}));
    }
	
	deleteSscSla(_ssc_sla: SscSla) {
		return this.http.post<any>('Ssc/Sla/Delete', _ssc_sla)
		.pipe(map(res => {
			return res;
		}));
	}
	
	editSscSla(_ssc_sla: SscSla) {
		return this.http.post<any>('Ssc/Sla/Edit', _ssc_sla)
		.pipe(map(res => {
			return res;
		}));
	}
	
	getOne(_ssc_sla: SscSla) : Observable<SscSla> {
		return this.http.post<any>('Ssc/Sla/Get', _ssc_sla)
		.pipe(map(res => { 
			return new SscSla(res.SSC_SLA_ID, res.MACHINE_ID, res.PRESENCE_LOCATION_ID, res.DEVICE_ROLE);
		})); 
	}
}
