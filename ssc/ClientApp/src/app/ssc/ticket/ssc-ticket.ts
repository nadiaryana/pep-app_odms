export class SscTicket {
	constructor(
		public ssc_ticket_id: number = 0,
		public machine_id: number,
		public presence_location_id: number,
		public device_role: string,
		public asset_name: string = "",
		public location_name: string = ""
	) {}
}
