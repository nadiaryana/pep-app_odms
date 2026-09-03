import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MonitoringRK } from './monitoring-rk';

@Injectable({
  providedIn: 'root'
})
export class MonitoringRKService {

  private apiUrl = '/api/pe/MonitoringRK';

  constructor(private http: HttpClient) { }

  getAll(): Observable<MonitoringRK[]> {
    return this.http.get<MonitoringRK[]>(this.apiUrl);
  }

  getById(id: string): Observable<MonitoringRK> {
    return this.http.get<MonitoringRK>(`${this.apiUrl}/${id}`);
  }

  create(items: MonitoringRK[]): Observable<any> {
    return this.http.post<any>(this.apiUrl, items);
  }

  update(id: string, monitoringRK: MonitoringRK): Observable<MonitoringRK> {
    return this.http.put<MonitoringRK>(`${this.apiUrl}/${id}`, monitoringRK);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // === Rigless endpoint ===
  getRigless(sort: string, order: string, page: number, pagesize: number = 50, filter: string, columnfilter: any, mode: string = "", httpOption: any = {}): Observable<any> {
    var params: any = {};
    if (sort != null) params["sort"] = sort;
    if (order != null) params["order"] = order;
    if (page != null) params["page"] = page.toString();
    if (pagesize != null) params["pagesize"] = pagesize.toString();
    if (filter != null) params["filter"] = filter;
    if (Object.keys(columnfilter).length > 0) params["columnfilter"] = JSON.stringify(columnfilter);
    if (mode != null) params["mode"] = mode;
    httpOption["params"] = params;
    return this.http.get<any>('/api/pe/MonitoringRK/rigless', httpOption);
  }

  // === Rigless create/update/delete (koleksi monitoring_rk_rigless, model sama MonitoringRK) ===
  createRigless(items: any[]): Observable<any> {
    return this.http.post<any>('/api/pe/MonitoringRK/rigless', items);
  }

  updateRigless(id: string, item: any): Observable<any> {
    return this.http.put<any>(`/api/pe/MonitoringRK/rigless/${id}`, item);
  }

  deleteRigless(ids: string[]): Observable<any> {
    return this.http.delete('/api/pe/MonitoringRK/rigless', { params: { _ids: ids } });
  }
}
