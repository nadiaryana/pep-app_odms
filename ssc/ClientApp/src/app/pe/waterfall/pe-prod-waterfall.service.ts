import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
	PeProdWaterfall,
	PeProdWaterfallApi,
	PeProdWaterfallChart,
	PeProdWaterfallKategori,
	PeProdWaterfallWell
} from './pe-prod-waterfall';

@Injectable({
	providedIn: 'root'
})

export class PeProdWaterfallService {

	private apiUrl = '/api/pe/ProdWaterfall';

	constructor(
		private http: HttpClient,
	) { }

	/**
	 * Daftar baris breakdown satu periode.
	 * mode: "" daftar, "excel" unduh xlsx, "<kolom>" daftar nilai distinct untuk xfilter.
	 */
	getRepoIssues(
		sort: string,
		order: string,
		page: number,
		pagesize: number = 50,
		filter: string,
		columnfilter: object,
		mode: string = "",
		start_date: Date = null,
		end_date: Date = null,
		httpOption: object = {}): Observable<PeProdWaterfallApi> {

		var params = {};
		if (sort != null) params["sort"] = sort;
		if (order != null) params["order"] = order;
		if (page != null) params["page"] = page.toString();
		if (pagesize != null) params["pagesize"] = pagesize.toString();
		if (filter != null) params["filter"] = filter;
		if (Object.keys(columnfilter).length > 0) params["columnfilter"] = JSON.stringify(columnfilter);
		if (mode != null) params["mode"] = mode;
		if (start_date != null) params["start_date"] = start_date.toISOString();
		if (end_date != null) params["end_date"] = end_date.toISOString();

		httpOption["params"] = params;

		return this.http.get<PeProdWaterfallApi>(this.apiUrl, httpOption);
	}

	/** Master kategori waterfall. */
	getKategori(): Observable<PeProdWaterfallKategori[]> {
		return this.http.get<any>(this.apiUrl + '/Kategori')
			.pipe(map(res => res["items"].map(k => new PeProdWaterfallKategori(k._id, k.code, k.name, k.order))));
	}

	/** Daftar sumur + delta otomatis dari data daily untuk satu periode. */
	getWells(start_date: Date, end_date: Date): Observable<PeProdWaterfallWell[]> {
		return this.http.get<any>(this.apiUrl + '/Wells', {
			params: {
				start_date: start_date.toISOString(),
				end_date: end_date.toISOString()
			}
		}).pipe(map(res => res["items"]));
	}

	/** Data chart: total awal/akhir periode + delta per kategori. */
	getChart(start_date: Date, end_date: Date): Observable<PeProdWaterfallChart> {
		return this.http.get<PeProdWaterfallChart>(this.apiUrl + '/Chart', {
			params: {
				start_date: start_date.toISOString(),
				end_date: end_date.toISOString()
			}
		});
	}

	add(items: PeProdWaterfall[]): Observable<any> {
		return this.http.post<any>(this.apiUrl, items);
	}

	update(id: string, payload: Partial<PeProdWaterfall>): Observable<any> {
		// Encode ID to handle special characters like #
		const encodedId = encodeURIComponent(id);
		return this.http.patch(`${this.apiUrl}/${encodedId}`, payload);
	}

	deleteSelected(ids: string[]): Observable<any> {
		return this.http.request<any>('delete', this.apiUrl, { body: ids });
	}
}
