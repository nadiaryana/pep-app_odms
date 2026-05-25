import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router, RouterStateSnapshot, ActivatedRoute } from '@angular/router';

// import { PeActual } from './pe-bhp';
import { PeActual } from './pe-actual';
//import { Sensor } from './sensor';

@Injectable({
  providedIn: 'root'
})

export class PeActualService {
  
  constructor(
	private http: HttpClient,
  ) { 
	
  }

    add(_pe_actual: PeActual) {
		return this.http.post<any>('Pe/Actual/Add', _pe_actual)
		.pipe(map(res => {
			return res;
		}));
    }
	
	deletePeActual(_pe_actual: PeActual) {
		return this.http.post<any>('Pe/Actual/Delete', _pe_actual)
		.pipe(map(res => {
			return res;
		}));
	}
	
	editPeActual(_pe_actual: PeActual) {
		return this.http.post<any>('Pe/Actual/Edit', _pe_actual)
		.pipe(map(res => {
			return res;
		}));
	}
	
	getOne(_pe_actual: PeActual) : Observable<PeActual> {
		return this.http.post<any>('Pe/Actual/Get', _pe_actual)
		.pipe(map(res => { 
			return new PeActual(res.PE_TICKET_ID, res.MACHINE_ID, res.PRESENCE_LOCATION_ID, res.DEVICE_ROLE);
		})); 
	}
}
