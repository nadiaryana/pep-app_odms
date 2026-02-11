import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router, RouterStateSnapshot, ActivatedRoute } from '@angular/router';

import { PeLab } from './pe-lab';
//import { Sensor } from './sensor';

@Injectable({
  providedIn: 'root'
})

export class PeLabService {
  
  constructor(
	private http: HttpClient,
  ) { 
	
  }

    add(_pe_lab: PeLab) {
		return this.http.post<any>('Pe/Lab/Add', _pe_lab)
		.pipe(map(res => {
			return res;
		}));
    }
	
	deletePeLab(_pe_lab: PeLab) {
		return this.http.post<any>('Pe/Lab/Delete', _pe_lab)
		.pipe(map(res => {
			return res;
		}));
	}
	
	editPeLab(_pe_lab: PeLab) {
		return this.http.post<any>('Pe/Lab/Edit', _pe_lab)
		.pipe(map(res => {
			return res;
		}));
	}
	
	getOne(_pe_lab: PeLab) : Observable<PeLab> {
		return this.http.post<any>('Pe/Lab/Get', _pe_lab)
		.pipe(map(res => { 
			return new PeLab(res.PE_TICKET_ID, res.MACHINE_ID, res.PRESENCE_LOCATION_ID, res.DEVICE_ROLE);
		})); 
	}
	updatePeLab(id: string, payload: Partial<PeLab>) {
		// Encode ID to handle special characters like #
		const encodedId = encodeURIComponent(id);
		return this.http.patch(`/api/pe/lab/${encodedId}`, payload);
	}


}
