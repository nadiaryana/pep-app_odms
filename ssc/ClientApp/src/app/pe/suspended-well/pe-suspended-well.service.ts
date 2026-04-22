import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router, RouterStateSnapshot, ActivatedRoute } from '@angular/router';

import { PeWellDatabase } from './pe-suspended-well';

@Injectable({
  providedIn: 'root'
})

export class PeWellDatabaseService {
  
  constructor(
	private http: HttpClient,
  ) { 
	
  }

    add(_pe_welldatabase: PeWellDatabase) {
		return this.http.post<any>('Pe/WellDatabase/Add', _pe_welldatabase)
		.pipe(map(res => {
			return res;
		}));
    }
	
	deletePeWellDatabase(_pe_welldatabase: PeWellDatabase) {
		return this.http.post<any>('Pe/WellDatabase/Delete', _pe_welldatabase)
		.pipe(map(res => {
			return res;
		}));
	}
	
	editPeWellDatabase(_pe_welldatabase: PeWellDatabase) {
		return this.http.post<any>('Pe/WellDatabase/Edit', _pe_welldatabase)
		.pipe(map(res => {
			return res;
		}));
	}
	
	getOne(_pe_welldatabase: PeWellDatabase) : Observable<PeWellDatabase> {
		return this.http.post<any>('Pe/WellDatabase/Get', _pe_welldatabase)
		.pipe(map(res => { 
			return new PeWellDatabase(res.PE_TICKET_ID, res.MACHINE_ID, res.PRESENCE_LOCATION_ID, res.DEVICE_ROLE);
		})); 
	}
	updatePeWellDatabase(id: string, payload: Partial<PeWellDatabase>) {
		// Encode ID to handle special characters like #
		const encodedId = encodeURIComponent(id);
		return this.http.patch(`/api/pe/WellDatabase/${encodedId}`, payload);
	}
}
