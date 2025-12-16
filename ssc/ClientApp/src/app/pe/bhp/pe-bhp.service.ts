import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router, RouterStateSnapshot, ActivatedRoute } from '@angular/router';

import { PeBhp } from './pe-bhp';
//import { Sensor } from './sensor';

@Injectable({
  providedIn: 'root'
})

export class PeBhpService {
  
  constructor(
	private http: HttpClient,
  ) { 
	
  }

    add(_pe_bhp: PeBhp) {
		return this.http.post<any>('Pe/Bhp/Add', _pe_bhp)
		.pipe(map(res => {
			return res;
		}));
    }
	
	deletePeBhp(_pe_bhp: PeBhp) {
		return this.http.post<any>('Pe/Bhp/Delete', _pe_bhp)
		.pipe(map(res => {
			return res;
		}));
	}
	
	editPeBhp(_pe_bhp: PeBhp) {
		return this.http.post<any>('Pe/Bhp/Edit', _pe_bhp)
		.pipe(map(res => {
			return res;
		}));
	}
	
	getOne(_pe_bhp: PeBhp) : Observable<PeBhp> {
		return this.http.post<any>('Pe/Bhp/Get', _pe_bhp)
		.pipe(map(res => { 
			return new PeBhp(res.PE_TICKET_ID, res.MACHINE_ID, res.PRESENCE_LOCATION_ID, res.DEVICE_ROLE);
		})); 
	}
}
