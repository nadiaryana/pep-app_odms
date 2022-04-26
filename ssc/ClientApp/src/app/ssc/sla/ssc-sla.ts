export class SscSla {
	constructor(
		public ssc_sla_id: number = 0,
		public machine_id: number,
		public presence_location_id: number,
		public device_role: string,
		public asset_name: string = "",
		public location_name: string = ""
	) {}
}
