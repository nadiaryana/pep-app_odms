(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "./$$_lazy_route_resource lazy recursive":
/*!******************************************************!*\
  !*** ./$$_lazy_route_resource lazy namespace object ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./pe/pe.module": [
		"./src/app/pe/pe.module.ts",
		"default~pe-pe-module~po-po-module~wows-wows-module",
		"pe-pe-module"
	],
	"./po/po.module": [
		"./src/app/po/po.module.ts",
		"default~pe-pe-module~po-po-module~wows-wows-module",
		"po-po-module"
	],
	"./ssc/ssc.module": [
		"./src/app/ssc/ssc.module.ts",
		"ssc-ssc-module"
	],
	"./wows/wows.module": [
		"./src/app/wows/wows.module.ts",
		"default~pe-pe-module~po-po-module~wows-wows-module",
		"wows-wows-module"
	]
};
function webpackAsyncContext(req) {
	if(!__webpack_require__.o(map, req)) {
		return Promise.resolve().then(function() {
			var e = new Error("Cannot find module '" + req + "'");
			e.code = 'MODULE_NOT_FOUND';
			throw e;
		});
	}

	var ids = map[req], id = ids[0];
	return Promise.all(ids.slice(1).map(__webpack_require__.e)).then(function() {
		return __webpack_require__(id);
	});
}
webpackAsyncContext.keys = function webpackAsyncContextKeys() {
	return Object.keys(map);
};
webpackAsyncContext.id = "./$$_lazy_route_resource lazy recursive";
module.exports = webpackAsyncContext;

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/account/login.component.html":
/*!************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/account/login.component.html ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"main-div\">\n\t<mat-card class=\"example-card\">\n\t\t<mat-progress-bar [style.display]=\"submitting ? 'block' : 'none'\" mode=\"indeterminate\"></mat-progress-bar>\n\t\t<form class=\"example-form\" (ngSubmit)=\"onSubmit()\" [formGroup]=\"loginForm\">\n\t\t\t<mat-card-header>\n\t\t\t\t<mat-card-title>Login</mat-card-title>\n\t\t\t</mat-card-header>\n\t\t\t<mat-card-content>\n\t\t\t\t<table class=\"example-full-width\" cellspacing=\"0\">\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t<mat-form-field class=\"example-full-width\">\n\t\t\t\t\t\t\t\t<mat-select matSelect formControlName=\"company_id\">\n\t\t\t\t\t\t\t\t\t<mat-option *ngFor=\"let c of companies\" [value]=\"c._id\">{{c.name}}</mat-option>\n\t\t\t\t\t\t\t\t</mat-select>\n\t\t\t\t\t\t\t</mat-form-field>\n\t\t\t\t\t\t\t<mat-error *ngIf=\"f.company_id.hasError('required') && !f.company_id.pristine\">\n\t\t\t\t\t\t\t\tCompany is <strong>required</strong>\n\t\t\t\t\t\t\t</mat-error>\n\t\t\t\t\t\t</td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t<mat-form-field class=\"example-full-width\">\n\t\t\t\t\t\t\t\t<input matInput placeholder=\"Username\" formControlName=\"username\">\n\t\t\t\t\t\t\t</mat-form-field>\n\t\t\t\t\t\t\t<mat-error *ngIf=\"f.username.hasError('required') && !f.username.pristine\">\n\t\t\t\t\t\t\t\tUsername is <strong>required</strong>\n\t\t\t\t\t\t\t</mat-error>\n\t\t\t\t\t\t</td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<td><mat-form-field class=\"example-full-width\">\n\t\t\t\t\t\t\t<input matInput type=\"password\" placeholder=\"Password\" formControlName=\"password\">\n\t\t\t\t\t\t</mat-form-field>\n\t\t\t\t\t\t<mat-error *ngIf=\"f.password.hasError('required') && !f.password.pristine\">\n\t\t\t\t\t\t\tPassword is <strong>required</strong>\n\t\t\t\t\t\t</mat-error>\n\t\t\t\t\t</td>\n\t\t\t\t</tr></table>\n\t\t\t</mat-card-content>\n\t\t\t<mat-card-actions>\n\t\t\t\t<button mat-raised-button color=\"primary\" [disabled]=\"!loginForm.valid\">Login</button>\n\t\t\t</mat-card-actions>\n\t\t</form>\n\t</mat-card>\n</div>\n\n <!--div [hidden]=\"!submitted\">\n\t  <h2>You submitted the following:</h2>\n\t  <div class=\"row\">\n\t\t<div class=\"col-xs-3\">Company ID</div>\n\t\t<div class=\"col-xs-9\">{{ company_id.value }}</div>\n\t  </div>\n\t  <div class=\"row\">\n\t\t<div class=\"col-xs-3\">Username</div>\n\t\t<div class=\"col-xs-9\">{{ username.value }}</div>\n\t  </div>\n\t  <div class=\"row\">\n\t\t<div class=\"col-xs-3\">Password</div>\n\t\t<div class=\"col-xs-9\">{{ password.value }}</div>\n\t  </div>\n\t  <br>\n\t  <button class=\"btn btn-primary\" (click)=\"submitted=false\">Edit</button>\n\t</div-->\n\n<!--div class=\"container\">\n\t<div [hidden]=\"submitted\">\n\t\t<h1>Login Form</h1>\n\t\t<form (ngSubmit)=\"onSubmit()\" #login=\"ngForm\">\n\t\t\t{{diagnostic}}\n\t\t\t\n\t\t<div class=\"form-group\">\n\t\t\t<label for=\"company\">Company</label>\n\t\t\t<select class=\"form-control\" required [(ngModel)]=\"model.company_id\" name=\"company_id\" #company_id=\"ngModel\">\n\t\t\t<option *ngFor=\"let c of company\" [value]=\"c.COMPANY_ID\">{{c.COMPANY_NAME}}</option>\n\t\t\t</select>\n\t\t\t<div [hidden]=\"company_id.valid || company_id.pristine\" class=\"alert alert-danger\">Company is required</div>\n\t\t</div>\n\t\t\n\t\t  <div class=\"form-group\">\n\t\t\t<label for=\"username\">Username</label>\n\t\t\t<input type=\"text\" class=\"form-control\" required [(ngModel)]=\"model.username\" name=\"username\" #username=\"ngModel\">\n\t\t\t<div [hidden]=\"username.valid || username.pristine\" class=\"alert alert-danger\">Username is required</div>\n\t\t  </div>\n\t \n\t\t  <div class=\"form-group\">\n\t\t\t<label for=\"password\">Password</label>\n\t\t\t<input type=\"password\" class=\"form-control\" required [(ngModel)]=\"model.password\" name=\"password\" #password=\"ngModel\">\n\t\t\t<div [hidden]=\"password.valid || password.pristine\" class=\"alert alert-danger\">Password is required</div>\n\t\t  </div>\n\t \n\t\t  <button type=\"submit\" [disabled]=\"!login.form.valid\" class=\"btn btn-success\">Submit</button>\n\t \n\t\t</form>\n\t</div>\n\t\n\t\n</div-->\n"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/account/logout.component.html":
/*!*************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/account/logout.component.html ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div *ngIf=\"loading\" class=\"loading-shade\" >\n  <mat-spinner ></mat-spinner>\n</div>"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/app.component.html":
/*!**************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/app.component.html ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<mat-toolbar color=\"primary\" *ngIf=\"!fullWindow\">\r\n  <div>\r\n    <a class=\"mat-display-1\" routerLink=\"/\">\r\n      <img src=\"assets/image/pertamina.svg\" style=\"width : 200px\" alt=\"Pertamina EP\" />\r\n    </a>\r\n  </div>\r\n  <div>\r\n    <button mat-icon-button (click)=\"sidenav.toggle()\">\r\n      <mat-icon>menu</mat-icon>\r\n    </button> \r\n  </div>\r\n  <div fxFlex fxLayout fxLayoutAlign=\"flex-end\" fxHide fxShow.gt-xs=\"true\">\r\n    <ul fxLayout fxLayoutGap=\"20px\" class=\"navigation-items\">\r\n      <ng-container *ngFor=\"let menu of root\">\r\n        <li *ngIf=\"menu.permission\">\r\n          <a [routerLink]=\"menu.outlet ? [{outlets:menu.outlet}] : menu.path\">\r\n            <mat-icon class=\"icon\">{{menu.icon}}</mat-icon>\r\n            <span class=\"label\">{{menu.label}}</span>\r\n          </a>\r\n        </li>\r\n      </ng-container>\r\n    </ul>\r\n  </div>\r\n</mat-toolbar>\n<mat-sidenav-container>\n  <mat-sidenav #sidenav role=\"navigation\" [mode]=\"screenWidth > 599? 'side' : 'over'\" [opened]=\"currentUser!=null && !fullWindow && screenWidth > 599\">\n    <mat-accordion>\n      <app-panel></app-panel>\n    </mat-accordion>\n  </mat-sidenav>\n  <mat-sidenav-content>\n\n    <main>\n      <div class=\"container\" [ngClass]=\"fullWindow? 'fullWindow' : ''\">\n        <app-title></app-title>\n        <router-outlet></router-outlet>\n        <router-outlet name=\"overlay\"></router-outlet>\n        <router-outlet name=\"overlay2\"></router-outlet>\n        <app-snackbar-message></app-snackbar-message>\n      </div>\n    </main>\n  </mat-sidenav-content>\n</mat-sidenav-container>\n"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/dashboard/dashboard.component.html":
/*!******************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/dashboard/dashboard.component.html ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container\">\n\t<p>\n\t  Welcome {{currentUser.DisplayName}} !\n\t</p>\n\t<button mat-raised-button color=\"primary\" (click)=\"logout()\" >Logout</button>\n</div>\n"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/location/location-add.component.html":
/*!********************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/location/location-add.component.html ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container-content\">\n\t<mat-horizontal-stepper linear #stepper>\n\t\t<mat-step completed=false>\n\t\t\t<ng-template matStepLabel>Upload Excel</ng-template>\n\t\t\t<div>\n\t\t\t\t<input style=\"display: none\" (change)=\"handleFile($event)\" type=\"file\" #fileInput/>\n\t\t\t</div>\n\t\t\t<button mat-raised-button color=\"basic\"(click)=\"fileInput.click()\">Pick File</button> {{ fileName }}\n\t\t\t<br/>\n\t\t\t<div class=\"loading-shade\" *ngIf=\"isUploading\">\n\t\t\t\t<mat-spinner></mat-spinner>\n\t\t\t</div>\n\t\t\t<div class=\"progress-bar\" *ngIf=\"isUploading\">\n\t\t\t\t<mat-progress-bar mode=\"determinate\" value=\"{{ progressPercent }}\"></mat-progress-bar> {{ progressPercent }} %\n\t\t\t</div>\n\t\t\t<button mat-raised-button color=\"primary\" (click)=\"onUpload()\" [disabled]=\"!fileName\">Upload</button>\n\t\t\t<!--div>\n\t\t\t\t<button mat-button matStepperNext>Next</button>\n\t\t\t</div-->\n\t\t</mat-step>\n\n\t    <mat-step completed=false>\n\t      \t<ng-template matStepLabel>Verify Data</ng-template>\n\t      \t<div *ngIf=\"data_error_count == 0\">\n\t      \t\tSave this data ?\n\t        \t<button mat-raised-button (click)=\"stepper.reset();resetData()\">Reset</button>\n\t        \t<button mat-raised-button (click)=\"saveData()\">Commit</button>\n\t      \t</div>\n\t      \t<div *ngIf=\"data_error_count > 0\">\n\t      \t\t<div class=\"cell-error\">There are {{ data_error_count }} error(s) in your data</div>\n\t        \t<button mat-raised-button (click)=\"stepper.reset();resetData()\">Reset</button>\n\t      \t</div>\n\t      \t<mat-form-field>\n\t      \t\t<mat-select [(value)]=\"data_mode\" (selectionChange)=\"loadData()\">\n\t\t\t\t\t<mat-option value=\"all\">Show All</mat-option>\n\t\t\t\t\t<mat-option value=\"error\">Show error(s) only</mat-option>\n\t\t\t\t\t<mat-option value=\"warning\">Show warning(s) only</mat-option>\n\t\t\t\t</mat-select>\n\t      \t</mat-form-field>\n\t      \t<div class=\"loading-shade\" *ngIf=\"isSaving || isLoading\">\n\t\t\t\t<mat-spinner></mat-spinner>\n\t\t\t</div>\n\t      \t<div class=\"container-table\">\n\t\t\t\t<table mat-table [dataSource]=\"data\" class=\"common-table\"\n\t\t\t\t    matSort matSortActive=\"date\" matSortDisableClear matSortDirection=\"desc\">\n\n\t\t\t\t    <ng-container matColumnDef=\"info\">\n\t\t\t\t      <th mat-header-cell *matHeaderCellDef></th>\n\t\t\t\t      <td mat-cell *matCellDef=\"let row\" class=\"cell-center\" [ngClass]=\"{'cell-warning':row._error._row?.value=='warning','cell-error':row._error._row?.value=='error'}\" [matTooltip]=\"row._error._row?.message\" matTooltipPosition=\"after\"><mat-icon>{{row._error._row?.value}}</mat-icon></td>\n\t\t\t\t    </ng-container>\n\n\t\t\t\t    <ng-container matColumnDef=\"id\">\n\t\t\t\t      <th mat-header-cell *matHeaderCellDef>ID</th>\n\t\t\t\t      <td mat-cell *matCellDef=\"let row\" class=\"cell-center\" [ngClass]=\"{'cell-error':row._error.id?.value}\" [matTooltip]=\"row._error.id?.message\" matTooltipPosition=\"after\">{{row.id || row._error.id?.value || '-'}}</td>\n\t\t\t\t    </ng-container>\n\n\t\t\t\t    <ng-container matColumnDef=\"name\">\n\t\t\t\t      <th mat-header-cell *matHeaderCellDef>Name</th>\n\t\t\t\t      <td mat-cell *matCellDef=\"let row\" [ngClass]=\"{'cell-error':row._error.name?.value}\" [matTooltip]=\"row._error.name?.message\" matTooltipPosition=\"after\">{{row.name || row._error.name?.value || '-'}}</td>\n\t\t\t\t    </ng-container>\n\n\t\t\t\t    <ng-container matColumnDef=\"parent_id\">\n\t\t\t\t      <th mat-header-cell *matHeaderCellDef>Parent</th>\n\t\t\t\t      <td mat-cell *matCellDef=\"let row\" [ngClass]=\"{'cell-error':row._error.parent_id?.value}\" [matTooltip]=\"row._error.parent_id?.message\" matTooltipPosition=\"after\">{{row.parent_id || row._error.parent_id?.value || '-'}}</td>\n\t\t\t\t    </ng-container>\n\n\t\t\t\t    <ng-container matColumnDef=\"path\">\n\t\t\t\t      <th mat-header-cell *matHeaderCellDef>Path</th>\n\t\t\t\t      <td mat-cell *matCellDef=\"let row\" [ngClass]=\"{'cell-error':row._error.path?.value}\" [matTooltip]=\"row._error.path?.message\" matTooltipPosition=\"after\">{{row.path || row._error.path?.value || '-'}}</td>\n\t\t\t\t    </ng-container>\n\n\t\t\t\t    <ng-container matColumnDef=\"type\">\n\t\t\t\t      <th mat-header-cell *matHeaderCellDef>Type</th>\n\t\t\t\t      <td mat-cell *matCellDef=\"let row\" [ngClass]=\"{'cell-error':row._error.type?.value}\" [matTooltip]=\"row._error.type?.message\" matTooltipPosition=\"after\">{{row.type || row._error.type?.value || '-'}}</td>\n\t\t\t\t    </ng-container>\n\n\t\t\t\t    <ng-container matColumnDef=\"Actions\">\n\t\t\t\t      <th mat-header-cell *matHeaderCellDef>Action</th>   \n\t\t\t\t      <td mat-cell *matCellDef=\"let row\"> \n\t\t\t\t       <!--button mat-button *ngIf=\"passPermission('/pe/sensor/edit')\" [routerLink]=\"['/', 'presence','device', 'edit', row.PE_TICKET_ID]\" matTooltip=\"Edit Device\" ><mat-icon>edit</mat-icon></button> \n\t\t\t\t       <button mat-button *ngIf=\"passPermission('/pe/sensor/delete')\" (click)=\"deleteLocation(row.PE_TICKET_ID)\" matTooltip=\"Delete Device\"><mat-icon>delete</mat-icon></button--> \n\t\t\t\t     </td>\n\t\t\t\t   </ng-container>\n\n\t\t\t\t   \t<tr mat-header-row *matHeaderRowDef=\"displayedColumns; sticky: true\"></tr>\n\t\t\t\t   \t<tr mat-row *matRowDef=\"let row; columns: displayedColumns;\"></tr>\n\t\t \t\t</table>\n\t \t\t</div>\n\t \t\t<mat-paginator [length]=\"resultsLength\"  [pageSizeOptions]=\"[50, 100, 500, 1000]\"></mat-paginator>\n\t  \t</mat-step>\n\t\t<mat-step>\n\t    \t<ng-template matStepLabel>Done</ng-template>\n\t    \t\t<p *ngIf=\"modified_count\">{{ modified_count + \" item(s) updated successfully.\" }}</p>\n\t    \t\t<p *ngIf=\"created_count\">{{ created_count + \" item(s) created successfully.\" }}</p>\n\t    \t<div>\n\t      \t\t<button mat-raised-button (click)=\"stepper.reset();resetData()\">Reset</button>\n\t    \t</div>\n\t  \t</mat-step>\n\t </mat-horizontal-stepper>\n</div>"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/location/location-list.component.html":
/*!*********************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/location/location-list.component.html ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container-top-bar\" [ngClass.gt-sm]=\"'top-flow'\" [ngClass.lt-md]=\"'top-flow-xs'\">\n  <!--mat-form-field>\n    <input matInput placeholder=\"Filter\" [formControl]=\"filterControl\">\n  </mat-form-field-->\n  <button mat-button color=\"primary\" [disabled]=\"isLoadingResults\" [routerLink]=\"['/location/add']\">Add/Edit</button>\n  <button mat-button color=\"primary\" (click)=\"deleteSelected()\" [disabled]=\"!selection.selected.length\">Delete Selected</button>\n  <button mat-button color=\"primary\" (click)=\"exportExcel()\" [disabled]=\"isLoadingResults\">Export to Excel</button>\n</div>\n\n<div class=\"container-content\" [ngClass.gt-sm]=\"'top-flow'\" [ngClass.lt-md]=\"'top-flow-xs'\">\n  \n  <div class=\"loading-shade\" *ngIf=\"isLoadingResults || isRateLimitReached\">\n    <mat-spinner *ngIf=\"isLoadingResults\"></mat-spinner>\n  </div>\n\n  <div class=\"container-table\">\n\n    <table mat-table [dataSource]=\"data\" class=\"common-table\"\n    matSort matSortActive=\"date\" matSortDisableClear matSortDirection=\"desc\">\n\n    <ng-container matColumnDef=\"expand\">\n      <th mat-header-cell *matHeaderCellDef>\n      </th>\n      <td mat-cell *matCellDef=\"let row\">\n        <button mat-button matTooltip=\"Expand\" *ngIf=\"row.has_children\" (click)=\"treeToggle(row);$event.stopPropagation()\" [disabled]=\"isLoadingResults\">\n          <mat-icon>{{row.expand == 1 ? 'remove_box' : 'add_box'}}</mat-icon>\n        </button>\n      </td>\n    </ng-container>\n\n    <ng-container matColumnDef=\"select\">\n      <th mat-header-cell *matHeaderCellDef>\n        <mat-checkbox (change)=\"($event && !isEditing) ? masterToggle() : null\"\n          [checked]=\"selection.hasValue() && isAllSelected()\"\n          [indeterminate]=\"selection.hasValue() && !isAllSelected()\"\n          [aria-label]=\"checkboxLabel()\"\n          [disabled]=\"isEditing\">\n        </mat-checkbox>\n      </th>\n      <td mat-cell *matCellDef=\"let row\">\n        <mat-checkbox (click)=\"$event.stopPropagation()\"\n          (change)=\"($event && !isEditing) ? selection.toggle(row) : null\"\n          [checked]=\"selection.isSelected(row)\"\n          [aria-label]=\"checkboxLabel(row)\"\n          [disabled]=\"isEditing\">\n        </mat-checkbox>\n      </td>\n    </ng-container>\n\n    <ng-container matColumnDef=\"id\">\n      <th mat-header-cell *matHeaderCellDef>\n        <div fxLayout=\"row\" fxLayoutAlign=\"start center\">\n          <span mat-sort-header arrowPosition=\"before\" class=\"mat-sort-header\">ID</span>\n          <app-xfilter title=\"ID\" column=\"id\" [selected]=\"id_xSelected\"></app-xfilter>\n        </div>\n     </th>\n      <td mat-cell *matCellDef=\"let row\" class=\"cell-center\">{{row.id}}</td>\n    </ng-container>\n\n    <ng-container matColumnDef=\"tree\">\n      <th mat-header-cell *matHeaderCellDef>\n        <div fxLayout=\"row\" fxLayoutAlign=\"start center\">\n          <span mat-sort-header arrowPosition=\"before\" class=\"mat-sort-header\">Tree</span>\n          <app-xfilter title=\"Name\" column=\"name\" [selected]=\"name_xSelected\"></app-xfilter>\n        </div>\n     </th>\n      <td mat-cell *matCellDef=\"let row\" [ngClass]=\"'tree-depth-'+row.path.length\" >\n        <button mat-button (click)=\"treeToggle(row);$event.stopPropagation()\" [disabled]=\"isLoadingResults || !row.has_children\" [ngClass]=\"!row.has_children? 'tree-spacer' : ''\">\n          <mat-icon>{{row.expand == 1 ? 'remove_circle_outline' : 'add_circle_outline'}}</mat-icon>\n        </button>\n        <span>{{row.name}}</span>\n      </td>\n    </ng-container>\n\n   <ng-container matColumnDef=\"name\">\n      <th mat-header-cell *matHeaderCellDef>\n        <div fxLayout=\"row\" fxLayoutAlign=\"start center\">\n          <span mat-sort-header arrowPosition=\"before\" class=\"mat-sort-header\">Name</span>\n          <app-xfilter title=\"Name\" column=\"name\" [selected]=\"name_xSelected\"></app-xfilter>\n        </div>\n     </th>\n      <td mat-cell *matCellDef=\"let row\" >{{row.name}}</td>\n    </ng-container>\n\n    <ng-container matColumnDef=\"parent_id\">\n      <th mat-header-cell *matHeaderCellDef>\n        <div fxLayout=\"row\" fxLayoutAlign=\"start center\">\n          <span mat-sort-header arrowPosition=\"before\" class=\"mat-sort-header\">Parent</span>\n          <app-xfilter title=\"Parent\" column=\"parent_id\" [selected]=\"parent_id_xSelected\"></app-xfilter>\n        </div>\n     </th>\n      <td mat-cell *matCellDef=\"let row\" >{{row.parent_id}}</td>\n    </ng-container>\n\n    <ng-container matColumnDef=\"path\">\n      <th mat-header-cell *matHeaderCellDef>\n        <div fxLayout=\"row\" fxLayoutAlign=\"start center\">\n          <span mat-sort-header arrowPosition=\"before\" class=\"mat-sort-header\">Path</span>\n          <app-xfilter title=\"Path\" column=\"path\" [selected]=\"path_xSelected\"></app-xfilter>\n        </div>\n     </th>\n      <td mat-cell *matCellDef=\"let row\" >{{row.path}}</td>\n    </ng-container>\n\n    <ng-container matColumnDef=\"type\">\n      <th mat-header-cell *matHeaderCellDef>\n        <div fxLayout=\"row\" fxLayoutAlign=\"start center\">\n          <span mat-sort-header arrowPosition=\"before\" class=\"mat-sort-header\">Type</span>\n          <app-xfilter title=\"Type\" column=\"type\" [selected]=\"type_xSelected\"></app-xfilter>\n        </div>\n     </th>\n      <td mat-cell *matCellDef=\"let row\" >{{row.type}}</td>\n    </ng-container>\n\n    <ng-container matColumnDef=\"Actions\">\n      <th mat-header-cell *matHeaderCellDef>Action</th>   \n      <td mat-cell *matCellDef=\"let row\"> \n       <!--button mat-button *ngIf=\"passPermission('/pe/sensor/edit')\" [routerLink]=\"['/', 'presence','device', 'edit', row.PE_TICKET_ID]\" matTooltip=\"Edit Device\" ><mat-icon>edit</mat-icon></button> \n       <button mat-button *ngIf=\"passPermission('/pe/sensor/delete')\" (click)=\"deleteLocation(row.PE_TICKET_ID)\" matTooltip=\"Delete Device\"><mat-icon>delete</mat-icon></button--> \n     </td>\n   </ng-container>\n\n   <tr mat-header-row *matHeaderRowDef=\"displayedColumns; sticky: true\"></tr>\n   <tr mat-row *matRowDef=\"let row; columns: displayedColumns;\" (click)=\"(!isEditing) ? selection.toggle(row) : null\"></tr>\n </table>\n</div>\n\n<mat-paginator [length]=\"resultsLength\"  [pageSizeOptions]=\"[50, 100, 500, 1000]\"></mat-paginator>\n<router-outlet></router-outlet>\n  <router-outlet name=\"overlay2\"></router-outlet>\n</div>\n"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/location/location.component.html":
/*!****************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/location/location.component.html ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<router-outlet></router-outlet>\n<router-outlet name=\"overlay2\"></router-outlet>"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/navigation/header/header.component.html":
/*!***********************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/navigation/header/header.component.html ***!
  \***********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<mat-toolbar color=\"primary\">\r\n\r\n  <div>\r\n    <a routerLink=\"/home\">Owner-Account</a>\r\n  </div>\r\n  <div fxHide.gt-xs>\r\n    <button mat-icon-button (click)=\"onToggleSidenav()\">\r\n      <mat-icon>menu</mat-icon>\r\n    </button>\r\n  </div>\r\n  <div fxFlex fxLayout fxLayoutAlign=\"end\" fxHide.xs>\r\n    <ul fxLayout fxLayoutGap=\"15px\" class=\"navigation-items\">\r\n      <li>\r\n        <a routerLink=\"/owner\">Owner Actions</a>\r\n      </li>\r\n      <li>\r\n        <a routerLink=\"/account\">Account Actions</a>\r\n      </li>\r\n    </ul>\r\n  </div>\r\n</mat-toolbar>\r\n"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/navigation/panel/panel.component.html":
/*!*********************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/navigation/panel/panel.component.html ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<mat-expansion-panel  *ngFor=\"let panel of panels; let i=index\" [expanded]=\"i==1 ?  true : false\" >\n  <mat-expansion-panel-header>\n    <mat-panel-title>\n      {{panel.title}}\n    </mat-panel-title>\n  </mat-expansion-panel-header>\n  <mat-nav-list>\n    <ng-container *ngFor=\"let menu of panel.items; let j=index\" >\r\n      <!--<a mat-list-item [routerLink]=\"menu.outlet ? [{outlets:menu.outlet}] : menu.path\" *ngIf=\"menu.permission\">-->\r\n      <a mat-list-item [routerLink]=\"menu.outlet ? [{outlets:menu.outlet}] : menu.path\" *ngIf=\"!menu.hasSubitem\" class=\"main-panel-item\">\r\n        <mat-icon class=\"icon\">{{menu.icon}}</mat-icon>\r\n        <span class=\"label\"> {{menu.label}}</span>\r\n      </a>\r\n      <mat-expansion-panel *ngIf=\"menu.hasSubitem\" [expanded]=\"step === j\" (opened)=\"setStep(j)\">\r\n        <mat-expansion-panel-header class=\"sub-panel\">\r\n          <mat-panel-title>\r\n            <mat-icon class=\"icon\">{{menu.icon}}</mat-icon>{{menu.label}}\r\n          </mat-panel-title>\r\n        </mat-expansion-panel-header>\r\n        <ng-container *ngFor=\"let submenu of menu.items\" >\r\n          <!--<a mat-list-item [routerLink]=\"menu.outlet ? [{outlets:menu.outlet}] : menu.path\" *ngIf=\"menu.permission\">-->\r\n          <a mat-list-item [routerLink]=\"submenu.outlet ? [{outlets:submenu.outlet}] : submenu.path\" class=\"sub-panel-item\">\r\n            <mat-icon class=\"icon\">{{submenu.icon}}</mat-icon>\r\n            <span class=\"label\">{{submenu.label}}</span>\r\n          </a>\r\n          </ng-container>\r\n      </mat-expansion-panel>\r\n    </ng-container>\n  </mat-nav-list>\n</mat-expansion-panel>\n"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/navigation/title/title.component.html":
/*!*********************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/navigation/title/title.component.html ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"breadcrumbs\" *ngIf=\"!fullWindow\">\n\t<ng-container *ngFor=\"let item of breadcrumbs; let isLast = last\">\n\t\t<span *ngIf=\"item.routerLink\" class=\"breadcrumbs-item\"><a [routerLink]=\"[item.routerLink]\">{{item.label}}</a></span>\n\t\t<span *ngIf=\"!item.routerLink\" class=\"breadcrumbs-item\">{{item.label}}</span>\n\t\t<span *ngIf=\"!isLast\" class=\"breadcrumbs-separator\"><mat-icon>chevron_right</mat-icon>\n\t\t</span>\n\t\t<span *ngIf=\"isLast\" class=\"breadcrumbs-break\"></span>\n\t</ng-container>\n</div>\r\n  <h1 class=\"mat-h1\"><mat-icon>{{icon}}</mat-icon>{{title}}</h1>\n"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/xfilter/xfilter-dialog-date.component.html":
/*!**************************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/xfilter/xfilter-dialog-date.component.html ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<h1 mat-dialog-title>Date Filter</h1>\n<form (ngSubmit)=\"onOk()\">\n\t<div mat-dialog-content>\n\t\t<div class=\"group-dialog\">\n\t\t\t<mat-form-field >\n\t\t\t\t<mat-select class=\"opr-number\" [(ngModel)]=\"opr1\" name=\"opr1\">\n\t\t\t\t\t<mat-option *ngFor=\"let item of operators | keyvalue\" [value]=\"item.key\">{{item.value}}</mat-option>\n\t\t\t\t</mat-select>\n\t\t\t</mat-form-field>\n\t\t\t<mat-form-field>\n\t\t\t\t<input matInput class=\"input-hidden\" [matDatepicker]=\"datePicker1\" [(ngModel)]=\"val1\" name=\"val1\" (dateChange)=\"dateChange($event, 'val1Input')\" disabled>\n\t\t\t\t<input matInput [(ngModel)]=\"val1Input\" name=\"val1Input\" disabled>\n\t\t\t\t<mat-datepicker-toggle matSuffix [for]=\"datePicker1\"></mat-datepicker-toggle>\n\t\t\t\t<mat-datepicker #datePicker1 disabled=\"false\"></mat-datepicker>\n\t\t    </mat-form-field>\n\t\t</div>\n\t\t<div class=\"group-dialog\">\n\t\t\t<mat-radio-group aria-label=\"Select an option\" [(ngModel)]=\"log\" name=\"log\">\n\t\t\t\t<mat-radio-button value=\"and\" selected>And</mat-radio-button>\n\t\t\t\t<mat-radio-button value=\"or\">Or</mat-radio-button>\n\t\t\t</mat-radio-group>\n\t\t</div>\n\t\t<div class=\"group-dialog\">\n\t\t\t<mat-form-field >\n\t\t\t\t<mat-select class=\"opr-number\" [(ngModel)]=\"opr2\" name=\"opr2\">\n\t\t\t\t\t<mat-option *ngFor=\"let item of operators | keyvalue\" [value]=\"item.key\">{{item.value}}</mat-option>\n\t\t\t\t</mat-select>\n\t\t\t</mat-form-field>\n\t\t\t<mat-form-field>\n\t\t\t\t<input matInput class=\"input-hidden\" [matDatepicker]=\"datePicker2\" [(ngModel)]=\"val2\" name=\"val2\" (dateChange)=\"dateChange($event, 'val2Input')\" disabled>\n\t\t\t\t<input matInput [(ngModel)]=\"val2Input\" name=\"val2Input\" disabled>\n\t\t\t\t<mat-datepicker-toggle matSuffix [for]=\"datePicker2\"></mat-datepicker-toggle>\n\t\t\t\t<mat-datepicker #datePicker2 disabled=\"false\"></mat-datepicker>\n\t\t    </mat-form-field>\n\t\t</div>\n\t</div>\n\t<div mat-dialog-actions>\n\t\t<button mat-button type=\"submit\" cdkFocusInitial>Ok</button>\n\t\t<button mat-button type=\"button\" (click)=\"onCancel()\">Cancel</button>\n\t</div>\n</form>\n"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/xfilter/xfilter-dialog-number.component.html":
/*!****************************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/xfilter/xfilter-dialog-number.component.html ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<h1 mat-dialog-title>Number Filter</h1>\n<form (ngSubmit)=\"onOk()\">\n\t<div mat-dialog-content>\n\t\t<div class=\"group-dialog\">\n\t\t\t<mat-form-field >\n\t\t\t\t<mat-select class=\"opr-number\" [(ngModel)]=\"opr1\" name=\"opr1\">\n\t\t\t\t\t<mat-option *ngFor=\"let item of operators | keyvalue\" [value]=\"item.key\">{{item.value }}</mat-option>\n\t\t\t\t</mat-select>\n\t\t\t</mat-form-field>\n\t\t\t<mat-form-field>\n\t\t\t\t<input matInput  [(ngModel)]=\"val1\" name=\"val1\">\n\t\t\t</mat-form-field>\n\t\t</div>\n\t\t<div class=\"group-dialog\">\n\t\t\t<mat-radio-group aria-label=\"Select an option\" [(ngModel)]=\"log\" name=\"log\">\n\t\t\t\t<mat-radio-button value=\"and\" selected>And</mat-radio-button>\n\t\t\t\t<mat-radio-button value=\"or\">Or</mat-radio-button>\n\t\t\t</mat-radio-group>\n\t\t</div>\n\t\t<div class=\"group-dialog\">\n\t\t\t<mat-form-field >\n\t\t\t\t<mat-select class=\"opr-number\" [(ngModel)]=\"opr2\" name=\"opr2\">\n\t\t\t\t\t<mat-option *ngFor=\"let item of operators | keyvalue\" [value]=\"item.key\">{{item.value}}</mat-option>\n\t\t\t\t</mat-select>\n\t\t\t</mat-form-field>\n\t\t\t<mat-form-field>\n\t\t\t\t<input matInput [(ngModel)]=\"val2\" name=\"val2\">\n\t\t\t</mat-form-field>\n\t\t</div>\n\t</div>\n\t<div mat-dialog-actions>\n\t\t<button mat-button type=\"submit\" cdkFocusInitial>Ok</button>\n\t\t<button mat-button type=\"button\" (click)=\"onCancel()\">Cancel</button>\n\t</div>\n</form>\n"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/xfilter/xfilter-dialog-text.component.html":
/*!**************************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/xfilter/xfilter-dialog-text.component.html ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<h1 mat-dialog-title>Text Filter</h1>\n<form (ngSubmit)=\"onOk()\">\n\t<div mat-dialog-content>\n\t\t<div class=\"group-dialog\">\n\t\t\t<mat-form-field >\n\t\t\t\t<mat-select class=\"opr-number\" [(ngModel)]=\"opr1\" name=\"opr1\">\n\t\t\t\t\t<mat-option *ngFor=\"let item of operators | keyvalue\" [value]=\"item.key\">{{item.value}}</mat-option>\n\t\t\t\t</mat-select>\n\t\t\t</mat-form-field>\n\t\t\t<mat-form-field>\n\t\t\t\t<input matInput [(ngModel)]=\"val1\" name=\"val1\">\n\t\t\t</mat-form-field>\n\t\t</div>\n\t\t<div class=\"group-dialog\">\n\t\t\t<mat-radio-group aria-label=\"Select an option\" [(ngModel)]=\"log\" name=\"log\">\n\t\t\t\t<mat-radio-button value=\"and\" selected>And</mat-radio-button>\n\t\t\t\t<mat-radio-button value=\"or\">Or</mat-radio-button>\n\t\t\t</mat-radio-group>\n\t\t</div>\n\t\t<div class=\"group-dialog\">\n\t\t\t<mat-form-field >\n\t\t\t\t<mat-select class=\"opr-number\" [(ngModel)]=\"opr2\" name=\"opr2\">\n\t\t\t\t\t<mat-option *ngFor=\"let item of operators | keyvalue\" [value]=\"item.key\">{{item.value}}</mat-option>\n\t\t\t\t</mat-select>\n\t\t\t</mat-form-field>\n\t\t\t<mat-form-field>\n\t\t\t\t<input matInput [(ngModel)]=\"val2\" name=\"val2\">\n\t\t\t</mat-form-field>\n\t\t</div>\n\t</div>\n\t<div mat-dialog-actions>\n\t\t<button mat-button type=\"submit\" cdkFocusInitial>Ok</button>\n\t\t<button mat-button type=\"button\" (click)=\"onCancel()\">Cancel</button>\n\t</div>\n</form>\n"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/xfilter/xfilter-dialog-tree.component.html":
/*!**************************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/xfilter/xfilter-dialog-tree.component.html ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<mat-tree [dataSource]=\"dataSource\" [treeControl]=\"treeControl\">\n  <mat-tree-node *matTreeNodeDef=\"let node\" matTreeNodeToggle matTreeNodePadding matTreeNodePaddingIndent=\"20\">\n    <button type=\"button\" mat-icon-button disabled></button>\n    <mat-checkbox class=\"checklist-leaf-node\"\n                  [checked]=\"checklistSelection.isSelected(node)\"\n                  (change)=\"todoLeafItemSelectionToggle(node)\">{{node.item}}</mat-checkbox>\n  </mat-tree-node>\n\n  <!--mat-tree-node *matTreeNodeDef=\"let node; when: hasNoContent\" matTreeNodePadding matTreeNodePaddingIndent=\"20\">\n    <button mat-icon-button disabled></button>\n    <mat-form-field>\n      <mat-label>New item...</mat-label>\n      <input matInput #itemValue placeholder=\"Ex. Lettuce\">\n    </mat-form-field>\n    <button mat-button (click)=\"saveNode(node, itemValue.value)\">Save</button>\n  </mat-tree-node-->\n\n  <mat-tree-node *matTreeNodeDef=\"let node; when: hasChild\" matTreeNodePadding matTreeNodePaddingIndent=\"20\">\n    <button type=\"button\" mat-icon-button matTreeNodeToggle\n            [attr.aria-label]=\"'toggle ' + node.filename\">\n      <mat-icon class=\"mat-icon-rtl-mirror\">\n        {{treeControl.isExpanded(node) ? 'expand_more' : 'chevron_right'}}\n      </mat-icon>\n    </button>\n    <mat-checkbox [checked]=\"descendantsAllSelected(node)\"\n                  [indeterminate]=\"descendantsPartiallySelected(node)\"\n                  (change)=\"todoItemSelectionToggle(node)\">{{node.item}}</mat-checkbox>\n    <!--button mat-icon-button (click)=\"addNewItem(node)\"><mat-icon>add</mat-icon></button-->\n  </mat-tree-node>\n</mat-tree>\n"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/xfilter/xfilter-dialog.component.html":
/*!*********************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/xfilter/xfilter-dialog.component.html ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<h1 mat-dialog-title>Filter {{title}}</h1>\n<form (ngSubmit)=\"onOk()\">\n\t<div mat-dialog-content>\n\t\t<mat-form-field>\n\t\t\t<input matInput [formControl]=\"itemFilter\">\n\t\t</mat-form-field>\n\t\t<button mat-button type=\"button\" (click)=\"clearFilter()\" [disabled]=\"data.selected.length == 0 && itemFilter.value == ''\" >Clear Filter</button>\n\n\t\t<button *ngIf=\"format=='number'\" mat-button type=\"button\" [matMenuTriggerFor]=\"number_filterMenu\" [ngClass]=\"(data.selected.length > 0 && data.selected[0].hasOwnProperty('opr') && data.selected[0].hasOwnProperty('val'))? 'x-active' : ''\">Number Filter</button>\n\t\t<mat-menu #number_filterMenu>\n\t\t\t<ng-container *ngFor=\"let item of number_filters | keyvalue : asIsOrder; let i = index\">\n\t\t\t\t<button mat-menu-item (click)=\"selectNumberFilter(item.key)\" [ngClass]=\"(data.selected.length > 0 && item.key == data.selected[0].predef) ? 'x-active' : ''\">{{item.value.replace(\"$\",\"\")}}</button>\n\t\t\t\t<mat-divider *ngIf=\"item.value.substr(-1) == '$'\"></mat-divider>\n\t\t\t</ng-container>\n\t\t</mat-menu>\n\n\t\t<!--button mat-button type=\"button\" (click)=\"openNumberDialog()\" *ngIf=\"format=='number'\" [ngClass]=\"(data.selected.length > 0 && data.selected[0].hasOwnProperty('opr') && data.selected[0].hasOwnProperty('val'))? 'x-active' : ''\" >Number Filter</button-->\n\n\t\t<!--mat-form-field *ngIf=\"format=='date' || format=='datetime'\">\n\t\t\t<mat-label>Date Filter</mat-label>\n\t\t\t<mat-select (selectionChange)=\"selectDateFilter($event)\">\n\t\t\t\t<mat-option *ngFor=\"let item of date_filters | keyvalue : asIsOrder; let i = index\" [value]=\"item.key\">{{item.value}}</mat-option>\n\t\t\t</mat-select>\n\t\t</mat-form-field-->\n\n\t\t<button *ngIf=\"format=='date' || format=='datetime'\" mat-button type=\"button\" [matMenuTriggerFor]=\"date_filterMenu\" [ngClass]=\"(data.selected.length > 0 && data.selected[0].hasOwnProperty('opr') && data.selected[0].hasOwnProperty('val'))? 'x-active' : ''\">Date Filter</button>\n\t\t<mat-menu #date_filterMenu>\n\t\t\t<ng-container *ngFor=\"let item of date_filters | keyvalue : asIsOrder; let i = index\">\n\t\t\t<button mat-menu-item (click)=\"selectDateFilter(item.key)\" [ngClass]=\"(data.selected.length > 0 && item.key == data.selected[0].predef) ? 'x-active' : ''\">{{item.value.replace(\"$\",\"\")}}</button>\n\t\t\t<mat-divider *ngIf=\"item.value.substr(-1) == '$'\"></mat-divider>\n\t\t\t</ng-container>\n\t\t</mat-menu>\n\n\t\t<!--button mat-button type=\"button\" (click)=\"openDateDialog()\" *ngIf=\"format=='date' || format=='datetime'\" [ngClass]=\"(data.selected.length > 0 && data.selected[0].hasOwnProperty('opr') && data.selected[0].hasOwnProperty('val'))? 'x-active' : ''\" >Date Filter</button-->\n\n\t\t<button *ngIf=\"format=='string'\" mat-button type=\"button\" [matMenuTriggerFor]=\"text_filterMenu\" [ngClass]=\"(data.selected.length > 0 && data.selected[0].hasOwnProperty('opr') && data.selected[0].hasOwnProperty('val'))? 'x-active' : ''\">Text Filter</button>\n\t\t<mat-menu #text_filterMenu>\n\t\t\t<ng-container *ngFor=\"let item of text_filters | keyvalue : asIsOrder; let i = index\">\n\t\t\t\t<button mat-menu-item (click)=\"selectTextFilter(item.key)\" [ngClass]=\"(data.selected.length > 0 && item.key == data.selected[0].predef) ? 'x-active' : ''\">{{item.value.replace(\"$\",\"\")}}</button>\n\t\t\t\t<mat-divider *ngIf=\"item.value.substr(-1) == '$'\"></mat-divider>\n\t\t\t</ng-container>\n\t\t</mat-menu>\n\n\t\t<!--button mat-button type=\"button\" (click)=\"openTextDialog()\" *ngIf=\"format=='string'\" [ngClass]=\"(data.selected.length > 0 && data.selected[0].hasOwnProperty('opr') && data.selected[0].hasOwnProperty('val(Select All) 'x-active' : ''\" >Text Filter</button-->\n\n\t\t<div class=\"loading-shade\" *ngIf=\"isLoadingResults\">\n\t\t    <mat-spinner *ngIf=\"isLoadingResults\"></mat-spinner>\n\t\t</div>\n\t\t<mat-checkbox #select_all (change)=\"toggleSelectAll()\">Select All</mat-checkbox>\n\t\t<mat-selection-list #list [style.display]=\"format=='date' ? 'none' : 'auto'\" >\n\t\t\t<!--mat-list-option #select_all value=\"select:all\" (click)=\"toggleSelectAll()\" [selected]=\"isDefaultSelected(item)\" >\n\t\t\t\t(Select All)\n\t\t\t</mat-list-option-->\n\t\t\t<mat-list-option *ngFor=\"let item of list_items\" [value]=\"item\" (click)=\"toggleItem(item, selected)\" [selected]=\"isDefaultSelected(item)\" [ngClass]=\"format=='number' ? 'number' : ''\" >\n\t\t\t\t{{formatItem(format, item)}}\n\t\t\t</mat-list-option>\n\t\t</mat-selection-list>\n\t\t<app-xfilter-dialog-tree *ngIf=\"format=='date'\" [items]=\"list_items\" [list]=\"list\" [select_all]=\"select_all\" [select_all_checked]=\"select_all_checked\"></app-xfilter-dialog-tree>\n\t</div>\n\t<div mat-dialog-actions>\n\t\t<button mat-button type=\"submit\" cdkFocusInitial>Ok</button>\n\t\t<button mat-button type=\"button\" (click)=\"onCancel()\">Cancel</button>\n\t</div>\n</form>\n"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/xfilter/xfilter.component.html":
/*!**************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/xfilter/xfilter.component.html ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<button mat-icon-button aria-label=\"Filter\" (click)=\"openDialog()\" [class]=\"'mat-icon-button ' + (selected.length? 'x-active' : '')\">\n\t<mat-icon class=\"icon-filter\">filter_list</mat-icon>\n</button>\n"

/***/ }),

