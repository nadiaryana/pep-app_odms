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
		period2_start_date: Date = null,
		period2_end_date: Date = null,
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
		if (period2_start_date != null) params["period2_start_date"] = period2_start_date.toISOString();
		if (period2_end_date != null) params["period2_end_date"] = period2_end_date.toISOString();

		httpOption["params"] = params;

		return this.http.get<PeProdWaterfallApi>(this.apiUrl, httpOption);
	}

	/** Master kategori waterfall. */
	getKategori(): Observable<PeProdWaterfallKategori[]> {
		return this.http.get<any>(this.apiUrl + '/Kategori')
			.pipe(map(res => res["items"].map(k => new PeProdWaterfallKategori(k._id, k.code, k.name, k.order))));
	}

	/** Tambahkan kategori waterfall baru. */
	addKategori(code: string, name: string): Observable<PeProdWaterfallKategori> {
		return this.http.post<any>(this.apiUrl + '/Kategori', { code: code, name: name })
			.pipe(map(res => {
				var k = res["item"];
				return new PeProdWaterfallKategori(k._id, k.code, k.name, k.order);
			}));
	}

	/** Daftar sumur + rata-rata net dan delta otomatis dari data daily dua periode. */
	getWells(
		start_date: Date = null,
		end_date: Date = null,
		period2_start_date: Date = null,
		period2_end_date: Date = null
	): Observable<PeProdWaterfallWell[]> {
		var params = {};
		if (start_date != null) params["start_date"] = start_date.toISOString();
		if (end_date != null) params["end_date"] = end_date.toISOString();
		if (period2_start_date != null) params["period2_start_date"] = period2_start_date.toISOString();
		if (period2_end_date != null) params["period2_end_date"] = period2_end_date.toISOString();

		return this.http.get<any>(this.apiUrl + '/Wells', {
			params: params
		}).pipe(map(res => res["items"]));
	}

	/** Data chart: rata-rata produksi dan delta kategori untuk dua periode. */
	getChart(
		start_date: Date,
		end_date: Date,
		period2_start_date: Date |null = null,
		period2_end_date: Date | null = null
	): Observable<PeProdWaterfallChart> {
		var params = {
			start_date: start_date.toISOString(),
			end_date: end_date.toISOString()
		};
		if (period2_start_date && period2_end_date) {
			params["period2_start_date"] = period2_start_date.toISOString();
			params["period2_end_date"] = period2_end_date.toISOString();
		}
		return this.http.get<PeProdWaterfallChart>(this.apiUrl + '/Chart', { params: params });
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
