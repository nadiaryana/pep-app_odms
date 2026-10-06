import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router, RouterStateSnapshot, ActivatedRoute } from '@angular/router';

import { PeProdWaterfall } from './pe-prod-waterfall';
//import { Sensor } from './sensor';

@Injectable({
  providedIn: 'root'
})

export class PeProdWaterfallService {
  
  constructor(
	private http: HttpClient,
  ) { 
	
  }

    add(_pe_prod_waterfall: PeProdWaterfall) {
		return this.http.post<any>('Pe/ProdWaterfall/Add', _pe_prod_waterfall)
		.pipe(map(res => {
			return res;
		}));
    }
	
	deletePeProdWaterfall(_pe_prod_waterfall: PeProdWaterfall) {
		return this.http.post<any>('Pe/ProdWaterfall/Delete', _pe_prod_waterfall)
		.pipe(map(res => {
			return res;
		}));
	}
	
	editPeProdWaterfall(_pe_prod_waterfall: PeProdWaterfall) {
		return this.http.post<any>('Pe/ProdWaterfall/Edit', _pe_prod_waterfall)
		.pipe(map(res => {
			return res;
		}));
	}
	
	getOne(_pe_prod_waterfall: PeProdWaterfall) : Observable<PeProdWaterfall> {
		return this.http.post<any>('Pe/ProdWaterfall/Get', _pe_prod_waterfall)
		.pipe(map(res => { 
			return new PeProdWaterfall(res._id, res.machine_id, res.preset_location_id, res.device_role, res.asset_name, res.location_name);
		})); 
	}
	updatePeProdWaterfall(id: string, payload: Partial<PeProdWaterfall>) {
		// Encode ID to handle special characters like #
		const encodedId = encodeURIComponent(id);
		return this.http.patch(`/api/pe/ProdWaterfall/${encodedId}`, payload);
	}
}