/***/ "./src/app/account/login.component.scss":
/*!**********************************************!*\
  !*** ./src/app/account/login.component.scss ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".main-div {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-pack: center;\n          justify-content: center;\n  -webkit-box-align: center;\n          align-items: center;\n}\n\n::ng-deep .mat-sidenav-content {\n  background: url('pertamina.png') no-repeat !important;\n  background-position-x: right !important;\n  background-position-y: bottom !important;\n}\n\nmat-card {\n  margin: 2em;\n  width: 300px;\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-pack: center;\n          justify-content: center;\n  -webkit-box-align: center;\n          align-items: center;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n          flex-direction: column;\n}\n\nmat-progress-bar {\n  width: 332px;\n  margin: -16px 0 16px 0 !important;\n}\n\nmat-form-field {\n  width: 250px;\n}\n\n::ng-deep .mat-card-header-text {\n  margin-left: 0 !important;\n  margin-right: 0 !important;\n}\n\nmat-card-actions {\n  margin-left: 0;\n  margin-right: 0;\n}\n\n/* Absolute Center Spinner */\n\n.loading-indicator {\n  position: fixed;\n  z-index: 999;\n  height: 100vh;\n  width: 100%;\n  overflow: show;\n  margin: auto;\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-pack: center;\n          justify-content: center;\n  -webkit-box-align: center;\n          align-items: center;\n}\n\n/* Transparent Overlay\nmat-spinner:before {\n  content: '';\n  display: block;\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background-color: rgba(0,0,0,0.3);\n} */\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvYWNjb3VudC9EOlxccGVwLWFwcF9uZXdcXHNzY1xcQ2xpZW50QXBwL3NyY1xcYXBwXFxhY2NvdW50XFxsb2dpbi5jb21wb25lbnQuc2NzcyIsInNyYy9hcHAvYWNjb3VudC9sb2dpbi5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLG9CQUFBO0VBQUEsYUFBQTtFQUNBLHdCQUFBO1VBQUEsdUJBQUE7RUFDQSx5QkFBQTtVQUFBLG1CQUFBO0FDQ0Y7O0FERUE7RUFDRSxxREFBQTtFQUNBLHVDQUFBO0VBQ0Esd0NBQUE7QUNDRjs7QURHQTtFQUNDLFdBQUE7RUFDQSxZQUFBO0VBQ0Esb0JBQUE7RUFBQSxhQUFBO0VBQ0Msd0JBQUE7VUFBQSx1QkFBQTtFQUNBLHlCQUFBO1VBQUEsbUJBQUE7RUFDQSw0QkFBQTtFQUFBLDZCQUFBO1VBQUEsc0JBQUE7QUNBRjs7QURHQTtFQUNDLFlBQUE7RUFDQSxpQ0FBQTtBQ0FEOztBREdBO0VBQ0csWUFBQTtBQ0FIOztBREdBO0VBQ0MseUJBQUE7RUFDQSwwQkFBQTtBQ0FEOztBRE9BO0VBQ0MsY0FBQTtFQUNBLGVBQUE7QUNKRDs7QURPQSw0QkFBQTs7QUFDQTtFQUNFLGVBQUE7RUFDQSxZQUFBO0VBQ0EsYUFBQTtFQUNBLFdBQUE7RUFDQSxjQUFBO0VBQ0EsWUFBQTtFQUNBLG9CQUFBO0VBQUEsYUFBQTtFQUNBLHdCQUFBO1VBQUEsdUJBQUE7RUFDQSx5QkFBQTtVQUFBLG1CQUFBO0FDSkY7O0FET0E7Ozs7Ozs7Ozs7R0FBQSIsImZpbGUiOiJzcmMvYXBwL2FjY291bnQvbG9naW4uY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIubWFpbi1kaXZ7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xufVxuXG46Om5nLWRlZXAgLm1hdC1zaWRlbmF2LWNvbnRlbnQge1xuICBiYWNrZ3JvdW5kOiB1cmwoXCJzcmMvYXNzZXRzL2ltYWdlL3BlcnRhbWluYS5wbmdcIikgbm8tcmVwZWF0ICFpbXBvcnRhbnQ7XG4gIGJhY2tncm91bmQtcG9zaXRpb24teDogcmlnaHQgIWltcG9ydGFudDtcbiAgYmFja2dyb3VuZC1wb3NpdGlvbi15OiBib3R0b20gIWltcG9ydGFudDtcbn1cblxuXG5tYXQtY2FyZCB7IFxuXHRtYXJnaW46IDJlbTtcblx0d2lkdGg6IDMwMHB4O1xuXHRkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbn1cblxubWF0LXByb2dyZXNzLWJhciB7XG5cdHdpZHRoOiAzMzJweDtcblx0bWFyZ2luOiAtMTZweCAwIDE2cHggMCAhaW1wb3J0YW50O1xufVxuXG5tYXQtZm9ybS1maWVsZCB7XG4gICB3aWR0aDogMjUwcHg7XG59XG5cbjo6bmctZGVlcCAubWF0LWNhcmQtaGVhZGVyLXRleHQge1xuXHRtYXJnaW4tbGVmdDogMCAhaW1wb3J0YW50O1xuXHRtYXJnaW4tcmlnaHQ6IDAgIWltcG9ydGFudDtcbn1cblxubWF0LWNhcmQtY29udGVudCB7XG5cdFxufVxuXG5tYXQtY2FyZC1hY3Rpb25zIHtcblx0bWFyZ2luLWxlZnQ6IDA7XG5cdG1hcmdpbi1yaWdodDogMDtcbn1cblxuLyogQWJzb2x1dGUgQ2VudGVyIFNwaW5uZXIgKi9cbi5sb2FkaW5nLWluZGljYXRvciB7XG4gIHBvc2l0aW9uOiBmaXhlZDtcbiAgei1pbmRleDogOTk5O1xuICBoZWlnaHQ6IDEwMHZoO1xuICB3aWR0aDogMTAwJTtcbiAgb3ZlcmZsb3c6IHNob3c7XG4gIG1hcmdpbjogYXV0bztcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG59XG5cbi8qIFRyYW5zcGFyZW50IE92ZXJsYXlcbm1hdC1zcGlubmVyOmJlZm9yZSB7XG4gIGNvbnRlbnQ6ICcnO1xuICBkaXNwbGF5OiBibG9jaztcbiAgcG9zaXRpb246IGZpeGVkO1xuICB0b3A6IDA7XG4gIGxlZnQ6IDA7XG4gIHdpZHRoOiAxMDAlO1xuICBoZWlnaHQ6IDEwMCU7XG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwwLDAsMC4zKTtcbn0gKi9cbiIsIi5tYWluLWRpdiB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xufVxuXG46Om5nLWRlZXAgLm1hdC1zaWRlbmF2LWNvbnRlbnQge1xuICBiYWNrZ3JvdW5kOiB1cmwoXCJzcmMvYXNzZXRzL2ltYWdlL3BlcnRhbWluYS5wbmdcIikgbm8tcmVwZWF0ICFpbXBvcnRhbnQ7XG4gIGJhY2tncm91bmQtcG9zaXRpb24teDogcmlnaHQgIWltcG9ydGFudDtcbiAgYmFja2dyb3VuZC1wb3NpdGlvbi15OiBib3R0b20gIWltcG9ydGFudDtcbn1cblxubWF0LWNhcmQge1xuICBtYXJnaW46IDJlbTtcbiAgd2lkdGg6IDMwMHB4O1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbn1cblxubWF0LXByb2dyZXNzLWJhciB7XG4gIHdpZHRoOiAzMzJweDtcbiAgbWFyZ2luOiAtMTZweCAwIDE2cHggMCAhaW1wb3J0YW50O1xufVxuXG5tYXQtZm9ybS1maWVsZCB7XG4gIHdpZHRoOiAyNTBweDtcbn1cblxuOjpuZy1kZWVwIC5tYXQtY2FyZC1oZWFkZXItdGV4dCB7XG4gIG1hcmdpbi1sZWZ0OiAwICFpbXBvcnRhbnQ7XG4gIG1hcmdpbi1yaWdodDogMCAhaW1wb3J0YW50O1xufVxuXG5tYXQtY2FyZC1hY3Rpb25zIHtcbiAgbWFyZ2luLWxlZnQ6IDA7XG4gIG1hcmdpbi1yaWdodDogMDtcbn1cblxuLyogQWJzb2x1dGUgQ2VudGVyIFNwaW5uZXIgKi9cbi5sb2FkaW5nLWluZGljYXRvciB7XG4gIHBvc2l0aW9uOiBmaXhlZDtcbiAgei1pbmRleDogOTk5O1xuICBoZWlnaHQ6IDEwMHZoO1xuICB3aWR0aDogMTAwJTtcbiAgb3ZlcmZsb3c6IHNob3c7XG4gIG1hcmdpbjogYXV0bztcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG59XG5cbi8qIFRyYW5zcGFyZW50IE92ZXJsYXlcbm1hdC1zcGlubmVyOmJlZm9yZSB7XG4gIGNvbnRlbnQ6ICcnO1xuICBkaXNwbGF5OiBibG9jaztcbiAgcG9zaXRpb246IGZpeGVkO1xuICB0b3A6IDA7XG4gIGxlZnQ6IDA7XG4gIHdpZHRoOiAxMDAlO1xuICBoZWlnaHQ6IDEwMCU7XG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwwLDAsMC4zKTtcbn0gKi8iXX0= */"

/***/ }),

/***/ "./src/app/account/login.component.ts":
/*!********************************************!*\
  !*** ./src/app/account/login.component.ts ***!
  \********************************************/
/*! exports provided: LoginComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoginComponent", function() { return LoginComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _auth_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../auth.service */ "./src/app/auth.service.ts");
/* harmony import */ var _navigation_title_title_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../navigation/title/title.service */ "./src/app/navigation/title/title.service.ts");






//import { Company } from '../company';

var LoginComponent = /** @class */ (function () {
    function LoginComponent(authService, formBuilder, snackBar, titleService, http) {
        this.authService = authService;
        this.formBuilder = formBuilder;
        this.snackBar = snackBar;
        this.titleService = titleService;
        this.http = http;
        this.submitting = false;
    }
    LoginComponent.prototype.onSubmit = function () {
        var _this = this;
        this.submitting = true;
        this.snackBar.dismiss();
        this.loginForm.disable();
        this.authService.login({
            company_id: this.loginForm.controls.company_id.value,
            username: this.loginForm.controls.username.value,
            password: this.loginForm.controls.password.value
        }).subscribe(function (res) {
            if (res["errMsg"]) {
                _this.snackBar.open(res["errMsg"], 'dismiss');
            }
            _this.submitting = false;
            _this.loginForm.enable();
        }, function (error) {
            _this.snackBar.open(error, 'dismiss');
            _this.submitting = false;
            _this.loginForm.enable();
        });
    };
    Object.defineProperty(LoginComponent.prototype, "f", {
        get: function () { return this.loginForm.controls; },
        enumerable: true,
        configurable: true
    });
    LoginComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.titleService.titleSource.next(null);
        this.loginForm = this.formBuilder.group({
            company_id: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].required],
            username: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].required],
            password: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].required],
        });
        this.http.get('api/account/company').subscribe(function (res) {
            _this.companies = res.items;
            _this.loginForm.controls.company_id.setValue(_this.companies[0]._id);
        });
    };
    ;
    LoginComponent.ctorParameters = function () { return [
        { type: _auth_service__WEBPACK_IMPORTED_MODULE_5__["AuthService"] },
        { type: _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormBuilder"] },
        { type: _angular_material__WEBPACK_IMPORTED_MODULE_4__["MatSnackBar"] },
        { type: _navigation_title_title_service__WEBPACK_IMPORTED_MODULE_6__["TitleService"] },
        { type: _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"] }
    ]; };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])()
    ], LoginComponent.prototype, "companies", void 0);
    LoginComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-login',
            template: __webpack_require__(/*! raw-loader!./login.component.html */ "./node_modules/raw-loader/index.js!./src/app/account/login.component.html"),
            styles: [__webpack_require__(/*! ./login.component.scss */ "./src/app/account/login.component.scss")]
        })
    ], LoginComponent);
    return LoginComponent;
}());



