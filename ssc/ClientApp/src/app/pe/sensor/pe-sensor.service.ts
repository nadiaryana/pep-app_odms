import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router, RouterStateSnapshot, ActivatedRoute } from '@angular/router';

import { PeSensor } from './pe-sensor';
//import { Sensor } from './sensor';

@Injectable({
  providedIn: 'root'
})

export class PeSensorService {
  
  constructor(
	private http: HttpClient,
  ) { 
	
  }

    add(_pe_sensor: PeSensor) {
		return this.http.post<any>('Pe/Sensor/Add', _pe_sensor)
		.pipe(map(res => {
			return res;
		}));
    }
	
	deletePeSensor(_pe_sensor: PeSensor) {
		return this.http.post<any>('Pe/Sensor/Delete', _pe_sensor)
		.pipe(map(res => {
			return res;
		}));
	}
	
	editPeSensor(_pe_sensor: PeSensor) {
		return this.http.post<any>('Pe/Sensor/Edit', _pe_sensor)
		.pipe(map(res => {
			return res;
		}));
	}
	
	getOne(_pe_sensor: PeSensor) : Observable<PeSensor> {
		return this.http.post<any>('Pe/Sensor/Get', _pe_sensor)
		.pipe(map(res => { 
			return new PeSensor(res.PE_TICKET_ID, res.MACHINE_ID, res.PRESENCE_LOCATION_ID, res.DEVICE_ROLE);
		})); 
	}
}
