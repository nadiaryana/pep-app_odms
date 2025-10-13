import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router, RouterStateSnapshot, ActivatedRoute } from '@angular/router';

import { PeProduction } from './pe-production';
import { Daily } from './daily';

@Injectable({
  providedIn: 'root'
})

export class PeProductionService {
  
  constructor(
	private http: HttpClient,
  ) { 
	
  }

    add(_pe_production: PeProduction) {
		return this.http.post<any>('Pe/Production/Add', _pe_production)
		.pipe(map(res => {
			return res;
		}));
    }
	
	deletePeDaily(_pe_production: PeProduction) {
		return this.http.post<any>('Pe/Production/Delete', _pe_production)
		.pipe(map(res => {
			return res;
		}));
	}
	
	// editPeDaily(_pe_daily: PeProduction) {
	// 	return this.http.post<any>('Pe/Production/Edit', _pe_daily)
	// 	.pipe(map(res => {
	// 		return res;
	// 	}));
	// }
	
	getOne(_pe_production: PeProduction) : Observable<PeProduction> {
		return this.http.post<any>('Pe/Production/Get', _pe_production)
		.pipe(map(res => { 
			return new PeProduction(res.PE_TICKET_ID, res.MACHINE_ID, res.PRESENCE_LOCATION_ID, res.DEVICE_ROLE);
		})); 
	}
}
