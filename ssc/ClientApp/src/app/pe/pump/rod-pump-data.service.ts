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
      .set('page', (page || 0).toString())
      .set('pagesize', (pagesize || 50).toString());

    return this.http.get<RodPumpDataApi>('/api/pe/RodPumpData', { params });
  }

  uploadRodPumpData(file: File): Observable<any> {
    const fd = new FormData();
    fd.append('files', file);
    return this.http.post<any>('/api/pe/RodPumpData/UploadFiles', fd);
  }
}