/***/ }),

/***/ "./src/app/account/logout.component.scss":
/*!***********************************************!*\
  !*** ./src/app/account/logout.component.scss ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".loading-shade {\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  background: rgba(0, 0, 0, 0.15);\n  z-index: 999;\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n  -webkit-box-pack: center;\n          justify-content: center;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvYWNjb3VudC9EOlxccGVwLWFwcF9uZXdcXHNzY1xcQ2xpZW50QXBwL3NyY1xcYXBwXFxhY2NvdW50XFxsb2dvdXQuY29tcG9uZW50LnNjc3MiLCJzcmMvYXBwL2FjY291bnQvbG9nb3V0LmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0Usa0JBQUE7RUFDQSxNQUFBO0VBQ0EsT0FBQTtFQUNBLFNBQUE7RUFDQSxRQUFBO0VBQ0EsK0JBQUE7RUFDQSxZQUFBO0VBQ0Esb0JBQUE7RUFBQSxhQUFBO0VBQ0EseUJBQUE7VUFBQSxtQkFBQTtFQUNBLHdCQUFBO1VBQUEsdUJBQUE7QUNDRiIsImZpbGUiOiJzcmMvYXBwL2FjY291bnQvbG9nb3V0LmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLmxvYWRpbmctc2hhZGUge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogMDtcbiAgbGVmdDogMDtcbiAgYm90dG9tOiAwO1xuICByaWdodDogMDtcbiAgYmFja2dyb3VuZDogcmdiYSgwLCAwLCAwLCAwLjE1KTtcbiAgei1pbmRleDogOTk5O1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbn0iLCIubG9hZGluZy1zaGFkZSB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiAwO1xuICBsZWZ0OiAwO1xuICBib3R0b206IDA7XG4gIHJpZ2h0OiAwO1xuICBiYWNrZ3JvdW5kOiByZ2JhKDAsIDAsIDAsIDAuMTUpO1xuICB6LWluZGV4OiA5OTk7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xufSJdfQ== */"

/***/ }),

/***/ "./src/app/account/logout.component.ts":
/*!*********************************************!*\
  !*** ./src/app/account/logout.component.ts ***!
  \*********************************************/
/*! exports provided: LogoutComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LogoutComponent", function() { return LogoutComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _auth_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../auth.service */ "./src/app/auth.service.ts");




var LogoutComponent = /** @class */ (function () {
    function LogoutComponent(authService, snackBar) {
        this.authService = authService;
        this.snackBar = snackBar;
        this.loading = false;
    }
    LogoutComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.loading = true;
        this.snackBar.dismiss();
        this.authService.logout().subscribe(function (res) {
            if (res.errMsg) {
                _this.snackBar.open(res.errMsg, 'dismiss');
            }
            _this.loading = false;
        }, function (error) {
            _this.snackBar.open("Server error", 'dismiss');
            _this.loading = false;
        });
    };
    ;
    LogoutComponent.ctorParameters = function () { return [
        { type: _auth_service__WEBPACK_IMPORTED_MODULE_3__["AuthService"] },
        { type: _angular_material__WEBPACK_IMPORTED_MODULE_2__["MatSnackBar"] }
    ]; };
    LogoutComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-logout',
            template: __webpack_require__(/*! raw-loader!./logout.component.html */ "./node_modules/raw-loader/index.js!./src/app/account/logout.component.html"),
            styles: [__webpack_require__(/*! ./logout.component.scss */ "./src/app/account/logout.component.scss")]
        })
    ], LogoutComponent);
    return LogoutComponent;
}());



/***/ }),

/***/ "./src/app/app-routing.module.ts":
/*!***************************************!*\
  !*** ./src/app/app-routing.module.ts ***!
  \***************************************/
/*! exports provided: AppRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppRoutingModule", function() { return AppRoutingModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _auth_guard__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./auth.guard */ "./src/app/auth.guard.ts");
/* harmony import */ var _account_login_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./account/login.component */ "./src/app/account/login.component.ts");
/* harmony import */ var _selective_preloading_strategy_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./selective-preloading-strategy.service */ "./src/app/selective-preloading-strategy.service.ts");
/* harmony import */ var _account_logout_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./account/logout.component */ "./src/app/account/logout.component.ts");
/* harmony import */ var _location_location_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./location/location.component */ "./src/app/location/location.component.ts");
/* harmony import */ var _location_location_list_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./location/location-list.component */ "./src/app/location/location-list.component.ts");
/* harmony import */ var _location_location_add_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./location/location-add.component */ "./src/app/location/location-add.component.ts");
/* harmony import */ var _permission_guard__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./permission.guard */ "./src/app/permission.guard.ts");











var appRoutes = [
    { path: 'login', component: _account_login_component__WEBPACK_IMPORTED_MODULE_4__["LoginComponent"] },
    { path: 'dashboard', redirectTo: 'pe/dashboard', pathMatch: 'full' },
    { path: 'ssc', loadChildren: './ssc/ssc.module#SscModule', data: { preload: true, label: "SSC" } },
    { path: 'pe', loadChildren: './pe/pe.module#PeModule', data: { preload: true, label: "PE" } },
    { path: 'po', loadChildren: './po/po.module#PoModule', data: { preload: true, label: "PO" } },
    { path: 'wows', loadChildren: './wows/wows.module#PeModule', data: { preload: true, label: "WOWS" } },
    { path: 'logout', component: _account_logout_component__WEBPACK_IMPORTED_MODULE_6__["LogoutComponent"], canActivate: [_auth_guard__WEBPACK_IMPORTED_MODULE_3__["AuthGuard"]], outlet: "overlay" },
    { path: 'location', component: _location_location_component__WEBPACK_IMPORTED_MODULE_7__["LocationComponent"], children: [
            { path: 'list', component: _location_location_list_component__WEBPACK_IMPORTED_MODULE_8__["LocationListComponent"], canActivate: [_permission_guard__WEBPACK_IMPORTED_MODULE_10__["PermissionGuard"]] },
            { path: 'add', component: _location_location_add_component__WEBPACK_IMPORTED_MODULE_9__["LocationAddComponent"], canActivate: [_permission_guard__WEBPACK_IMPORTED_MODULE_10__["PermissionGuard"]] },
            { path: '', redirectTo: 'list', pathMatch: "full" },
        ] },
    { path: '', redirectTo: 'pe/dashboard', pathMatch: 'full' },
];
var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            imports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forRoot(appRoutes, {
                    enableTracing: false,
                    preloadingStrategy: _selective_preloading_strategy_service__WEBPACK_IMPORTED_MODULE_5__["SelectivePreloadingStrategyService"],
                })],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"]]
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());



/***/ }),

/***/ "./src/app/app.component.scss":
/*!************************************!*\
  !*** ./src/app/app.component.scss ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "mat-sidenav-container, mat-sidenav-content, mat-sidenav {\n  min-height: 100vh;\n  overflow: hidden;\n}\n\nmat-sidenav {\n  width: 250px;\n}\n\na {\n  text-decoration: none;\n  color: white;\n}\n\na:hover,\na:active {\n  color: lightgray;\n}\n\n.navigation-items {\n  list-style: none;\n  cursor: pointer;\n}\n\n.icon {\n  vertical-align: middle;\n}\n\n.label {\n  -webkit-box-flex: 1;\n          flex: 1 1 auto;\n}\n\n.container {\n  position: relative;\n  min-height: 200px;\n  margin: 1em 2em;\n}\n\n.fullWindow {\n  margin: 0 !important;\n  padding: 10px;\n}\n\n.container-top-bar {\n  /*position: relative;*/\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-pack: start;\n          justify-content: flex-start;\n  -webkit-box-align: center;\n          align-items: center;\n}\n\n.container-top-bar button {\n  margin: 16px;\n}\n\n.container-content {\n  position: relative;\n  min-height: 200px;\n}\n\nmat-toolbar {\n  height: 65px;\n}\n\n.mat-toolbar.mat-primary {\n  background: #ed2626;\n  color: #fff;\n}\n\n.mat-display-1 {\n  color: black;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvRDpcXHBlcC1hcHBfbmV3XFxzc2NcXENsaWVudEFwcC9zcmNcXGFwcFxcYXBwLmNvbXBvbmVudC5zY3NzIiwic3JjL2FwcC9hcHAuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxpQkFBQTtFQUNBLGdCQUFBO0FDQ0Y7O0FERUE7RUFDRSxZQUFBO0FDQ0Y7O0FERUE7RUFDRSxxQkFBQTtFQUNBLFlBQUE7QUNDRjs7QURFQTs7RUFFRSxnQkFBQTtBQ0NGOztBREVBO0VBQ0UsZ0JBQUE7RUFDQSxlQUFBO0FDQ0Y7O0FERUE7RUFDRSxzQkFBQTtBQ0NGOztBREVBO0VBQ0UsbUJBQUE7VUFBQSxjQUFBO0FDQ0Y7O0FERUE7RUFDRSxrQkFBQTtFQUNBLGlCQUFBO0VBQ0EsZUFBQTtBQ0NGOztBREVBO0VBQ0Usb0JBQUE7RUFDQSxhQUFBO0FDQ0Y7O0FERUE7RUFDRSxzQkFBQTtFQUNBLG9CQUFBO0VBQUEsYUFBQTtFQUNBLHVCQUFBO1VBQUEsMkJBQUE7RUFDQSx5QkFBQTtVQUFBLG1CQUFBO0FDQ0Y7O0FERUE7RUFDRSxZQUFBO0FDQ0Y7O0FERUE7RUFDRSxrQkFBQTtFQUNBLGlCQUFBO0FDQ0Y7O0FERUE7RUFDRSxZQUFBO0FDQ0Y7O0FERUE7RUFDRSxtQkFBQTtFQUNBLFdBQUE7QUNDRjs7QURFQTtFQUNFLFlBQUE7QUNDRiIsImZpbGUiOiJzcmMvYXBwL2FwcC5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIm1hdC1zaWRlbmF2LWNvbnRhaW5lciwgbWF0LXNpZGVuYXYtY29udGVudCwgbWF0LXNpZGVuYXYge1xuICBtaW4taGVpZ2h0OiAxMDB2aDtcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcbn1cblxubWF0LXNpZGVuYXYge1xuICB3aWR0aDogMjUwcHg7XG59XG5cbmEge1xuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XG4gIGNvbG9yOiB3aGl0ZTtcbn1cblxuYTpob3ZlcixcbmE6YWN0aXZlIHtcbiAgY29sb3I6IGxpZ2h0Z3JheTtcbn1cblxuLm5hdmlnYXRpb24taXRlbXMge1xuICBsaXN0LXN0eWxlOiBub25lO1xuICBjdXJzb3I6IHBvaW50ZXI7XG59XG5cbi5pY29uIHtcbiAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcbn1cblxuLmxhYmVsIHtcbiAgZmxleDogMSAxIGF1dG87XG59XG5cbi5jb250YWluZXIge1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIG1pbi1oZWlnaHQ6IDIwMHB4O1xuICBtYXJnaW46IDFlbSAyZW07XG59XG5cbi5mdWxsV2luZG93IHtcbiAgbWFyZ2luOiAwICFpbXBvcnRhbnQ7XG4gIHBhZGRpbmcgOiAxMHB4O1xufVxuXG4uY29udGFpbmVyLXRvcC1iYXIge1xuICAvKnBvc2l0aW9uOiByZWxhdGl2ZTsqL1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtc3RhcnQ7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG59XG5cbi5jb250YWluZXItdG9wLWJhciBidXR0b24ge1xuICBtYXJnaW46IDE2cHg7XG59XG5cbi5jb250YWluZXItY29udGVudCB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgbWluLWhlaWdodDogMjAwcHg7XG59XG5cbm1hdC10b29sYmFyIHtcbiAgaGVpZ2h0OiA2NXB4O1xufVxuXG4ubWF0LXRvb2xiYXIubWF0LXByaW1hcnkge1xuICBiYWNrZ3JvdW5kOiAjZWQyNjI2O1xuICBjb2xvcjogI2ZmZjtcbn1cblxuLm1hdC1kaXNwbGF5LTEge1xyXG4gIGNvbG9yIDogYmxhY2s7XHJcbn1cblxuXG4iLCJtYXQtc2lkZW5hdi1jb250YWluZXIsIG1hdC1zaWRlbmF2LWNvbnRlbnQsIG1hdC1zaWRlbmF2IHtcbiAgbWluLWhlaWdodDogMTAwdmg7XG4gIG92ZXJmbG93OiBoaWRkZW47XG59XG5cbm1hdC1zaWRlbmF2IHtcbiAgd2lkdGg6IDI1MHB4O1xufVxuXG5hIHtcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xuICBjb2xvcjogd2hpdGU7XG59XG5cbmE6aG92ZXIsXG5hOmFjdGl2ZSB7XG4gIGNvbG9yOiBsaWdodGdyYXk7XG59XG5cbi5uYXZpZ2F0aW9uLWl0ZW1zIHtcbiAgbGlzdC1zdHlsZTogbm9uZTtcbiAgY3Vyc29yOiBwb2ludGVyO1xufVxuXG4uaWNvbiB7XG4gIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XG59XG5cbi5sYWJlbCB7XG4gIGZsZXg6IDEgMSBhdXRvO1xufVxuXG4uY29udGFpbmVyIHtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBtaW4taGVpZ2h0OiAyMDBweDtcbiAgbWFyZ2luOiAxZW0gMmVtO1xufVxuXG4uZnVsbFdpbmRvdyB7XG4gIG1hcmdpbjogMCAhaW1wb3J0YW50O1xuICBwYWRkaW5nOiAxMHB4O1xufVxuXG4uY29udGFpbmVyLXRvcC1iYXIge1xuICAvKnBvc2l0aW9uOiByZWxhdGl2ZTsqL1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtc3RhcnQ7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG59XG5cbi5jb250YWluZXItdG9wLWJhciBidXR0b24ge1xuICBtYXJnaW46IDE2cHg7XG59XG5cbi5jb250YWluZXItY29udGVudCB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgbWluLWhlaWdodDogMjAwcHg7XG59XG5cbm1hdC10b29sYmFyIHtcbiAgaGVpZ2h0OiA2NXB4O1xufVxuXG4ubWF0LXRvb2xiYXIubWF0LXByaW1hcnkge1xuICBiYWNrZ3JvdW5kOiAjZWQyNjI2O1xuICBjb2xvcjogI2ZmZjtcbn1cblxuLm1hdC1kaXNwbGF5LTEge1xuICBjb2xvcjogYmxhY2s7XG59Il19 */"

/***/ }),

/***/ "./src/app/app.component.ts":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _auth_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./auth.service */ "./src/app/auth.service.ts");
/* harmony import */ var _permission_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./permission.service */ "./src/app/permission.service.ts");
/* harmony import */ var _navigation_panel_panel__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./navigation/panel/panel */ "./src/app/navigation/panel/panel.ts");
/* harmony import */ var _common_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./common.service */ "./src/app/common.service.ts");






var AppComponent = /** @class */ (function () {
    function AppComponent(authService, permissionService, commonService) {
        var _this = this;
        this.authService = authService;
        this.permissionService = permissionService;
        this.commonService = commonService;
        this.title = 'PEP';
        this.authService.currentUser.subscribe(function (res) {
            _this.currentUser = res;
            _this.root = [
                //	new PanelItem("Home", "", "home", this.permissionService.passPermission("")),
                //	new PanelItem("Employee", "employee", "dashboard", this.permissionService.passPermission("employee")),
                //	new PanelItem("Enum", "enum", "dashboard", this.permissionService.passPermission("enum")),
                //	new PanelItem("Location", "location", "dashboard", this.permissionService.passPermission("location")),
                new _navigation_panel_panel__WEBPACK_IMPORTED_MODULE_4__["PanelItem"]("Logout", "logout", "input", _this.permissionService.passPermission("logout"), false, [], { overlay: "logout" }),
            ];
        });
    }
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.commonService.swMessage.subscribe(function (width) {
            _this.screenWidth = width;
        });
        this.commonService.fsMessage.subscribe(function (res) {
            try {
                if (res === true) {
                    var docElmWithBrowsersFullScreenFunctions = document.documentElement;
                    if (docElmWithBrowsersFullScreenFunctions.requestFullscreen) {
                        docElmWithBrowsersFullScreenFunctions.requestFullscreen();
                    }
                    else if (docElmWithBrowsersFullScreenFunctions.mozRequestFullScreen) { /* Firefox */
                        docElmWithBrowsersFullScreenFunctions.mozRequestFullScreen();
                    }
                    else if (docElmWithBrowsersFullScreenFunctions.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
                        docElmWithBrowsersFullScreenFunctions.webkitRequestFullscreen();
                    }
                    else if (docElmWithBrowsersFullScreenFunctions.msRequestFullscreen) { /* IE/Edge */
                        docElmWithBrowsersFullScreenFunctions.msRequestFullscreen();
                    }
                }
                else if (res === false && _this.fullWindow) {
                    var docWithBrowsersExitFunctions = document;
                    if (docWithBrowsersExitFunctions.exitFullscreen) {
                        docWithBrowsersExitFunctions.exitFullscreen();
                    }
                    else if (docWithBrowsersExitFunctions.mozCancelFullScreen) { /* Firefox */
                        docWithBrowsersExitFunctions.mozCancelFullScreen();
                    }
                    else if (docWithBrowsersExitFunctions.webkitExitFullscreen) { /* Chrome, Safari and Opera */
                        docWithBrowsersExitFunctions.webkitExitFullscreen();
                    }
                    else if (docWithBrowsersExitFunctions.msExitFullscreen) { /* IE/Edge */
                        docWithBrowsersExitFunctions.msExitFullscreen();
                    }
                }
                _this.fullWindow = res;
            }
            catch (e) {
            }
        });
    };
    AppComponent.prototype.passPermission = function (url) {
        return this.permissionService.passPermission(url);
    };
    AppComponent.ctorParameters = function () { return [
        { type: _auth_service__WEBPACK_IMPORTED_MODULE_2__["AuthService"] },
        { type: _permission_service__WEBPACK_IMPORTED_MODULE_3__["PermissionService"] },
        { type: _common_service__WEBPACK_IMPORTED_MODULE_5__["CommonService"] }
    ]; };
    AppComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-root',
            template: __webpack_require__(/*! raw-loader!./app.component.html */ "./node_modules/raw-loader/index.js!./src/app/app.component.html"),
            styles: [__webpack_require__(/*! ./app.component.scss */ "./src/app/app.component.scss")]
        })
    ], AppComponent);
    return AppComponent;
}());



/***/ }),

/***/ "./src/app/app.module.ts":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _angular_flex_layout__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/flex-layout */ "./node_modules/@angular/flex-layout/esm5/flex-layout.es5.js");
/* harmony import */ var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/platform-browser/animations */ "./node_modules/@angular/platform-browser/fesm5/animations.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_common_locales_id__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/common/locales/id */ "./node_modules/@angular/common/locales/id.js");
/* harmony import */ var _angular_common_locales_id__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_angular_common_locales_id__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _app_routing_module__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./app-routing.module */ "./src/app/app-routing.module.ts");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./app.component */ "./src/app/app.component.ts");
/* harmony import */ var _material_material_module__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./material/material.module */ "./src/app/material/material.module.ts");
/* harmony import */ var _xfilter_xfilter_module__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./xfilter/xfilter.module */ "./src/app/xfilter/xfilter.module.ts");
/* harmony import */ var _navigation_panel_panel_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./navigation/panel/panel.component */ "./src/app/navigation/panel/panel.component.ts");
/* harmony import */ var _navigation_header_header_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./navigation/header/header.component */ "./src/app/navigation/header/header.component.ts");
/* harmony import */ var _navigation_title_title_component__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./navigation/title/title.component */ "./src/app/navigation/title/title.component.ts");
/* harmony import */ var _snackbar_component__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./snackbar.component */ "./src/app/snackbar.component.ts");
/* harmony import */ var _account_login_component__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./account/login.component */ "./src/app/account/login.component.ts");
/* harmony import */ var _account_logout_component__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./account/logout.component */ "./src/app/account/logout.component.ts");
/* harmony import */ var _dashboard_dashboard_component__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./dashboard/dashboard.component */ "./src/app/dashboard/dashboard.component.ts");
/* harmony import */ var _location_location_component__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./location/location.component */ "./src/app/location/location.component.ts");
/* harmony import */ var _location_location_list_component__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./location/location-list.component */ "./src/app/location/location-list.component.ts");
/* harmony import */ var _location_location_add_component__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./location/location-add.component */ "./src/app/location/location-add.component.ts");
/* harmony import */ var _xfilter_xfilter_component__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./xfilter/xfilter.component */ "./src/app/xfilter/xfilter.component.ts");
/* harmony import */ var _auth_interceptor__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./auth.interceptor */ "./src/app/auth.interceptor.ts");











Object(_angular_common__WEBPACK_IMPORTED_MODULE_7__["registerLocaleData"])(_angular_common_locales_id__WEBPACK_IMPORTED_MODULE_8___default.a, 'id');




















var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["NgModule"])({
            declarations: [
                _app_component__WEBPACK_IMPORTED_MODULE_10__["AppComponent"],
                _navigation_panel_panel_component__WEBPACK_IMPORTED_MODULE_13__["PanelComponent"],
                _navigation_header_header_component__WEBPACK_IMPORTED_MODULE_14__["HeaderComponent"],
                _navigation_title_title_component__WEBPACK_IMPORTED_MODULE_15__["TitleComponent"],
                _snackbar_component__WEBPACK_IMPORTED_MODULE_16__["SnackbarComponent"],
                _account_login_component__WEBPACK_IMPORTED_MODULE_17__["LoginComponent"],
                _account_logout_component__WEBPACK_IMPORTED_MODULE_18__["LogoutComponent"],
                _dashboard_dashboard_component__WEBPACK_IMPORTED_MODULE_19__["DashboardComponent"],
                _location_location_component__WEBPACK_IMPORTED_MODULE_20__["LocationComponent"],
                _location_location_list_component__WEBPACK_IMPORTED_MODULE_21__["LocationListComponent"],
                _location_location_add_component__WEBPACK_IMPORTED_MODULE_22__["LocationAddComponent"],
                _location_location_list_component__WEBPACK_IMPORTED_MODULE_21__["LocationDeleteDialogComponent"]
            ],
            imports: [
                _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__["BrowserModule"],
                _app_routing_module__WEBPACK_IMPORTED_MODULE_9__["AppRoutingModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormsModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_3__["ReactiveFormsModule"],
                _angular_common_http__WEBPACK_IMPORTED_MODULE_4__["HttpClientModule"],
                _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_6__["BrowserAnimationsModule"],
                _material_material_module__WEBPACK_IMPORTED_MODULE_11__["MaterialModule"],
                _angular_flex_layout__WEBPACK_IMPORTED_MODULE_5__["FlexLayoutModule"],
                _xfilter_xfilter_module__WEBPACK_IMPORTED_MODULE_12__["xFilterModule"],
            ],
            providers: [
                { provide: _angular_common_http__WEBPACK_IMPORTED_MODULE_4__["HTTP_INTERCEPTORS"], useClass: _auth_interceptor__WEBPACK_IMPORTED_MODULE_24__["AuthInterceptor"], multi: true },
                { provide: _angular_core__WEBPACK_IMPORTED_MODULE_2__["LOCALE_ID"], useValue: 'id-ID' }
            ],
            bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_10__["AppComponent"]],
            entryComponents: [
                _xfilter_xfilter_component__WEBPACK_IMPORTED_MODULE_23__["xFilterDialogComponent"],
                _xfilter_xfilter_component__WEBPACK_IMPORTED_MODULE_23__["xFilterDialogNumberComponent"],
                _xfilter_xfilter_component__WEBPACK_IMPORTED_MODULE_23__["xFilterDialogDateComponent"],
                _xfilter_xfilter_component__WEBPACK_IMPORTED_MODULE_23__["xFilterDialogTextComponent"],
                _location_location_list_component__WEBPACK_IMPORTED_MODULE_21__["LocationDeleteDialogComponent"],
            ],
        })
    ], AppModule);
    return AppModule;
}());



/***/ }),

/***/ "./src/app/auth.guard.ts":
/*!*******************************!*\
  !*** ./src/app/auth.guard.ts ***!
  \*******************************/
/*! exports provided: AuthGuard */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthGuard", function() { return AuthGuard; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _auth_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./auth.service */ "./src/app/auth.service.ts");




var AuthGuard = /** @class */ (function () {
    function AuthGuard(router, authService) {
        var _this = this;
        this.router = router;
        this.authService = authService;
        this.authService.currentUser.subscribe(function (res) { return _this.currentUser = res; });
    }
    AuthGuard.prototype.canActivate = function (route, state) {
        //console.log(route);
        //const currentUser = this.authenticationService.currentUserValue;
        if (this.currentUser != null) {
            // authorised so return true
            return true;
        }
        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
    };
    AuthGuard.ctorParameters = function () { return [
        { type: _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"] },
        { type: _auth_service__WEBPACK_IMPORTED_MODULE_3__["AuthService"] }
    ]; };
    AuthGuard = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root'
        })
    ], AuthGuard);
    return AuthGuard;
}());



/***/ }),

/***/ "./src/app/auth.interceptor.ts":
/*!*************************************!*\
  !*** ./src/app/auth.interceptor.ts ***!
  \*************************************/
/*! exports provided: AuthInterceptor */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthInterceptor", function() { return AuthInterceptor; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _snackbar_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./snackbar.service */ "./src/app/snackbar.service.ts");







var AuthInterceptor = /** @class */ (function () {
    function AuthInterceptor(router, snackbarService) {
        this.router = router;
        this.snackbarService = snackbarService;
    }
    AuthInterceptor.prototype.intercept = function (request, next) {
        var _this = this;
        return next.handle(request).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["tap"])(function () { }, function (err) {
            if (err instanceof _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpErrorResponse"]) {
                if (err.status !== 401) {
                    return;
                }
                _this.router.navigate([{ outlets: { overlay: "logout" } }]);
                _this.snackbarService.status.next(new _snackbar_service__WEBPACK_IMPORTED_MODULE_5__["SnackbarApi"](true, 'Your session has been ended. Please re-login.', 'dismiss'));
            }
        }));
    };
    AuthInterceptor.ctorParameters = function () { return [
        { type: _angular_router__WEBPACK_IMPORTED_MODULE_4__["Router"] },
        { type: _snackbar_service__WEBPACK_IMPORTED_MODULE_5__["SnackbarService"] }
    ]; };
    AuthInterceptor = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])()
    ], AuthInterceptor);
    return AuthInterceptor;
}());



/***/ }),

/***/ "./src/app/auth.service.ts":
/*!*********************************!*\
  !*** ./src/app/auth.service.ts ***!
  \*********************************/
/*! exports provided: AuthService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthService", function() { return AuthService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");






//import { Company } from './company';
var AuthService = /** @class */ (function () {
    function AuthService(http, active, router) {
        this.http = http;
        this.active = active;
        this.router = router;
        this.currentUserSubject = new rxjs__WEBPACK_IMPORTED_MODULE_3__["BehaviorSubject"](JSON.parse(sessionStorage.getItem('currentUser')));
    }
    Object.defineProperty(AuthService.prototype, "currentUser", {
        get: function () {
            return this.currentUserSubject.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    AuthService.prototype.login = function (login) {
        var _this = this;
        return this.http.post('api/account/login', login)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])(function (res) {
            // login successful if there's a jwt token in the response
            if (res.user) { // && user.token
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                sessionStorage.setItem('currentUser', JSON.stringify(res.user));
                _this.currentUserSubject.next(res.user);
                _this.router.navigate([_this.active.snapshot.queryParams['returnUrl'] ? _this.active.snapshot.queryParams['returnUrl'] : '']);
            }
            if (res.timezone) {
                sessionStorage.setItem('serverTimezone', JSON.stringify(res.timezone));
            }
            return res;
        }, function (error) {
            return error;
        }));
    };
    AuthService.prototype.logout = function () {
        var _this = this;
        return this.http.get('api/account/logout')
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])(function (res) {
            if (res.errMsg == null) {
                sessionStorage.removeItem('currentUser');
                sessionStorage.removeItem('serverTimezone');
                _this.currentUserSubject.next(null);
                _this.router.navigate([{ outlets: { overlay: null } }])
                    .then(function (_) { return _this.router.navigate(['/login']); });
                //this.router.navigate(['/login', {outlets: {overlay:null}}]);
            }
            return res;
        }, function (error) {
            _this.router.navigate([{ outlets: { overlay: null } }]);
            return error;
        }));
    };
    AuthService.ctorParameters = function () { return [
        { type: _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"] },
        { type: _angular_router__WEBPACK_IMPORTED_MODULE_5__["ActivatedRoute"] },
        { type: _angular_router__WEBPACK_IMPORTED_MODULE_5__["Router"] }
    ]; };
    AuthService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root'
        })
    ], AuthService);
    return AuthService;
}());



/***/ }),

/***/ "./src/app/common.service.ts":
/*!***********************************!*\
  !*** ./src/app/common.service.ts ***!
  \***********************************/
/*! exports provided: CommonService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CommonService", function() { return CommonService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _navigation_panel_panel_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./navigation/panel/panel.service */ "./src/app/navigation/panel/panel.service.ts");





