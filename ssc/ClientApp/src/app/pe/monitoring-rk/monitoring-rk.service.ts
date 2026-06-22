import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  create(monitoringRK: MonitoringRK): Observable<MonitoringRK> {
    return this.http.post<MonitoringRK>(this.apiUrl, monitoringRK);
  }

  update(id: string, monitoringRK: MonitoringRK): Observable<MonitoringRK> {
    return this.http.put<MonitoringRK>(`${this.apiUrl}/${id}`, monitoringRK);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
