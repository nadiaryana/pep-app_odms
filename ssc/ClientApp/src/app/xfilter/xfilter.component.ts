import { Component, OnInit, Inject, Input, Output, EventEmitter, Injectable, ViewChild } from '@angular/core';
import { MatSelectionList, MatListOption, MatSelect, MatMenu, MatCheckbox } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { formatDate } from '@angular/common';
import { debounceTime } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})

export class xFilterService {

	private currentFilter: BehaviorSubject<any>;
	private currentSelected: BehaviorSubject<any>;
	@Output() update: EventEmitter<boolean> = new EventEmitter();

	constructor() {
		this.currentFilter = new BehaviorSubject<any>("");
		this.currentSelected = new BehaviorSubject<any>("");
	}

	public get filter(): Observable<any> {
		return this.currentFilter.asObservable();
	}

	public get selected(): Observable<any> {
		return this.currentSelected.asObservable();
	}

	resetFilter() {
		this.currentFilter = new BehaviorSubject<any>("");
		this.currentSelected = new BehaviorSubject<any>("");
	}

	updateFilter(filter:any) {
		this.currentFilter.next(filter);
	}

	updateItems(data:any) {
		this.update.emit(data);
	}

	updateSelected(selected:any) {
		this.currentSelected.next(selected);
	}

}


@Component({
  selector: 'app-xfilter',
  templateUrl: './xfilter.component.html',
  styleUrls: ['./xfilter.component.scss'],
})

export class xFilterComponent implements OnInit {

  	@Input() column: string;
  	@Input() title: string;
  	@Input() selected: any;
  	@Input() format: string;

	constructor(
		public dialog: MatDialog,
		private xfilterService: xFilterService,
	) {

	}

	ngOnInit() {

	}

	openDialog(): void {
		const dialogRef = this.dialog.open(xFilterDialogComponent, {
			width: '250px',
      data: { column: this.column, selected: this.selected, title: this.title, format: this.format }
      });
      console.log(this.selected)
		dialogRef.afterClosed().subscribe(res => {
			if(res) this.xfilterService.updateSelected({ column: this.column, selected: res});
		});
	}

	ngOnDestroy() {
		this.xfilterService.resetFilter();
	}
}


@Component({
	selector: 'app-xfilter-dialog',
	templateUrl: './xfilter-dialog.component.html',
	styleUrls: ['./xfilter.component.scss'],
})

export class xFilterDialogComponent {

	list_items: string[] = [];
	listControl = new FormControl('');
	itemFilter = new FormControl('');
	isLoadingResults = false;
	title: string;
	format: string;
	@ViewChild('list', {static:true}) list: MatSelectionList;
	//@ViewChild('select_all', {static:true}) select_all: MatListOption;
	@ViewChild('select_all', {static:true}) select_all: MatCheckbox;
	select_all_checked: boolean;
	selected: boolean;
	item: string;
	filterSubscription:Subscription;

	text_filters = {
		"eq" : "Equals...",
		"ne" : "Does Not Equals...$",
		"bw" : "Begins With...",
		"ew" : "Ends With...$",
		"ct" : "Contains...",
		"nct" : "Does Not Contains...$",
		"custom" : "Custom Filter",
	}

	number_filters = {
		"eq" : "Equals...",
		"ne" : "Does Not Equals...$",
		"gt" : "Greater Than...",
		"gte" : "Greater Than or Equal to...",
		"lt" : "Less Than...",
		"lte" : "Less Than or Equal to...",
		"gte_lte" : "Between...$",
		"custom" : "Custom Filter",
	}

	date_filters = {
		"eq" : "Equals...$",
		"lt" : "Before...",
		"gt" : "After...",
		"gte_lte" : "Between...$",
		"d +1" : "Tomorrow",
		"d +0" : "Today",
		"d -1" : "Yesterday$",
		"m +1" : "Next Month",
		"m +0" : "This Month",
		"m -1" : "Last Month$",
		"y +1" : "Next Year",
		"y +0" : "This Year",
		"y -1" : "Last Year$",
		"custom" : "Custom Filter",
	}

	constructor(
		public dialogRef: MatDialogRef<xFilterDialogComponent>,
		private xfilterService: xFilterService,
		public dialog: MatDialog, 
		@Inject(MAT_DIALOG_DATA) public data: any
	) {}

