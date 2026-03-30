// pe-map-sumur.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Sumur } from './pe-map-sumur.component';

// =============================================
// INTERFACE RESPONSE API
// =============================================

export interface SumurApiResponse {
  data: SumurApiItem[];
  total: number;
  message: string;
}

export interface SumurApiItem {
  id: number;
  nama_sumur: string;
  latitude_dms: string;
  longitude_dms: string;
  keterangan?: string;
}

@Injectable({
  providedIn: 'root',
})
export class PeMapSumurService {

  private readonly baseUrl = '/api';

  constructor(private http: HttpClient) {}

  getSumurList(): Observable<Sumur[]> {
    return this.http
      .get<SumurApiResponse>(`${this.baseUrl}/sumur`)
      .pipe(
        map((res) => this.mapToSumur(res.data)),
        catchError((err) => {
          console.error('[PeMapSumurService] Error getSumurList:', err);
          return throwError(() => err);
        })
      );
  }

  getSumurById(id: number): Observable<Sumur> {
    return this.http
      .get<{ data: SumurApiItem }>(`${this.baseUrl}/sumur/${id}`)
      .pipe(
        map((res) => this.mapToSumur([res.data])[0]),
        catchError((err) => {
          console.error('[PeMapSumurService] Error getSumurById:', err);
          return throwError(() => err);
        })
      );
  }

  private mapToSumur(items: SumurApiItem[]): Sumur[] {
    return items.map((item) => ({
      name: item.nama_sumur,
      latDMS: item.latitude_dms,
      lngDMS: item.longitude_dms,
    }));
  }
}