var CommonService = /** @class */ (function () {
    function CommonService(http, panelService) {
        var _this = this;
        this.http = http;
        this.panelService = panelService;
        this.messageFs = new rxjs__WEBPACK_IMPORTED_MODULE_3__["BehaviorSubject"](false);
        this.fsMessage = this.messageFs.asObservable();
        this.messageSw = new rxjs__WEBPACK_IMPORTED_MODULE_3__["BehaviorSubject"](window.innerWidth);
        this.messageSh = new rxjs__WEBPACK_IMPORTED_MODULE_3__["BehaviorSubject"](window.innerHeight);
        this.swMessage = this.messageSw.asObservable();
        this.shMessage = this.messageSh.asObservable();
        this.fsMessage.subscribe(function (res) {
            _this.fullWindow = res;
        });
        window.addEventListener('resize', function (event) {
            _this.messageSw.next(window.innerWidth);
            _this.messageSh.next(window.innerHeight);
            console.log(window.innerWidth);
            console.log(window.innerHeight);
        });
        this.swMessage.subscribe(function (width) {
            _this.screenWidth = width;
            console.log(width);
        });
        this.shMessage.subscribe(function (height) {
            _this.screenHeight = height;
            console.log(height);
        });
    }
    CommonService.prototype.onResize = function (event) {
        this.messageSw.next(event.target.innerWidth);
        this.messageSh.next(event.target.innerHeight);
    };
    CommonService.prototype.convertUTCtoLocal = function (date) {
        var newDate = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
        return newDate;
    };
    CommonService.prototype.toggleFullwindow = function () {
        this.messageFs.next(!this.fullWindow);
    };
    CommonService.prototype.isFullWindow = function () {
        return this.fullWindow;
    };
    CommonService.prototype.getGridData = function (url, sort, order, page, pagesize, filter, columnfilter, mode, httpOption) {
        if (pagesize === void 0) { pagesize = 50; }
        if (mode === void 0) { mode = ""; }
        if (httpOption === void 0) { httpOption = {}; }
        var params = {};
        if (sort != null)
            params["sort"] = sort;
        if (order != null)
            params["order"] = order;
        if (page != null)
            params["page"] = page.toString();
        if (pagesize != null)
            params["pagesize"] = pagesize.toString();
        if (filter != null)
            params["filter"] = filter;
        if (Object.keys(columnfilter).length > 0)
            params["columnfilter"] = JSON.stringify(columnfilter);
        if (mode != null)
            params["mode"] = mode;
        httpOption["params"] = params;
        return this.http.get(url, httpOption);
    };
    Object.defineProperty(CommonService.prototype, "Math", {
        get: function () {
            return Math;
        },
        enumerable: true,
        configurable: true
    });
    CommonService.ctorParameters = function () { return [
        { type: _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"] },
        { type: _navigation_panel_panel_service__WEBPACK_IMPORTED_MODULE_4__["PanelService"] }
    ]; };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["HostListener"])('window:resize', ['$event'])
    ], CommonService.prototype, "onResize", null);
    CommonService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root'
        })
    ], CommonService);
    return CommonService;
}());



/***/ }),

/***/ "./src/app/dashboard/dashboard.component.scss":
/*!****************************************************!*\
  !*** ./src/app/dashboard/dashboard.component.scss ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".container {\n  /*position: relative;*/\n  min-height: 200px;\n  margin: 2em;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvZGFzaGJvYXJkL0Q6XFxwZXAtYXBwX25ld1xcc3NjXFxDbGllbnRBcHAvc3JjXFxhcHBcXGRhc2hib2FyZFxcZGFzaGJvYXJkLmNvbXBvbmVudC5zY3NzIiwic3JjL2FwcC9kYXNoYm9hcmQvZGFzaGJvYXJkLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0Usc0JBQUE7RUFDQSxpQkFBQTtFQUNBLFdBQUE7QUNDRiIsImZpbGUiOiJzcmMvYXBwL2Rhc2hib2FyZC9kYXNoYm9hcmQuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIuY29udGFpbmVyIHtcbiAgLypwb3NpdGlvbjogcmVsYXRpdmU7Ki9cbiAgbWluLWhlaWdodDogMjAwcHg7XG4gIG1hcmdpbjogMmVtO1xufSIsIi5jb250YWluZXIge1xuICAvKnBvc2l0aW9uOiByZWxhdGl2ZTsqL1xuICBtaW4taGVpZ2h0OiAyMDBweDtcbiAgbWFyZ2luOiAyZW07XG59Il19 */"

/***/ }),

/***/ "./src/app/dashboard/dashboard.component.ts":
/*!**************************************************!*\
  !*** ./src/app/dashboard/dashboard.component.ts ***!
  \**************************************************/
/*! exports provided: DashboardComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DashboardComponent", function() { return DashboardComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _auth_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../auth.service */ "./src/app/auth.service.ts");
/* harmony import */ var _navigation_title_title_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../navigation/title/title.service */ "./src/app/navigation/title/title.service.ts");




var DashboardComponent = /** @class */ (function () {
    function DashboardComponent(authService, titleService) {
        var _this = this;
        this.authService = authService;
        this.titleService = titleService;
        this.titleService.titleSource.next(null);
        this.authService.currentUser.subscribe(function (res) {
            _this.currentUser = res;
            console.log(_this.currentUser);
        });
    }
    DashboardComponent.prototype.ngOnInit = function () {
    };
    DashboardComponent.prototype.logout = function () {
        this.authService.logout().subscribe(function (res) {
            if (res.errMsg) {
                //this.snackBar.open(res.errMsg, 'dismiss');
            }
            //this.loading = false; 
        }, function (error) {
            //this.snackBar.open("Server error", 'dismiss');
            //this.loading = false; 
        });
    };
    DashboardComponent.ctorParameters = function () { return [
        { type: _auth_service__WEBPACK_IMPORTED_MODULE_2__["AuthService"] },
        { type: _navigation_title_title_service__WEBPACK_IMPORTED_MODULE_3__["TitleService"] }
    ]; };
    DashboardComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-dashboard',
            template: __webpack_require__(/*! raw-loader!./dashboard.component.html */ "./node_modules/raw-loader/index.js!./src/app/dashboard/dashboard.component.html"),
            styles: [__webpack_require__(/*! ./dashboard.component.scss */ "./src/app/dashboard/dashboard.component.scss")]
        })
    ], DashboardComponent);
    return DashboardComponent;
}());



/***/ }),

/***/ "./src/app/dialog.service.ts":
/*!***********************************!*\
  !*** ./src/app/dialog.service.ts ***!
  \***********************************/
/*! exports provided: DialogService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DialogService", function() { return DialogService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");



/**
 * Async modal dialog service
 * DialogService makes this app easier to test by faking this service.
 * TODO: better modal implementation that doesn't use window.confirm
 */
var DialogService = /** @class */ (function () {
    function DialogService() {
    }
    /**
     * Ask user to confirm an action. `message` explains the action and choices.
     * Returns observable resolving to `true`=confirm or `false`=cancel
     */
    DialogService.prototype.confirm = function (message) {
        var confirmation = window.confirm(message || 'Is it OK?');
        return Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["of"])(confirmation);
    };
    ;
    DialogService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root',
        })
    ], DialogService);
    return DialogService;
}());



/***/ }),

/***/ "./src/app/location/location-add.component.ts":
/*!****************************************************!*\
  !*** ./src/app/location/location-add.component.ts ***!
  \****************************************************/
/*! exports provided: LocationAddComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LocationAddComponent", function() { return LocationAddComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _snackbar_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../snackbar.service */ "./src/app/snackbar.service.ts");
/* harmony import */ var _dialog_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../dialog.service */ "./src/app/dialog.service.ts");
/* harmony import */ var _navigation_title_title_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../navigation/title/title.service */ "./src/app/navigation/title/title.service.ts");






//import { Location }    from './location';




var LocationAddComponent = /** @class */ (function () {
    function LocationAddComponent(formBuilder, router, snackbarService, dialogService, titleService, http) {
        this.formBuilder = formBuilder;
        this.router = router;
        this.snackbarService = snackbarService;
        this.dialogService = dialogService;
        this.titleService = titleService;
        this.http = http;
        //company = ['PT Pertamina EP', 'PT Pertamina (Persero)'];
        this.loading = false;
        this.isUploading = false;
        this.isLoading = false;
        this.isSaving = false;
        this.modified_count = 0;
        this.created_count = 0;
        this.data_mode = "all";
        this.resultsLength = 0;
        this.data = [];
        this.data_error_count = 0;
        this.displayedColumns = ["info", "id", "name", "parent_id", "path", "type"];
    }
    LocationAddComponent.prototype.onSubmit = function () {
        this.loading = true;
        //this.snackBar.dismiss();
        this.snackbarService.status.next(new _snackbar_service__WEBPACK_IMPORTED_MODULE_6__["SnackbarApi"](false));
        this.locationForm.disable();
    };
    Object.defineProperty(LocationAddComponent.prototype, "f", {
        get: function () { return this.locationForm.controls; },
        enumerable: true,
        configurable: true
    });
    LocationAddComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.titleService.titleSource.next({
            title: "Add Location",
            icon: "",
            breadcrumbs: [
                { label: 'Location', routerLink: '' },
                { label: 'Add', routerLink: '' },
            ]
        });
        this.locationForm = this.formBuilder.group({
            //location_id: ['', Validators.required],
            location_id: [''],
            is_anchor: [''],
        });
        this.paginator.page.subscribe(function () { return _this.loadData(); });
        //this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    };
    ;
    LocationAddComponent.prototype.listLocation = function () {
        this.router.navigate(['location', 'list']);
    };
    LocationAddComponent.prototype.canDeactivate = function () {
        if (this.locationForm.pristine) {
            return true;
        }
        return this.dialogService.confirm('Discard changes?');
    };
    LocationAddComponent.prototype.handleFile = function (event) {
        this.progressPercent = null;
        this.fileName = event.target.files[0].name;
        var reader = new FileReader();
        // tslint:disable-next-line:no-shadowed-variable
        reader.onload = function (event) {
            //this.image = event.target.result;
        };
        reader.readAsDataURL(event.target.files[0]);
    };
    LocationAddComponent.prototype.onUpload = function () {
        var _this = this;
        var fd = new FormData();
        this.isUploading = true;
        fd.append('files', this.fileInput.nativeElement.files[0]);
        this.http.post('/api/location/UploadFiles', fd, {
            reportProgress: true,
            observe: 'events'
        })
            .subscribe(function (event) {
            if (event.type === _angular_common_http__WEBPACK_IMPORTED_MODULE_5__["HttpEventType"].UploadProgress) {
                _this.progressPercent = Math.round((event.loaded / event.total) * 100);
            }
            else if (event.type === _angular_common_http__WEBPACK_IMPORTED_MODULE_5__["HttpEventType"].Response) {
                _this.isUploading = false;
                //this.data = event.body['items'];
                _this.data_error_count = event.body['error_count'];
                _this.tmp_id = event.body['_id'];
                _this.stepper.selected.completed = true;
                _this.stepper.next();
                _this.loadData();
                if (_this.data_error_count > 0)
                    _this.snackbarService.status.next(new _snackbar_service__WEBPACK_IMPORTED_MODULE_6__["SnackbarApi"](true, "There are " + _this.data_error_count + " error(s) in your data.", 'dismiss'));
            }
        });
    };
    LocationAddComponent.prototype.loadData = function () {
        var _this = this;
        this.isLoading = true;
        var httpOption = {
            params: {
                _id: this.tmp_id,
                page: this.paginator.pageIndex.toString(),
                pageSize: this.paginator.pageSize.toString(),
                mode: this.data_mode
            }
        };
        this.http.get('/api/location/Tmp', httpOption).subscribe(function (res) {
            _this.isLoading = false;
            _this.data = res['items'];
            _this.data_error_count = res['error_count'];
            _this.resultsLength = res['total_count'];
            //if(this.data_error_count > 0) this.snackbarService.status.next(new SnackbarApi(true, "There are "+this.data_error_count+" error(s) in your data.", 'dismiss'));
        }, function (error) {
            _this.isLoading = false;
            _this.snackbarService.status.next(new _snackbar_service__WEBPACK_IMPORTED_MODULE_6__["SnackbarApi"](true, error['message'], 'dismiss'));
            console.log(error);
        });
    };
    LocationAddComponent.prototype.saveData = function () {
        var _this = this;
        this.isSaving = true;
        this.http.get('/api/location/SaveData', { params: { _id: this.tmp_id } }).subscribe(function (res) {
            _this.isSaving = false;
            _this.modified_count = res["modified_count"];
            _this.created_count = res["created_count"];
            _this.stepper.selected.completed = true;
            _this.stepper.next();
            _this.snackbarService.status.next(new _snackbar_service__WEBPACK_IMPORTED_MODULE_6__["SnackbarApi"](true, res["total_count"] + " item(s) saved successfully.", 'dismiss'));
        }, function (error) {
            _this.isSaving = false;
            _this.snackbarService.status.next(new _snackbar_service__WEBPACK_IMPORTED_MODULE_6__["SnackbarApi"](true, error['message'], 'dismiss'));
            console.log(error);
        });
    };
    LocationAddComponent.prototype.resetData = function () {
        this.isUploading = false;
        this.isLoading = false;
        this.isSaving = false;
        this.modified_count = 0;
        this.created_count = 0;
        this.progressPercent = 0;
        this.fileName = "";
        this.data = [];
        this.data_error_count = 0;
        this.resultsLength = 0;
        this.tmp_id = null;
        this.data_mode = "all";
        this.snackbarService.status.next(new _snackbar_service__WEBPACK_IMPORTED_MODULE_6__["SnackbarApi"](false));
    };
    LocationAddComponent.prototype.formatInterval = function (arr) {
        return arr.map(function (a) { return a.join("-"); }).join(", ");
    };
    LocationAddComponent.prototype.unloadNotification = function ($event) {
        return this.locationForm.pristine;
    };
    LocationAddComponent.ctorParameters = function () { return [
        { type: _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormBuilder"] },
        { type: _angular_router__WEBPACK_IMPORTED_MODULE_4__["Router"] },
        { type: _snackbar_service__WEBPACK_IMPORTED_MODULE_6__["SnackbarService"] },
        { type: _dialog_service__WEBPACK_IMPORTED_MODULE_7__["DialogService"] },
        { type: _navigation_title_title_service__WEBPACK_IMPORTED_MODULE_8__["TitleService"] },
        { type: _angular_common_http__WEBPACK_IMPORTED_MODULE_5__["HttpClient"] }
    ]; };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])()
    ], LocationAddComponent.prototype, "locations", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('fileInput', { static: true })
    ], LocationAddComponent.prototype, "fileInput", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('stepper', { static: true })
    ], LocationAddComponent.prototype, "stepper", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])(_angular_material__WEBPACK_IMPORTED_MODULE_3__["MatPaginator"], { static: true })
    ], LocationAddComponent.prototype, "paginator", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])(_angular_material__WEBPACK_IMPORTED_MODULE_3__["MatSort"], { static: true })
    ], LocationAddComponent.prototype, "sort", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["HostListener"])('window:beforeunload', ['$event'])
    ], LocationAddComponent.prototype, "unloadNotification", null);
    LocationAddComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-location-add',
            template: __webpack_require__(/*! raw-loader!./location-add.component.html */ "./node_modules/raw-loader/index.js!./src/app/location/location-add.component.html"),
            styles: [__webpack_require__(/*! ./location.scss */ "./src/app/location/location.scss")]
        })
    ], LocationAddComponent);
    return LocationAddComponent;
}());



/***/ }),

/***/ "./src/app/location/location-list.component.ts":
/*!*****************************************************!*\
  !*** ./src/app/location/location-list.component.ts ***!
  \*****************************************************/
/*! exports provided: LocationListComponent, MatTableApi, LocationDeleteDialogComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LocationListComponent", function() { return LocationListComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MatTableApi", function() { return MatTableApi; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LocationDeleteDialogComponent", function() { return LocationDeleteDialogComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _angular_material_table__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material/table */ "./node_modules/@angular/material/esm5/table.es5.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_cdk_collections__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/cdk/collections */ "./node_modules/@angular/cdk/esm5/collections.es5.js");
/* harmony import */ var _snackbar_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../snackbar.service */ "./src/app/snackbar.service.ts");
/* harmony import */ var _permission_service__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../permission.service */ "./src/app/permission.service.ts");
/* harmony import */ var _navigation_title_title_service__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../navigation/title/title.service */ "./src/app/navigation/title/title.service.ts");
/* harmony import */ var _xfilter_xfilter_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../xfilter/xfilter.component */ "./src/app/xfilter/xfilter.component.ts");
/* harmony import */ var _common_service__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../common.service */ "./src/app/common.service.ts");
















var LocationListComponent = /** @class */ (function () {
    function LocationListComponent(http, router, dialog, 
    //public snackBar: MatSnackBar,
    //private locationService: LocationService,
    snackbarService, permissionService, titleService, route, xfilterService, commonService) {
        this.http = http;
        this.router = router;
        this.dialog = dialog;
        this.snackbarService = snackbarService;
        this.permissionService = permissionService;
        this.titleService = titleService;
        this.route = route;
        this.xfilterService = xfilterService;
        this.commonService = commonService;
        this.displayedColumns = ["tree", "id", "parent_id", "path", "type", "select"];
        this.data = [];
        this.dataSource = new _angular_material_table__WEBPACK_IMPORTED_MODULE_4__["MatTableDataSource"](this.data);
        this.selection = new _angular_cdk_collections__WEBPACK_IMPORTED_MODULE_9__["SelectionModel"](true, []);
        this.isEditing = false;
        this.resultsLength = 0;
        this.isLoadingResults = true;
        this.isRateLimitReached = false;
        this.submitting = false;
        this.filterControl = new _angular_forms__WEBPACK_IMPORTED_MODULE_7__["FormControl"]('');
        this.id_xSelected = [];
        this.name_xSelected = [];
        this.parent_id_xSelected = [];
        this.path_xSelected = [];
        this.type_xSelected = [];
        this.expand_xSelected = [];
    }
    LocationListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.titleService.titleSource.next({
            title: "Location",
            icon: "",
            breadcrumbs: [
                { label: 'Location', routerLink: '' }
            ]
        });
        var p_start_submitDate = this.route.snapshot.paramMap.get('start_submitDate');
        if (p_start_submitDate != null && p_start_submitDate.length > 0) {
            //this.start_submitDate = isNaN(Number(p_start_submitDate)) ? new Date(Date.parse(p_start_submitDate)) : new Date(Number(p_start_submitDate));
            this.start_submitDate = Number(p_start_submitDate);
            console.log(this.start_submitDate);
        }
        var p_end_submitDate = this.route.snapshot.paramMap.get('end_submitDate');
        if (p_end_submitDate != null && p_end_submitDate.length > 0) {
            //this.end_submitDate = isNaN(Number(p_end_submitDate)) ? new Date(Date.parse(p_end_submitDate)) : new Date(Number(p_end_submitDate));
            this.end_submitDate = Number(p_end_submitDate);
            console.log(this.end_submitDate);
        }
        this.group = this.route.snapshot.paramMap.get('group');
        this.status = this.route.snapshot.paramMap.get('status');
        // If the user changes the sort order, reset back to the first page.
        this.sort.sortChange.subscribe(function () { return _this.paginator.pageIndex = 0; });
        this.filterSubscription = this.xfilterService.filter.subscribe(function (res) {
            if (res)
                _this.getColumnValues(res);
        });
        this.selectedSubscription = this.xfilterService.selected.subscribe(function (res) {
            _this[res["column"] + "_xSelected"] = res["selected"];
        });
        this.listSubscription = Object(rxjs__WEBPACK_IMPORTED_MODULE_5__["merge"])(this.sort.sortChange, this.paginator.page, this.filterControl.valueChanges.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["debounceTime"])(300)), this.xfilterService.selected).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["startWith"])({}), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["switchMap"])(function () {
            _this.isLoadingResults = true;
            var columnfilter = _this.getColumnFilter();
            return _this.commonService.getGridData('/api/location', _this.sort.active, _this.sort.direction, _this.paginator.pageIndex, _this.paginator.pageSize, _this.filterControl.value, columnfilter);
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["map"])(function (data) {
            // Flip flag to show that loading has finished.
            _this.isLoadingResults = false;
            _this.isRateLimitReached = false;
            _this.resultsLength = data.total_count;
            return data.items;
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["catchError"])(function () {
            _this.isLoadingResults = false;
            // Catch if the GitHub API has reached its rate limit. Return empty data.
            _this.isRateLimitReached = true;
            return Object(rxjs__WEBPACK_IMPORTED_MODULE_5__["of"])([]);
        })).subscribe(function (data) {
            _this.data = data;
            _this.dataSource = new _angular_material_table__WEBPACK_IMPORTED_MODULE_4__["MatTableDataSource"](_this.data);
            _this.selection.clear();
        });
    };
    LocationListComponent.prototype.ngOnDestroy = function () {
        this.filterSubscription.unsubscribe();
        this.selectedSubscription.unsubscribe();
        this.listSubscription.unsubscribe();
    };
    LocationListComponent.prototype.passPermission = function (path) {
        return this.permissionService.passPermission(path);
    };
    LocationListComponent.prototype.exportExcel = function () {
        var _this = this;
        var httpOption = {
            observe: 'response',
            headers: new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpHeaders"]({
                'Content-Type': 'application/json'
            }),
            responseType: 'arraybuffer'
        };
        this.isLoadingResults = true;
        var columnfilter = this.getColumnFilter();
        this.commonService.getGridData('/api/location', this.sort.active, this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize, this.filterControl.value, columnfilter, "excel", httpOption).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["map"])(function (res) {
            _this.isLoadingResults = false;
            return {
                filename: 'Location.xlsx',
                data: new Blob([res['body']], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
            };
        })).subscribe(function (res) {
            if (window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveBlob(res.data, res.filename);
            }
            else {
                var link = window.URL.createObjectURL(res.data);
                var a = document.createElement('a');
                document.body.appendChild(a);
                a.setAttribute('style', 'display: none');
                a.href = link;
                a.download = res.filename;
                a.click();
                window.URL.revokeObjectURL(link);
                a.remove();
            }
        }, function (error) {
            _this.isLoadingResults = false;
            _this.snackbarService.status.next(new _snackbar_service__WEBPACK_IMPORTED_MODULE_10__["SnackbarApi"](true, error['message'], 'dismiss'));
            console.log(error);
        }, function () {
            console.log('Completed file download.');
        });
    };
    LocationListComponent.prototype.getColumnValues = function (param) {
        var _this = this;
        var column = param["column"];
        var filter = param["filter"];
        var selected = param["selected"];
        var clear = param["clear"];
        var columnfilter = this.getColumnFilter();
        if (filter)
            columnfilter[column] = [filter];
        if (selected && selected.length > 0)
            columnfilter[column] = selected.map(function (s) { return "^" + s + "$"; });
        if (clear)
            delete columnfilter[column];
        return this.commonService.getGridData('/api/location', this.sort.active, this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize, this.filterControl.value, columnfilter, column).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["map"])(function (res) {
            return res;
        })).subscribe(function (res) {
            _this.xfilterService.updateItems({ column: column, items: res.items });
        }, function () {
        });
    };
    LocationListComponent.prototype.getColumnFilter = function () {
        var columnfilter = {};
        if (this.id_xSelected.length)
            columnfilter["id"] = this.id_xSelected;
        if (this.name_xSelected.length)
            columnfilter["name"] = this.name_xSelected; //.map(s => "^"+s+"$");
        if (this.parent_id_xSelected.length)
            columnfilter["parent_id"] = this.parent_id_xSelected;
        if (this.path_xSelected.length)
            columnfilter["path"] = this.path_xSelected;
        if (this.type_xSelected.length)
            columnfilter["type"] = this.type_xSelected;
        if (this.expand_xSelected.length)
            columnfilter["expand"] = this.expand_xSelected;
        console.log(this.expand_xSelected);
        //if(this.start_submitDate) columnfilter['start_submitDate'] = this.start_submitDate;// - date.getTimezoneOffset()*60*1000;//.getTime();
        //if(this.end_submitDate) columnfilter['end_submitDate'] = this.end_submitDate;// - date.getTimezoneOffset()*60*1000;//.getTime();
        //if(this.group) columnfilter['group'] = this.group;
        //if(this.status) columnfilter['status'] = this.status;
        return columnfilter;
    };
    LocationListComponent.prototype.formatInterval = function (arr) {
        return arr.map(function (a) { return a.join("-"); }).join(", ");
    };
    /** Whether the number of selected elements matches the total number of rows. */
    LocationListComponent.prototype.isAllSelected = function () {
        var numSelected = this.selection.selected.length;
        var numRows = this.dataSource.data.length;
        return numSelected === numRows;
    };
    /** Selects all rows if they are not all selected; otherwise clear selection. */
    LocationListComponent.prototype.masterToggle = function () {
        var _this = this;
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSource.data.forEach(function (row) { return _this.selection.select(row); });
    };
    /** The label for the checkbox on the passed row */
    LocationListComponent.prototype.checkboxLabel = function (row) {
        if (!row) {
            return (this.isAllSelected() ? 'select' : 'deselect') + " all";
        }
        return (this.selection.isSelected(row) ? 'deselect' : 'select') + " row " + row.presence_user_workday_cycle_id;
    };
    LocationListComponent.prototype.deleteSelected = function () {
        var _this = this;
        this.snackbarService.status.next(new _snackbar_service__WEBPACK_IMPORTED_MODULE_10__["SnackbarApi"](false));
        var dialogRef = this.dialog.open(LocationDeleteDialogComponent, {
            width: '250px',
            data: this.selection.selected.length
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result) {
                _this.isLoadingResults = true;
                _this.snackbarService.status.next(new _snackbar_service__WEBPACK_IMPORTED_MODULE_10__["SnackbarApi"](false));
                _this.http.delete('/api/location', {
                    headers: new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpHeaders"]({
                        'Content-Type': 'application/json'
                    }),
                    params: {
                        _ids: _this.selection.selected.map(function (s) { return s._id; })
                    }
                }).subscribe(function (res) {
                    _this.isLoadingResults = false;
                    _this.snackbarService.status.next(new _snackbar_service__WEBPACK_IMPORTED_MODULE_10__["SnackbarApi"](true, res["deleted_count"] + " item(s) deleted successfully.", "dismiss"));
                    _this.paginator._changePageSize(_this.paginator.pageSize);
                }, function (error) {
                    _this.isLoadingResults = false;
                    _this.snackbarService.status.next(new _snackbar_service__WEBPACK_IMPORTED_MODULE_10__["SnackbarApi"](true, error['message'], "dismiss"));
                });
            }
        });
    };
    LocationListComponent.prototype.treeToggle = function (row) {
        var _this = this;
        this.expand_xSelected = this.expand_xSelected.filter(function (e) { return e != row.id; });
        if (row.expand != 1) {
            this.commonService.getGridData('/api/location', null, null, null, 999999, null, { parent_id: [row.id] }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["map"])(function (res) {
                _this.isLoadingResults = false;
                return res.items;
            })).subscribe(function (data) {
                var _a;
                (_a = _this.data).splice.apply(_a, tslib__WEBPACK_IMPORTED_MODULE_0__["__spread"]([_this.data.map(function (d) { return d.id; }).indexOf(row.id) + 1, 0], data));
                _this.data = _this.data.slice();
                _this.dataSource = new _angular_material_table__WEBPACK_IMPORTED_MODULE_4__["MatTableDataSource"](_this.data);
                _this.selection.clear();
                _this.expand_xSelected.push(row.id);
                row.expand = 1;
            });
        }
        else {
            this.data = this.data.filter(function (d) { return d.path.join(",").indexOf(row.path.concat([row.id]).join(",")) == -1; });
            row.expand = 0;
        }
    };
    LocationListComponent.ctorParameters = function () { return [
        { type: _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"] },
        { type: _angular_router__WEBPACK_IMPORTED_MODULE_8__["Router"] },
        { type: _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatDialog"] },
        { type: _snackbar_service__WEBPACK_IMPORTED_MODULE_10__["SnackbarService"] },
        { type: _permission_service__WEBPACK_IMPORTED_MODULE_11__["PermissionService"] },
        { type: _navigation_title_title_service__WEBPACK_IMPORTED_MODULE_12__["TitleService"] },
        { type: _angular_router__WEBPACK_IMPORTED_MODULE_8__["ActivatedRoute"] },
        { type: _xfilter_xfilter_component__WEBPACK_IMPORTED_MODULE_13__["xFilterService"] },
        { type: _common_service__WEBPACK_IMPORTED_MODULE_14__["CommonService"] }
    ]; };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ViewChild"])(_angular_material__WEBPACK_IMPORTED_MODULE_3__["MatPaginator"], { static: true })
    ], LocationListComponent.prototype, "paginator", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ViewChild"])(_angular_material__WEBPACK_IMPORTED_MODULE_3__["MatSort"], { static: true })
    ], LocationListComponent.prototype, "sort", void 0);
    LocationListComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Component"])({
            selector: 'location-list',
            template: __webpack_require__(/*! raw-loader!./location-list.component.html */ "./node_modules/raw-loader/index.js!./src/app/location/location-list.component.html"),
            styles: [__webpack_require__(/*! ./location.scss */ "./src/app/location/location.scss")]
        })
    ], LocationListComponent);
    return LocationListComponent;
}());

