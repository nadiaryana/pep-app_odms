export class PeMap {
	constructor(
		public _id: string,
		public machine_id: number,
		public presence_location_id: number,
		public device_role: string,
		public asset_name: string = "",
		public location_name: string = ""
	) {}
}

export class PeMapError {
	constructor(
		public pe_map_id: number = 0,
	) {}
}