	ngOnInit() {
		var init = true;
		this.isLoadingResults = true;
		this.title = this.data["title"] ? this.data["title"] : this.data["column"];
		this.format = this.data["format"] ? this.data["format"] : "string";
      this.xfilterService.updateFilter({ column: this.data["column"] });
      console.log("sampai sini kah" + this.data["column"])

      this.itemFilter.valueChanges.pipe(debounceTime(300)).subscribe(res => {
        console.log("sampai sini kah 2" + this.data["column"])
          this.isLoadingResults = true;
			this.xfilterService.updateFilter({column: this.data["column"], filter: res});
		});
      this.filterSubscription = this.xfilterService.update.subscribe(res => {
        console.log("sampai sini kah 3" + res)
			this.isLoadingResults = false;
          if (res["column"] == this.data["column"]) {
            this.list_items = res["items"];
              console.log(this.list_items);
				this.select_all.checked = (this.list.selectedOptions.selected.length == this.list.options.length);
				console.log(this.data["column"] + ' '+ this.list.selectedOptions.selected.length + ' ' + this.list.options.length + ' ' + this.list_items.length);
			}
		})
	}

	ngOnDestroy() {
		this.filterSubscription.unsubscribe();
	}

	toggleItem(item, selected) {
		if(!selected) this.select_all.checked = false;
		if(this.list.selectedOptions.selected.length == this.list.options.length) this.select_all.checked = true;
	}

	toggleSelectAll() {
		if(this.select_all.checked) {
			this.list.selectAll();
		} else {
			this.list.deselectAll();
		}
		this.select_all_checked = this.select_all.checked;
	}

	isDefaultSelected(item) {
		return this.data["selected"].filter(d => d==item).length > 0 || this.data["selected"].length == 0;
	}

	clearFilter() {
		this.isLoadingResults = true;
		this.itemFilter.setValue("", {emitEvent: false});
		this.data["selected"] = [];
		this.xfilterService.updateFilter({column: this.data["column"], clear: true});
	}

	onOk() {
		var res;
		//console.log("Ini apa ya: "+this.list.options);
		// console.log(this.list.selectedOptions.selected.length + ' ' +  this.list.options.length + ' ' + this.data["selected"].length == 0 + ' ' + this.itemFilter.value);
		// console.log(this.itemFilter);
		// if(this.list.selectedOptions.selected.length == this.list.options.length && this.data["selected"].length == 0 && this.itemFilter.value == "") {
		if(this.list.selectedOptions.selected.length == this.list.options.length && this.data["selected"].length == 0 && this.itemFilter.value == "") {
			// res = [];
			res = this.list.selectedOptions.selected.map(o => o.value);
		} else {
			res = this.list.selectedOptions.selected.map(o => o.value);
		}
		
		this.dialogRef.close(res);
	}

	onCancel() {
		this.dialogRef.close();
	}

	formatItem(fmt, val) {
		switch(fmt) {
			case 'date' :
				return formatDate(val, 'dd MMM y', 'en-US');
			case 'datetime' :
				return formatDate(val, 'dd MMM y HH:mm', 'en-US');
			default :
				return val;
		}
	}

	selectNumberFilter(predef) {
		this.openNumberDialog(predef);
	}
	
	openNumberDialog(predef) {
		const dialogNumberRef = this.dialog.open(xFilterDialogNumberComponent, {
			width: 'auto',
			data: { selected: this.data["selected"], predef: predef }
		});
		dialogNumberRef.afterClosed().subscribe(res => {
			if(res) this.xfilterService.updateSelected({ column: this.data["column"], selected: res});
		});

		this.dialogRef.close();
	}