/*export interface Location {
  PE_TICKET_ID: number;
  ASSET_ID: number;
  ASSET_NAME: string;
}*/
var MatTableApi = /** @class */ (function () {
    function MatTableApi(sort, order, page, pagesize, filter) {
        this.sort = sort;
        this.order = order;
        this.page = page;
        this.pagesize = pagesize;
        this.filter = filter;
    }
    MatTableApi.ctorParameters = function () { return [
        { type: String },
        { type: String },
        { type: Number },
        { type: Number },
        { type: String }
    ]; };
    return MatTableApi;
}());

var LocationDeleteDialogComponent = /** @class */ (function () {
    function LocationDeleteDialogComponent(dialogRef, data) {
        this.dialogRef = dialogRef;
        this.data = data;
    }
    LocationDeleteDialogComponent.prototype.onNoClick = function () {
        this.dialogRef.close();
    };
    LocationDeleteDialogComponent.prototype.onYesClick = function () {
        this.dialogRef.close();
    };
    LocationDeleteDialogComponent.ctorParameters = function () { return [
        { type: _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatDialogRef"] },
        { type: Number, decorators: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_2__["Inject"], args: [_angular_material__WEBPACK_IMPORTED_MODULE_3__["MAT_DIALOG_DATA"],] }] }
    ]; };
    LocationDeleteDialogComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Component"])({
            selector: 'app-location-delete-dialog',
            template: '<h1 mat-dialog-title>Confirm Delete</h1><div mat-dialog-content>  <p>Confirm delete {{data}} selected item ?</p></div><div mat-dialog-actions>  <button mat-button [mat-dialog-close]="1" >Yes</button> <button mat-button [mat-dialog-close]="0" cdkFocusInitial>No</button> </div>',
            styles: [__webpack_require__(/*! ./location.scss */ "./src/app/location/location.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__param"](1, Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Inject"])(_angular_material__WEBPACK_IMPORTED_MODULE_3__["MAT_DIALOG_DATA"]))
    ], LocationDeleteDialogComponent);
    return LocationDeleteDialogComponent;
}());



/***/ }),

/***/ "./src/app/location/location.component.ts":
/*!************************************************!*\
  !*** ./src/app/location/location.component.ts ***!
  \************************************************/
/*! exports provided: LocationComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LocationComponent", function() { return LocationComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");



var LocationComponent = /** @class */ (function () {
    function LocationComponent(snackBar) {
        this.snackBar = snackBar;
    }
    LocationComponent.ctorParameters = function () { return [
        { type: _angular_material__WEBPACK_IMPORTED_MODULE_2__["MatSnackBar"] }
    ]; };
    LocationComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-location',
            template: __webpack_require__(/*! raw-loader!./location.component.html */ "./node_modules/raw-loader/index.js!./src/app/location/location.component.html"),
            styles: [__webpack_require__(/*! ./location.scss */ "./src/app/location/location.scss")]
        })
    ], LocationComponent);
    return LocationComponent;
}());



/***/ }),

/***/ "./src/app/location/location.scss":
/*!****************************************!*\
  !*** ./src/app/location/location.scss ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ":host {\n  position: relative;\n  top: 5px;\n}\n\n:host ::ng-deep .container-top-bar {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-pack: end;\n          justify-content: flex-end;\n}\n\n:host ::ng-deep .container-top-bar button {\n  margin: 0;\n}\n\n:host ::ng-deep .container-content {\n  min-height: 200px;\n}\n\n:host ::ng-deep .top-flow {\n  position: relative;\n  top: -45px;\n}\n\n:host ::ng-deep .top-flow-xs {\n  position: relative;\n  top: -15px;\n  -webkit-box-pack: start;\n          justify-content: flex-start;\n}\n\n/* PE table */\n\n:host ::ng-deep .container-table {\n  /*position: relative;*/\n  max-height: 400px;\n  overflow: auto;\n}\n\n:host ::ng-deep .loading-shade {\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 56px;\n  right: 0;\n  background: rgba(0, 0, 0, 0.15);\n  z-index: 999;\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n  -webkit-box-pack: center;\n          justify-content: center;\n}\n\n:host ::ng-deep .common-table {\n  width: 100%;\n  border-top: 1px solid rgba(0, 0, 0, 0.12);\n}\n\n:host ::ng-deep .common-table .mat-header-row {\n  height: 40px;\n}\n\n:host ::ng-deep .common-table .mat-header-row:nth-child(2) .mat-header-cell {\n  top: 40px !important;\n}\n\n:host ::ng-deep .common-table .mat-header-row:nth-child(3) .mat-header-cell {\n  top: 80px !important;\n}\n\n:host ::ng-deep .common-table .mat-header-cell {\n  white-space: nowrap;\n  padding-right: 7px;\n  padding-left: 7px;\n  text-align: center;\n  border-right: 1px solid rgba(0, 0, 0, 0.12);\n}\n\n:host ::ng-deep .common-table .mat-sort-header {\n  padding-top: 0.625em;\n}\n\n:host ::ng-deep .common-table .mat-row {\n  height: 32px;\n}\n\n:host ::ng-deep .common-table .mat-cell {\n  white-space: nowrap;\n  padding-right: 7px;\n  padding-left: 7px;\n}\n\n:host ::ng-deep .common-table .cell-center {\n  text-align: center;\n}\n\n:host ::ng-deep .common-table .cell-right {\n  text-align: right;\n}\n\n:host ::ng-deep .common-table .cell-error {\n  color: red;\n}\n\n:host ::ng-deep .common-table .cell-warning {\n  color: orange;\n}\n\n:host ::ng-deep .common-table .mat-cell .mat-icon {\n  font-size: 18px;\n}\n\n:host ::ng-deep .common-table .mat-header-cell .mat-form-field {\n  width: auto;\n}\n\n:host ::ng-deep .input-hidden {\n  position: absolute;\n  width: 0px;\n  border: none;\n  height: 100%;\n}\n\n:host ::ng-deep .button-fw {\n  font-size: 24px;\n  /*position: absolute;\n  right: 0;\n  top: 0;*/\n  min-width: auto;\n  padding: 0;\n  margin-left: 6px;\n}\n\n:host ::ng-deep .tree-depth-1 {\n  padding-left: 27px !important;\n}\n\n:host ::ng-deep .tree-depth-2 {\n  padding-left: 47px !important;\n}\n\n:host ::ng-deep .tree-depth-3 {\n  padding-left: 67px !important;\n}\n\n:host ::ng-deep .tree-depth-4 {\n  padding-left: 87px !important;\n}\n\n:host ::ng-deep .tree-spacer {\n  color: white !important;\n}\n\n/* form */\n\nmat-card {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-pack: start;\n          justify-content: flex-start;\n  -webkit-box-align: start;\n          align-items: flex-start;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n          flex-direction: column;\n}\n\nmat-progress-bar {\n  width: 332px;\n  margin: -16px 0 16px 0 !important;\n}\n\nmat-form-field {\n  width: 250px;\n}\n\n::ng-deep .mat-card-header-text {\n  margin-left: 0 !important;\n  margin-right: 0 !important;\n}\n\nmat-card-actions {\n  margin-left: 0;\n  margin-right: 0;\n}\n\n/* Column Widths */\n\n.mat-column-number,\n.mat-column-state {\n  max-width: 64px;\n}\n\n.mat-column-created {\n  max-width: 124px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvbG9jYXRpb24vRDpcXHBlcC1hcHBfbmV3XFxzc2NcXENsaWVudEFwcC9zcmNcXGFwcFxcbG9jYXRpb25cXGxvY2F0aW9uLnNjc3MiLCJzcmMvYXBwL2xvY2F0aW9uL2xvY2F0aW9uLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxrQkFBQTtFQUNBLFFBQUE7QUNDRjs7QURFQTtFQUNFLG9CQUFBO0VBQUEsYUFBQTtFQUNBLHFCQUFBO1VBQUEseUJBQUE7QUNDRjs7QURFQTtFQUNFLFNBQUE7QUNDRjs7QURFQTtFQUNFLGlCQUFBO0FDQ0Y7O0FERUE7RUFDRSxrQkFBQTtFQUNBLFVBQUE7QUNDRjs7QURDQTtFQUNFLGtCQUFBO0VBQ0EsVUFBQTtFQUNBLHVCQUFBO1VBQUEsMkJBQUE7QUNFRjs7QURDQSxhQUFBOztBQUlFO0VBQ0Usc0JBQUE7RUFDQSxpQkFBQTtFQUNBLGNBQUE7QUNESjs7QURJRTtFQUNFLGtCQUFBO0VBQ0EsTUFBQTtFQUNBLE9BQUE7RUFDQSxZQUFBO0VBQ0EsUUFBQTtFQUNBLCtCQUFBO0VBQ0EsWUFBQTtFQUNBLG9CQUFBO0VBQUEsYUFBQTtFQUNBLHlCQUFBO1VBQUEsbUJBQUE7RUFDQSx3QkFBQTtVQUFBLHVCQUFBO0FDRko7O0FES0U7RUFDRSxXQUFBO0VBQ0EseUNBQUE7QUNISjs7QURNRTtFQUNFLFlBQUE7QUNKSjs7QURNRTtFQUNFLG9CQUFBO0FDSko7O0FETUU7RUFDRSxvQkFBQTtBQ0pKOztBRE9FO0VBQ0UsbUJBQUE7RUFDQSxrQkFBQTtFQUNBLGlCQUFBO0VBQ0Esa0JBQUE7RUFDQSwyQ0FBQTtBQ0xKOztBRFFFO0VBQ0Usb0JBQUE7QUNOSjs7QURTRTtFQUNFLFlBQUE7QUNQSjs7QURVRTtFQUNFLG1CQUFBO0VBQ0Esa0JBQUE7RUFDQSxpQkFBQTtBQ1JKOztBRFdFO0VBQ0Usa0JBQUE7QUNUSjs7QURXRTtFQUNFLGlCQUFBO0FDVEo7O0FEV0U7RUFDRSxVQUFBO0FDVEo7O0FEV0U7RUFDRSxhQUFBO0FDVEo7O0FEV0U7RUFDRSxlQUFBO0FDVEo7O0FEWUU7RUFDRSxXQUFBO0FDVko7O0FEYUU7RUFDRSxrQkFBQTtFQUNBLFVBQUE7RUFDQSxZQUFBO0VBQ0EsWUFBQTtBQ1hKOztBRGNFO0VBQ0UsZUFBQTtFQUNBOztVQUFBO0VBR0EsZUFBQTtFQUNBLFVBQUE7RUFDQSxnQkFBQTtBQ1pKOztBRGVFO0VBQ0UsNkJBQUE7QUNiSjs7QURlRTtFQUNFLDZCQUFBO0FDYko7O0FEZUU7RUFDRSw2QkFBQTtBQ2JKOztBRGVFO0VBQ0UsNkJBQUE7QUNiSjs7QURlRTtFQUNFLHVCQUFBO0FDYko7O0FEaUJBLFNBQUE7O0FBRUE7RUFDRSxvQkFBQTtFQUFBLGFBQUE7RUFDQSx1QkFBQTtVQUFBLDJCQUFBO0VBQ0Esd0JBQUE7VUFBQSx1QkFBQTtFQUNBLDRCQUFBO0VBQUEsNkJBQUE7VUFBQSxzQkFBQTtBQ2ZGOztBRGtCQTtFQUNFLFlBQUE7RUFDQSxpQ0FBQTtBQ2ZGOztBRGtCQTtFQUNHLFlBQUE7QUNmSDs7QURrQkE7RUFDRSx5QkFBQTtFQUNBLDBCQUFBO0FDZkY7O0FEc0JBO0VBQ0UsY0FBQTtFQUNBLGVBQUE7QUNuQkY7O0FEc0JBLGtCQUFBOztBQUNBOztFQUVFLGVBQUE7QUNuQkY7O0FEc0JBO0VBQ0UsZ0JBQUE7QUNuQkYiLCJmaWxlIjoic3JjL2FwcC9sb2NhdGlvbi9sb2NhdGlvbi5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiOmhvc3Qge1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIHRvcDogNXB4O1xufVxuXG46aG9zdCA6Om5nLWRlZXAgLmNvbnRhaW5lci10b3AtYmFyIHtcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBmbGV4LWVuZDtcbn1cblxuOmhvc3QgOjpuZy1kZWVwIC5jb250YWluZXItdG9wLWJhciBidXR0b24ge1xuICBtYXJnaW46IDA7XG59XG5cbjpob3N0IDo6bmctZGVlcCAuY29udGFpbmVyLWNvbnRlbnQge1xuICBtaW4taGVpZ2h0OiAyMDBweDtcbn1cblxuOmhvc3QgOjpuZy1kZWVwIC50b3AtZmxvdyB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgdG9wOiAtNDVweDtcbn1cbjpob3N0IDo6bmctZGVlcCAudG9wLWZsb3cteHMge1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIHRvcDogLTE1cHg7XG4gIGp1c3RpZnktY29udGVudDogZmxleC1zdGFydDtcbn1cblxuLyogUEUgdGFibGUgKi9cblxuOmhvc3QgOjpuZy1kZWVwIHtcblxuICAuY29udGFpbmVyLXRhYmxlIHtcbiAgICAvKnBvc2l0aW9uOiByZWxhdGl2ZTsqL1xuICAgIG1heC1oZWlnaHQ6IDQwMHB4O1xuICAgIG92ZXJmbG93OiBhdXRvO1xuICB9XG5cbiAgLmxvYWRpbmctc2hhZGUge1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICB0b3A6IDA7XG4gICAgbGVmdDogMDtcbiAgICBib3R0b206IDU2cHg7XG4gICAgcmlnaHQ6IDA7XG4gICAgYmFja2dyb3VuZDogcmdiYSgwLCAwLCAwLCAwLjE1KTtcbiAgICB6LWluZGV4OiA5OTk7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICB9XG5cbiAgLmNvbW1vbi10YWJsZSB7XG4gICAgd2lkdGg6IDEwMCU7XG4gICAgYm9yZGVyLXRvcDogMXB4IHNvbGlkIHJnYmEoMCwwLDAsLjEyKTtcbiAgfVxuXG4gIC5jb21tb24tdGFibGUgLm1hdC1oZWFkZXItcm93IHtcbiAgICBoZWlnaHQ6IDQwcHg7XG4gIH1cbiAgLmNvbW1vbi10YWJsZSAubWF0LWhlYWRlci1yb3c6bnRoLWNoaWxkKDIpIC5tYXQtaGVhZGVyLWNlbGwge1xuICAgIHRvcDogNDBweCAhaW1wb3J0YW50O1xuICB9XG4gIC5jb21tb24tdGFibGUgLm1hdC1oZWFkZXItcm93Om50aC1jaGlsZCgzKSAubWF0LWhlYWRlci1jZWxsIHtcbiAgICB0b3A6IDgwcHggIWltcG9ydGFudDtcbiAgfVxuXG4gIC5jb21tb24tdGFibGUgLm1hdC1oZWFkZXItY2VsbCB7XG4gICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbiAgICBwYWRkaW5nLXJpZ2h0OiA3cHg7XG4gICAgcGFkZGluZy1sZWZ0OiA3cHg7XG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgIGJvcmRlci1yaWdodDogMXB4IHNvbGlkIHJnYmEoMCwwLDAsLjEyKTtcbiAgfVxuXG4gIC5jb21tb24tdGFibGUgLm1hdC1zb3J0LWhlYWRlciB7XG4gICAgcGFkZGluZy10b3A6IDAuNjI1ZW07XG4gIH1cblxuICAuY29tbW9uLXRhYmxlIC5tYXQtcm93IHtcbiAgICBoZWlnaHQ6IDMycHg7XG4gIH1cblxuICAuY29tbW9uLXRhYmxlIC5tYXQtY2VsbCB7XG4gICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbiAgICBwYWRkaW5nLXJpZ2h0OiA3cHg7XG4gICAgcGFkZGluZy1sZWZ0OiA3cHg7XG4gIH1cblxuICAuY29tbW9uLXRhYmxlIC5jZWxsLWNlbnRlciB7XG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICB9XG4gIC5jb21tb24tdGFibGUgLmNlbGwtcmlnaHQge1xuICAgIHRleHQtYWxpZ246IHJpZ2h0O1xuICB9XG4gIC5jb21tb24tdGFibGUgLmNlbGwtZXJyb3Ige1xuICAgIGNvbG9yOiByZWQ7XG4gIH1cbiAgLmNvbW1vbi10YWJsZSAuY2VsbC13YXJuaW5nIHtcbiAgICBjb2xvcjogb3JhbmdlO1xuICB9XG4gIC5jb21tb24tdGFibGUgLm1hdC1jZWxsIC5tYXQtaWNvbiB7XG4gICAgZm9udC1zaXplOiAxOHB4O1xuICB9XG5cbiAgLmNvbW1vbi10YWJsZSAubWF0LWhlYWRlci1jZWxsIC5tYXQtZm9ybS1maWVsZCB7XG4gICAgd2lkdGg6IGF1dG87XG4gIH1cblxuICAuaW5wdXQtaGlkZGVuIHtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgd2lkdGg6IDBweDtcbiAgICBib3JkZXI6IG5vbmU7XG4gICAgaGVpZ2h0OiAxMDAlO1xuICB9XG5cbiAgLmJ1dHRvbi1mdyB7XG4gICAgZm9udC1zaXplOiAyNHB4O1xuICAgIC8qcG9zaXRpb246IGFic29sdXRlO1xuICAgIHJpZ2h0OiAwO1xuICAgIHRvcDogMDsqL1xuICAgIG1pbi13aWR0aDogYXV0bztcbiAgICBwYWRkaW5nOiAwO1xuICAgIG1hcmdpbi1sZWZ0OiA2cHg7XG4gIH1cblxuICAudHJlZS1kZXB0aC0xIHtcbiAgICBwYWRkaW5nLWxlZnQ6IDI3cHggIWltcG9ydGFudDtcbiAgfVxuICAudHJlZS1kZXB0aC0yIHtcbiAgICBwYWRkaW5nLWxlZnQ6IDQ3cHggIWltcG9ydGFudDtcbiAgfVxuICAudHJlZS1kZXB0aC0zIHtcbiAgICBwYWRkaW5nLWxlZnQ6IDY3cHggIWltcG9ydGFudDtcbiAgfVxuICAudHJlZS1kZXB0aC00IHtcbiAgICBwYWRkaW5nLWxlZnQ6IDg3cHggIWltcG9ydGFudDtcbiAgfVxuICAudHJlZS1zcGFjZXIge1xuICAgIGNvbG9yOiB3aGl0ZSAhaW1wb3J0YW50O1xuICB9XG59XG5cbi8qIGZvcm0gKi9cblxubWF0LWNhcmQgeyBcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBmbGV4LXN0YXJ0O1xuICBhbGlnbi1pdGVtczogZmxleC1zdGFydDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbn1cblxubWF0LXByb2dyZXNzLWJhciB7XG4gIHdpZHRoOiAzMzJweDtcbiAgbWFyZ2luOiAtMTZweCAwIDE2cHggMCAhaW1wb3J0YW50O1xufVxuXG5tYXQtZm9ybS1maWVsZCB7XG4gICB3aWR0aDogMjUwcHg7XG59XG5cbjo6bmctZGVlcCAubWF0LWNhcmQtaGVhZGVyLXRleHQge1xuICBtYXJnaW4tbGVmdDogMCAhaW1wb3J0YW50O1xuICBtYXJnaW4tcmlnaHQ6IDAgIWltcG9ydGFudDtcbn1cblxubWF0LWNhcmQtY29udGVudCB7XG4gIFxufVxuXG5tYXQtY2FyZC1hY3Rpb25zIHtcbiAgbWFyZ2luLWxlZnQ6IDA7XG4gIG1hcmdpbi1yaWdodDogMDtcbn1cblxuLyogQ29sdW1uIFdpZHRocyAqL1xuLm1hdC1jb2x1bW4tbnVtYmVyLFxuLm1hdC1jb2x1bW4tc3RhdGUge1xuICBtYXgtd2lkdGg6IDY0cHg7XG59XG5cbi5tYXQtY29sdW1uLWNyZWF0ZWQge1xuICBtYXgtd2lkdGg6IDEyNHB4O1xufVxuXG4iLCI6aG9zdCB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgdG9wOiA1cHg7XG59XG5cbjpob3N0IDo6bmctZGVlcCAuY29udGFpbmVyLXRvcC1iYXIge1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtZW5kO1xufVxuXG46aG9zdCA6Om5nLWRlZXAgLmNvbnRhaW5lci10b3AtYmFyIGJ1dHRvbiB7XG4gIG1hcmdpbjogMDtcbn1cblxuOmhvc3QgOjpuZy1kZWVwIC5jb250YWluZXItY29udGVudCB7XG4gIG1pbi1oZWlnaHQ6IDIwMHB4O1xufVxuXG46aG9zdCA6Om5nLWRlZXAgLnRvcC1mbG93IHtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICB0b3A6IC00NXB4O1xufVxuXG46aG9zdCA6Om5nLWRlZXAgLnRvcC1mbG93LXhzIHtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICB0b3A6IC0xNXB4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtc3RhcnQ7XG59XG5cbi8qIFBFIHRhYmxlICovXG46aG9zdCA6Om5nLWRlZXAgLmNvbnRhaW5lci10YWJsZSB7XG4gIC8qcG9zaXRpb246IHJlbGF0aXZlOyovXG4gIG1heC1oZWlnaHQ6IDQwMHB4O1xuICBvdmVyZmxvdzogYXV0bztcbn1cbjpob3N0IDo6bmctZGVlcCAubG9hZGluZy1zaGFkZSB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiAwO1xuICBsZWZ0OiAwO1xuICBib3R0b206IDU2cHg7XG4gIHJpZ2h0OiAwO1xuICBiYWNrZ3JvdW5kOiByZ2JhKDAsIDAsIDAsIDAuMTUpO1xuICB6LWluZGV4OiA5OTk7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xufVxuOmhvc3QgOjpuZy1kZWVwIC5jb21tb24tdGFibGUge1xuICB3aWR0aDogMTAwJTtcbiAgYm9yZGVyLXRvcDogMXB4IHNvbGlkIHJnYmEoMCwgMCwgMCwgMC4xMik7XG59XG46aG9zdCA6Om5nLWRlZXAgLmNvbW1vbi10YWJsZSAubWF0LWhlYWRlci1yb3cge1xuICBoZWlnaHQ6IDQwcHg7XG59XG46aG9zdCA6Om5nLWRlZXAgLmNvbW1vbi10YWJsZSAubWF0LWhlYWRlci1yb3c6bnRoLWNoaWxkKDIpIC5tYXQtaGVhZGVyLWNlbGwge1xuICB0b3A6IDQwcHggIWltcG9ydGFudDtcbn1cbjpob3N0IDo6bmctZGVlcCAuY29tbW9uLXRhYmxlIC5tYXQtaGVhZGVyLXJvdzpudGgtY2hpbGQoMykgLm1hdC1oZWFkZXItY2VsbCB7XG4gIHRvcDogODBweCAhaW1wb3J0YW50O1xufVxuOmhvc3QgOjpuZy1kZWVwIC5jb21tb24tdGFibGUgLm1hdC1oZWFkZXItY2VsbCB7XG4gIHdoaXRlLXNwYWNlOiBub3dyYXA7XG4gIHBhZGRpbmctcmlnaHQ6IDdweDtcbiAgcGFkZGluZy1sZWZ0OiA3cHg7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgYm9yZGVyLXJpZ2h0OiAxcHggc29saWQgcmdiYSgwLCAwLCAwLCAwLjEyKTtcbn1cbjpob3N0IDo6bmctZGVlcCAuY29tbW9uLXRhYmxlIC5tYXQtc29ydC1oZWFkZXIge1xuICBwYWRkaW5nLXRvcDogMC42MjVlbTtcbn1cbjpob3N0IDo6bmctZGVlcCAuY29tbW9uLXRhYmxlIC5tYXQtcm93IHtcbiAgaGVpZ2h0OiAzMnB4O1xufVxuOmhvc3QgOjpuZy1kZWVwIC5jb21tb24tdGFibGUgLm1hdC1jZWxsIHtcbiAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbiAgcGFkZGluZy1yaWdodDogN3B4O1xuICBwYWRkaW5nLWxlZnQ6IDdweDtcbn1cbjpob3N0IDo6bmctZGVlcCAuY29tbW9uLXRhYmxlIC5jZWxsLWNlbnRlciB7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbn1cbjpob3N0IDo6bmctZGVlcCAuY29tbW9uLXRhYmxlIC5jZWxsLXJpZ2h0IHtcbiAgdGV4dC1hbGlnbjogcmlnaHQ7XG59XG46aG9zdCA6Om5nLWRlZXAgLmNvbW1vbi10YWJsZSAuY2VsbC1lcnJvciB7XG4gIGNvbG9yOiByZWQ7XG59XG46aG9zdCA6Om5nLWRlZXAgLmNvbW1vbi10YWJsZSAuY2VsbC13YXJuaW5nIHtcbiAgY29sb3I6IG9yYW5nZTtcbn1cbjpob3N0IDo6bmctZGVlcCAuY29tbW9uLXRhYmxlIC5tYXQtY2VsbCAubWF0LWljb24ge1xuICBmb250LXNpemU6IDE4cHg7XG59XG46aG9zdCA6Om5nLWRlZXAgLmNvbW1vbi10YWJsZSAubWF0LWhlYWRlci1jZWxsIC5tYXQtZm9ybS1maWVsZCB7XG4gIHdpZHRoOiBhdXRvO1xufVxuOmhvc3QgOjpuZy1kZWVwIC5pbnB1dC1oaWRkZW4ge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHdpZHRoOiAwcHg7XG4gIGJvcmRlcjogbm9uZTtcbiAgaGVpZ2h0OiAxMDAlO1xufVxuOmhvc3QgOjpuZy1kZWVwIC5idXR0b24tZncge1xuICBmb250LXNpemU6IDI0cHg7XG4gIC8qcG9zaXRpb246IGFic29sdXRlO1xuICByaWdodDogMDtcbiAgdG9wOiAwOyovXG4gIG1pbi13aWR0aDogYXV0bztcbiAgcGFkZGluZzogMDtcbiAgbWFyZ2luLWxlZnQ6IDZweDtcbn1cbjpob3N0IDo6bmctZGVlcCAudHJlZS1kZXB0aC0xIHtcbiAgcGFkZGluZy1sZWZ0OiAyN3B4ICFpbXBvcnRhbnQ7XG59XG46aG9zdCA6Om5nLWRlZXAgLnRyZWUtZGVwdGgtMiB7XG4gIHBhZGRpbmctbGVmdDogNDdweCAhaW1wb3J0YW50O1xufVxuOmhvc3QgOjpuZy1kZWVwIC50cmVlLWRlcHRoLTMge1xuICBwYWRkaW5nLWxlZnQ6IDY3cHggIWltcG9ydGFudDtcbn1cbjpob3N0IDo6bmctZGVlcCAudHJlZS1kZXB0aC00IHtcbiAgcGFkZGluZy1sZWZ0OiA4N3B4ICFpbXBvcnRhbnQ7XG59XG46aG9zdCA6Om5nLWRlZXAgLnRyZWUtc3BhY2VyIHtcbiAgY29sb3I6IHdoaXRlICFpbXBvcnRhbnQ7XG59XG5cbi8qIGZvcm0gKi9cbm1hdC1jYXJkIHtcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBmbGV4LXN0YXJ0O1xuICBhbGlnbi1pdGVtczogZmxleC1zdGFydDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbn1cblxubWF0LXByb2dyZXNzLWJhciB7XG4gIHdpZHRoOiAzMzJweDtcbiAgbWFyZ2luOiAtMTZweCAwIDE2cHggMCAhaW1wb3J0YW50O1xufVxuXG5tYXQtZm9ybS1maWVsZCB7XG4gIHdpZHRoOiAyNTBweDtcbn1cblxuOjpuZy1kZWVwIC5tYXQtY2FyZC1oZWFkZXItdGV4dCB7XG4gIG1hcmdpbi1sZWZ0OiAwICFpbXBvcnRhbnQ7XG4gIG1hcmdpbi1yaWdodDogMCAhaW1wb3J0YW50O1xufVxuXG5tYXQtY2FyZC1hY3Rpb25zIHtcbiAgbWFyZ2luLWxlZnQ6IDA7XG4gIG1hcmdpbi1yaWdodDogMDtcbn1cblxuLyogQ29sdW1uIFdpZHRocyAqL1xuLm1hdC1jb2x1bW4tbnVtYmVyLFxuLm1hdC1jb2x1bW4tc3RhdGUge1xuICBtYXgtd2lkdGg6IDY0cHg7XG59XG5cbi5tYXQtY29sdW1uLWNyZWF0ZWQge1xuICBtYXgtd2lkdGg6IDEyNHB4O1xufSJdfQ== */"

/***/ }),

/***/ "./src/app/material/material.module.ts":
/*!*********************************************!*\
  !*** ./src/app/material/material.module.ts ***!
  \*********************************************/
