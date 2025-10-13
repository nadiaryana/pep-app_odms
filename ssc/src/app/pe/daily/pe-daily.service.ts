import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router, RouterStateSnapshot, ActivatedRoute } from '@angular/router';

import { PeDaily } from './pe-daily';
import { Daily } from './daily';

@Injectable({
  providedIn: 'root'
})

export class PeDailyService {
  
  constructor(
	private http: HttpClient,
  ) { 
	
  }

    add(_pe_daily: PeDaily) {
		return this.http.post<any>('Pe/Daily/Add', _pe_daily)
		.pipe(map(res => {
			return res;
		}));
    }
	
	deletePeDaily(_pe_daily: PeDaily) {
		return this.http.post<any>('Pe/Daily/Delete', _pe_daily)
		.pipe(map(res => {
			return res;
		}));
	}
	
	editPeDaily(_pe_daily: PeDaily) {
		return this.http.post<any>('Pe/Daily/Edit', _pe_daily)
		.pipe(map(res => {
			return res;
		}));
	}
	
	getOne(_pe_daily: PeDaily) : Observable<PeDaily> {
		return this.http.post<any>('Pe/Daily/Get', _pe_daily)
		.pipe(map(res => { 
			return new PeDaily(res.PE_TICKET_ID, res.MACHINE_ID, res.PRESENCE_LOCATION_ID, res.DEVICE_ROLE);
		})); 
	}
}