	selectDateFilter(predef) {
		if(predef.indexOf(" ") == -1) {
			this.openDateDialog(predef);
		} else {
			var dt = new Date();
			dt.setHours(0,0,0,0);
			var res = [];
			switch(predef) {
				case "d +1" :
					dt.setDate(dt.getDate()+1);
					res.push({opr: "eq", val: dt.toISOString()});
					break;
				case "d +0" :
					res.push({opr: "eq", val: dt.toISOString()});
					break;
				case "d -1" :
					dt.setDate(dt.getDate()-1);
					res.push({opr: "eq", val: dt.toISOString()});
					break;
				case "m +1" :
					var dt2 = new Date(dt.getFullYear(), dt.getMonth()+2, 0);
					dt.setMonth(dt.getMonth()+1, 1);
					res.push({opr: "gte", val: dt.toISOString()});
					res.push({opr: "lte", val: dt2.toISOString()});
					break;
				case "m +0" :
					var dt2 = new Date(dt.getFullYear(), dt.getMonth()+1, 0);
					dt.setDate(1);
					res.push({opr: "gte", val: dt.toISOString()});
					res.push({opr: "lte", val: dt2.toISOString()});
					break;
				case "m -1" :
					var dt2 = new Date(dt.getFullYear(), dt.getMonth(), 0);
					dt.setMonth(dt.getMonth()-1, 1);
					res.push({opr: "gte", val: dt.toISOString()});
					res.push({opr: "lte", val: dt2.toISOString()});
					break;
				case "y +1" :
					var dt2 = new Date(dt.getFullYear()+1, 11, 31);
					dt.setFullYear(dt.getFullYear()+1);
					dt.setMonth(0, 1);
					res.push({opr: "gte", val: dt.toISOString()});
					res.push({opr: "lte", val: dt2.toISOString()});
					break;
				case "y +0" :
					var dt2 = new Date(dt.getFullYear(), 11, 31);
					dt.setMonth(0, 1);
					res.push({opr: "gte", val: dt.toISOString()});
					res.push({opr: "lte", val: dt2.toISOString()});
					break;
				case "y -1" :
					var dt2 = new Date(dt.getFullYear()-1, 11, 31);
					dt.setFullYear(dt.getFullYear()-1);
					dt.setMonth(0, 1);
					res.push({opr: "gte", val: dt.toISOString()});
					res.push({opr: "lte", val: dt2.toISOString()});
					break;
			}
			res.map(r => {
				r["log"] = "and";
				r["predef"] = predef;
			})
			this.xfilterService.updateSelected({ column: this.data["column"], selected: res});
			this.dialogRef.close();
		}
		
	}

	openDateDialog(predef) {
		const dialogDateRef = this.dialog.open(xFilterDialogDateComponent, {
			width: 'auto',
			data: { selected: this.data["selected"], predef: predef }
		});
		dialogDateRef.afterClosed().subscribe(res => {
			if(res) this.xfilterService.updateSelected({ column: this.data["column"], selected: res});
		});

		this.dialogRef.close();
	}

	selectTextFilter(predef) {
		this.openTextDialog(predef);
	}

	openTextDialog(predef) {
		const dialogTextRef = this.dialog.open(xFilterDialogTextComponent, {
			width: 'auto',
			data: { selected: this.data["selected"], predef: predef }
		});
		dialogTextRef.afterClosed().subscribe(res => {
			if(res) this.xfilterService.updateSelected({ column: this.data["column"], selected: res});
		});

		this.dialogRef.close();
	}

	asIsOrder(a, b) {
	  return -1;
	}
}


@Component({
	selector: 'app-xfilter-number-dialog',
	templateUrl: './xfilter-dialog-number.component.html',
	styleUrls: ['./xfilter.component.scss'],
})

export class xFilterDialogNumberComponent {

	opr1: string;
	val1: string;
	opr2: string;
	val2: string;
	log:string = "and";

	operators = {
		"eq" : "equal",
		"ne" : "does not equal",
		"gt" : "is greater than",
		"gte" : "is greater than or equal to",
		"lt" : "less than",
		"lte" : "is less than or equal to",
	}

	constructor(
		public dialogNumberRef: MatDialogRef<xFilterDialogNumberComponent>,
		private xfilterService: xFilterService,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {}

	ngOnInit() {
		if(this.data["selected"].length > 0 && this.data["predef"] == this.data["selected"][0].predef) {
			for(var i=1; i<=this.data["selected"].length; i++) {
				var sel = this.data["selected"][i-1];
				if(typeof sel === "object") {
					this["opr"+i] = sel["opr"];
					this["val"+i] = sel["val"];
					this.log = sel["log"];
				}
			}
		} else {
			var predef = this.data["predef"].split("_");
			for(var i=1; i<=predef.length; i++) {
				this["opr"+i] = predef[i-1];
				this.log = "and";
			}
		}
	}

	onOk() {
		var res = [];
		if(this.opr1 != null && this.val1 != null) res.push({opr: this.opr1, val: Number(this.val1), log: this.log});
		if(this.opr2 != null && this.val2 != null) res.push({opr: this.opr2, val: Number(this.val2), log: this.log});

		if(res.length > 0 && this.data["predef"] != null) {
			var predef = res.map(s => (s.opr)? s.opr : "").join("_");
			if(predef != this.data["predef"]) predef = "custom";
			res.map(r => r.predef = predef);
		}

		this.dialogNumberRef.close(res);
	}

	onCancel() {
		this.dialogNumberRef.close();
	}
}


@Component({
	selector: 'app-xfilter-date-dialog',
	templateUrl: './xfilter-dialog-date.component.html',
	styleUrls: ['./xfilter.component.scss'],
})

export class xFilterDialogDateComponent {