/*! exports provided: MaterialModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MaterialModule", function() { return MaterialModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _angular_material_radio__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material/radio */ "./node_modules/@angular/material/esm5/radio.es5.js");





var MaterialModule = /** @class */ (function () {
    function MaterialModule() {
    }
    MaterialModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: [],
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatTabsModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatSidenavModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatToolbarModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatIconModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatButtonModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatListModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatInputModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatProgressSpinnerModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatDialogModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatCardModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatSelectModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatSnackBarModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatTableModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatPaginatorModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatSortModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatProgressBarModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatExpansionModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatDatepickerModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatNativeDateModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatCheckboxModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatAutocompleteModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatTooltipModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatTreeModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatStepperModule"],
                _angular_material_radio__WEBPACK_IMPORTED_MODULE_4__["MatRadioModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatMenuModule"],
            ],
            exports: [
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatTabsModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatSidenavModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatToolbarModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatIconModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatButtonModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatListModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatInputModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatProgressSpinnerModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatDialogModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatCardModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatSelectModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatSnackBarModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatTableModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatPaginatorModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatSortModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatProgressBarModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatExpansionModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatDatepickerModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatNativeDateModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatCheckboxModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatAutocompleteModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatTooltipModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatTreeModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatStepperModule"],
                _angular_material_radio__WEBPACK_IMPORTED_MODULE_4__["MatRadioModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatMenuModule"],
            ],
        })
    ], MaterialModule);
    return MaterialModule;
}());



/***/ }),

/***/ "./src/app/navigation/header/header.component.scss":
/*!*********************************************************!*\
  !*** ./src/app/navigation/header/header.component.scss ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "a {\n  text-decoration: none;\n  color: white;\n}\n\na:hover, a:active {\n  color: lightgray;\n}\n\n.navigation-items {\n  list-style-type: none;\n  padding: 0;\n  margin: 0;\n}\n\nmat-toolbar {\n  border-radius: 3px;\n}\n\n@media (max-width: 959px) {\n  mat-toolbar {\n    border-radius: 0px;\n  }\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvbmF2aWdhdGlvbi9oZWFkZXIvRDpcXHBlcC1hcHBfbmV3XFxzc2NcXENsaWVudEFwcC9zcmNcXGFwcFxcbmF2aWdhdGlvblxcaGVhZGVyXFxoZWFkZXIuY29tcG9uZW50LnNjc3MiLCJzcmMvYXBwL25hdmlnYXRpb24vaGVhZGVyL2hlYWRlci5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNJLHFCQUFBO0VBQ0EsWUFBQTtBQ0NKOztBREVBO0VBQ0ksZ0JBQUE7QUNDSjs7QURFQTtFQUNJLHFCQUFBO0VBQ0EsVUFBQTtFQUNBLFNBQUE7QUNDSjs7QURFQTtFQUNJLGtCQUFBO0FDQ0o7O0FERUE7RUFDSTtJQUNJLGtCQUFBO0VDQ047QUFDRiIsImZpbGUiOiJzcmMvYXBwL25hdmlnYXRpb24vaGVhZGVyL2hlYWRlci5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbImEge1xuICAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcbiAgICBjb2xvcjogd2hpdGU7XG59XG4gXG5hOmhvdmVyLCBhOmFjdGl2ZXtcbiAgICBjb2xvcjogbGlnaHRncmF5O1xufVxuIFxuLm5hdmlnYXRpb24taXRlbXN7XG4gICAgbGlzdC1zdHlsZS10eXBlOiBub25lO1xuICAgIHBhZGRpbmc6IDA7XG4gICAgbWFyZ2luOiAwO1xufVxuIFxubWF0LXRvb2xiYXJ7XG4gICAgYm9yZGVyLXJhZGl1czogM3B4O1xufVxuIFxuQG1lZGlhKG1heC13aWR0aDogOTU5cHgpe1xuICAgIG1hdC10b29sYmFye1xuICAgICAgICBib3JkZXItcmFkaXVzOiAwcHg7XG4gICAgfVxufSIsImEge1xuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XG4gIGNvbG9yOiB3aGl0ZTtcbn1cblxuYTpob3ZlciwgYTphY3RpdmUge1xuICBjb2xvcjogbGlnaHRncmF5O1xufVxuXG4ubmF2aWdhdGlvbi1pdGVtcyB7XG4gIGxpc3Qtc3R5bGUtdHlwZTogbm9uZTtcbiAgcGFkZGluZzogMDtcbiAgbWFyZ2luOiAwO1xufVxuXG5tYXQtdG9vbGJhciB7XG4gIGJvcmRlci1yYWRpdXM6IDNweDtcbn1cblxuQG1lZGlhIChtYXgtd2lkdGg6IDk1OXB4KSB7XG4gIG1hdC10b29sYmFyIHtcbiAgICBib3JkZXItcmFkaXVzOiAwcHg7XG4gIH1cbn0iXX0= */"

/***/ }),

/***/ "./src/app/navigation/header/header.component.ts":
/*!*******************************************************!*\
  !*** ./src/app/navigation/header/header.component.ts ***!
  \*******************************************************/
/*! exports provided: HeaderComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HeaderComponent", function() { return HeaderComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


var HeaderComponent = /** @class */ (function () {
    function HeaderComponent() {
        var _this = this;
        this.sidenavToggle = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.onToggleSidenav = function () {
            _this.sidenavToggle.emit();
        };
    }
    HeaderComponent.prototype.ngOnInit = function () {
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])()
    ], HeaderComponent.prototype, "sidenavToggle", void 0);
    HeaderComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-header',
            template: __webpack_require__(/*! raw-loader!./header.component.html */ "./node_modules/raw-loader/index.js!./src/app/navigation/header/header.component.html"),
            styles: [__webpack_require__(/*! ./header.component.scss */ "./src/app/navigation/header/header.component.scss")]
        })
    ], HeaderComponent);
    return HeaderComponent;
}());



/***/ }),

/***/ "./src/app/navigation/panel/panel.component.scss":
/*!*******************************************************!*\
  !*** ./src/app/navigation/panel/panel.component.scss ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "::ng-deep .mat-expansion-panel-header {\n  padding-left: 15px !important;\n  height: 48px !important;\n  background-color: rgba(239, 239, 239, 0.4);\n  font-weight: 500 !important;\n}\n\n.sub-panel {\n  height: 35px !important;\n  line-height: 2;\n  background-color: transparent;\n}\n\n.sub-panel-item .icon {\n  font-size: 22px;\n  padding-right: 5px;\n}\n\n::ng-deep .mat-expansion-panel-body {\n  padding: 0 0 16px !important;\n  color: white !important;\n}\n\n::ng-deep .mat-nav-list {\n  padding-top: 0px !important;\n}\n\n.mat-nav-list .mat-list-item {\n  height: 32px !important;\n}\n\n::ng-deep .mat-list-item-content {\n  padding: 0 15px !important;\n  font-size: 14px;\n}\n\n::ng-deep .mat-expansion-panel {\n  box-shadow: none !important;\n}\n\n::ng-deep .icon {\n  padding-right: 10px;\n}\n\n::ng-deep .sub-panel-item {\n  font-weight: 400 !important;\n  padding-left: 28px !important;\n}\n\n::ng-deep .main-panel-item {\n  font-weight: 500 !important;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvbmF2aWdhdGlvbi9wYW5lbC9EOlxccGVwLWFwcF9uZXdcXHNzY1xcQ2xpZW50QXBwL3NyY1xcYXBwXFxuYXZpZ2F0aW9uXFxwYW5lbFxccGFuZWwuY29tcG9uZW50LnNjc3MiLCJzcmMvYXBwL25hdmlnYXRpb24vcGFuZWwvcGFuZWwuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSw2QkFBQTtFQUNBLHVCQUFBO0VBQ0EsMENBQUE7RUFDQSwyQkFBQTtBQ0NGOztBREVBO0VBQ0UsdUJBQUE7RUFDQSxjQUFBO0VBQ0EsNkJBQUE7QUNDRjs7QURHQTtFQUNFLGVBQUE7RUFDQSxrQkFBQTtBQ0FGOztBREtBO0VBQ0UsNEJBQUE7RUFDQSx1QkFBQTtBQ0ZGOztBRE1BO0VBQ0MsMkJBQUE7QUNIRDs7QURNQTtFQUNDLHVCQUFBO0FDSEQ7O0FETUE7RUFDRSwwQkFBQTtFQUNBLGVBQUE7QUNIRjs7QURNQTtFQUNFLDJCQUFBO0FDSEY7O0FETUE7RUFDRSxtQkFBQTtBQ0hGOztBRE1BO0VBQ0UsMkJBQUE7RUFDQSw2QkFBQTtBQ0hGOztBRE1BO0VBQ0UsMkJBQUE7QUNIRiIsImZpbGUiOiJzcmMvYXBwL25hdmlnYXRpb24vcGFuZWwvcGFuZWwuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyI6Om5nLWRlZXAgLm1hdC1leHBhbnNpb24tcGFuZWwtaGVhZGVyIHtcbiAgcGFkZGluZy1sZWZ0IDogMTVweCAhaW1wb3J0YW50O1xuICBoZWlnaHQ6IDQ4cHggIWltcG9ydGFudDtcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDIzOSAyMzkgMjM5IC8gNDAlKTtcbiAgZm9udC13ZWlnaHQ6IDUwMCAhaW1wb3J0YW50O1xufVxuXG4uc3ViLXBhbmVsIHtcbiAgaGVpZ2h0OiAzNXB4ICFpbXBvcnRhbnQ7XG4gIGxpbmUtaGVpZ2h0OiAyO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcblxufVxuXG4uc3ViLXBhbmVsLWl0ZW0gLmljb257XG4gIGZvbnQtc2l6ZSA6IDIycHg7XG4gIHBhZGRpbmctcmlnaHQgOiA1cHg7XG59XG5cblxuXG46Om5nLWRlZXAgLm1hdC1leHBhbnNpb24tcGFuZWwtYm9keSB7XG4gIHBhZGRpbmc6IDAgMCAxNnB4ICFpbXBvcnRhbnQ7XG4gIGNvbG9yOiB3aGl0ZSAhaW1wb3J0YW50O1xufVxuXG5cbjo6bmctZGVlcCAubWF0LW5hdi1saXN0IHtcblx0cGFkZGluZy10b3A6IDBweCAhaW1wb3J0YW50O1xufVxuXG4ubWF0LW5hdi1saXN0IC5tYXQtbGlzdC1pdGVtIHtcblx0aGVpZ2h0OiAzMnB4ICFpbXBvcnRhbnQ7XG59XG5cbjo6bmctZGVlcCAubWF0LWxpc3QtaXRlbS1jb250ZW50IHtcbiAgcGFkZGluZzogMCAxNXB4ICFpbXBvcnRhbnQ7XG4gIGZvbnQtc2l6ZTogMTRweDtcbn1cblxuOjpuZy1kZWVwIC5tYXQtZXhwYW5zaW9uLXBhbmVsIHtcclxuICBib3gtc2hhZG93IDogbm9uZSAhaW1wb3J0YW50O1xyXG59XG5cbjo6bmctZGVlcCAuaWNvbiB7XG4gIHBhZGRpbmctcmlnaHQgOiAxMHB4O1xufVxuXG46Om5nLWRlZXAgLnN1Yi1wYW5lbC1pdGVtIHtcbiAgZm9udC13ZWlnaHQ6IDQwMCAhaW1wb3J0YW50O1xuICBwYWRkaW5nLWxlZnQgOiAyOHB4ICFpbXBvcnRhbnQ7XG59XG5cbjo6bmctZGVlcCAubWFpbi1wYW5lbC1pdGVtIHtcbiAgZm9udC13ZWlnaHQ6IDUwMCAhaW1wb3J0YW50O1xufVxuXG4iLCI6Om5nLWRlZXAgLm1hdC1leHBhbnNpb24tcGFuZWwtaGVhZGVyIHtcbiAgcGFkZGluZy1sZWZ0OiAxNXB4ICFpbXBvcnRhbnQ7XG4gIGhlaWdodDogNDhweCAhaW1wb3J0YW50O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDIzOSwgMjM5LCAyMzksIDAuNCk7XG4gIGZvbnQtd2VpZ2h0OiA1MDAgIWltcG9ydGFudDtcbn1cblxuLnN1Yi1wYW5lbCB7XG4gIGhlaWdodDogMzVweCAhaW1wb3J0YW50O1xuICBsaW5lLWhlaWdodDogMjtcbiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG59XG5cbi5zdWItcGFuZWwtaXRlbSAuaWNvbiB7XG4gIGZvbnQtc2l6ZTogMjJweDtcbiAgcGFkZGluZy1yaWdodDogNXB4O1xufVxuXG46Om5nLWRlZXAgLm1hdC1leHBhbnNpb24tcGFuZWwtYm9keSB7XG4gIHBhZGRpbmc6IDAgMCAxNnB4ICFpbXBvcnRhbnQ7XG4gIGNvbG9yOiB3aGl0ZSAhaW1wb3J0YW50O1xufVxuXG46Om5nLWRlZXAgLm1hdC1uYXYtbGlzdCB7XG4gIHBhZGRpbmctdG9wOiAwcHggIWltcG9ydGFudDtcbn1cblxuLm1hdC1uYXYtbGlzdCAubWF0LWxpc3QtaXRlbSB7XG4gIGhlaWdodDogMzJweCAhaW1wb3J0YW50O1xufVxuXG46Om5nLWRlZXAgLm1hdC1saXN0LWl0ZW0tY29udGVudCB7XG4gIHBhZGRpbmc6IDAgMTVweCAhaW1wb3J0YW50O1xuICBmb250LXNpemU6IDE0cHg7XG59XG5cbjo6bmctZGVlcCAubWF0LWV4cGFuc2lvbi1wYW5lbCB7XG4gIGJveC1zaGFkb3c6IG5vbmUgIWltcG9ydGFudDtcbn1cblxuOjpuZy1kZWVwIC5pY29uIHtcbiAgcGFkZGluZy1yaWdodDogMTBweDtcbn1cblxuOjpuZy1kZWVwIC5zdWItcGFuZWwtaXRlbSB7XG4gIGZvbnQtd2VpZ2h0OiA0MDAgIWltcG9ydGFudDtcbiAgcGFkZGluZy1sZWZ0OiAyOHB4ICFpbXBvcnRhbnQ7XG59XG5cbjo6bmctZGVlcCAubWFpbi1wYW5lbC1pdGVtIHtcbiAgZm9udC13ZWlnaHQ6IDUwMCAhaW1wb3J0YW50O1xufSJdfQ== */"

/***/ }),

/***/ "./src/app/navigation/panel/panel.component.ts":
/*!*****************************************************!*\
  !*** ./src/app/navigation/panel/panel.component.ts ***!
  \*****************************************************/
/*! exports provided: PanelComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PanelComponent", function() { return PanelComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _panel__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./panel */ "./src/app/navigation/panel/panel.ts");
/* harmony import */ var _panel_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./panel.service */ "./src/app/navigation/panel/panel.service.ts");
/* harmony import */ var _auth_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../auth.service */ "./src/app/auth.service.ts");
/* harmony import */ var _permission_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../permission.service */ "./src/app/permission.service.ts");







var PanelComponent = /** @class */ (function () {
    function PanelComponent(panelService, authService, permissionService) {
        var _this = this;
        this.panelService = panelService;
        this.authService = authService;
        this.permissionService = permissionService;
        this.panels = [];
        this.step = 0;
        this.authService.currentUser.subscribe(function (res) {
            if (res != null) {
                _this.root = [
                    // new PanelItem("Home", "", "home", this.permissionService.passPermission("")),
                    // new PanelItem("Employee", "employee", "dashboard", this.permissionService.passPermission("employee")),
                    // new PanelItem("Enum", "enum", "dashboard", this.permissionService.passPermission("enum")),
                    // new PanelItem("Location", "location", "dashboard", this.permissionService.passPermission("location")),
                    new _panel__WEBPACK_IMPORTED_MODULE_2__["PanelItem"]("Logout", "logout", "input", _this.permissionService.passPermission("logout"), false, [], { overlay: "logout" }),
                ];
                _this.addPanel(new _panel__WEBPACK_IMPORTED_MODULE_2__["Panel"]("Menu", 0, _this.root));
            }
            else {
                _this.panels = [];
            }
        });
        this.panelService.currentMessage.subscribe(function (res) {
            if (res.title != null && res.items.filter(function (i) { return i.permission; }).length > 0) {
                _this.addPanel(res);
                //console.log("add panel "+res.title+" "+this.panels.length);
            }
        });
    }
    PanelComponent.prototype.setStep = function (index) {
        this.step = index;
    };
    PanelComponent.prototype.addPanel = function (item) {
        for (var i = 0; i < this.panels.length; i++) {
            if (this.panels[i].title == item.title) {
                this.panels.splice(i, 1);
                break;
            }
        }
        this.panels.push(item);
    };
    PanelComponent.prototype.ngOnInit = function () {
    };
    PanelComponent.ctorParameters = function () { return [
        { type: _panel_service__WEBPACK_IMPORTED_MODULE_3__["PanelService"] },
        { type: _auth_service__WEBPACK_IMPORTED_MODULE_4__["AuthService"] },
        { type: _permission_service__WEBPACK_IMPORTED_MODULE_5__["PermissionService"] }
    ]; };
    PanelComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-panel',
            template: __webpack_require__(/*! raw-loader!./panel.component.html */ "./node_modules/raw-loader/index.js!./src/app/navigation/panel/panel.component.html"),
            styles: [__webpack_require__(/*! ./panel.component.scss */ "./src/app/navigation/panel/panel.component.scss")]
        })
    ], PanelComponent);
    return PanelComponent;
}());



/***/ }),

/***/ "./src/app/navigation/panel/panel.service.ts":
/*!***************************************************!*\
  !*** ./src/app/navigation/panel/panel.service.ts ***!
  \***************************************************/
/*! exports provided: PanelService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PanelService", function() { return PanelService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _panel__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./panel */ "./src/app/navigation/panel/panel.ts");




var PanelService = /** @class */ (function () {
    function PanelService() {
        this.messageSource = new rxjs__WEBPACK_IMPORTED_MODULE_2__["BehaviorSubject"](new _panel__WEBPACK_IMPORTED_MODULE_3__["Panel"]("", 0, []));
        this.currentMessage = this.messageSource.asObservable();
    }
    PanelService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root'
        })
    ], PanelService);
    return PanelService;
}());



/***/ }),

/***/ "./src/app/navigation/panel/panel.ts":
/*!*******************************************!*\
  !*** ./src/app/navigation/panel/panel.ts ***!
  \*******************************************/
/*! exports provided: Panel, PanelItem, PanelSubItem */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Panel", function() { return Panel; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PanelItem", function() { return PanelItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PanelSubItem", function() { return PanelSubItem; });
var Panel = /** @class */ (function () {
    function Panel(title, order, items) {
        if (title === void 0) { title = ""; }
        if (order === void 0) { order = 0; }
        if (items === void 0) { items = [new PanelItem()]; }
        this.title = title;
        this.order = order;
        this.items = items;
    }
    Panel.ctorParameters = function () { return [
        { type: String },
        { type: Number },
        { type: Array }
    ]; };
    return Panel;
}());

var PanelItem = /** @class */ (function () {
    function PanelItem(label, path, icon, permission, hasSubitem, items, outlet) {
        if (label === void 0) { label = ""; }
        if (path === void 0) { path = ""; }
        if (icon === void 0) { icon = ""; }
        if (permission === void 0) { permission = false; }
        if (hasSubitem === void 0) { hasSubitem = false; }
        if (items === void 0) { items = [new PanelSubItem()]; }
        if (outlet === void 0) { outlet = null; }
        this.label = label;
        this.path = path;
        this.icon = icon;
        this.permission = permission;
        this.hasSubitem = hasSubitem;
        this.items = items;
        this.outlet = outlet;
    }
    PanelItem.ctorParameters = function () { return [
        { type: String },
        { type: String },
        { type: String },
        { type: Boolean },
        { type: Boolean },
        { type: Array },
        { type: Object }
    ]; };
    return PanelItem;
}());

var PanelSubItem = /** @class */ (function () {
    function PanelSubItem(label, path, icon, permission, outlet) {
        if (label === void 0) { label = ""; }
        if (path === void 0) { path = ""; }
        if (icon === void 0) { icon = ""; }
        if (permission === void 0) { permission = false; }
        if (outlet === void 0) { outlet = null; }
        this.label = label;
        this.path = path;
        this.icon = icon;
        this.permission = permission;
        this.outlet = outlet;
    }
    PanelSubItem.ctorParameters = function () { return [
        { type: String },
        { type: String },
        { type: String },
        { type: Boolean },
        { type: Object }
    ]; };
    return PanelSubItem;
}());



/***/ }),

/***/ "./src/app/navigation/title/title.component.scss":
/*!*******************************************************!*\
  !*** ./src/app/navigation/title/title.component.scss ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".breadcrumbs {\n  display: none;\n}\n\n.breadcrumbs-break {\n  display: block;\n  clear: both;\n}\n\n.breadcrumbs-item,\n.breadcrumbs-separator {\n  display: block;\n  float: left;\n  font-size: 14px;\n}\n\n.breadcrumbs-separator .mat-icon {\n  margin-top: 3px;\n  margin-left: 4px;\n  width: 18px;\n}\n\n.mat-h1 {\n  color: red;\n  font-size: 23px;\n}\n\n.mat-h1 > .mat-icon {\n  vertical-align: text-top;\n  padding-right: 10px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvbmF2aWdhdGlvbi90aXRsZS9EOlxccGVwLWFwcF9uZXdcXHNzY1xcQ2xpZW50QXBwL3NyY1xcYXBwXFxuYXZpZ2F0aW9uXFx0aXRsZVxcdGl0bGUuY29tcG9uZW50LnNjc3MiLCJzcmMvYXBwL25hdmlnYXRpb24vdGl0bGUvdGl0bGUuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDQyxhQUFBO0FDQ0Q7O0FERUE7RUFDQyxjQUFBO0VBQ0EsV0FBQTtBQ0NEOztBREVBOztFQUVDLGNBQUE7RUFDQSxXQUFBO0VBQ0EsZUFBQTtBQ0NEOztBREVBO0VBQ0UsZUFBQTtFQUNBLGdCQUFBO0VBQ0EsV0FBQTtBQ0NGOztBREVBO0VBQ0UsVUFBQTtFQUNBLGVBQUE7QUNDRjs7QURDQTtFQUNFLHdCQUFBO0VBQ0EsbUJBQUE7QUNFRiIsImZpbGUiOiJzcmMvYXBwL25hdmlnYXRpb24vdGl0bGUvdGl0bGUuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIuYnJlYWRjcnVtYnMge1xuXHRkaXNwbGF5OiBub25lO1xufVxuXG4uYnJlYWRjcnVtYnMtYnJlYWsge1xuXHRkaXNwbGF5OiBibG9jaztcblx0Y2xlYXI6IGJvdGg7XG59XG5cbi5icmVhZGNydW1icy1pdGVtLFxuLmJyZWFkY3J1bWJzLXNlcGFyYXRvciB7XG5cdGRpc3BsYXk6IGJsb2NrO1xuXHRmbG9hdDogbGVmdDtcblx0Zm9udC1zaXplOiAxNHB4O1xufVxuXG4uYnJlYWRjcnVtYnMtc2VwYXJhdG9yIC5tYXQtaWNvbiB7XG4gXHRtYXJnaW4tdG9wOiAzcHg7XG4gXHRtYXJnaW4tbGVmdDogNHB4O1xuIFx0d2lkdGg6IDE4cHg7XG4gfVxuXG4ubWF0LWgxIHtcclxuICBjb2xvciA6IHJlZDtcclxuICBmb250LXNpemUgOiAyM3B4O1xyXG59XG4ubWF0LWgxID4gLm1hdC1pY29uIHtcclxuICB2ZXJ0aWNhbC1hbGlnbiA6IHRleHQtdG9wO1xyXG4gIHBhZGRpbmctcmlnaHQgOiAxMHB4O1xyXG59XHJcbiIsIi5icmVhZGNydW1icyB7XG4gIGRpc3BsYXk6IG5vbmU7XG59XG5cbi5icmVhZGNydW1icy1icmVhayB7XG4gIGRpc3BsYXk6IGJsb2NrO1xuICBjbGVhcjogYm90aDtcbn1cblxuLmJyZWFkY3J1bWJzLWl0ZW0sXG4uYnJlYWRjcnVtYnMtc2VwYXJhdG9yIHtcbiAgZGlzcGxheTogYmxvY2s7XG4gIGZsb2F0OiBsZWZ0O1xuICBmb250LXNpemU6IDE0cHg7XG59XG5cbi5icmVhZGNydW1icy1zZXBhcmF0b3IgLm1hdC1pY29uIHtcbiAgbWFyZ2luLXRvcDogM3B4O1xuICBtYXJnaW4tbGVmdDogNHB4O1xuICB3aWR0aDogMThweDtcbn1cblxuLm1hdC1oMSB7XG4gIGNvbG9yOiByZWQ7XG4gIGZvbnQtc2l6ZTogMjNweDtcbn1cblxuLm1hdC1oMSA+IC5tYXQtaWNvbiB7XG4gIHZlcnRpY2FsLWFsaWduOiB0ZXh0LXRvcDtcbiAgcGFkZGluZy1yaWdodDogMTBweDtcbn0iXX0= */"

/***/ }),

/***/ "./src/app/navigation/title/title.component.ts":
/*!*****************************************************!*\
  !*** ./src/app/navigation/title/title.component.ts ***!
  \*****************************************************/
/*! exports provided: TitleComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TitleComponent", function() { return TitleComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _title_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./title.service */ "./src/app/navigation/title/title.service.ts");
/* harmony import */ var _common_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../common.service */ "./src/app/common.service.ts");




var TitleComponent = /** @class */ (function () {
    function TitleComponent(titleService, commonService) {
        var _this = this;
        this.titleService = titleService;
        this.commonService = commonService;
        this.titleService.currentTitle.subscribe(function (res) {
            if (res != null) {
                _this.title = res.title;
                _this.icon = res.icon;
                _this.breadcrumbs = res.breadcrumbs;
            }
            else {
                _this.icon = "";
                _this.title = null;
                _this.breadcrumbs = [];
            }
        });
        this.commonService.fsMessage.subscribe(function (res) {
            _this.fullWindow = res;
        });
    }
    TitleComponent.prototype.ngOnInit = function () {
    };
    TitleComponent.ctorParameters = function () { return [
        { type: _title_service__WEBPACK_IMPORTED_MODULE_2__["TitleService"] },
        { type: _common_service__WEBPACK_IMPORTED_MODULE_3__["CommonService"] }
    ]; };
    TitleComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-title',
            template: __webpack_require__(/*! raw-loader!./title.component.html */ "./node_modules/raw-loader/index.js!./src/app/navigation/title/title.component.html"),
            styles: [__webpack_require__(/*! ./title.component.scss */ "./src/app/navigation/title/title.component.scss")]
        })
    ], TitleComponent);
    return TitleComponent;
}());



/***/ }),

/***/ "./src/app/navigation/title/title.service.ts":
/*!***************************************************!*\
  !*** ./src/app/navigation/title/title.service.ts ***!
  \***************************************************/
/*! exports provided: TitleService, titleSet, bcItem */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TitleService", function() { return TitleService; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "titleSet", function() { return titleSet; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "bcItem", function() { return bcItem; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");



var TitleService = /** @class */ (function () {
    function TitleService() {
        this.titleSource = new rxjs__WEBPACK_IMPORTED_MODULE_2__["BehaviorSubject"]({
            title: "",
            icon: "",
            breadcrumbs: []
        });
        this.currentTitle = this.titleSource.asObservable();
    }
    TitleService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root'
        })
    ], TitleService);
    return TitleService;
}());

var titleSet = /** @class */ (function () {
    function titleSet() {
        this.breadcrumbs = [];
    }
    return titleSet;
}());

var bcItem = /** @class */ (function () {
    function bcItem() {
        this.routerLink = '';
    }
    return bcItem;
}());



/***/ }),

/***/ "./src/app/permission.guard.ts":
/*!*************************************!*\
  !*** ./src/app/permission.guard.ts ***!
  \*************************************/
/*! exports provided: PermissionGuard */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PermissionGuard", function() { return PermissionGuard; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _permission_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./permission.service */ "./src/app/permission.service.ts");




var PermissionGuard = /** @class */ (function () {
    function PermissionGuard(router, permissionService) {
        this.router = router;
        this.permissionService = permissionService;
    }
    PermissionGuard.prototype.canActivate = function (route, state) {
        var res = this.permissionService.passPermission(state.url);
        if (!res) {
            this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        }
        return res;
    };
    PermissionGuard.ctorParameters = function () { return [
        { type: _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"] },
        { type: _permission_service__WEBPACK_IMPORTED_MODULE_3__["PermissionService"] }
    ]; };
    PermissionGuard = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root'
        })
    ], PermissionGuard);
    return PermissionGuard;
}());



