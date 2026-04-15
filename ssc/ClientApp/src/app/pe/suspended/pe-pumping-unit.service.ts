import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router, RouterStateSnapshot, ActivatedRoute } from '@angular/router';

import { PePumpingUnit } from './pe-pumping-unit';
//import { Sensor } from './sensor';

@Injectable({
  providedIn: 'root'
})

export class PePumpingUnitService {
  
  constructor(
	private http: HttpClient,
  ) { 
	
  }

    add(_pe_bhp: PePumpingUnit) {
		return this.http.post<any>('Pe/PumpingUnit/Add', _pe_bhp)
		.pipe(map(res => {
			return res;
		}));
    }
	
	deletePePumpingUnit(_pe_bhp: PePumpingUnit) {
		return this.http.post<any>('Pe/PumpingUnit/Delete', _pe_bhp)
		.pipe(map(res => {
			return res;
		}));
	}
	
	editPePumpingUnit(_pe_bhp: PePumpingUnit) {
		return this.http.post<any>('Pe/PumpingUnit/Edit', _pe_bhp)
		.pipe(map(res => {
			return res;
		}));
	}
	
	getOne(_pe_bhp: PePumpingUnit) : Observable<PePumpingUnit> {
		return this.http.post<any>('Pe/PumpingUnit/Get', _pe_bhp)
		.pipe(map(res => { 
			return new PePumpingUnit(res.PE_TICKET_ID, res.MACHINE_ID, res.PRESENCE_LOCATION_ID, res.DEVICE_ROLE);
		})); 
	}
}
