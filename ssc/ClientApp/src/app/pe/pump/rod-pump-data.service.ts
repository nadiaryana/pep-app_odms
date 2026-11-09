import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { RodPumpDataApi } from './rod-pump-data';

@Injectable({
  providedIn: 'root'
})
export class RodPumpDataService {

  constructor(
    private http: HttpClient,
  ) { }

  getRodPumpData(sort: string, order: string, page: number, pagesize: number): Observable<RodPumpDataApi> {
    const params = new HttpParams()
      .set('sort', sort || 'rod_nomor')
      .set('order', order || 'asc')
      .set('page', page.toString())
      .set('pagesize', pagesize.toString());

    return this.http.get<RodPumpDataApi>('/api/pe/RodPumpData', { params });
  }
}
