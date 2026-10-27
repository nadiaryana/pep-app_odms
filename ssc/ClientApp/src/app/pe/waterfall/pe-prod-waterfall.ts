/**
 * Satu baris breakdown waterfall: satu sumur pada satu periode (start_date - end_date)
 * di dalam satu kategori.
 */
export class PeProdWaterfall {
	constructor(
		public _id: string = "",
		public start_date: Date = null,
		public end_date: Date = null,
		public kategori: string = "",
		public well: string = "",
		public delta_prod: number = null,
		public remarks: string = "",
		public period2_start_date: Date = null,
		public period2_end_date: Date = null
	) {}
}

/** Master kategori waterfall (koleksi prod_waterfall_kategori). */
export class PeProdWaterfallKategori {
	constructor(
		public _id: string = "",
		public code: string = "",
		public name: string = "",
		public order: number = 0
	) {}

	get label(): string {
		return this.code ? this.code + ". " + this.name : this.name;
	}
}

/** Baris sumur pada halaman add; delta merupakan selisih rata-rata net dua periode. */
export interface PeProdWaterfallWell {
	well: string;
	average_net_period1: number;
	average_net_period2: number;
	delta_prod: number;
	added: boolean;
}

export interface PeProdWaterfallApi {
	items: PeProdWaterfall[];
	total_count: number;
	/** Total delta per kategori dari seluruh hasil filter (tanpa paging). */
	categories?: PeProdWaterfallChartKategori[];
}

export interface PeProdWaterfallChartKategori {
	kategori: string;
	label: string;
	delta_prod: number;
	well_count: number;
}

export interface PeProdWaterfallChart {
	start_date: string;
	end_date: string;
	period2_start_date: string;
	period2_end_date: string;
	total_start: number;
	total_end: number;
	others: number;
	categories: PeProdWaterfallChartKategori[];
	items: PeProdWaterfall[];
}