/***/ }),

/***/ "./src/app/permission.service.ts":
/*!***************************************!*\
  !*** ./src/app/permission.service.ts ***!
  \***************************************/
/*! exports provided: PermissionService, Menu */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PermissionService", function() { return PermissionService; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Menu", function() { return Menu; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _auth_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./auth.service */ "./src/app/auth.service.ts");




//import { User } from './user';
var PermissionService = /** @class */ (function () {
    function PermissionService(router, authService) {
        var _this = this;
        this.router = router;
        this.authService = authService;
        this.root = [
            new Menu("", false),
            new Menu("dashboard", true),
            new Menu("employee", true, ["Employee Read"]),
            new Menu("enum", true, ["Enum Read"]),
            new Menu("location", true, ["Location Read"]),
            new Menu("location/list", true, ["Location Read"]),
            new Menu("location/add", true, ["Location Add"]),
            new Menu("logout", true),
        ];
        this.authService.currentUser.subscribe(function (res) { return _this.currentUser = res; });
    }
    PermissionService.prototype.passPermission = function (path) {
        var res;
        var ms = this.root.filter(function (m) { return m.link == path.replace(/^\/|\/$/g, ''); });
        if (ms.length > 0) {
            var menu = ms[0];
            if (this.currentUser != null) {
                if (menu.permission.length == 0) {
                    res = true;
                }
                else {
                    for (var p = 0; p < menu.permission.length; p++) {
                        if (this.currentUser.Permission.indexOf(menu.permission[p]) != -1) {
                            res = true;
                        }
                    }
                }
            }
            else {
                res = !menu.auth;
            }
        }
        return res;
    };
    PermissionService.ctorParameters = function () { return [
        { type: _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"] },
        { type: _auth_service__WEBPACK_IMPORTED_MODULE_3__["AuthService"] }
    ]; };
    PermissionService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root'
        })
    ], PermissionService);
    return PermissionService;
}());

var Menu = /** @class */ (function () {
    function Menu(link, auth, permission) {
        if (permission === void 0) { permission = []; }
        this.link = link;
        this.auth = auth;
        this.permission = permission;
    }
    Menu.ctorParameters = function () { return [
        { type: String },
        { type: Boolean },
        { type: Array }
    ]; };
    return Menu;
}());



/***/ }),

/***/ "./src/app/selective-preloading-strategy.service.ts":
/*!**********************************************************!*\
  !*** ./src/app/selective-preloading-strategy.service.ts ***!
  \**********************************************************/
/*! exports provided: SelectivePreloadingStrategyService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SelectivePreloadingStrategyService", function() { return SelectivePreloadingStrategyService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");



var SelectivePreloadingStrategyService = /** @class */ (function () {
    function SelectivePreloadingStrategyService() {
        this.preloadedModules = [];
    }
    SelectivePreloadingStrategyService.prototype.preload = function (route, load) {
        if (route.data && route.data['preload']) {
            // add the route path to the preloaded module array
            this.preloadedModules.push(route.path);
            // log the route path to the console
            //console.log('Preloaded: ' + route.path);
            return load();
        }
        else {
            return Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["of"])(null);
        }
    };
    SelectivePreloadingStrategyService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root',
        })
    ], SelectivePreloadingStrategyService);
    return SelectivePreloadingStrategyService;
}());



/***/ }),

/***/ "./src/app/snackbar.component.ts":
/*!***************************************!*\
  !*** ./src/app/snackbar.component.ts ***!
  \***************************************/
/*! exports provided: SnackbarComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SnackbarComponent", function() { return SnackbarComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _snackbar_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./snackbar.service */ "./src/app/snackbar.service.ts");




var SnackbarComponent = /** @class */ (function () {
    function SnackbarComponent(snackBar, snackbarService) {
        var _this = this;
        this.snackBar = snackBar;
        this.snackbarService = snackbarService;
        this.open = false;
        snackbarService.status$.subscribe(function (obj) {
            _this.open = obj.open;
            if (_this.open) {
                _this.snackBar.open(obj.mesage, obj.action, obj.config);
            }
            else {
                _this.snackBar.dismiss();
            }
        });
    }
    SnackbarComponent.ctorParameters = function () { return [
        { type: _angular_material__WEBPACK_IMPORTED_MODULE_2__["MatSnackBar"] },
        { type: _snackbar_service__WEBPACK_IMPORTED_MODULE_3__["SnackbarService"] }
    ]; };
    SnackbarComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-snackbar-message',
            template: '<div></div>'
        })
    ], SnackbarComponent);
    return SnackbarComponent;
}());



/***/ }),

/***/ "./src/app/snackbar.service.ts":
/*!*************************************!*\
  !*** ./src/app/snackbar.service.ts ***!
  \*************************************/
/*! exports provided: SnackbarService, SnackbarApi */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SnackbarService", function() { return SnackbarService; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SnackbarApi", function() { return SnackbarApi; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");



var SnackbarService = /** @class */ (function () {
    function SnackbarService() {
        this.status = new rxjs__WEBPACK_IMPORTED_MODULE_2__["BehaviorSubject"](new SnackbarApi(false));
        this.status$ = this.status.asObservable();
    }
    SnackbarService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root'
        })
    ], SnackbarService);
    return SnackbarService;
}());

var SnackbarApi = /** @class */ (function () {
    function SnackbarApi(open, mesage, action, config) {
        if (open === void 0) { open = true; }
        if (mesage === void 0) { mesage = ''; }
        if (action === void 0) { action = ''; }
        if (config === void 0) { config = {}; }
        this.open = open;
        this.mesage = mesage;
        this.action = action;
        this.config = config;
    }
    SnackbarApi.ctorParameters = function () { return [
        { type: Boolean },
        { type: String },
        { type: String },
        { type: Object }
    ]; };
    return SnackbarApi;
}());



/***/ }),

/***/ "./src/app/xfilter/xfilter-dialog-tree.component.ts":
/*!**********************************************************!*\
  !*** ./src/app/xfilter/xfilter-dialog-tree.component.ts ***!
  \**********************************************************/
/*! exports provided: TodoItemNode, TodoItemFlatNode, ChecklistDatabase, xFilterDialogTreeComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TodoItemNode", function() { return TodoItemNode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TodoItemFlatNode", function() { return TodoItemFlatNode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ChecklistDatabase", function() { return ChecklistDatabase; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xFilterDialogTreeComponent", function() { return xFilterDialogTreeComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_cdk_collections__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/cdk/collections */ "./node_modules/@angular/cdk/esm5/collections.es5.js");
/* harmony import */ var _angular_cdk_tree__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/cdk/tree */ "./node_modules/@angular/cdk/esm5/tree.es5.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_material_tree__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material/tree */ "./node_modules/@angular/material/esm5/tree.es5.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");







/**
 * Node for to-do item
 */
var TodoItemNode = /** @class */ (function () {
    function TodoItemNode() {
    }
    return TodoItemNode;
}());

/** Flat to-do item node with expandable and level information */
var TodoItemFlatNode = /** @class */ (function () {
    function TodoItemFlatNode() {
    }
    return TodoItemFlatNode;
}());

/**
 * The Json object for to-do list data.
 */
var TREE_DATA = {
    Groceries: {
        'Almond Meal flour': null,
        'Organic eggs': null,
        'Protein Powder': null,
        Fruits: {
            Apple: null,
            Berries: ['Blueberry', 'Raspberry'],
            Orange: null
        }
    },
    Reminders: [
        'Cook dinner',
        'Read the Material Design spec',
        'Upgrade Application to Angular'
    ]
};
/**
 * Checklist database, it can build a tree structured Json object.
 * Each node in Json object represents a to-do item or a category.
 * If a node is a category, it has children items and new items can be added under the category.
 */
var ChecklistDatabase = /** @class */ (function () {
    function ChecklistDatabase() {
        this.dataChange = new rxjs__WEBPACK_IMPORTED_MODULE_5__["BehaviorSubject"]([]);
        this.initialize();
    }
    Object.defineProperty(ChecklistDatabase.prototype, "data", {
        get: function () { return this.dataChange.value; },
        enumerable: true,
        configurable: true
    });
    ChecklistDatabase.prototype.initialize = function () {
        // Build the tree nodes from Json object. The result is a list of `TodoItemNode` with nested
        //     file node as children.
        var data = this.buildFileTree(TREE_DATA, 0);
        // Notify the change.
        this.dataChange.next(data);
    };
    /**
     * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
     * The return value is the list of `TodoItemNode`.
     */
    ChecklistDatabase.prototype.buildFileTree = function (obj, level) {
        var _this = this;
        return Object.keys(obj).reduce(function (accumulator, key) {
            var value = obj[key];
            var node = new TodoItemNode();
            node.item = key;
            if (value != null) {
                if (typeof value === 'object') {
                    node.children = _this.buildFileTree(value, level + 1);
                }
                else {
                    node.value = value;
                }
            }
            return accumulator.concat(node);
        }, []);
    };
    /** Add an item to to-do list */
    ChecklistDatabase.prototype.insertItem = function (parent, name) {
        if (parent.children) {
            parent.children.push({ item: name });
            this.dataChange.next(this.data);
        }
    };
    ChecklistDatabase.prototype.updateItem = function (node, name) {
        node.item = name;
        this.dataChange.next(this.data);
    };
    ChecklistDatabase = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Injectable"])()
    ], ChecklistDatabase);
    return ChecklistDatabase;
}());

/**
 * @title Tree with checkboxes
 */
var xFilterDialogTreeComponent = /** @class */ (function () {
    function xFilterDialogTreeComponent(_database) {
        var _this = this;
        this._database = _database;
        /** Map from flat node to nested node. This helps us finding the nested node to be modified */
        this.flatNodeMap = new Map();
        /** Map from nested node to flattened node. This helps us to keep the same object for selection */
        this.nestedNodeMap = new Map();
        /** A selected parent node to be inserted */
        this.selectedParent = null;
        /** The new item's name */
        this.newItemName = '';
        /** The selection for checklist */
        this.checklistSelection = new _angular_cdk_collections__WEBPACK_IMPORTED_MODULE_1__["SelectionModel"](true /* multiple */);
        this.getLevel = function (node) { return node.level; };
        this.isExpandable = function (node) { return node.expandable; };
        this.getChildren = function (node) { return node.children; };
        this.hasChild = function (_, _nodeData) { return _nodeData.expandable; };
        this.hasNoContent = function (_, _nodeData) { return _nodeData.item === ''; };
        /**
         * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
         */
        this.transformer = function (node, level) {
            var existingNode = _this.nestedNodeMap.get(node);
            var flatNode = existingNode && existingNode.item === node.item
                ? existingNode
                : new TodoItemFlatNode();
            flatNode.item = node.item;
            flatNode.level = level;
            flatNode.expandable = node.children ? !!node.children.length : false;
            flatNode.value = node.value;
            _this.flatNodeMap.set(flatNode, node);
            _this.nestedNodeMap.set(node, flatNode);
            return flatNode;
        };
        this.treeFlattener = new _angular_material_tree__WEBPACK_IMPORTED_MODULE_4__["MatTreeFlattener"](this.transformer, this.getLevel, this.isExpandable, this.getChildren);
        this.treeControl = new _angular_cdk_tree__WEBPACK_IMPORTED_MODULE_2__["FlatTreeControl"](this.getLevel, this.isExpandable);
        this.dataSource = new _angular_material_tree__WEBPACK_IMPORTED_MODULE_4__["MatTreeFlatDataSource"](this.treeControl, this.treeFlattener);
        _database.dataChange.subscribe(function (data) {
            _this.dataSource.data = data;
        });
        this.database = _database;
    }
    Object.defineProperty(xFilterDialogTreeComponent.prototype, "select_all_checked", {
        //@Input() selected: any;
        set: function (checked) {
            var _this = this;
            console.log(this.checklistSelection);
            console.log(this.treeControl);
            if (checked) {
                this.treeControl.dataNodes.filter(function (n) { return !_this.checklistSelection.isSelected(n); }).map(function (n) { return _this.checklistSelection.toggle(n); });
            }
            else {
                this.treeControl.dataNodes.filter(function (n) { return _this.checklistSelection.isSelected(n); }).map(function (n) { return _this.checklistSelection.toggle(n); });
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(xFilterDialogTreeComponent.prototype, "items", {
        set: function (value) {
            var _this = this;
            var e_1, _a, e_2, _b, e_3, _c;
            var tree_items = {};
            for (var i in value) {
                var year = Object(_angular_common__WEBPACK_IMPORTED_MODULE_6__["formatDate"])(value[i], 'y', 'en-US');
                var month = Object(_angular_common__WEBPACK_IMPORTED_MODULE_6__["formatDate"])(value[i], 'MMMM', 'en-US');
                var date = Object(_angular_common__WEBPACK_IMPORTED_MODULE_6__["formatDate"])(value[i], 'dd ', 'en-US');
                if (tree_items[year] == null) {
                    tree_items[year] = {};
                    for (var m = 1; m <= 12; m++) {
                        tree_items[year][Object(_angular_common__WEBPACK_IMPORTED_MODULE_6__["formatDate"])('2020-' + m + '-1', 'MMMM', 'en-US')] = null;
                    }
                }
                if (tree_items[year][month] == null) {
                    tree_items[year][month] = {};
                    for (var d = 1; d <= 31; d++) {
                        tree_items[year][month][String(d).padStart(2, "0") + " "] = null;
                    }
                }
                tree_items[year][month][date] = value[i];
            }
            try {
                for (var _d = tslib__WEBPACK_IMPORTED_MODULE_0__["__values"](Object.entries(tree_items)), _e = _d.next(); !_e.done; _e = _d.next()) {
                    var _f = tslib__WEBPACK_IMPORTED_MODULE_0__["__read"](_e.value, 2), y = _f[0], year_1 = _f[1];
                    try {
                        for (var _g = tslib__WEBPACK_IMPORTED_MODULE_0__["__values"](Object.entries(year_1)), _h = _g.next(); !_h.done; _h = _g.next()) {
                            var _j = tslib__WEBPACK_IMPORTED_MODULE_0__["__read"](_h.value, 2), m_1 = _j[0], month_1 = _j[1];
                            if (year_1[m_1] == null) {
                                delete year_1[m_1];
                            }
                            else {
                                try {
                                    for (var _k = tslib__WEBPACK_IMPORTED_MODULE_0__["__values"](Object.entries(month_1)), _l = _k.next(); !_l.done; _l = _k.next()) {
                                        var _m = tslib__WEBPACK_IMPORTED_MODULE_0__["__read"](_l.value, 2), d_1 = _m[0], date_1 = _m[1];
                                        if (month_1[d_1] == null) {
                                            delete month_1[d_1];
                                        }
                                    }
                                }
                                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                                finally {
                                    try {
                                        if (_l && !_l.done && (_c = _k.return)) _c.call(_k);
                                    }
                                    finally { if (e_3) throw e_3.error; }
                                }
                            }
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (_h && !_h.done && (_b = _g.return)) _b.call(_g);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
                }
                finally { if (e_1) throw e_1.error; }
            }
            this.database.dataChange.next(this.database.buildFileTree(tree_items, 0));
            //this.treeControl.expandAll();
            this.treeControl.dataNodes
                .filter(function (n) { return _this.list.selectedOptions.selected.map(function (s) { return s.value; }).indexOf(n.value) != -1; })
                .map(function (e) { return (e.expandable) ? _this.todoItemSelectionToggle(e) : _this.todoLeafItemSelectionToggle(e); });
            ;
        },
        enumerable: true,
        configurable: true
    });
    xFilterDialogTreeComponent.prototype.updateSelected = function () {
        var _this = this;
        this.list.deselectAll();
        this.list.options
            .filter(function (o) { return _this.checklistSelection.selected.map(function (s) { return s.value; }).indexOf(o.value) != -1; })
            .map(function (i) { return i.selected = true; });
        //console.log(this.list.selectedOptions.selected.length +' '+ this.list.options.length)
        if (this.list.options.length > 0)
            this.select_all.checked = this.list.selectedOptions.selected.length == this.list.options.length;
    };
    /** Whether all the descendants of the node are selected. */
    xFilterDialogTreeComponent.prototype.descendantsAllSelected = function (node) {
        var _this = this;
        var descendants = this.treeControl.getDescendants(node);
        var descAllSelected = descendants.length > 0 && descendants.every(function (child) {
            return _this.checklistSelection.isSelected(child);
        });
        return descAllSelected;
    };
    /** Whether part of the descendants are selected */
    xFilterDialogTreeComponent.prototype.descendantsPartiallySelected = function (node) {
        var _this = this;
        var descendants = this.treeControl.getDescendants(node);
        var result = descendants.some(function (child) { return _this.checklistSelection.isSelected(child); });
        return result && !this.descendantsAllSelected(node);
    };
    /** Toggle the to-do item selection. Select/deselect all the descendants node */
    xFilterDialogTreeComponent.prototype.todoItemSelectionToggle = function (node) {
        var _this = this;
        var _a, _b;
        this.checklistSelection.toggle(node);
        var descendants = this.treeControl.getDescendants(node);
        this.checklistSelection.isSelected(node)
            ? (_a = this.checklistSelection).select.apply(_a, tslib__WEBPACK_IMPORTED_MODULE_0__["__spread"](descendants)) : (_b = this.checklistSelection).deselect.apply(_b, tslib__WEBPACK_IMPORTED_MODULE_0__["__spread"](descendants));
        // Force update for the parent
        descendants.forEach(function (child) { return _this.checklistSelection.isSelected(child); });
        this.updateSelected();
        this.checkAllParentsSelection(node);
    };
    /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
    xFilterDialogTreeComponent.prototype.todoLeafItemSelectionToggle = function (node) {
        this.checklistSelection.toggle(node);
        this.updateSelected();
        this.checkAllParentsSelection(node);
    };
    /* Checks all the parents when a leaf node is selected/unselected */
    xFilterDialogTreeComponent.prototype.checkAllParentsSelection = function (node) {
        var parent = this.getParentNode(node);
        while (parent) {
            this.checkRootNodeSelection(parent);
            parent = this.getParentNode(parent);
        }
    };
    /** Check root node checked state and change it accordingly */
    xFilterDialogTreeComponent.prototype.checkRootNodeSelection = function (node) {
        var _this = this;
        var nodeSelected = this.checklistSelection.isSelected(node);
        var descendants = this.treeControl.getDescendants(node);
        var descAllSelected = descendants.length > 0 && descendants.every(function (child) {
            return _this.checklistSelection.isSelected(child);
        });
        if (nodeSelected && !descAllSelected) {
            this.checklistSelection.deselect(node);
        }
        else if (!nodeSelected && descAllSelected) {
            this.checklistSelection.select(node);
        }
    };
    /* Get the parent node of a node */
    xFilterDialogTreeComponent.prototype.getParentNode = function (node) {
        var currentLevel = this.getLevel(node);
        if (currentLevel < 1) {
            return null;
        }
        var startIndex = this.treeControl.dataNodes.indexOf(node) - 1;
        for (var i = startIndex; i >= 0; i--) {
            var currentNode = this.treeControl.dataNodes[i];
            if (this.getLevel(currentNode) < currentLevel) {
                return currentNode;
            }
        }
        return null;
    };
    /** Select the category so we can insert the new item. */
    xFilterDialogTreeComponent.prototype.addNewItem = function (node) {
        var parentNode = this.flatNodeMap.get(node);
        this._database.insertItem(parentNode, '');
        this.treeControl.expand(node);
    };
    /** Save the node to database */
    xFilterDialogTreeComponent.prototype.saveNode = function (node, itemValue) {
        var nestedNode = this.flatNodeMap.get(node);
        this._database.updateItem(nestedNode, itemValue);
    };
    xFilterDialogTreeComponent.ctorParameters = function () { return [
        { type: ChecklistDatabase }
    ]; };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Input"])()
    ], xFilterDialogTreeComponent.prototype, "list", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Input"])()
    ], xFilterDialogTreeComponent.prototype, "select_all", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Input"])()
    ], xFilterDialogTreeComponent.prototype, "select_all_checked", null);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Input"])()
    ], xFilterDialogTreeComponent.prototype, "items", null);
    xFilterDialogTreeComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Component"])({
            selector: 'app-xfilter-dialog-tree',
            template: __webpack_require__(/*! raw-loader!./xfilter-dialog-tree.component.html */ "./node_modules/raw-loader/index.js!./src/app/xfilter/xfilter-dialog-tree.component.html"),
            providers: [ChecklistDatabase],
            styles: [__webpack_require__(/*! ./xfilter.component.scss */ "./src/app/xfilter/xfilter.component.scss")]
        })
    ], xFilterDialogTreeComponent);
    return xFilterDialogTreeComponent;
}());



/***/ }),

/***/ "./src/app/xfilter/xfilter.component.scss":
/*!************************************************!*\
  !*** ./src/app/xfilter/xfilter.component.scss ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".mat-dialog-content {\n  position: relative;\n}\n\n.loading-shade {\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  background: rgba(0, 0, 0, 0.15);\n  z-index: 999;\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n  -webkit-box-pack: center;\n          justify-content: center;\n}\n\n::ng-deep .mat-dialog-container {\n  padding: 12px 24px 18px 12px !important;\n  overflow: hidden !important;\n}\n\n::ng-deep .mat-dialog-container .mat-dialog-title {\n  margin: 0px !important;\n  font-size: 15px !important;\n}\n\n::ng-deep .mat-dialog-container .mat-dialog-content {\n  padding: 0 0 0 24px !important;\n}\n\n.mat-selection-list .mat-list-option,\n.mat-tree .mat-tree-node {\n  height: 32px !important;\n  min-height: 32px !important;\n}\n\n.mat-selection-list .mat-list-option.number {\n  text-align: right !important;\n}\n\n.x-active {\n  color: #c00 !important;\n}\n\n.opr-number {\n  width: 200px;\n  margin-right: 10px;\n}\n\n.input-hidden {\n  position: absolute;\n  width: 0px;\n  border: none;\n  height: 100%;\n}\n\n.group-dialog .mat-form-field,\n.group-dialog .mat-radio-button {\n  margin-right: 10px !important;\n}\n\n::ng-deep .mat-select-panel .mat-option {\n  height: 32px !important;\n}\n\n::ng-deep .mat-menu-content .mat-menu-item {\n  height: 32px !important;\n  line-height: 32px !important;\n}\n\n::ng-deep .icon-filter {\n  font-size: 16px;\n  padding: 5px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAveGZpbHRlci9EOlxccGVwLWFwcF9uZXdcXHNzY1xcQ2xpZW50QXBwL3NyY1xcYXBwXFx4ZmlsdGVyXFx4ZmlsdGVyLmNvbXBvbmVudC5zY3NzIiwic3JjL2FwcC94ZmlsdGVyL3hmaWx0ZXIuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxrQkFBQTtBQ0NGOztBREVBO0VBQ0Usa0JBQUE7RUFDQSxNQUFBO0VBQ0EsT0FBQTtFQUNBLFNBQUE7RUFDQSxRQUFBO0VBQ0EsK0JBQUE7RUFDQSxZQUFBO0VBQ0Esb0JBQUE7RUFBQSxhQUFBO0VBQ0EseUJBQUE7VUFBQSxtQkFBQTtFQUNBLHdCQUFBO1VBQUEsdUJBQUE7QUNDRjs7QURFQTtFQUNFLHVDQUFBO0VBQ0EsMkJBQUE7QUNDRjs7QURFQTtFQUNFLHNCQUFBO0VBQ0EsMEJBQUE7QUNDRjs7QURFQTtFQUNFLDhCQUFBO0FDQ0Y7O0FERUE7O0VBRUUsdUJBQUE7RUFDQSwyQkFBQTtBQ0NGOztBREVBO0VBQ0UsNEJBQUE7QUNDRjs7QURFQTtFQUNFLHNCQUFBO0FDQ0Y7O0FERUE7RUFDRSxZQUFBO0VBQ0Esa0JBQUE7QUNDRjs7QURFQTtFQUNJLGtCQUFBO0VBQ0EsVUFBQTtFQUNBLFlBQUE7RUFDQSxZQUFBO0FDQ0o7O0FERUE7O0VBRUUsNkJBQUE7QUNDRjs7QURFQTtFQUNFLHVCQUFBO0FDQ0Y7O0FERUE7RUFDRSx1QkFBQTtFQUNBLDRCQUFBO0FDQ0Y7O0FERUE7RUFDRSxlQUFBO0VBQ0EsWUFBQTtBQ0NGIiwiZmlsZSI6InNyYy9hcHAveGZpbHRlci94ZmlsdGVyLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLm1hdC1kaWFsb2ctY29udGVudCB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbn1cblxuLmxvYWRpbmctc2hhZGUge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogMDtcbiAgbGVmdDogMDtcbiAgYm90dG9tOiAwO1xuICByaWdodDogMDtcbiAgYmFja2dyb3VuZDogcmdiYSgwLCAwLCAwLCAwLjE1KTtcbiAgei1pbmRleDogOTk5O1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbn1cblxuOjpuZy1kZWVwIC5tYXQtZGlhbG9nLWNvbnRhaW5lciB7XG4gIHBhZGRpbmc6IDEycHggMjRweCAxOHB4IDEycHggIWltcG9ydGFudDtcbiAgb3ZlcmZsb3c6IGhpZGRlbiAhaW1wb3J0YW50O1xufVxuXG46Om5nLWRlZXAgLm1hdC1kaWFsb2ctY29udGFpbmVyIC5tYXQtZGlhbG9nLXRpdGxlIHtcbiAgbWFyZ2luOiAwcHggIWltcG9ydGFudDtcbiAgZm9udC1zaXplOiAxNXB4ICFpbXBvcnRhbnQ7XG59XG5cbjo6bmctZGVlcCAubWF0LWRpYWxvZy1jb250YWluZXIgLm1hdC1kaWFsb2ctY29udGVudCB7XG4gIHBhZGRpbmc6IDAgMCAwIDI0cHggIWltcG9ydGFudDtcbn1cblxuLm1hdC1zZWxlY3Rpb24tbGlzdCAubWF0LWxpc3Qtb3B0aW9uLFxuLm1hdC10cmVlIC5tYXQtdHJlZS1ub2RlIHtcbiAgaGVpZ2h0OiAzMnB4ICFpbXBvcnRhbnQ7XG4gIG1pbi1oZWlnaHQ6IDMycHggIWltcG9ydGFudDtcbn1cblxuLm1hdC1zZWxlY3Rpb24tbGlzdCAubWF0LWxpc3Qtb3B0aW9uLm51bWJlciB7XG4gIHRleHQtYWxpZ246IHJpZ2h0ICFpbXBvcnRhbnQ7XG59XG5cbi54LWFjdGl2ZSB7XG4gIGNvbG9yOiAjYzAwICFpbXBvcnRhbnQ7XG59XG5cbi5vcHItbnVtYmVyIHtcbiAgd2lkdGg6IDIwMHB4O1xuICBtYXJnaW4tcmlnaHQ6IDEwcHg7XG59XG5cbi5pbnB1dC1oaWRkZW4ge1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICB3aWR0aDogMHB4O1xuICAgIGJvcmRlcjogbm9uZTtcbiAgICBoZWlnaHQ6IDEwMCU7XG59XG5cbi5ncm91cC1kaWFsb2cgLm1hdC1mb3JtLWZpZWxkLFxuLmdyb3VwLWRpYWxvZyAubWF0LXJhZGlvLWJ1dHRvbiwge1xuICBtYXJnaW4tcmlnaHQ6IDEwcHggIWltcG9ydGFudDtcbn1cblxuOjpuZy1kZWVwIC5tYXQtc2VsZWN0LXBhbmVsIC5tYXQtb3B0aW9uIHtcbiAgaGVpZ2h0OiAzMnB4ICFpbXBvcnRhbnQ7XG59XG5cbjo6bmctZGVlcCAubWF0LW1lbnUtY29udGVudCAubWF0LW1lbnUtaXRlbSB7XG4gIGhlaWdodDogMzJweCAhaW1wb3J0YW50O1xuICBsaW5lLWhlaWdodDogMzJweCAhaW1wb3J0YW50O1xufVxuXG46Om5nLWRlZXAgLmljb24tZmlsdGVyIHtcbiAgZm9udC1zaXplIDogMTZweDtcbiAgcGFkZGluZyA6IDVweDtcbiAgXG59XG5cbiIsIi5tYXQtZGlhbG9nLWNvbnRlbnQge1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG59XG5cbi5sb2FkaW5nLXNoYWRlIHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB0b3A6IDA7XG4gIGxlZnQ6IDA7XG4gIGJvdHRvbTogMDtcbiAgcmlnaHQ6IDA7XG4gIGJhY2tncm91bmQ6IHJnYmEoMCwgMCwgMCwgMC4xNSk7XG4gIHotaW5kZXg6IDk5OTtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG59XG5cbjo6bmctZGVlcCAubWF0LWRpYWxvZy1jb250YWluZXIge1xuICBwYWRkaW5nOiAxMnB4IDI0cHggMThweCAxMnB4ICFpbXBvcnRhbnQ7XG4gIG92ZXJmbG93OiBoaWRkZW4gIWltcG9ydGFudDtcbn1cblxuOjpuZy1kZWVwIC5tYXQtZGlhbG9nLWNvbnRhaW5lciAubWF0LWRpYWxvZy10aXRsZSB7XG4gIG1hcmdpbjogMHB4ICFpbXBvcnRhbnQ7XG4gIGZvbnQtc2l6ZTogMTVweCAhaW1wb3J0YW50O1xufVxuXG46Om5nLWRlZXAgLm1hdC1kaWFsb2ctY29udGFpbmVyIC5tYXQtZGlhbG9nLWNvbnRlbnQge1xuICBwYWRkaW5nOiAwIDAgMCAyNHB4ICFpbXBvcnRhbnQ7XG59XG5cbi5tYXQtc2VsZWN0aW9uLWxpc3QgLm1hdC1saXN0LW9wdGlvbixcbi5tYXQtdHJlZSAubWF0LXRyZWUtbm9kZSB7XG4gIGhlaWdodDogMzJweCAhaW1wb3J0YW50O1xuICBtaW4taGVpZ2h0OiAzMnB4ICFpbXBvcnRhbnQ7XG59XG5cbi5tYXQtc2VsZWN0aW9uLWxpc3QgLm1hdC1saXN0LW9wdGlvbi5udW1iZXIge1xuICB0ZXh0LWFsaWduOiByaWdodCAhaW1wb3J0YW50O1xufVxuXG4ueC1hY3RpdmUge1xuICBjb2xvcjogI2MwMCAhaW1wb3J0YW50O1xufVxuXG4ub3ByLW51bWJlciB7XG4gIHdpZHRoOiAyMDBweDtcbiAgbWFyZ2luLXJpZ2h0OiAxMHB4O1xufVxuXG4uaW5wdXQtaGlkZGVuIHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB3aWR0aDogMHB4O1xuICBib3JkZXI6IG5vbmU7XG4gIGhlaWdodDogMTAwJTtcbn1cblxuLmdyb3VwLWRpYWxvZyAubWF0LWZvcm0tZmllbGQsXG4uZ3JvdXAtZGlhbG9nIC5tYXQtcmFkaW8tYnV0dG9uIHtcbiAgbWFyZ2luLXJpZ2h0OiAxMHB4ICFpbXBvcnRhbnQ7XG59XG5cbjo6bmctZGVlcCAubWF0LXNlbGVjdC1wYW5lbCAubWF0LW9wdGlvbiB7XG4gIGhlaWdodDogMzJweCAhaW1wb3J0YW50O1xufVxuXG46Om5nLWRlZXAgLm1hdC1tZW51LWNvbnRlbnQgLm1hdC1tZW51LWl0ZW0ge1xuICBoZWlnaHQ6IDMycHggIWltcG9ydGFudDtcbiAgbGluZS1oZWlnaHQ6IDMycHggIWltcG9ydGFudDtcbn1cblxuOjpuZy1kZWVwIC5pY29uLWZpbHRlciB7XG4gIGZvbnQtc2l6ZTogMTZweDtcbiAgcGFkZGluZzogNXB4O1xufSJdfQ== */"

