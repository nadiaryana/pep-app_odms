import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router, RouterStateSnapshot, ActivatedRoute } from '@angular/router';

// import { PePumpingUnit } from './pe-pumping-unit';
import { PeSuspendedWell } from './pe-suspended-well.component';
//import { Sensor } from './sensor';

@Injectable({
  providedIn: 'root'
})

export class PeSuspendedWellService {
  
  constructor(
	private http: HttpClient,
  ) { 
	
  }

    add(_pe_suspended: PeSuspendedWell) {
		return this.http.post<any>('Pe/PumpingUnit/Add', _pe_pumping)
		.pipe(map(res => {
			return res;
		}));
    }
	
	deletePePumpingUnit(_pe_pumping: PeSuspendedWell) {
		return this.http.post<any>('Pe/PumpingUnit/Delete', _pe_pumping)
		.pipe(map(res => {
			return res;
		}));
	}
	
	editPePumpingUnit(_pe_pumping: PeSuspendedWell) {
		return this.http.post<any>('Pe/PumpingUnit/Edit', _pe_pumping)
		.pipe(map(res => {
			return res;
		}));
	}
	
	getOne(_pe_pumping: PeSuspendedWell) : Observable<PeSuspendedWell> {
		return this.http.post<any>('Pe/PumpingUnit/Get', _pe_pumping)
		.pipe(map(res => { 
			return new PeSuspendedWell(res.PE_TICKET_ID, res.MACHINE_ID, res.PRESENCE_LOCATION_ID, res.DEVICE_ROLE);
		})); 
	}
	updatePePumpingUnit(id: string, payload: Partial<PeSuspendedWell>) {
		// Encode ID to handle special characters like #
		const encodedId = encodeURIComponent(id);
		return this.http.patch(`/api/pe/PumpingUnit/${encodedId}`, payload);
	}
}
