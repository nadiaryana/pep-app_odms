export class PeSumur {
	constructor(
		public _id: string,
		public machine_id: number,
		public presence_location_id: number,
		public device_role: string,
		public asset_name: string = "",
		public location_name: string = ""
	) {}
}

export class PeSumurError {
	constructor(
		public pe_sumur_id: number = 0,
	) {}
}