/***/ }),

/***/ "./src/app/xfilter/xfilter.component.ts":
/*!**********************************************!*\
  !*** ./src/app/xfilter/xfilter.component.ts ***!
  \**********************************************/
/*! exports provided: xFilterService, xFilterComponent, xFilterDialogComponent, xFilterDialogNumberComponent, xFilterDialogDateComponent, xFilterDialogTextComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xFilterService", function() { return xFilterService; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xFilterComponent", function() { return xFilterComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xFilterDialogComponent", function() { return xFilterDialogComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xFilterDialogNumberComponent", function() { return xFilterDialogNumberComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xFilterDialogDateComponent", function() { return xFilterDialogDateComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xFilterDialogTextComponent", function() { return xFilterDialogTextComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/dialog */ "./node_modules/@angular/material/esm5/dialog.es5.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");







var xFilterService = /** @class */ (function () {
    function xFilterService() {
        this.update = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.currentFilter = new rxjs__WEBPACK_IMPORTED_MODULE_4__["BehaviorSubject"]("");
        this.currentSelected = new rxjs__WEBPACK_IMPORTED_MODULE_4__["BehaviorSubject"]("");
    }
    Object.defineProperty(xFilterService.prototype, "filter", {
        get: function () {
            return this.currentFilter.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(xFilterService.prototype, "selected", {
        get: function () {
            return this.currentSelected.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    xFilterService.prototype.resetFilter = function () {
        this.currentFilter = new rxjs__WEBPACK_IMPORTED_MODULE_4__["BehaviorSubject"]("");
        this.currentSelected = new rxjs__WEBPACK_IMPORTED_MODULE_4__["BehaviorSubject"]("");
    };
    xFilterService.prototype.updateFilter = function (filter) {
        this.currentFilter.next(filter);
    };
    xFilterService.prototype.updateItems = function (data) {
        this.update.emit(data);
    };
    xFilterService.prototype.updateSelected = function (selected) {
        this.currentSelected.next(selected);
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])()
    ], xFilterService.prototype, "update", void 0);
    xFilterService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root'
        })
    ], xFilterService);
    return xFilterService;
}());

var xFilterComponent = /** @class */ (function () {
    function xFilterComponent(dialog, xfilterService) {
        this.dialog = dialog;
        this.xfilterService = xfilterService;
    }
    xFilterComponent.prototype.ngOnInit = function () {
    };
    xFilterComponent.prototype.openDialog = function () {
        var _this = this;
        var dialogRef = this.dialog.open(xFilterDialogComponent, {
            width: '250px',
            data: { column: this.column, selected: this.selected, title: this.title, format: this.format }
        });
        console.log(this.selected);
        dialogRef.afterClosed().subscribe(function (res) {
            if (res)
                _this.xfilterService.updateSelected({ column: _this.column, selected: res });
        });
    };
    xFilterComponent.prototype.ngOnDestroy = function () {
        this.xfilterService.resetFilter();
    };
    xFilterComponent.ctorParameters = function () { return [
        { type: _angular_material_dialog__WEBPACK_IMPORTED_MODULE_2__["MatDialog"] },
        { type: xFilterService }
    ]; };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])()
    ], xFilterComponent.prototype, "column", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])()
    ], xFilterComponent.prototype, "title", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])()
    ], xFilterComponent.prototype, "selected", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])()
    ], xFilterComponent.prototype, "format", void 0);
    xFilterComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-xfilter',
            template: __webpack_require__(/*! raw-loader!./xfilter.component.html */ "./node_modules/raw-loader/index.js!./src/app/xfilter/xfilter.component.html"),
            styles: [__webpack_require__(/*! ./xfilter.component.scss */ "./src/app/xfilter/xfilter.component.scss")]
        })
    ], xFilterComponent);
    return xFilterComponent;
}());

var xFilterDialogComponent = /** @class */ (function () {
    function xFilterDialogComponent(dialogRef, xfilterService, dialog, data) {
        this.dialogRef = dialogRef;
        this.xfilterService = xfilterService;
        this.dialog = dialog;
        this.data = data;
        this.list_items = [];
        this.listControl = new _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormControl"]('');
        this.itemFilter = new _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormControl"]('');
        this.isLoadingResults = false;
        this.text_filters = {
            "eq": "Equals...",
            "ne": "Does Not Equals...$",
            "bw": "Begins With...",
            "ew": "Ends With...$",
            "ct": "Contains...",
            "nct": "Does Not Contains...$",
            "custom": "Custom Filter",
        };
        this.number_filters = {
            "eq": "Equals...",
            "ne": "Does Not Equals...$",
            "gt": "Greater Than...",
            "gte": "Greater Than or Equal to...",
            "lt": "Less Than...",
            "lte": "Less Than or Equal to...",
            "gte_lte": "Between...$",
            "custom": "Custom Filter",
        };
        this.date_filters = {
            "eq": "Equals...$",
            "lt": "Before...",
            "gt": "After...",
            "gte_lte": "Between...$",
            "d +1": "Tomorrow",
            "d +0": "Today",
            "d -1": "Yesterday$",
            "m +1": "Next Month",
            "m +0": "This Month",
            "m -1": "Last Month$",
            "y +1": "Next Year",
            "y +0": "This Year",
            "y -1": "Last Year$",
            "custom": "Custom Filter",
        };
    }
    xFilterDialogComponent.prototype.ngOnInit = function () {
        var _this = this;
        var init = true;
        this.isLoadingResults = true;
        this.title = this.data["title"] ? this.data["title"] : this.data["column"];
        this.format = this.data["format"] ? this.data["format"] : "string";
        this.xfilterService.updateFilter({ column: this.data["column"] });
        console.log("sampai sini kah" + this.data["column"]);
        this.itemFilter.valueChanges.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["debounceTime"])(300)).subscribe(function (res) {
            console.log("sampai sini kah 2" + _this.data["column"]);
            _this.isLoadingResults = true;
            _this.xfilterService.updateFilter({ column: _this.data["column"], filter: res });
        });
        this.filterSubscription = this.xfilterService.update.subscribe(function (res) {
            console.log("sampai sini kah 3" + res);
            _this.isLoadingResults = false;
            if (res["column"] == _this.data["column"]) {
                _this.list_items = res["items"];
                console.log(_this.list_items);
                _this.select_all.checked = (_this.list.selectedOptions.selected.length == _this.list.options.length);
                console.log(_this.data["column"] + ' ' + _this.list.selectedOptions.selected.length + ' ' + _this.list.options.length + ' ' + _this.list_items.length);
            }
        });
    };
    xFilterDialogComponent.prototype.ngOnDestroy = function () {
        this.filterSubscription.unsubscribe();
    };
    xFilterDialogComponent.prototype.toggleItem = function (item, selected) {
        if (!selected)
            this.select_all.checked = false;
        if (this.list.selectedOptions.selected.length == this.list.options.length)
            this.select_all.checked = true;
    };
    xFilterDialogComponent.prototype.toggleSelectAll = function () {
        if (this.select_all.checked) {
            this.list.selectAll();
        }
        else {
            this.list.deselectAll();
        }
        this.select_all_checked = this.select_all.checked;
    };
    xFilterDialogComponent.prototype.isDefaultSelected = function (item) {
        return this.data["selected"].filter(function (d) { return d == item; }).length > 0 || this.data["selected"].length == 0;
    };
    xFilterDialogComponent.prototype.clearFilter = function () {
        this.isLoadingResults = true;
        this.itemFilter.setValue("", { emitEvent: false });
        this.data["selected"] = [];
        this.xfilterService.updateFilter({ column: this.data["column"], clear: true });
    };
    xFilterDialogComponent.prototype.onOk = function () {
        var res;
        //console.log(this.list.options);
        console.log(this.list.selectedOptions.selected.length + " " + this.list.options.length + " " + this.data["selected"].length == 0 + " " + this.itemFilter.value);
        if (this.list.selectedOptions.selected.length == this.list.options.length && this.data["selected"].length == 0 && this.itemFilter.value == "") {
            res = [];
        }
        else {
            res = this.list.selectedOptions.selected.map(function (o) { return o.value; });
        }
        this.dialogRef.close(res);
    };
    xFilterDialogComponent.prototype.onCancel = function () {
        this.dialogRef.close();
    };
    xFilterDialogComponent.prototype.formatItem = function (fmt, val) {
        switch (fmt) {
            case 'date':
                return Object(_angular_common__WEBPACK_IMPORTED_MODULE_5__["formatDate"])(val, 'dd MMM y', 'en-US');
            case 'datetime':
                return Object(_angular_common__WEBPACK_IMPORTED_MODULE_5__["formatDate"])(val, 'dd MMM y HH:mm', 'en-US');
            default:
                return val;
        }
    };
    xFilterDialogComponent.prototype.selectNumberFilter = function (predef) {
        this.openNumberDialog(predef);
    };
    xFilterDialogComponent.prototype.openNumberDialog = function (predef) {
        var _this = this;
        var dialogNumberRef = this.dialog.open(xFilterDialogNumberComponent, {
            width: 'auto',
            data: { selected: this.data["selected"], predef: predef }
        });
        dialogNumberRef.afterClosed().subscribe(function (res) {
            if (res)
                _this.xfilterService.updateSelected({ column: _this.data["column"], selected: res });
        });
        this.dialogRef.close();
    };
    xFilterDialogComponent.prototype.selectDateFilter = function (predef) {
        if (predef.indexOf(" ") == -1) {
            this.openDateDialog(predef);
        }
        else {
            var dt = new Date();
            dt.setHours(0, 0, 0, 0);
            var res = [];
            switch (predef) {
                case "d +1":
                    dt.setDate(dt.getDate() + 1);
                    res.push({ opr: "eq", val: dt.toISOString() });
                    break;
                case "d +0":
                    res.push({ opr: "eq", val: dt.toISOString() });
                    break;
                case "d -1":
                    dt.setDate(dt.getDate() - 1);
                    res.push({ opr: "eq", val: dt.toISOString() });
                    break;
                case "m +1":
                    var dt2 = new Date(dt.getFullYear(), dt.getMonth() + 2, 0);
                    dt.setMonth(dt.getMonth() + 1, 1);
                    res.push({ opr: "gte", val: dt.toISOString() });
                    res.push({ opr: "lte", val: dt2.toISOString() });
                    break;
                case "m +0":
                    var dt2 = new Date(dt.getFullYear(), dt.getMonth() + 1, 0);
                    dt.setDate(1);
                    res.push({ opr: "gte", val: dt.toISOString() });
                    res.push({ opr: "lte", val: dt2.toISOString() });
                    break;
                case "m -1":
                    var dt2 = new Date(dt.getFullYear(), dt.getMonth(), 0);
                    dt.setMonth(dt.getMonth() - 1, 1);
                    res.push({ opr: "gte", val: dt.toISOString() });
                    res.push({ opr: "lte", val: dt2.toISOString() });
                    break;
                case "y +1":
                    var dt2 = new Date(dt.getFullYear() + 1, 11, 31);
                    dt.setFullYear(dt.getFullYear() + 1);
                    dt.setMonth(0, 1);
                    res.push({ opr: "gte", val: dt.toISOString() });
                    res.push({ opr: "lte", val: dt2.toISOString() });
                    break;
                case "y +0":
                    var dt2 = new Date(dt.getFullYear(), 11, 31);
                    dt.setMonth(0, 1);
                    res.push({ opr: "gte", val: dt.toISOString() });
                    res.push({ opr: "lte", val: dt2.toISOString() });
                    break;
                case "y -1":
                    var dt2 = new Date(dt.getFullYear() - 1, 11, 31);
                    dt.setFullYear(dt.getFullYear() - 1);
                    dt.setMonth(0, 1);
                    res.push({ opr: "gte", val: dt.toISOString() });
                    res.push({ opr: "lte", val: dt2.toISOString() });
                    break;
            }
            res.map(function (r) {
                r["log"] = "and";
                r["predef"] = predef;
            });
            this.xfilterService.updateSelected({ column: this.data["column"], selected: res });
            this.dialogRef.close();
        }
    };
    xFilterDialogComponent.prototype.openDateDialog = function (predef) {
        var _this = this;
        var dialogDateRef = this.dialog.open(xFilterDialogDateComponent, {
            width: 'auto',
            data: { selected: this.data["selected"], predef: predef }
        });
        dialogDateRef.afterClosed().subscribe(function (res) {
            if (res)
                _this.xfilterService.updateSelected({ column: _this.data["column"], selected: res });
        });
        this.dialogRef.close();
    };
    xFilterDialogComponent.prototype.selectTextFilter = function (predef) {
        this.openTextDialog(predef);
    };
    xFilterDialogComponent.prototype.openTextDialog = function (predef) {
        var _this = this;
        var dialogTextRef = this.dialog.open(xFilterDialogTextComponent, {
            width: 'auto',
            data: { selected: this.data["selected"], predef: predef }
        });
        dialogTextRef.afterClosed().subscribe(function (res) {
            if (res)
                _this.xfilterService.updateSelected({ column: _this.data["column"], selected: res });
        });
        this.dialogRef.close();
    };
    xFilterDialogComponent.prototype.asIsOrder = function (a, b) {
        return -1;
    };
    xFilterDialogComponent.ctorParameters = function () { return [
        { type: _angular_material_dialog__WEBPACK_IMPORTED_MODULE_2__["MatDialogRef"] },
        { type: xFilterService },
        { type: _angular_material_dialog__WEBPACK_IMPORTED_MODULE_2__["MatDialog"] },
        { type: undefined, decorators: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Inject"], args: [_angular_material_dialog__WEBPACK_IMPORTED_MODULE_2__["MAT_DIALOG_DATA"],] }] }
    ]; };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('list', { static: true })
    ], xFilterDialogComponent.prototype, "list", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('select_all', { static: true })
    ], xFilterDialogComponent.prototype, "select_all", void 0);
    xFilterDialogComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-xfilter-dialog',
            template: __webpack_require__(/*! raw-loader!./xfilter-dialog.component.html */ "./node_modules/raw-loader/index.js!./src/app/xfilter/xfilter-dialog.component.html"),
            styles: [__webpack_require__(/*! ./xfilter.component.scss */ "./src/app/xfilter/xfilter.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__param"](3, Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Inject"])(_angular_material_dialog__WEBPACK_IMPORTED_MODULE_2__["MAT_DIALOG_DATA"]))
    ], xFilterDialogComponent);
    return xFilterDialogComponent;
}());

var xFilterDialogNumberComponent = /** @class */ (function () {
    function xFilterDialogNumberComponent(dialogNumberRef, xfilterService, data) {
        this.dialogNumberRef = dialogNumberRef;
        this.xfilterService = xfilterService;
        this.data = data;
        this.log = "and";
        this.operators = {
            "eq": "equal",
            "ne": "does not equal",
            "gt": "is greater than",
            "gte": "is greater than or equal to",
            "lt": "less than",
            "lte": "is less than or equal to",
        };
    }
    xFilterDialogNumberComponent.prototype.ngOnInit = function () {
        if (this.data["selected"].length > 0 && this.data["predef"] == this.data["selected"][0].predef) {
            for (var i = 1; i <= this.data["selected"].length; i++) {
                var sel = this.data["selected"][i - 1];
                if (typeof sel === "object") {
                    this["opr" + i] = sel["opr"];
                    this["val" + i] = sel["val"];
                    this.log = sel["log"];
                }
            }
        }
        else {
            var predef = this.data["predef"].split("_");
            for (var i = 1; i <= predef.length; i++) {
                this["opr" + i] = predef[i - 1];
                this.log = "and";
            }
        }
    };
    xFilterDialogNumberComponent.prototype.onOk = function () {
        var res = [];
        if (this.opr1 != null && this.val1 != null)
            res.push({ opr: this.opr1, val: Number(this.val1), log: this.log });
        if (this.opr2 != null && this.val2 != null)
            res.push({ opr: this.opr2, val: Number(this.val2), log: this.log });
        if (res.length > 0 && this.data["predef"] != null) {
            var predef = res.map(function (s) { return (s.opr) ? s.opr : ""; }).join("_");
            if (predef != this.data["predef"])
                predef = "custom";
            res.map(function (r) { return r.predef = predef; });
        }
        this.dialogNumberRef.close(res);
    };
    xFilterDialogNumberComponent.prototype.onCancel = function () {
        this.dialogNumberRef.close();
    };
    xFilterDialogNumberComponent.ctorParameters = function () { return [
        { type: _angular_material_dialog__WEBPACK_IMPORTED_MODULE_2__["MatDialogRef"] },
        { type: xFilterService },
        { type: undefined, decorators: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Inject"], args: [_angular_material_dialog__WEBPACK_IMPORTED_MODULE_2__["MAT_DIALOG_DATA"],] }] }
    ]; };
    xFilterDialogNumberComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-xfilter-number-dialog',
            template: __webpack_require__(/*! raw-loader!./xfilter-dialog-number.component.html */ "./node_modules/raw-loader/index.js!./src/app/xfilter/xfilter-dialog-number.component.html"),
            styles: [__webpack_require__(/*! ./xfilter.component.scss */ "./src/app/xfilter/xfilter.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__param"](2, Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Inject"])(_angular_material_dialog__WEBPACK_IMPORTED_MODULE_2__["MAT_DIALOG_DATA"]))
    ], xFilterDialogNumberComponent);
    return xFilterDialogNumberComponent;
}());

var xFilterDialogDateComponent = /** @class */ (function () {
    function xFilterDialogDateComponent(dialogDateRef, xfilterService, data) {
        this.dialogDateRef = dialogDateRef;
        this.xfilterService = xfilterService;
        this.data = data;
        this.log = "and";
        this.operators = {
            "eq": "equal",
            "ne": "does not equal",
            "gt": "is after",
            "gte": "is after or equal to",
            "lt": "is before",
            "lte": "is before or equal to",
        };
    }
    xFilterDialogDateComponent.prototype.ngOnInit = function () {
        if (this.data["selected"].length > 0 && this.data["predef"] == this.data["selected"][0].predef) {
            for (var i = 1; i <= this.data["selected"].length; i++) {
                var sel = this.data["selected"][i - 1];
                if (typeof sel === "object") {
                    this["opr" + i] = sel["opr"];
                    this["val" + i] = new Date(Date.parse(sel["val"]));
                    this["val" + i + "Input"] = this["val" + i].toLocaleDateString("en-US", { month: "short", year: "numeric", day: "numeric" });
                    this.log = sel["log"];
                }
            }
        }
        else {
            var predef = this.data["predef"].split("_");
            for (var i = 1; i <= predef.length; i++) {
                this["opr" + i] = predef[i - 1];
                this.log = "and";
            }
        }
    };
    xFilterDialogDateComponent.prototype.onOk = function () {
        var res = [];
        if (this.opr1 != null && this.val1 != null)
            res.push({ opr: this.opr1, val: this.val1.toISOString(), log: this.log });
        if (this.opr2 != null && this.val2 != null)
            res.push({ opr: this.opr2, val: this.val2.toISOString(), log: this.log });
        if (res.length > 0 && this.data["predef"] != null) {
            var predef = res.map(function (s) { return (s.opr) ? s.opr : ""; }).join("_");
            if (predef != this.data["predef"])
                predef = "custom";
            res.map(function (r) { return r.predef = predef; });
        }
        this.dialogDateRef.close(res);
    };
    xFilterDialogDateComponent.prototype.onCancel = function () {
        this.dialogDateRef.close();
    };
    xFilterDialogDateComponent.prototype.dateChange = function (evt, input) {
        this[input] = evt.value.toLocaleDateString("en-US", { month: "short", year: "numeric", day: "numeric" });
    };
    xFilterDialogDateComponent.ctorParameters = function () { return [
        { type: _angular_material_dialog__WEBPACK_IMPORTED_MODULE_2__["MatDialogRef"] },
        { type: xFilterService },
        { type: undefined, decorators: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Inject"], args: [_angular_material_dialog__WEBPACK_IMPORTED_MODULE_2__["MAT_DIALOG_DATA"],] }] }
    ]; };
    xFilterDialogDateComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-xfilter-date-dialog',
            template: __webpack_require__(/*! raw-loader!./xfilter-dialog-date.component.html */ "./node_modules/raw-loader/index.js!./src/app/xfilter/xfilter-dialog-date.component.html"),
            styles: [__webpack_require__(/*! ./xfilter.component.scss */ "./src/app/xfilter/xfilter.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__param"](2, Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Inject"])(_angular_material_dialog__WEBPACK_IMPORTED_MODULE_2__["MAT_DIALOG_DATA"]))
    ], xFilterDialogDateComponent);
    return xFilterDialogDateComponent;
}());

var xFilterDialogTextComponent = /** @class */ (function () {
    function xFilterDialogTextComponent(dialogTextRef, xfilterService, data) {
        this.dialogTextRef = dialogTextRef;
        this.xfilterService = xfilterService;
        this.data = data;
        this.log = "and";
        this.operators = {
            "eq": "equal",
            "ne": "does not equal",
            "bw": "begins with",
            "ew": "ends with",
            "ct": "contains",
            "nct": "does not contain",
        };
    }
    xFilterDialogTextComponent.prototype.ngOnInit = function () {
        if (this.data["selected"].length > 0 && this.data["predef"] == this.data["selected"][0].predef) {
            for (var i = 1; i <= this.data["selected"].length; i++) {
                var sel = this.data["selected"][i - 1];
                if (typeof sel === "object") {
                    this["opr" + i] = sel["opr"];
                    this["val" + i] = sel["val"];
                    this.log = sel["log"];
                }
            }
        }
        else {
            var predef = this.data["predef"].split("_");
            for (var i = 1; i <= predef.length; i++) {
                this["opr" + i] = predef[i - 1];
                this.log = "and";
            }
        }
    };
    xFilterDialogTextComponent.prototype.onOk = function () {
        var res = [];
        if (this.opr1 != null && this.val1 != null)
            res.push({ opr: this.opr1, val: this.val1, log: this.log });
        if (this.opr2 != null && this.val2 != null)
            res.push({ opr: this.opr2, val: this.val2, log: this.log });
        if (res.length > 0 && this.data["predef"] != null) {
            var predef = res.map(function (s) { return (s.opr) ? s.opr : ""; }).join("_");
            if (predef != this.data["predef"])
                predef = "custom";
            res.map(function (r) { return r.predef = predef; });
        }
        this.dialogTextRef.close(res);
    };
    xFilterDialogTextComponent.prototype.onCancel = function () {
        this.dialogTextRef.close();
    };
    xFilterDialogTextComponent.ctorParameters = function () { return [
        { type: _angular_material_dialog__WEBPACK_IMPORTED_MODULE_2__["MatDialogRef"] },
        { type: xFilterService },
        { type: undefined, decorators: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Inject"], args: [_angular_material_dialog__WEBPACK_IMPORTED_MODULE_2__["MAT_DIALOG_DATA"],] }] }
    ]; };
    xFilterDialogTextComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-xfilter-text-dialog',
            template: __webpack_require__(/*! raw-loader!./xfilter-dialog-text.component.html */ "./node_modules/raw-loader/index.js!./src/app/xfilter/xfilter-dialog-text.component.html"),
            styles: [__webpack_require__(/*! ./xfilter.component.scss */ "./src/app/xfilter/xfilter.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__param"](2, Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Inject"])(_angular_material_dialog__WEBPACK_IMPORTED_MODULE_2__["MAT_DIALOG_DATA"]))
    ], xFilterDialogTextComponent);
    return xFilterDialogTextComponent;
}());



/***/ }),

/***/ "./src/app/xfilter/xfilter.module.ts":
/*!*******************************************!*\
  !*** ./src/app/xfilter/xfilter.module.ts ***!
  \*******************************************/
/*! exports provided: xFilterModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xFilterModule", function() { return xFilterModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _material_material_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../material/material.module */ "./src/app/material/material.module.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _xfilter_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./xfilter.component */ "./src/app/xfilter/xfilter.component.ts");
/* harmony import */ var _xfilter_dialog_tree_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./xfilter-dialog-tree.component */ "./src/app/xfilter/xfilter-dialog-tree.component.ts");












var xFilterModule = /** @class */ (function () {
    function xFilterModule() {
    }
    xFilterModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["NgModule"])({
            declarations: [
                _xfilter_component__WEBPACK_IMPORTED_MODULE_5__["xFilterComponent"],
                _xfilter_component__WEBPACK_IMPORTED_MODULE_5__["xFilterDialogComponent"],
                _xfilter_component__WEBPACK_IMPORTED_MODULE_5__["xFilterDialogNumberComponent"],
                _xfilter_component__WEBPACK_IMPORTED_MODULE_5__["xFilterDialogDateComponent"],
                _xfilter_component__WEBPACK_IMPORTED_MODULE_5__["xFilterDialogTextComponent"],
                _xfilter_dialog_tree_component__WEBPACK_IMPORTED_MODULE_6__["xFilterDialogTreeComponent"],
            ],
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
                _material_material_module__WEBPACK_IMPORTED_MODULE_3__["MaterialModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormsModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_4__["ReactiveFormsModule"],
            ],
            exports: [
                _xfilter_component__WEBPACK_IMPORTED_MODULE_5__["xFilterComponent"],
                _xfilter_component__WEBPACK_IMPORTED_MODULE_5__["xFilterDialogComponent"],
                _xfilter_component__WEBPACK_IMPORTED_MODULE_5__["xFilterDialogNumberComponent"],
                _xfilter_component__WEBPACK_IMPORTED_MODULE_5__["xFilterDialogDateComponent"],
                _xfilter_component__WEBPACK_IMPORTED_MODULE_5__["xFilterDialogTextComponent"],
                _xfilter_dialog_tree_component__WEBPACK_IMPORTED_MODULE_6__["xFilterDialogTreeComponent"],
            ],
        })
    ], xFilterModule);
    return xFilterModule;
}());



/***/ }),

/***/ "./src/environments/environment.ts":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
var environment = {
    production: false
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser-dynamic */ "./node_modules/@angular/platform-browser-dynamic/fesm5/platform-browser-dynamic.js");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "./src/app/app.module.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./environments/environment */ "./src/environments/environment.ts");




if (_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
}
Object(_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__["platformBrowserDynamic"])().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])
    .catch(function (err) { return console.error(err); });


/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! D:\pep-app_new\ssc\ClientApp\src\main.ts */"./src/main.ts");


/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main-es5.js.map