	opr1: string;
	val1: Date;
	val1Input: string;
	opr2: string;
	val2: Date;
	val2Input: string;
	log:string = "and";

	operators = {
		"eq" : "equal",
		"ne" : "does not equal",
		"gt" : "is after",
		"gte" : "is after or equal to",
		"lt" : "is before",
		"lte" : "is before or equal to",
	}

	constructor(
		public dialogDateRef: MatDialogRef<xFilterDialogDateComponent>,
		private xfilterService: xFilterService,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {}

	ngOnInit() {
		if(this.data["selected"].length > 0 && this.data["predef"] == this.data["selected"][0].predef) {
			for(var i=1; i<=this.data["selected"].length; i++) {
				var sel = this.data["selected"][i-1];
				if(typeof sel === "object") {
					this["opr"+i] = sel["opr"];
					this["val"+i] = new Date(Date.parse(sel["val"]));
					this["val"+i+"Input"] = this["val"+i].toLocaleDateString("en-US", { month:"short", year:"numeric", day:"numeric" });
					this.log = sel["log"];
				}
			}
		} else {
			var predef = this.data["predef"].split("_");
			for(var i=1; i<=predef.length; i++) {
				this["opr"+i] = predef[i-1];
				this.log = "and";
			}
		}
	}

	onOk() {
		var res = [];
		if(this.opr1 != null && this.val1 != null) res.push({opr: this.opr1, val: this.val1.toISOString(), log: this.log});
		if(this.opr2 != null && this.val2 != null) res.push({opr: this.opr2, val: this.val2.toISOString(), log: this.log});

		if(res.length > 0 && this.data["predef"] != null) {
			var predef = res.map(s => (s.opr)? s.opr : "").join("_");
			if(predef != this.data["predef"]) predef = "custom";
			res.map(r => r.predef = predef);
		}

		this.dialogDateRef.close(res);
	}

	onCancel() {
		this.dialogDateRef.close();
	}

	dateChange(evt, input) {
		this[input] = evt.value.toLocaleDateString("en-US", { month:"short", year:"numeric", day:"numeric" });
	}
}


@Component({
	selector: 'app-xfilter-text-dialog',
	templateUrl: './xfilter-dialog-text.component.html',
	styleUrls: ['./xfilter.component.scss'],
})

export class xFilterDialogTextComponent {

	opr1:string;
	val1:string;
	opr2: string;
	val2:string;
	log:string = "and";

	operators = {
		"eq" : "equal",
		"ne" : "does not equal",
		"bw" : "begins with",
		"ew" : "ends with",
		"ct" : "contains",
		"nct" : "does not contain",
	}

	constructor(
		public dialogTextRef: MatDialogRef<xFilterDialogTextComponent>,
		private xfilterService: xFilterService,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {}

	ngOnInit() {
		if(this.data["selected"].length > 0 && this.data["predef"] == this.data["selected"][0].predef) {
			for(var i=1; i<=this.data["selected"].length; i++) {
				var sel = this.data["selected"][i-1];
				if(typeof sel === "object") {
					this["opr"+i] = sel["opr"];
					this["val"+i] = sel["val"];
					this.log = sel["log"];
				}
			}
		} else {
			var predef = this.data["predef"].split("_");
			for(var i=1; i<=predef.length; i++) {
				this["opr"+i] = predef[i-1];
				this.log = "and";
			}
		}
	}

	onOk() {
		var res = [];
		if(this.opr1 != null && this.val1 != null) res.push({opr: this.opr1, val: this.val1, log: this.log});
		if(this.opr2 != null && this.val2 != null) res.push({opr: this.opr2, val: this.val2, log: this.log});

		if(res.length > 0 && this.data["predef"] != null) {
			var predef = res.map(s => (s.opr)? s.opr : "").join("_");
			if(predef != this.data["predef"]) predef = "custom";
			res.map(r => r.predef = predef);
		}

		this.dialogTextRef.close(res);
	}

	onCancel() {
		this.dialogTextRef.close();
	}
}
