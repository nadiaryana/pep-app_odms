import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router, RouterStateSnapshot, ActivatedRoute } from '@angular/router';

import { PeSonolog } from './pe-sonolog';
//import { Sonolog } from './sonolog';

@Injectable({
  providedIn: 'root'
})

export class PeSonologService {
  
  constructor(
	private http: HttpClient,
  ) { 
	
  }

    add(_pe_sonolog: PeSonolog) {
		return this.http.post<any>('Pe/Sonolog/Add', _pe_sonolog)
		.pipe(map(res => {
			return res;
		}));
    }
	
	deletePeSonolog(_pe_sonolog: PeSonolog) {
		return this.http.post<any>('Pe/Sonolog/Delete', _pe_sonolog)
		.pipe(map(res => {
			return res;
		}));
	}
	
	editPeSonolog(_pe_sonolog: PeSonolog) {
		return this.http.post<any>('Pe/Sonolog/Edit', _pe_sonolog)
		.pipe(map(res => {
			return res;
		}));
	}
	
	getOne(_pe_sonolog: PeSonolog) : Observable<PeSonolog> {
		return this.http.post<any>('Pe/Sonolog/Get', _pe_sonolog)
		.pipe(map(res => { 
			return new PeSonolog(res.PE_TICKET_ID, res.MACHINE_ID, res.PRESENCE_LOCATION_ID, res.DEVICE_ROLE);
		})); 
	}
}
