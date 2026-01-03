import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Barchart } from './barchart';

@Injectable({
  providedIn: 'root'
})
export class BarchartService {

  private apiUrl = '/api/pe/barchart';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Barchart[]> {
    return this.http.get<Barchart[]>(this.apiUrl);
  }

  getById(id: string): Observable<Barchart> {
    return this.http.get<Barchart>(`${this.apiUrl}/${id}`);
  }

  create(barchart: Barchart): Observable<Barchart> {
    return this.http.post<Barchart>(this.apiUrl, barchart);
  }

  update(id: string, barchart: Barchart): Observable<Barchart> {
    return this.http.put<Barchart>(`${this.apiUrl}/${id}`, barchart);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
