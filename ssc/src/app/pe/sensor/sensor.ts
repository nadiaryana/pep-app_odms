export class Sensor {
	constructor(
		public id: string,
		public type: string,
		public displayId: string,
		public summary: string,
		public customer_fullName: string,
		public customer_company: string,
		public customer_site: string,
		public customer_department: string,
		public assignee_fullName: string,
		public assignee_loginId: string,
		public priority: string,
		public status_value: string,
		public status_reason: string,
		public supportGroup_name: string,
	) {}
}
