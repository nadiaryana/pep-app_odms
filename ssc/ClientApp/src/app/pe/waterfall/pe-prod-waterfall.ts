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
		public remarks: string = ""
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

/** Baris sumur pada halaman add; delta dihitung dari data daily. */
export interface PeProdWaterfallWell {
	well: string;
	before: number;
	after: number;
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
	total_start: number;
	total_end: number;
	others: number;
	categories: PeProdWaterfallChartKategori[];
	items: PeProdWaterfall[];
}