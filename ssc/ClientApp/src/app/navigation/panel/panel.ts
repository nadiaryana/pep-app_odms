export class Panel {
	constructor(
		public title: string = "",
		public order: number = 0,
		public items: PanelItem[] = [new PanelItem()],
	) {}
}

export class PanelItem {
	constructor(
		public label: string = "",
		public path: string = "",
		public icon: string = "",
		public permission: boolean = false,
		public outlet: object = null,
	){}
}