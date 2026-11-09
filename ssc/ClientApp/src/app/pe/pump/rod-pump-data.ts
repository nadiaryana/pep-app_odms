export interface RodPumpData {
	_id?: string;
	rod_nomor?: number;
	plunger_diameter?: number;
	rod_weight?: number;
	elastic_constat?: number;
	freq_factor?: number;
	rod_string1?: number;
	rod_string2?: number;
	rod_string3?: number;
	rod_string4?: number;
	rod_string5?: number;
	rod_string6?: number;
	rod_string7?: number;
	created_by?: string;
	created_date?: string;
	updated_by?: string;
	updated_date?: string;
}

export interface RodPumpDataApi {
	items: RodPumpData[];
	total_count: number;
}
