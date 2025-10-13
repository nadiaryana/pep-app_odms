(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["ssc-ssc-module"],{

/***/ "./node_modules/raw-loader/index.js!./src/app/ssc/dashboard/ssc-dashboard.component.html":
/*!**************************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/ssc/dashboard/ssc-dashboard.component.html ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<button mat-button (click)=\"commonService.toggleFullwindow()\" class=\"button-fw\" [matTooltip]=\"commonService.fullWindow? 'Exit Fullscreen' : 'Fullscreen'\"><mat-icon>{{commonService.fullWindow? \"fullscreen_exit\" : \"fullscreen\"}}</mat-icon></button>\n<div fxLayout=\"column\" fxLayout.xs=\"column\">\n\t<div fxLayout=\"row\" fxLayoutAlign=\"left\">\n\t\t<mat-card>\n\t\t\t<mat-card-header><mat-card-title>Pandora Console</mat-card-title></mat-card-header>\n\t\t\t<mat-card-content><iframe #pandora class=\"pandora\" src=\"/api/ssc/proxy/pandora?nick=admin&pass=Pertamin4123!\" frameborder=\"0\" scrolling=\"no\" (load)=\"onLoad(pandora)\"></iframe></mat-card-content>\n\t\t</mat-card>\n\t\t<mat-card>\n\t\t\t<mat-card-header><mat-card-title>SSC Open Tickets</mat-card-title></mat-card-header>\n\t\t\t<mat-card-content><iframe #bmc class=\"bmc\" src=\"/ssc/ticket/open;group=Sangasanga;fullWindow=1;refresh=120\" frameborder=\"0\" scrolling=\"no\" (load)=\"onLoad(bmc)\"></iframe></mat-card-content>\n\t\t</mat-card>\n\t</div>\n\t<div fxLayout=\"row\" fxLayoutAlign=\"left\">\n\t\t<mat-card>\n\t\t\t<mat-card-header><mat-card-title>Server Room</mat-card-title></mat-card-header>\n\t\t\t<mat-card-content><iframe #ipthermo class=\"ipthermo\" src=\"/api/ssc/proxy/ipthermo\" frameborder=\"0\" scrolling=\"no\" (load)=\"onLoad(ipthermo)\"></iframe></mat-card-content>\n\t\t</mat-card>\n\t\t<mat-card class=\"nms_card\">\n\t\t\t<mat-card-header><mat-card-title>MPLS XL</mat-card-title></mat-card-header>\n\t\t\t<mat-card-content fxLayout=\"column\">\n\t\t\t\t<iframe #nms2 class=\"nms\" src=\"/api/ssc/proxy/nms?ResourceID=958&AccountID=monitor&Password=satrio\" frameborder=\"0\" scrolling=\"no\" (load)=\"onLoad(nms2)\"></iframe>\n\t\t\t\t<div class=\"nms_util_group\">\n\t\t\t\t\t<mat-card-subtitle>XL Sangasanga</mat-card-subtitle>\n\t\t\t\t\t<iframe #nms_util1 class=\"nms_util\" src=\"/api/ssc/proxy/nms?ResourceID=80&AccountID=monitor&Password=satrio&NetObject=N:186\" frameborder=\"0\" scrolling=\"no\" (load)=\"onLoad(nms_util1)\"></iframe>\n\t\t\t\t\t<mat-card-subtitle>XL Anggana</mat-card-subtitle>\n\t\t\t\t\t<iframe #nms_util2 class=\"nms_util\" src=\"/api/ssc/proxy/nms?ResourceID=80&AccountID=monitor&Password=satrio&NetObject=N:187\" frameborder=\"0\" scrolling=\"no\" (load)=\"onLoad(nms_util2)\"></iframe>\n\t\t\t\t\t<mat-card-subtitle>XL Samboja</mat-card-subtitle>\n\t\t\t\t\t<iframe #nms_util3 class=\"nms_util\" src=\"/api/ssc/proxy/nms?ResourceID=80&AccountID=monitor&Password=satrio&NetObject=N:23\" frameborder=\"0\" scrolling=\"no\" (load)=\"onLoad(nms_util3)\"></iframe>\n\t\t\t\t</div>\n\t\t\t</mat-card-content>\n\t\t</mat-card>\n\t\t<mat-card class=\"nms_card\">\n\t\t\t<mat-card-header><mat-card-title>MPLS Telkom</mat-card-title></mat-card-header>\n\t\t\t<mat-card-content fxLayout=\"column\">\n\t\t\t\t<iframe #nms1 class=\"nms\" src=\"/api/ssc/proxy/nms?ResourceID=1185&AccountID=monitor&Password=satrio\" frameborder=\"0\" scrolling=\"no\" (load)=\"onLoad(nms1)\"></iframe>\n\t\t\t\t<div class=\"nms_util_group\">\n\t\t\t\t\t<mat-card-subtitle>Telkom Sangasanga</mat-card-subtitle>\n\t\t\t\t\t<iframe #nms_util4 class=\"nms_util\" src=\"/api/ssc/proxy/nms?ResourceID=80&AccountID=monitor&Password=satrio&NetObject=N:207\" frameborder=\"0\" scrolling=\"no\" (load)=\"onLoad(nms_util4)\"></iframe>\n\t\t\t\t\t<mat-card-subtitle>Telkom Anggana</mat-card-subtitle>\n\t\t\t\t\t<iframe #nms_util5 class=\"nms_util\" src=\"/api/ssc/proxy/nms?ResourceID=80&AccountID=monitor&Password=satrio&NetObject=N:211\" frameborder=\"0\" scrolling=\"no\" (load)=\"onLoad(nms_util5)\"></iframe>\n\t\t\t\t\t<mat-card-subtitle>Telkom Samboja</mat-card-subtitle>\n\t\t\t\t\t<iframe #nms_util6 class=\"nms_util\" src=\"/api/ssc/proxy/nms?ResourceID=80&AccountID=monitor&Password=satrio&NetObject=N:208\" frameborder=\"0\" scrolling=\"no\" (load)=\"onLoad(nms_util6)\"></iframe>\n\t\t\t\t</div>\n\t\t\t</mat-card-content>\n\t\t</mat-card>\n\t</div>\n</div>\n"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/ssc/sla/ssc-sla-month.component.html":
/*!********************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/ssc/sla/ssc-sla-month.component.html ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container-top-bar\">\n  <mat-form-field>\n    <input matInput placeholder=\"Filter\" [formControl]=\"filterControl\">\n  </mat-form-field>\n  <mat-form-field class=\"filter\" floatLabel=\"never\">\n    <mat-label>Month</mat-label>\n    <input matInput class=\"input-hidden\" [formControl]=\"sla_month\" [matDatepicker]=\"sla_monthPicker\" disabled>\n    <input matInput [(ngModel)]=\"sla_monthInput\" disabled>\n    <mat-datepicker-toggle matSuffix [for]=\"sla_monthPicker\" [disabled]=\"isLoadingResults\"></mat-datepicker-toggle>\n    <mat-datepicker #sla_monthPicker startView=\"year\" disabled=\"false\" (monthSelected)=\"monthChange($event)\"></mat-datepicker>\n  </mat-form-field>\n</div>\n\n<div class=\"container-content\">\n  \n  <div class=\"loading-shade\" *ngIf=\"isLoadingResults || isRateLimitReached\">\n    <mat-spinner *ngIf=\"isLoadingResults\"></mat-spinner>\n  </div>\n\n  <div class=\"container-table\">\n\n    <table mat-table [dataSource]=\"data\" class=\"\"\n    matSort matSortActive=\"id\" matSortDisableClear matSortDirection=\"asc\">\n    \n    <ng-container matColumnDef=\"no\">\n      <th mat-header-cell *matHeaderCellDef>No</th>\n      <td mat-cell *matCellDef=\"let row\">{{row.no}}</td>\n    </ng-container>\n\n    <ng-container matColumnDef=\"group\">\n      <th mat-header-cell *matHeaderCellDef>Lokasi</th>\n      <td mat-cell *matCellDef=\"let row\" (click)=\"navigateTicket(row.group)\">{{row.group}}</td>\n    </ng-container>\n\n    <ng-container matColumnDef=\"met\">\n      <th mat-header-cell *matHeaderCellDef class=\"cell-right\">Met</th>\n      <td mat-cell *matCellDef=\"let row\" class=\"cell-right\" (click)=\"navigateTicket(row.group, 'met')\">{{row.met}}</td>\n    </ng-container>\n\n    <ng-container matColumnDef=\"missed\">\n      <th mat-header-cell *matHeaderCellDef class=\"cell-right\">Missed</th>\n      <td mat-cell *matCellDef=\"let row\" class=\"cell-right\" (click)=\"navigateTicket(row.group, 'missed')\">{{row.missed}}</td>\n    </ng-container>\n\n    <ng-container matColumnDef=\"total\">\n      <th mat-header-cell *matHeaderCellDef class=\"cell-right\">Total</th>\n      <td mat-cell *matCellDef=\"let row\" class=\"cell-right\" (click)=\"navigateTicket(row.group)\">{{row.total}}</td>\n    </ng-container>\n\n    <ng-container matColumnDef=\"sla\">\n      <th mat-header-cell *matHeaderCellDef class=\"cell-right\">SLA</th>\n      <td mat-cell *matCellDef=\"let row\" class=\"cell-right\">{{row.sla | percent:'1.2'}}</td>\n    </ng-container>\n\n   <tr mat-header-row *matHeaderRowDef=\"displayedColumns; sticky: true\"></tr>\n   <tr mat-row *matRowDef=\"let row; columns: displayedColumns;\"></tr>\n </table>\n</div>\n\n<mat-paginator [length]=\"resultsLength\"  [pageSizeOptions]=\"[10, 25, 50, 100]\"></mat-paginator>\n<router-outlet></router-outlet>\n  <router-outlet name=\"overlay2\"></router-outlet>\n</div>\n"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/ssc/sla/ssc-sla.component.html":
/*!**************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/ssc/sla/ssc-sla.component.html ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<router-outlet></router-outlet>\n<router-outlet name=\"overlay2\"></router-outlet>"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/ssc/ssc.component.html":
/*!******************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/ssc/ssc.component.html ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<router-outlet></router-outlet>\n<router-outlet name=\"overlay2\"></router-outlet>"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/ssc/ticket/ssc-ticket-list.component.html":
/*!*************************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/ssc/ticket/ssc-ticket-list.component.html ***!
  \*************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!--div class=\"container-top-bar\">\n  <mat-form-field>\n    <input matInput placeholder=\"Filter\" [formControl]=\"filterControl\">\n  </mat-form-field>\n</div-->\n\n<div class=\"container-content\">\n  \n  <div class=\"loading-shade\" *ngIf=\"isLoadingResults || isRateLimitReached\">\n    <mat-spinner *ngIf=\"isLoadingResults\"></mat-spinner>\n  </div>\n\n  <div class=\"container-table\">\n\n    <table mat-table [dataSource]=\"data\" class=\"ticket-table\"\n    matSort matSortActive=\"submitDate\" matSortDisableClear matSortDirection=\"desc\">\n    \n  <ng-container matColumnDef=\"id\">\n      <th mat-header-cell *matHeaderCellDef>\n        <div fxLayout=\"row\" fxLayoutAlign=\"start center\">\n          <span mat-sort-header arrowPosition=\"before\" class=\"mat-sort-header\">id</span>\n          <app-xfilter title=\"id\" column=\"id\" [selected]=\"id_xSelected\"></app-xfilter>\n        </div>\n     </th>\n      <td mat-cell *matCellDef=\"let row\">{{row.id}}</td>\n    </ng-container>\n\n  <ng-container matColumnDef=\"type\">\n      <th mat-header-cell *matHeaderCellDef>\n        <div fxLayout=\"row\" fxLayoutAlign=\"start center\">\n          <span mat-sort-header arrowPosition=\"before\" class=\"mat-sort-header\">type</span>\n          <app-xfilter title=\"type\" column=\"type\" [selected]=\"type_xSelected\"></app-xfilter>\n        </div>\n     </th>\n      <td mat-cell *matCellDef=\"let row\">{{row.type}}</td>\n    </ng-container>\n\n  <ng-container matColumnDef=\"displayId\">\n      <th mat-header-cell *matHeaderCellDef>\n        <div fxLayout=\"row\" fxLayoutAlign=\"start center\">\n          <span mat-sort-header arrowPosition=\"before\" class=\"mat-sort-header\">displayId</span>\n          <app-xfilter title=\"displayId\" column=\"displayId\" [selected]=\"displayId_xSelected\"></app-xfilter>\n        </div>\n     </th>\n      <td mat-cell *matCellDef=\"let row\">{{row.displayId}}</td>\n    </ng-container>\n\n  <ng-container matColumnDef=\"summary\">\n      <th mat-header-cell *matHeaderCellDef>\n        <div fxLayout=\"row\" fxLayoutAlign=\"start center\">\n          <span mat-sort-header arrowPosition=\"before\" class=\"mat-sort-header\">summary</span>\n          <app-xfilter title=\"summary\" column=\"summary\" [selected]=\"summary_xSelected\"></app-xfilter>\n        </div>\n     </th>\n      <td mat-cell *matCellDef=\"let row\">{{row.summary}}</td>\n    </ng-container>\n\n  <ng-container matColumnDef=\"customer_fullName\">\n      <th mat-header-cell *matHeaderCellDef>\n        <div fxLayout=\"row\" fxLayoutAlign=\"start center\">\n          <span mat-sort-header arrowPosition=\"before\" class=\"mat-sort-header\">customer_fullName</span>\n          <app-xfilter title=\"customer_fullName\" column=\"customer_fullName\" [selected]=\"customer_fullName_xSelected\"></app-xfilter>\n        </div>\n     </th>\n      <td mat-cell *matCellDef=\"let row\">{{row.customer?.fullName}}</td>\n    </ng-container>\n\n  <ng-container matColumnDef=\"customer_company\">\n      <th mat-header-cell *matHeaderCellDef>\n        <div fxLayout=\"row\" fxLayoutAlign=\"start center\">\n          <span mat-sort-header arrowPosition=\"before\" class=\"mat-sort-header\">customer_company</span>\n          <app-xfilter title=\"customer_company\" column=\"customer_company\" [selected]=\"customer_company_xSelected\"></app-xfilter>\n        </div>\n     </th>\n      <td mat-cell *matCellDef=\"let row\">{{row.customer?.company?.name}}</td>\n    </ng-container>\n\n  <ng-container matColumnDef=\"customer_site\">\n      <th mat-header-cell *matHeaderCellDef>\n        <div fxLayout=\"row\" fxLayoutAlign=\"start center\">\n          <span mat-sort-header arrowPosition=\"before\" class=\"mat-sort-header\">customer_site</span>\n          <app-xfilter title=\"customer_site\" column=\"customer_site\" [selected]=\"customer_site_xSelected\"></app-xfilter>\n        </div>\n     </th>\n      <td mat-cell *matCellDef=\"let row\">{{row.customer?.site?.name}}</td>\n    </ng-container>\n\n  <ng-container matColumnDef=\"customer_pa\">\n      <th mat-header-cell *matHeaderCellDef>\n        <div fxLayout=\"row\" fxLayoutAlign=\"start center\">\n          <span mat-sort-header arrowPosition=\"before\" class=\"mat-sort-header\">customer_pa</span>\n          <app-xfilter title=\"customer_pa\" column=\"customer_pa\" [selected]=\"customer_pa_xSelected\"></app-xfilter>\n        </div>\n     </th>\n      <td mat-cell *matCellDef=\"let row\">{{row.customer?.customFields?.pa?.PERS_AREA_TEXT}}</td>\n    </ng-container>\n\n  <ng-container matColumnDef=\"customer_psa\">\n      <th mat-header-cell *matHeaderCellDef>\n        <div fxLayout=\"row\" fxLayoutAlign=\"start center\">\n          <span mat-sort-header arrowPosition=\"before\" class=\"mat-sort-header\">customer_psa</span>\n          <app-xfilter title=\"customer_psa\" column=\"customer_psa\" [selected]=\"customer_psa_xSelected\"></app-xfilter>\n        </div>\n     </th>\n      <td mat-cell *matCellDef=\"let row\">{{row.customer?.customFields?.psa?.PERS_SUBAREA_TEXT}}</td>\n    </ng-container>\n\n  <ng-container matColumnDef=\"customer_department\">\n      <th mat-header-cell *matHeaderCellDef>\n        <div fxLayout=\"row\" fxLayoutAlign=\"start center\">\n          <span mat-sort-header arrowPosition=\"before\" class=\"mat-sort-header\">customer_department</span>\n          <app-xfilter title=\"customer_department\" column=\"customer_department\" [selected]=\"customer_department_xSelected\"></app-xfilter>\n        </div>\n     </th>\n      <td mat-cell *matCellDef=\"let row\">{{row.customer?.department}}</td>\n    </ng-container>\n\n  <ng-container matColumnDef=\"assignee_fullName\">\n      <th mat-header-cell *matHeaderCellDef>\n        <div fxLayout=\"row\" fxLayoutAlign=\"start center\">\n          <span mat-sort-header arrowPosition=\"before\" class=\"mat-sort-header\">assignee_fullName</span>\n          <app-xfilter title=\"assignee_fullName\" column=\"assignee_fullName\" [selected]=\"assignee_fullName_xSelected\"></app-xfilter>\n        </div>\n     </th>\n      <td mat-cell *matCellDef=\"let row\">{{row.assignee?.fullName}}</td>\n    </ng-container>\n\n  <ng-container matColumnDef=\"assignee_loginId\">\n      <th mat-header-cell *matHeaderCellDef>\n        <div fxLayout=\"row\" fxLayoutAlign=\"start center\">\n          <span mat-sort-header arrowPosition=\"before\" class=\"mat-sort-header\">assignee_loginId</span>\n          <app-xfilter title=\"assignee_loginId\" column=\"assignee_loginId\" [selected]=\"assignee_loginId_xSelected\"></app-xfilter>\n        </div>\n     </th>\n      <td mat-cell *matCellDef=\"let row\">{{row.assignee?.loginId}}</td>\n    </ng-container>\n\n  <ng-container matColumnDef=\"assignee_group\">\n      <th mat-header-cell *matHeaderCellDef>\n        <div fxLayout=\"row\" fxLayoutAlign=\"start center\">\n          <span mat-sort-header arrowPosition=\"before\" class=\"mat-sort-header\">assignee_group</span>\n          <app-xfilter title=\"assignee_group\" column=\"assignee_group\" [selected]=\"assignee_group_xSelected\"></app-xfilter>\n        </div>\n     </th>\n      <td mat-cell *matCellDef=\"let row\">{{row.assignee?.customFields?.group?.name}}</td>\n    </ng-container>\n\n  <ng-container matColumnDef=\"priority\">\n      <th mat-header-cell *matHeaderCellDef>\n        <div fxLayout=\"row\" fxLayoutAlign=\"start center\">\n          <span mat-sort-header arrowPosition=\"before\" class=\"mat-sort-header\">priority</span>\n          <app-xfilter title=\"priority\" column=\"priority\" [selected]=\"priority_xSelected\"></app-xfilter>\n        </div>\n     </th>\n      <td mat-cell *matCellDef=\"let row\">{{row.priority}}</td>\n    </ng-container>\n\n  <ng-container matColumnDef=\"status_value\">\n      <th mat-header-cell *matHeaderCellDef>\n        <div fxLayout=\"row\" fxLayoutAlign=\"start center\">\n          <span mat-sort-header arrowPosition=\"before\" class=\"mat-sort-header\">status_value</span>\n          <app-xfilter title=\"status_value\" column=\"status_value\" [selected]=\"status_value_xSelected\"></app-xfilter>\n        </div>\n     </th>\n      <td mat-cell *matCellDef=\"let row\">{{row.status?.value}}</td>\n    </ng-container>\n\n  <ng-container matColumnDef=\"status_reason\">\n      <th mat-header-cell *matHeaderCellDef>\n        <div fxLayout=\"row\" fxLayoutAlign=\"start center\">\n          <span mat-sort-header arrowPosition=\"before\" class=\"mat-sort-header\">status_reason</span>\n          <app-xfilter title=\"status_reason\" column=\"status_reason\" [selected]=\"status_reason_xSelected\"></app-xfilter>\n        </div>\n     </th>\n      <td mat-cell *matCellDef=\"let row\">{{row.status?.reason}}</td>\n    </ng-container>\n\n  <ng-container matColumnDef=\"supportGroup_name\">\n      <th mat-header-cell *matHeaderCellDef>\n        <div fxLayout=\"row\" fxLayoutAlign=\"start center\">\n          <span mat-sort-header arrowPosition=\"before\" class=\"mat-sort-header\">supportGroup_name</span>\n          <app-xfilter title=\"supportGroup_name\" column=\"supportGroup_name\" [selected]=\"supportGroup_name_xSelected\"></app-xfilter>\n        </div>\n     </th>\n      <td mat-cell *matCellDef=\"let row\">{{row.supportGroup?.name}}</td>\n    </ng-container>\n\n  <ng-container matColumnDef=\"submitDate\">\n      <th mat-header-cell *matHeaderCellDef>\n        <div fxLayout=\"row\" fxLayoutAlign=\"start center\">\n          <span mat-sort-header arrowPosition=\"before\" class=\"mat-sort-header\">submitDate</span>\n          <app-xfilter title=\"submitDate\" column=\"submitDate\" [selected]=\"submitDate_xSelected\" format=\"datetime\"></app-xfilter>\n        </div>\n     </th>\n      <td mat-cell *matCellDef=\"let row\">{{row.submitDate ? (row.submitDate | date: 'dd MMM y HH:mm') : '-'}}</td>\n    </ng-container>\n\n  <ng-container matColumnDef=\"completedDate\">\n      <th mat-header-cell *matHeaderCellDef>\n        <div fxLayout=\"row\" fxLayoutAlign=\"start center\">\n          <span mat-sort-header arrowPosition=\"before\" class=\"mat-sort-header\">completedDate</span>\n          <app-xfilter title=\"completedDate\" column=\"completedDate\" [selected]=\"completedDate_xSelected\" format=\"datetime\"></app-xfilter>\n        </div>\n     </th>\n      <td mat-cell *matCellDef=\"let row\">{{row.completedDate ? (row.completedDate | date: 'dd MMM y HH:mm') : '-'}}</td>\n    </ng-container>\n\n  <ng-container matColumnDef=\"slaStatus\">\n      <th mat-header-cell *matHeaderCellDef>\n        <div fxLayout=\"row\" fxLayoutAlign=\"start center\">\n          <span mat-sort-header arrowPosition=\"before\" class=\"mat-sort-header\">slaStatus</span>\n          <app-xfilter title=\"slaStatus\" column=\"slaStatus\" [selected]=\"slaStatus_xSelected\"></app-xfilter>\n        </div>\n     </th>\n      <td mat-cell *matCellDef=\"let row\">{{row.slaStatus}}</td>\n    </ng-container>\n\n  <ng-container matColumnDef=\"modifiedDate\">\n      <th mat-header-cell *matHeaderCellDef>\n        <div fxLayout=\"row\" fxLayoutAlign=\"start center\">\n          <span mat-sort-header arrowPosition=\"before\" class=\"mat-sort-header\">modifiedDate</span>\n          <app-xfilter title=\"modifiedDate\" column=\"modifiedDate\" [selected]=\"modifiedDate_xSelected\" format=\"datetime\"></app-xfilter>\n        </div>\n     </th>\n      <td mat-cell *matCellDef=\"let row\">{{row.modifiedDate ? (row.modifiedDate | date: 'dd MMM y HH:mm') : '-'}}</td>\n    </ng-container>\n\n  <ng-container matColumnDef=\"Actions\">\n      <th mat-header-cell *matHeaderCellDef>\n        <!--div fxLayout=\"row\" fxLayoutAlign=\"start center\">\n          <span mat-sort-header arrowPosition=\"before\" class=\"mat-sort-header\">Actions</span>\n          <app-xfilter title=\"Actions\" column=\"Actions\" [selected]=\"Actions_xSelected\"></app-xfilter>\n        </div-->\n     </th>\n      <td mat-cell *matCellDef=\"let row\"></td>\n    </ng-container>\n\n   <tr mat-header-row *matHeaderRowDef=\"displayedColumns; sticky: true\"></tr>\n   <tr mat-row *matRowDef=\"let row; columns: displayedColumns;\"></tr>\n </table>\n</div>\n\n<mat-paginator [length]=\"resultsLength\"  [pageSizeOptions]=\"[25, 50, 100, 500]\"></mat-paginator>\n<router-outlet></router-outlet>\n  <router-outlet name=\"overlay2\"></router-outlet>\n</div>\n"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/ssc/ticket/ssc-ticket-open.component.html":
/*!*************************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/ssc/ticket/ssc-ticket-open.component.html ***!
  \*************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!--div class=\"container-top-bar\" *ngIf=\"!fullWindow\">\n  <mat-form-field>\n    <input matInput placeholder=\"Filter\" [formControl]=\"filterControl\">\n  </mat-form-field>\n</div-->\n\n<div class=\"container-content\">\n  \n  <div class=\"loading-shade\" *ngIf=\"isLoadingResults || isRateLimitReached\">\n    <mat-spinner *ngIf=\"isLoadingResults\"></mat-spinner>\n  </div>\n\n  <div class=\"container-table\">\n\n    <table mat-table [dataSource]=\"data\" class=\"ticket-table\"\n    matSort matSortActive=\"submitDate\" matSortDisableClear matSortDirection=\"desc\">\n    \n  <ng-container matColumnDef=\"id\">\n      <th mat-header-cell *matHeaderCellDef>\n        <div fxLayout=\"row\" fxLayoutAlign=\"start center\">\n          <span mat-sort-header arrowPosition=\"before\" class=\"mat-sort-header\">ID</span>\n          <app-xfilter title=\"id\" column=\"id\" [selected]=\"id_xSelected\"></app-xfilter>\n        </div>\n     </th>\n      <td mat-cell *matCellDef=\"let row\">{{row.id}}</td>\n    </ng-container>\n\n  <ng-container matColumnDef=\"type\">\n      <th mat-header-cell *matHeaderCellDef>\n        <div fxLayout=\"row\" fxLayoutAlign=\"start center\">\n          <span mat-sort-header arrowPosition=\"before\" class=\"mat-sort-header\">Type</span>\n          <app-xfilter title=\"type\" column=\"type\" [selected]=\"type_xSelected\"></app-xfilter>\n        </div>\n     </th>\n      <td mat-cell *matCellDef=\"let row\">{{row.type}}</td>\n    </ng-container>\n\n  <ng-container matColumnDef=\"displayId\">\n      <th mat-header-cell *matHeaderCellDef>\n        <div fxLayout=\"row\" fxLayoutAlign=\"start center\">\n          <span mat-sort-header arrowPosition=\"before\" class=\"mat-sort-header\">Display Id</span>\n          <app-xfilter title=\"displayId\" column=\"displayId\" [selected]=\"displayId_xSelected\"></app-xfilter>\n        </div>\n     </th>\n      <td mat-cell *matCellDef=\"let row\">{{row.displayId}}</td>\n    </ng-container>\n\n  <ng-container matColumnDef=\"summary\">\n      <th mat-header-cell *matHeaderCellDef>\n        <div fxLayout=\"row\" fxLayoutAlign=\"start center\">\n          <span mat-sort-header arrowPosition=\"before\" class=\"mat-sort-header\">Summary</span>\n          <app-xfilter title=\"summary\" column=\"summary\" [selected]=\"summary_xSelected\"></app-xfilter>\n        </div>\n     </th>\n      <td mat-cell *matCellDef=\"let row\">{{row.summary}}</td>\n    </ng-container>\n\n  <ng-container matColumnDef=\"customer_fullName\">\n      <th mat-header-cell *matHeaderCellDef>\n        <div fxLayout=\"row\" fxLayoutAlign=\"start center\">\n          <span mat-sort-header arrowPosition=\"before\" class=\"mat-sort-header\">Customer Full Name</span>\n          <app-xfilter title=\"customer_fullName\" column=\"customer_fullName\" [selected]=\"customer_fullName_xSelected\"></app-xfilter>\n        </div>\n     </th>\n      <td mat-cell *matCellDef=\"let row\">{{row.customer?.fullName}}</td>\n    </ng-container>\n\n  <ng-container matColumnDef=\"customer_company\">\n      <th mat-header-cell *matHeaderCellDef>\n        <div fxLayout=\"row\" fxLayoutAlign=\"start center\">\n          <span mat-sort-header arrowPosition=\"before\" class=\"mat-sort-header\">Customer Company</span>\n          <app-xfilter title=\"customer_company\" column=\"customer_company\" [selected]=\"customer_company_xSelected\"></app-xfilter>\n        </div>\n     </th>\n      <td mat-cell *matCellDef=\"let row\">{{row.customer?.company?.name}}</td>\n    </ng-container>\n\n  <ng-container matColumnDef=\"customer_site\">\n      <th mat-header-cell *matHeaderCellDef>\n        <div fxLayout=\"row\" fxLayoutAlign=\"start center\">\n          <span mat-sort-header arrowPosition=\"before\" class=\"mat-sort-header\">Customer Site</span>\n          <app-xfilter title=\"customer_site\" column=\"customer_site\" [selected]=\"customer_site_xSelected\"></app-xfilter>\n        </div>\n     </th>\n      <td mat-cell *matCellDef=\"let row\">{{row.customer?.site?.name}}</td>\n    </ng-container>\n\n  <ng-container matColumnDef=\"customer_pa\">\n      <th mat-header-cell *matHeaderCellDef>\n        <div fxLayout=\"row\" fxLayoutAlign=\"start center\">\n          <span mat-sort-header arrowPosition=\"before\" class=\"mat-sort-header\">Customer Area</span>\n          <app-xfilter title=\"customer_pa\" column=\"customer_pa\" [selected]=\"customer_pa_xSelected\"></app-xfilter>\n        </div>\n     </th>\n      <td mat-cell *matCellDef=\"let row\">{{row.customer?.customFields?.pa?.PERS_AREA_TEXT}}</td>\n    </ng-container>\n\n  <ng-container matColumnDef=\"customer_psa\">\n      <th mat-header-cell *matHeaderCellDef>\n        <div fxLayout=\"row\" fxLayoutAlign=\"start center\">\n          <span mat-sort-header arrowPosition=\"before\" class=\"mat-sort-header\">Customer SubArea</span>\n          <app-xfilter title=\"customer_psa\" column=\"customer_psa\" [selected]=\"customer_psa_xSelected\"></app-xfilter>\n        </div>\n     </th>\n      <td mat-cell *matCellDef=\"let row\">{{row.customer?.customFields?.psa?.PERS_SUBAREA_TEXT}}</td>\n    </ng-container>\n\n  <ng-container matColumnDef=\"customer_department\">\n      <th mat-header-cell *matHeaderCellDef>\n        <div fxLayout=\"row\" fxLayoutAlign=\"start center\">\n          <span mat-sort-header arrowPosition=\"before\" class=\"mat-sort-header\">Customer Department</span>\n          <app-xfilter title=\"customer_department\" column=\"customer_department\" [selected]=\"customer_department_xSelected\"></app-xfilter>\n        </div>\n     </th>\n      <td mat-cell *matCellDef=\"let row\">{{row.customer?.department}}</td>\n    </ng-container>\n\n  <ng-container matColumnDef=\"assignee_fullName\">\n      <th mat-header-cell *matHeaderCellDef>\n        <div fxLayout=\"row\" fxLayoutAlign=\"start center\">\n          <span mat-sort-header arrowPosition=\"before\" class=\"mat-sort-header\">Assignee Full Name</span>\n          <app-xfilter title=\"assignee_fullName\" column=\"assignee_fullName\" [selected]=\"assignee_fullName_xSelected\"></app-xfilter>\n        </div>\n     </th>\n      <td mat-cell *matCellDef=\"let row\">{{row.assignee?.fullName}}</td>\n    </ng-container>\n\n  <ng-container matColumnDef=\"assignee_loginId\">\n      <th mat-header-cell *matHeaderCellDef>\n        <div fxLayout=\"row\" fxLayoutAlign=\"start center\">\n          <span mat-sort-header arrowPosition=\"before\" class=\"mat-sort-header\">Assignee Login Id</span>\n          <app-xfilter title=\"assignee_loginId\" column=\"assignee_loginId\" [selected]=\"assignee_loginId_xSelected\"></app-xfilter>\n        </div>\n     </th>\n      <td mat-cell *matCellDef=\"let row\">{{row.assignee?.loginId}}</td>\n    </ng-container>\n\n  <ng-container matColumnDef=\"assignee_group\">\n      <th mat-header-cell *matHeaderCellDef>\n        <div fxLayout=\"row\" fxLayoutAlign=\"start center\">\n          <span mat-sort-header arrowPosition=\"before\" class=\"mat-sort-header\">Assignee Group</span>\n          <app-xfilter title=\"assignee_group\" column=\"assignee_group\" [selected]=\"assignee_group_xSelected\"></app-xfilter>\n        </div>\n     </th>\n      <td mat-cell *matCellDef=\"let row\">{{row.assignee?.customFields?.group?.name}}</td>\n    </ng-container>\n\n  <ng-container matColumnDef=\"priority\">\n      <th mat-header-cell *matHeaderCellDef>\n        <div fxLayout=\"row\" fxLayoutAlign=\"start center\">\n          <span mat-sort-header arrowPosition=\"before\" class=\"mat-sort-header\">Priority</span>\n          <app-xfilter title=\"priority\" column=\"priority\" [selected]=\"priority_xSelected\"></app-xfilter>\n        </div>\n     </th>\n      <td mat-cell *matCellDef=\"let row\" class=\"cell-center\">\n        <mat-icon class=\"icon\" [ngClass]=\"'priority_'+row.priority.toLowerCase()\">brightness_1</mat-icon>\n      </td>\n    </ng-container>\n\n  <ng-container matColumnDef=\"status_value\">\n      <th mat-header-cell *matHeaderCellDef>\n        <div fxLayout=\"row\" fxLayoutAlign=\"start center\">\n          <span mat-sort-header arrowPosition=\"before\" class=\"mat-sort-header\">Status</span>\n          <app-xfilter title=\"status_value\" column=\"status_value\" [selected]=\"status_value_xSelected\"></app-xfilter>\n        </div>\n     </th>\n      <td mat-cell *matCellDef=\"let row\">{{row.status?.value}}</td>\n    </ng-container>\n\n  <ng-container matColumnDef=\"status_reason\">\n      <th mat-header-cell *matHeaderCellDef>\n        <div fxLayout=\"row\" fxLayoutAlign=\"start center\">\n          <span mat-sort-header arrowPosition=\"before\" class=\"mat-sort-header\">Status Reason</span>\n          <app-xfilter title=\"status_reason\" column=\"status_reason\" [selected]=\"status_reason_xSelected\"></app-xfilter>\n        </div>\n     </th>\n      <td mat-cell *matCellDef=\"let row\">{{row.status?.reason}}</td>\n    </ng-container>\n\n  <ng-container matColumnDef=\"supportGroup_name\">\n      <th mat-header-cell *matHeaderCellDef>\n        <div fxLayout=\"row\" fxLayoutAlign=\"start center\">\n          <span mat-sort-header arrowPosition=\"before\" class=\"mat-sort-header\">Support Group</span>\n          <app-xfilter title=\"supportGroup_name\" column=\"supportGroup_name\" [selected]=\"supportGroup_name_xSelected\"></app-xfilter>\n        </div>\n     </th>\n      <td mat-cell *matCellDef=\"let row\">{{row.supportGroup?.name}}</td>\n    </ng-container>\n\n  <ng-container matColumnDef=\"submitDate\">\n      <th mat-header-cell *matHeaderCellDef>\n        <div fxLayout=\"row\" fxLayoutAlign=\"start center\">\n          <span mat-sort-header arrowPosition=\"before\" class=\"mat-sort-header\">Submit Date</span>\n          <app-xfilter title=\"submitDate\" column=\"submitDate\" [selected]=\"submitDate_xSelected\" format=\"datetime\"></app-xfilter>\n        </div>\n     </th>\n      <td mat-cell *matCellDef=\"let row\">{{row.submitDate ? (row.submitDate | date: 'dd MMM y HH:mm') : '-'}}</td>\n    </ng-container>\n\n  <ng-container matColumnDef=\"completedDate\">\n      <th mat-header-cell *matHeaderCellDef>\n        <div fxLayout=\"row\" fxLayoutAlign=\"start center\">\n          <span mat-sort-header arrowPosition=\"before\" class=\"mat-sort-header\">Completed Date</span>\n          <app-xfilter title=\"completedDate\" column=\"completedDate\" [selected]=\"completedDate_xSelected\" format=\"datetime\"></app-xfilter>\n        </div>\n     </th>\n      <td mat-cell *matCellDef=\"let row\">{{row.completedDate ? (row.completedDate | date: 'dd MMM y HH:mm') : '-'}}</td>\n    </ng-container>\n\n  <ng-container matColumnDef=\"slaStatus\">\n      <th mat-header-cell *matHeaderCellDef>\n        <div fxLayout=\"row\" fxLayoutAlign=\"start center\">\n          <span mat-sort-header arrowPosition=\"before\" class=\"mat-sort-header\">Status</span>\n          <app-xfilter title=\"slaStatus\" column=\"slaStatus\" [selected]=\"slaStatus_xSelected\"></app-xfilter>\n        </div>\n     </th>\n      <td mat-cell *matCellDef=\"let row\">{{row.slaStatus}}</td>\n    </ng-container>\n\n  <ng-container matColumnDef=\"modifiedDate\">\n      <th mat-header-cell *matHeaderCellDef>\n        <div fxLayout=\"row\" fxLayoutAlign=\"start center\">\n          <span mat-sort-header arrowPosition=\"before\" class=\"mat-sort-header\">Modified Date</span>\n          <app-xfilter title=\"modifiedDate\" column=\"modifiedDate\" [selected]=\"modifiedDate_xSelected\" format=\"datetime\"></app-xfilter>\n        </div>\n     </th>\n      <td mat-cell *matCellDef=\"let row\">{{row.modifiedDate ? (row.modifiedDate | date: 'dd MMM y HH:mm') : '-'}}</td>\n    </ng-container>\n\n  <ng-container matColumnDef=\"Actions\">\n      <th mat-header-cell *matHeaderCellDef>\n        <!--div fxLayout=\"row\" fxLayoutAlign=\"start center\">\n          <span mat-sort-header arrowPosition=\"before\" class=\"mat-sort-header\">Actions</span>\n          <app-xfilter title=\"Actions\" column=\"Actions\" [selected]=\"Actions_xSelected\"></app-xfilter>\n        </div-->\n     </th>\n      <td mat-cell *matCellDef=\"let row\"></td>\n    </ng-container>\n\n   <tr mat-header-row *matHeaderRowDef=\"displayedColumns; sticky: true\"></tr>\n   <tr mat-row *matRowDef=\"let row; columns: displayedColumns;\"></tr>\n </table>\n</div>\n\n<mat-paginator [length]=\"resultsLength\"  [pageSizeOptions]=\"[10, 25, 50, 100]\"></mat-paginator>\n<router-outlet></router-outlet>\n  <router-outlet name=\"overlay2\"></router-outlet>\n</div>\n"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/ssc/ticket/ssc-ticket.component.html":
/*!********************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/ssc/ticket/ssc-ticket.component.html ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<router-outlet></router-outlet>\n<router-outlet name=\"overlay2\"></router-outlet>"

/***/ }),

/***/ "./src/app/ssc/dashboard/ssc-dashboard.component.ts":
/*!**********************************************************!*\
  !*** ./src/app/ssc/dashboard/ssc-dashboard.component.ts ***!
  \**********************************************************/
/*! exports provided: SscDashboardComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SscDashboardComponent", function() { return SscDashboardComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm2015/material.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");
/* harmony import */ var _common_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../common.service */ "./src/app/common.service.ts");
/* harmony import */ var _navigation_title_title_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../navigation/title/title.service */ "./src/app/navigation/title/title.service.ts");






let SscDashboardComponent = class SscDashboardComponent {
    constructor(snackBar, route, commonService, titleService) {
        this.snackBar = snackBar;
        this.route = route;
        this.commonService = commonService;
        this.titleService = titleService;
    }
    ngOnInit() {
        this.titleService.titleSource.next({
            title: "Dashboard",
            icon: "dasboard",
            breadcrumbs: [
                { label: 'ICT', routerLink: '' },
                { label: 'Dashboard', routerLink: '' }
            ]
        });
    }
    onLoad(elm) {
        //var frame:HTMLIFrameElement = document.getElementsByClassName('nms')[0];
        this.pandora.nativeElement.contentWindow.scrollTo(60, 310);
        this.nms1.nativeElement.contentWindow.scrollTo(20, 100);
        this.nms2.nativeElement.contentWindow.scrollTo(20, 100);
        this.nms_util1.nativeElement.contentWindow.scrollTo(11, 84);
        this.nms_util2.nativeElement.contentWindow.scrollTo(11, 84);
        this.nms_util3.nativeElement.contentWindow.scrollTo(11, 84);
        this.nms_util4.nativeElement.contentWindow.scrollTo(11, 84);
        this.nms_util5.nativeElement.contentWindow.scrollTo(11, 84);
        this.nms_util6.nativeElement.contentWindow.scrollTo(11, 84);
        this.ipthermo.nativeElement.contentWindow.scrollTo(0, 160);
        /*console.log(elm["className"]);
        if(elm["className"] == "nms") {
            elm["contentWindow"].scrollTo(20,100);
        } else if (elm["className"] == "pandora") {
            elm["contentWindow"].scrollTo(60,310);
        } else if (elm["className"] == "ipthermo") {
            elm["contentWindow"].scrollTo(0,160);
        } else if (elm["className"] == "nms_util") {
          elm["contentWindow"].scrollTo(11,84);
        }*/
    }
};
SscDashboardComponent.ctorParameters = () => [
    { type: _angular_material__WEBPACK_IMPORTED_MODULE_2__["MatSnackBar"] },
    { type: _angular_router__WEBPACK_IMPORTED_MODULE_3__["ActivatedRoute"] },
    { type: _common_service__WEBPACK_IMPORTED_MODULE_4__["CommonService"] },
    { type: _navigation_title_title_service__WEBPACK_IMPORTED_MODULE_5__["TitleService"] }
];
tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('pandora', { static: true })
], SscDashboardComponent.prototype, "pandora", void 0);
tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('nms1', { static: true })
], SscDashboardComponent.prototype, "nms1", void 0);
tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('nms2', { static: true })
], SscDashboardComponent.prototype, "nms2", void 0);
tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('nms_util1', { static: true })
], SscDashboardComponent.prototype, "nms_util1", void 0);
tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('nms_util2', { static: true })
], SscDashboardComponent.prototype, "nms_util2", void 0);
tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('nms_util3', { static: true })
], SscDashboardComponent.prototype, "nms_util3", void 0);
tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('nms_util4', { static: true })
], SscDashboardComponent.prototype, "nms_util4", void 0);
tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('nms_util5', { static: true })
], SscDashboardComponent.prototype, "nms_util5", void 0);
tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('nms_util6', { static: true })
], SscDashboardComponent.prototype, "nms_util6", void 0);
tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('ipthermo', { static: true })
], SscDashboardComponent.prototype, "ipthermo", void 0);
SscDashboardComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
        selector: 'app-ssc-dashboard',
        template: __webpack_require__(/*! raw-loader!./ssc-dashboard.component.html */ "./node_modules/raw-loader/index.js!./src/app/ssc/dashboard/ssc-dashboard.component.html"),
        styles: [__webpack_require__(/*! ./ssc-dashboard.scss */ "./src/app/ssc/dashboard/ssc-dashboard.scss")]
    })
], SscDashboardComponent);



/***/ }),

/***/ "./src/app/ssc/dashboard/ssc-dashboard.scss":
/*!**************************************************!*\
  !*** ./src/app/ssc/dashboard/ssc-dashboard.scss ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "iframe {\n  overflow: hidden;\n}\n\nmat-card, .mat-card {\n  margin: 5px;\n}\n\n.bmc {\n  width: 960px;\n  height: 420px;\n}\n\n.pandora {\n  width: 890px;\n  height: 370px;\n}\n\n.nms {\n  width: 606px;\n  height: 276px;\n}\n\n.nms_util {\n  width: 774px;\n  height: 124px;\n}\n\n.nms_util_group {\n  -webkit-transform: scale(0.79);\n          transform: scale(0.79);\n  -webkit-transform-origin: left top;\n          transform-origin: left top;\n  outline: 1px solid transparent;\n}\n\n.nms_card {\n  width: 615px;\n  height: 680px;\n}\n\n.ipthermo {\n  width: 580px;\n  height: 300px;\n}\n\n.mat-card-subtitle {\n  margin-top: 16px !important;\n  margin-bottom: 0;\n}\n\n.button-fw {\n  font-size: 24px;\n  position: absolute;\n  right: 0;\n  top: 0;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvc3NjL2Rhc2hib2FyZC9EOlxccGVwLWFwcF9uZXdcXHNzY1xcQ2xpZW50QXBwL3NyY1xcYXBwXFxzc2NcXGRhc2hib2FyZFxcc3NjLWRhc2hib2FyZC5zY3NzIiwic3JjL2FwcC9zc2MvZGFzaGJvYXJkL3NzYy1kYXNoYm9hcmQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNDLGdCQUFBO0FDQ0Q7O0FERUE7RUFDQyxXQUFBO0FDQ0Q7O0FERUE7RUFDQyxZQUFBO0VBQ0EsYUFBQTtBQ0NEOztBREVBO0VBQ0MsWUFBQTtFQUNBLGFBQUE7QUNDRDs7QURFQTtFQUNDLFlBQUE7RUFDQSxhQUFBO0FDQ0Q7O0FERUE7RUFDQyxZQUFBO0VBQ0EsYUFBQTtBQ0NEOztBREVBO0VBQ0MsOEJBQUE7VUFBQSxzQkFBQTtFQUNBLGtDQUFBO1VBQUEsMEJBQUE7RUFDQSw4QkFBQTtBQ0NEOztBREVBO0VBQ0MsWUFBQTtFQUNBLGFBQUE7QUNDRDs7QURFQTtFQUNDLFlBQUE7RUFDQSxhQUFBO0FDQ0Q7O0FERUE7RUFDQywyQkFBQTtFQUNBLGdCQUFBO0FDQ0Q7O0FERUE7RUFDRSxlQUFBO0VBQ0Esa0JBQUE7RUFDQSxRQUFBO0VBQ0EsTUFBQTtBQ0NGIiwiZmlsZSI6InNyYy9hcHAvc3NjL2Rhc2hib2FyZC9zc2MtZGFzaGJvYXJkLnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyJpZnJhbWUge1xuXHRvdmVyZmxvdzogaGlkZGVuO1xufVxuXG5tYXQtY2FyZCwgLm1hdC1jYXJkIHtcblx0bWFyZ2luOiA1cHg7XG59XG5cbi5ibWMge1xuXHR3aWR0aDogOTYwcHg7XG5cdGhlaWdodDogNDIwcHg7XG59XG5cbi5wYW5kb3JhIHtcblx0d2lkdGg6IDg5MHB4O1xuXHRoZWlnaHQ6IDM3MHB4O1xufVxuXG4ubm1zIHtcblx0d2lkdGg6IDYwNnB4O1xuXHRoZWlnaHQ6IDI3NnB4O1xufVxuXG4ubm1zX3V0aWwge1xuXHR3aWR0aDogNzc0cHg7XG5cdGhlaWdodDogMTI0cHg7XHRcbn1cblxuLm5tc191dGlsX2dyb3VwIHtcblx0dHJhbnNmb3JtOiBzY2FsZSgwLjc5KTtcblx0dHJhbnNmb3JtLW9yaWdpbjogbGVmdCB0b3A7XG5cdG91dGxpbmU6IDFweCBzb2xpZCB0cmFuc3BhcmVudDtcbn1cblxuLm5tc19jYXJkIHtcblx0d2lkdGg6IDYxNXB4O1xuXHRoZWlnaHQ6IDY4MHB4O1xufVxuXG4uaXB0aGVybW8ge1xuXHR3aWR0aDogNTgwcHg7XG5cdGhlaWdodDogMzAwcHg7XG59XG5cbi5tYXQtY2FyZC1zdWJ0aXRsZSB7XG5cdG1hcmdpbi10b3A6IDE2cHggIWltcG9ydGFudDtcblx0bWFyZ2luLWJvdHRvbTogMDtcbn1cblxuLmJ1dHRvbi1mdyB7XG4gIGZvbnQtc2l6ZTogMjRweDtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICByaWdodDogMDtcbiAgdG9wOiAwO1xufSIsImlmcmFtZSB7XG4gIG92ZXJmbG93OiBoaWRkZW47XG59XG5cbm1hdC1jYXJkLCAubWF0LWNhcmQge1xuICBtYXJnaW46IDVweDtcbn1cblxuLmJtYyB7XG4gIHdpZHRoOiA5NjBweDtcbiAgaGVpZ2h0OiA0MjBweDtcbn1cblxuLnBhbmRvcmEge1xuICB3aWR0aDogODkwcHg7XG4gIGhlaWdodDogMzcwcHg7XG59XG5cbi5ubXMge1xuICB3aWR0aDogNjA2cHg7XG4gIGhlaWdodDogMjc2cHg7XG59XG5cbi5ubXNfdXRpbCB7XG4gIHdpZHRoOiA3NzRweDtcbiAgaGVpZ2h0OiAxMjRweDtcbn1cblxuLm5tc191dGlsX2dyb3VwIHtcbiAgdHJhbnNmb3JtOiBzY2FsZSgwLjc5KTtcbiAgdHJhbnNmb3JtLW9yaWdpbjogbGVmdCB0b3A7XG4gIG91dGxpbmU6IDFweCBzb2xpZCB0cmFuc3BhcmVudDtcbn1cblxuLm5tc19jYXJkIHtcbiAgd2lkdGg6IDYxNXB4O1xuICBoZWlnaHQ6IDY4MHB4O1xufVxuXG4uaXB0aGVybW8ge1xuICB3aWR0aDogNTgwcHg7XG4gIGhlaWdodDogMzAwcHg7XG59XG5cbi5tYXQtY2FyZC1zdWJ0aXRsZSB7XG4gIG1hcmdpbi10b3A6IDE2cHggIWltcG9ydGFudDtcbiAgbWFyZ2luLWJvdHRvbTogMDtcbn1cblxuLmJ1dHRvbi1mdyB7XG4gIGZvbnQtc2l6ZTogMjRweDtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICByaWdodDogMDtcbiAgdG9wOiAwO1xufSJdfQ== */"

/***/ }),

/***/ "./src/app/ssc/sla/ssc-sla-month.component.ts":
/*!****************************************************!*\
  !*** ./src/app/ssc/sla/ssc-sla-month.component.ts ***!
  \****************************************************/
/*! exports provided: SscSlaMonthComponent, MatTableApi, ExampleHttpDao */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SscSlaMonthComponent", function() { return SscSlaMonthComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MatTableApi", function() { return MatTableApi; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ExampleHttpDao", function() { return ExampleHttpDao; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm2015/http.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm2015/material.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm2015/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm2015/operators/index.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm2015/forms.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");
/* harmony import */ var _ssc_sla_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./ssc-sla.service */ "./src/app/ssc/sla/ssc-sla.service.ts");
/* harmony import */ var _snackbar_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../snackbar.service */ "./src/app/snackbar.service.ts");
/* harmony import */ var _ssc_permission_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../ssc-permission.service */ "./src/app/ssc/ssc-permission.service.ts");
/* harmony import */ var _navigation_title_title_service__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../navigation/title/title.service */ "./src/app/navigation/title/title.service.ts");












let SscSlaMonthComponent = class SscSlaMonthComponent {
    constructor(http, router, dialog, 
    //public snackBar: MatSnackBar,
    ssc_slaService, snackbarService, sscPermissionService, titleService) {
        this.http = http;
        this.router = router;
        this.dialog = dialog;
        this.ssc_slaService = ssc_slaService;
        this.snackbarService = snackbarService;
        this.sscPermissionService = sscPermissionService;
        this.titleService = titleService;
        this.displayedColumns = ["no", "group", "met", "missed", "total", "sla"];
        this.data = [];
        this.resultsLength = 0;
        this.isLoadingResults = true;
        this.isRateLimitReached = false;
        this.submitting = false;
        this.filterControl = new _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormControl"]('');
        this.sla_month = new _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormControl"]('');
        this.sla_month_input = new _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormControl"]('');
    }
    ngOnInit() {
        this.titleService.titleSource.next({
            title: "SLA",
            icon: "",
            breadcrumbs: [
                { label: 'ICT', routerLink: '' },
                { label: 'SLA', routerLink: '' }
            ]
        });
        this.exampleDatabase = new ExampleHttpDao(this.http);
        this.sla_month.setValue(new Date());
        this.sla_monthDatePicker.select(new Date());
        this.sla_monthInput = new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" });
        // If the user changes the sort order, reset back to the first page.
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
        Object(rxjs__WEBPACK_IMPORTED_MODULE_4__["merge"])(this.sort.sortChange, this.paginator.page, this.filterControl.valueChanges.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["debounceTime"])(300)), this.sla_month.valueChanges.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["debounceTime"])(300))).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["startWith"])({}), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["switchMap"])(() => {
            this.isLoadingResults = true;
            var columnfilter = {};
            var date;
            if (this.sla_month.value) {
                date = this.sla_month.value;
            }
            else {
                date = new Date();
            }
            columnfilter['start_submitDate'] = new Date(date.getFullYear(), date.getMonth(), 1).getTime(); // - date.getTimezoneOffset()*60*1000;
            columnfilter['duration'] = "month";
            return this.exampleDatabase.getRepoIssues(this.sort.active, this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize, this.filterControl.value, columnfilter);
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["map"])(data => {
            // Flip flag to show that loading has finished.
            this.isLoadingResults = false;
            this.isRateLimitReached = false;
            this.resultsLength = data.total_count;
            return data.items;
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["catchError"])(() => {
            this.isLoadingResults = false;
            // Catch if the GitHub API has reached its rate limit. Return empty data.
            this.isRateLimitReached = true;
            return Object(rxjs__WEBPACK_IMPORTED_MODULE_4__["of"])([]);
        })).subscribe(data => this.data = data);
    }
    passPermission(path) {
        return this.sscPermissionService.passPermission(path);
    }
    monthChange(evt) {
        this.sla_monthInput = evt.toLocaleDateString("en-US", { month: "short", year: "numeric" });
        this.sla_monthDatePicker.select(evt);
        this.sla_monthDatePicker.close();
    }
    navigateTicket(group, status) {
        var date = this.sla_month.value;
        var start_submitDate = new Date(date.getFullYear(), date.getMonth(), 1).getTime(); // - date.getTimezoneOffset()*60*1000;
        var end_submitDate = new Date(date.getFullYear(), date.getMonth() + 1, 1).getTime(); // - date.getTimezoneOffset()*60*1000;
        var param = { start_submitDate: start_submitDate, end_submitDate: end_submitDate };
        if (group)
            param["assignee_group"] = group;
        if (status)
            param["slaStatus"] = status;
        param["status_value"] = "Resolved,Completed,Closed";
        this.router.navigate(['/', 'ssc', 'ticket', 'list', param]);
    }
};
SscSlaMonthComponent.ctorParameters = () => [
    { type: _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"] },
    { type: _angular_router__WEBPACK_IMPORTED_MODULE_7__["Router"] },
    { type: _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatDialog"] },
    { type: _ssc_sla_service__WEBPACK_IMPORTED_MODULE_8__["SscSlaService"] },
    { type: _snackbar_service__WEBPACK_IMPORTED_MODULE_9__["SnackbarService"] },
    { type: _ssc_permission_service__WEBPACK_IMPORTED_MODULE_10__["SscPermissionService"] },
    { type: _navigation_title_title_service__WEBPACK_IMPORTED_MODULE_11__["TitleService"] }
];
tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ViewChild"])('sla_monthPicker', { static: true })
], SscSlaMonthComponent.prototype, "sla_monthDatePicker", void 0);
tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ViewChild"])(_angular_material__WEBPACK_IMPORTED_MODULE_3__["MatPaginator"], { static: true })
], SscSlaMonthComponent.prototype, "paginator", void 0);
tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ViewChild"])(_angular_material__WEBPACK_IMPORTED_MODULE_3__["MatSort"], { static: true })
], SscSlaMonthComponent.prototype, "sort", void 0);
SscSlaMonthComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Component"])({
        selector: 'ssc-sla-month',
        template: __webpack_require__(/*! raw-loader!./ssc-sla-month.component.html */ "./node_modules/raw-loader/index.js!./src/app/ssc/sla/ssc-sla-month.component.html"),
        styles: [__webpack_require__(/*! ./ssc-sla.scss */ "./src/app/ssc/sla/ssc-sla.scss")]
    })
], SscSlaMonthComponent);

/*export interface SscSla {
  SSC_SLA_ID: number;
  ASSET_ID: number;
  ASSET_NAME: string;
}*/
class MatTableApi {
    constructor(sort, order, page, pagesize, filter) {
        this.sort = sort;
        this.order = order;
        this.page = page;
        this.pagesize = pagesize;
        this.filter = filter;
    }
}
MatTableApi.ctorParameters = () => [
    { type: String },
    { type: String },
    { type: Number },
    { type: Number },
    { type: String }
];
/** An example database that the data source uses to retrieve data for the table. */
class ExampleHttpDao {
    constructor(http) {
        this.http = http;
    }
    getRepoIssues(sort, order, page, pagesize = 10, filter, columnfilter) {
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
        return this.http.get('/api/ssc/sla', { params: params });
    }
}
ExampleHttpDao.ctorParameters = () => [
    { type: _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"] }
];


/***/ }),

/***/ "./src/app/ssc/sla/ssc-sla.component.ts":
/*!**********************************************!*\
  !*** ./src/app/ssc/sla/ssc-sla.component.ts ***!
  \**********************************************/
/*! exports provided: SscSlaComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SscSlaComponent", function() { return SscSlaComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm2015/material.js");



let SscSlaComponent = class SscSlaComponent {
    constructor(snackBar) {
        this.snackBar = snackBar;
    }
};
SscSlaComponent.ctorParameters = () => [
    { type: _angular_material__WEBPACK_IMPORTED_MODULE_2__["MatSnackBar"] }
];
SscSlaComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
        selector: 'app-ssc-sla',
        template: __webpack_require__(/*! raw-loader!./ssc-sla.component.html */ "./node_modules/raw-loader/index.js!./src/app/ssc/sla/ssc-sla.component.html"),
        styles: [__webpack_require__(/*! ./ssc-sla.scss */ "./src/app/ssc/sla/ssc-sla.scss")]
    })
], SscSlaComponent);



/***/ }),

/***/ "./src/app/ssc/sla/ssc-sla.scss":
/*!**************************************!*\
  !*** ./src/app/ssc/sla/ssc-sla.scss ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".container {\n  /*position: relative;*/\n  min-height: 200px;\n  margin: 2em;\n}\n\n.container-top-bar {\n  /*position: relative;*/\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-pack: start;\n          justify-content: flex-start;\n  -webkit-box-align: center;\n          align-items: center;\n}\n\n.container-top-bar button {\n  margin: 16px;\n}\n\n.container-top-bar button:first-of-type {\n  margin-left: 0px !important;\n}\n\n.container-top-bar button:first-of-type .mat-icon {\n  font-size: 22px;\n}\n\n.container-content {\n  position: relative;\n  min-height: 200px;\n}\n\n/* form */\n\nmat-card {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-pack: start;\n          justify-content: flex-start;\n  -webkit-box-align: start;\n          align-items: flex-start;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n          flex-direction: column;\n}\n\nmat-progress-bar {\n  width: 332px;\n  margin: -16px 0 16px 0 !important;\n}\n\nmat-form-field {\n  width: 250px;\n}\n\n::ng-deep .mat-card-header-text {\n  margin-left: 0 !important;\n  margin-right: 0 !important;\n}\n\nmat-card-actions {\n  margin-left: 0;\n  margin-right: 0;\n}\n\n/* list */\n\n.container-table {\n  /*position: relative;*/\n  max-height: 400px;\n  overflow: auto;\n}\n\ntable {\n  width: 100%;\n}\n\n.loading-shade {\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 56px;\n  right: 0;\n  background: rgba(0, 0, 0, 0.15);\n  z-index: 999;\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n  -webkit-box-pack: center;\n          justify-content: center;\n}\n\n.rate-limit-reached {\n  color: #980000;\n  max-width: 360px;\n  text-align: center;\n}\n\n/* Column Widths */\n\n.mat-column-number,\n.mat-column-state {\n  max-width: 64px;\n}\n\n.mat-column-created {\n  max-width: 124px;\n}\n\n.input-hidden {\n  position: absolute;\n  width: 0px;\n  border: none;\n  height: 100%;\n}\n\n.cell-right {\n  text-align: right;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvc3NjL3NsYS9EOlxccGVwLWFwcF9uZXdcXHNzY1xcQ2xpZW50QXBwL3NyY1xcYXBwXFxzc2NcXHNsYVxcc3NjLXNsYS5zY3NzIiwic3JjL2FwcC9zc2Mvc2xhL3NzYy1zbGEuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLHNCQUFBO0VBQ0EsaUJBQUE7RUFDQSxXQUFBO0FDQ0Y7O0FERUE7RUFDRSxzQkFBQTtFQUNBLG9CQUFBO0VBQUEsYUFBQTtFQUNBLHVCQUFBO1VBQUEsMkJBQUE7RUFDQSx5QkFBQTtVQUFBLG1CQUFBO0FDQ0Y7O0FERUE7RUFDRSxZQUFBO0FDQ0Y7O0FERUE7RUFDRSwyQkFBQTtBQ0NGOztBREVBO0VBQ0UsZUFBQTtBQ0NGOztBREVBO0VBQ0Usa0JBQUE7RUFDQSxpQkFBQTtBQ0NGOztBREVBLFNBQUE7O0FBRUE7RUFDRSxvQkFBQTtFQUFBLGFBQUE7RUFDQSx1QkFBQTtVQUFBLDJCQUFBO0VBQ0Esd0JBQUE7VUFBQSx1QkFBQTtFQUNBLDRCQUFBO0VBQUEsNkJBQUE7VUFBQSxzQkFBQTtBQ0FGOztBREdBO0VBQ0UsWUFBQTtFQUNBLGlDQUFBO0FDQUY7O0FER0E7RUFDRyxZQUFBO0FDQUg7O0FER0E7RUFDRSx5QkFBQTtFQUNBLDBCQUFBO0FDQUY7O0FET0E7RUFDRSxjQUFBO0VBQ0EsZUFBQTtBQ0pGOztBRE9BLFNBQUE7O0FBRUE7RUFDRSxzQkFBQTtFQUNBLGlCQUFBO0VBQ0EsY0FBQTtBQ0xGOztBRFFBO0VBQ0UsV0FBQTtBQ0xGOztBRFFBO0VBQ0Usa0JBQUE7RUFDQSxNQUFBO0VBQ0EsT0FBQTtFQUNBLFlBQUE7RUFDQSxRQUFBO0VBQ0EsK0JBQUE7RUFDQSxZQUFBO0VBQ0Esb0JBQUE7RUFBQSxhQUFBO0VBQ0EseUJBQUE7VUFBQSxtQkFBQTtFQUNBLHdCQUFBO1VBQUEsdUJBQUE7QUNMRjs7QURRQTtFQUNFLGNBQUE7RUFDQSxnQkFBQTtFQUNBLGtCQUFBO0FDTEY7O0FEUUEsa0JBQUE7O0FBQ0E7O0VBRUUsZUFBQTtBQ0xGOztBRFFBO0VBQ0UsZ0JBQUE7QUNMRjs7QURRQTtFQUNJLGtCQUFBO0VBQ0EsVUFBQTtFQUNBLFlBQUE7RUFDQSxZQUFBO0FDTEo7O0FEUUE7RUFDRSxpQkFBQTtBQ0xGIiwiZmlsZSI6InNyYy9hcHAvc3NjL3NsYS9zc2Mtc2xhLnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIuY29udGFpbmVyIHtcbiAgLypwb3NpdGlvbjogcmVsYXRpdmU7Ki9cbiAgbWluLWhlaWdodDogMjAwcHg7XG4gIG1hcmdpbjogMmVtO1xufVxuXG4uY29udGFpbmVyLXRvcC1iYXIge1xuICAvKnBvc2l0aW9uOiByZWxhdGl2ZTsqL1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtc3RhcnQ7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG59XG5cbi5jb250YWluZXItdG9wLWJhciBidXR0b24ge1xuICBtYXJnaW46IDE2cHg7XG59XG5cbi5jb250YWluZXItdG9wLWJhciBidXR0b246Zmlyc3Qtb2YtdHlwZSB7XG4gIG1hcmdpbi1sZWZ0OiAwcHggIWltcG9ydGFudDtcbn1cblxuLmNvbnRhaW5lci10b3AtYmFyIGJ1dHRvbjpmaXJzdC1vZi10eXBlIC5tYXQtaWNvbiB7XG4gIGZvbnQtc2l6ZTogMjJweDtcbn1cblxuLmNvbnRhaW5lci1jb250ZW50IHtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBtaW4taGVpZ2h0OiAyMDBweDtcbn1cblxuLyogZm9ybSAqL1xuXG5tYXQtY2FyZCB7IFxuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtc3RhcnQ7XG4gIGFsaWduLWl0ZW1zOiBmbGV4LXN0YXJ0O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xufVxuXG5tYXQtcHJvZ3Jlc3MtYmFyIHtcbiAgd2lkdGg6IDMzMnB4O1xuICBtYXJnaW46IC0xNnB4IDAgMTZweCAwICFpbXBvcnRhbnQ7XG59XG5cbm1hdC1mb3JtLWZpZWxkIHtcbiAgIHdpZHRoOiAyNTBweDtcbn1cblxuOjpuZy1kZWVwIC5tYXQtY2FyZC1oZWFkZXItdGV4dCB7XG4gIG1hcmdpbi1sZWZ0OiAwICFpbXBvcnRhbnQ7XG4gIG1hcmdpbi1yaWdodDogMCAhaW1wb3J0YW50O1xufVxuXG5tYXQtY2FyZC1jb250ZW50IHtcbiAgXG59XG5cbm1hdC1jYXJkLWFjdGlvbnMge1xuICBtYXJnaW4tbGVmdDogMDtcbiAgbWFyZ2luLXJpZ2h0OiAwO1xufVxuXG4vKiBsaXN0ICovXG5cbi5jb250YWluZXItdGFibGUge1xuICAvKnBvc2l0aW9uOiByZWxhdGl2ZTsqL1xuICBtYXgtaGVpZ2h0OiA0MDBweDtcbiAgb3ZlcmZsb3c6IGF1dG87XG59XG5cbnRhYmxlIHtcbiAgd2lkdGg6IDEwMCU7XG59XG5cbi5sb2FkaW5nLXNoYWRlIHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB0b3A6IDA7XG4gIGxlZnQ6IDA7XG4gIGJvdHRvbTogNTZweDtcbiAgcmlnaHQ6IDA7XG4gIGJhY2tncm91bmQ6IHJnYmEoMCwgMCwgMCwgMC4xNSk7XG4gIHotaW5kZXg6IDk5OTtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG59XG5cbi5yYXRlLWxpbWl0LXJlYWNoZWQge1xuICBjb2xvcjogIzk4MDAwMDtcbiAgbWF4LXdpZHRoOiAzNjBweDtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xufVxuXG4vKiBDb2x1bW4gV2lkdGhzICovXG4ubWF0LWNvbHVtbi1udW1iZXIsXG4ubWF0LWNvbHVtbi1zdGF0ZSB7XG4gIG1heC13aWR0aDogNjRweDtcbn1cblxuLm1hdC1jb2x1bW4tY3JlYXRlZCB7XG4gIG1heC13aWR0aDogMTI0cHg7XG59XG5cbi5pbnB1dC1oaWRkZW4ge1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICB3aWR0aDogMHB4O1xuICAgIGJvcmRlcjogbm9uZTtcbiAgICBoZWlnaHQ6IDEwMCU7XG59XG5cbi5jZWxsLXJpZ2h0IHtcbiAgdGV4dC1hbGlnbjogcmlnaHQ7XG59IiwiLmNvbnRhaW5lciB7XG4gIC8qcG9zaXRpb246IHJlbGF0aXZlOyovXG4gIG1pbi1oZWlnaHQ6IDIwMHB4O1xuICBtYXJnaW46IDJlbTtcbn1cblxuLmNvbnRhaW5lci10b3AtYmFyIHtcbiAgLypwb3NpdGlvbjogcmVsYXRpdmU7Ki9cbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBmbGV4LXN0YXJ0O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xufVxuXG4uY29udGFpbmVyLXRvcC1iYXIgYnV0dG9uIHtcbiAgbWFyZ2luOiAxNnB4O1xufVxuXG4uY29udGFpbmVyLXRvcC1iYXIgYnV0dG9uOmZpcnN0LW9mLXR5cGUge1xuICBtYXJnaW4tbGVmdDogMHB4ICFpbXBvcnRhbnQ7XG59XG5cbi5jb250YWluZXItdG9wLWJhciBidXR0b246Zmlyc3Qtb2YtdHlwZSAubWF0LWljb24ge1xuICBmb250LXNpemU6IDIycHg7XG59XG5cbi5jb250YWluZXItY29udGVudCB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgbWluLWhlaWdodDogMjAwcHg7XG59XG5cbi8qIGZvcm0gKi9cbm1hdC1jYXJkIHtcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBmbGV4LXN0YXJ0O1xuICBhbGlnbi1pdGVtczogZmxleC1zdGFydDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbn1cblxubWF0LXByb2dyZXNzLWJhciB7XG4gIHdpZHRoOiAzMzJweDtcbiAgbWFyZ2luOiAtMTZweCAwIDE2cHggMCAhaW1wb3J0YW50O1xufVxuXG5tYXQtZm9ybS1maWVsZCB7XG4gIHdpZHRoOiAyNTBweDtcbn1cblxuOjpuZy1kZWVwIC5tYXQtY2FyZC1oZWFkZXItdGV4dCB7XG4gIG1hcmdpbi1sZWZ0OiAwICFpbXBvcnRhbnQ7XG4gIG1hcmdpbi1yaWdodDogMCAhaW1wb3J0YW50O1xufVxuXG5tYXQtY2FyZC1hY3Rpb25zIHtcbiAgbWFyZ2luLWxlZnQ6IDA7XG4gIG1hcmdpbi1yaWdodDogMDtcbn1cblxuLyogbGlzdCAqL1xuLmNvbnRhaW5lci10YWJsZSB7XG4gIC8qcG9zaXRpb246IHJlbGF0aXZlOyovXG4gIG1heC1oZWlnaHQ6IDQwMHB4O1xuICBvdmVyZmxvdzogYXV0bztcbn1cblxudGFibGUge1xuICB3aWR0aDogMTAwJTtcbn1cblxuLmxvYWRpbmctc2hhZGUge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogMDtcbiAgbGVmdDogMDtcbiAgYm90dG9tOiA1NnB4O1xuICByaWdodDogMDtcbiAgYmFja2dyb3VuZDogcmdiYSgwLCAwLCAwLCAwLjE1KTtcbiAgei1pbmRleDogOTk5O1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbn1cblxuLnJhdGUtbGltaXQtcmVhY2hlZCB7XG4gIGNvbG9yOiAjOTgwMDAwO1xuICBtYXgtd2lkdGg6IDM2MHB4O1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG59XG5cbi8qIENvbHVtbiBXaWR0aHMgKi9cbi5tYXQtY29sdW1uLW51bWJlcixcbi5tYXQtY29sdW1uLXN0YXRlIHtcbiAgbWF4LXdpZHRoOiA2NHB4O1xufVxuXG4ubWF0LWNvbHVtbi1jcmVhdGVkIHtcbiAgbWF4LXdpZHRoOiAxMjRweDtcbn1cblxuLmlucHV0LWhpZGRlbiB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgd2lkdGg6IDBweDtcbiAgYm9yZGVyOiBub25lO1xuICBoZWlnaHQ6IDEwMCU7XG59XG5cbi5jZWxsLXJpZ2h0IHtcbiAgdGV4dC1hbGlnbjogcmlnaHQ7XG59Il19 */"

/***/ }),

/***/ "./src/app/ssc/sla/ssc-sla.service.ts":
/*!********************************************!*\
  !*** ./src/app/ssc/sla/ssc-sla.service.ts ***!
  \********************************************/
/*! exports provided: SscSlaService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SscSlaService", function() { return SscSlaService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm2015/http.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm2015/operators/index.js");
/* harmony import */ var _ssc_sla__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ssc-sla */ "./src/app/ssc/sla/ssc-sla.ts");





let SscSlaService = class SscSlaService {
    constructor(http) {
        this.http = http;
    }
    add(_ssc_sla) {
        return this.http.post('Ssc/Sla/Add', _ssc_sla)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(res => {
            return res;
        }));
    }
    deleteSscSla(_ssc_sla) {
        return this.http.post('Ssc/Sla/Delete', _ssc_sla)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(res => {
            return res;
        }));
    }
    editSscSla(_ssc_sla) {
        return this.http.post('Ssc/Sla/Edit', _ssc_sla)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(res => {
            return res;
        }));
    }
    getOne(_ssc_sla) {
        return this.http.post('Ssc/Sla/Get', _ssc_sla)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(res => {
            return new _ssc_sla__WEBPACK_IMPORTED_MODULE_4__["SscSla"](res.SSC_SLA_ID, res.MACHINE_ID, res.PRESENCE_LOCATION_ID, res.DEVICE_ROLE);
        }));
    }
};
SscSlaService.ctorParameters = () => [
    { type: _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"] }
];
SscSlaService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
        providedIn: 'root'
    })
], SscSlaService);



/***/ }),

/***/ "./src/app/ssc/sla/ssc-sla.ts":
/*!************************************!*\
  !*** ./src/app/ssc/sla/ssc-sla.ts ***!
  \************************************/
/*! exports provided: SscSla */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SscSla", function() { return SscSla; });
class SscSla {
    constructor(ssc_sla_id = 0, machine_id, presence_location_id, device_role, asset_name = "", location_name = "") {
        this.ssc_sla_id = ssc_sla_id;
        this.machine_id = machine_id;
        this.presence_location_id = presence_location_id;
        this.device_role = device_role;
        this.asset_name = asset_name;
        this.location_name = location_name;
    }
}
SscSla.ctorParameters = () => [
    { type: Number },
    { type: Number },
    { type: Number },
    { type: String },
    { type: String },
    { type: String }
];


/***/ }),

/***/ "./src/app/ssc/ssc-permission.guard.ts":
/*!*********************************************!*\
  !*** ./src/app/ssc/ssc-permission.guard.ts ***!
  \*********************************************/
/*! exports provided: SscPermissionGuard */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SscPermissionGuard", function() { return SscPermissionGuard; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");
/* harmony import */ var _ssc_permission_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ssc-permission.service */ "./src/app/ssc/ssc-permission.service.ts");




let SscPermissionGuard = class SscPermissionGuard {
    constructor(router, sscPermissionService) {
        this.router = router;
        this.sscPermissionService = sscPermissionService;
    }
    canActivate(route, state) {
        var res = this.sscPermissionService.passPermission(state.url);
        if (!res) {
            this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        }
        return res;
    }
};
SscPermissionGuard.ctorParameters = () => [
    { type: _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"] },
    { type: _ssc_permission_service__WEBPACK_IMPORTED_MODULE_3__["SscPermissionService"] }
];
SscPermissionGuard = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
        providedIn: 'root'
    })
], SscPermissionGuard);



/***/ }),

/***/ "./src/app/ssc/ssc-permission.service.ts":
/*!***********************************************!*\
  !*** ./src/app/ssc/ssc-permission.service.ts ***!
  \***********************************************/
/*! exports provided: SscPermissionService, Menu */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SscPermissionService", function() { return SscPermissionService; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Menu", function() { return Menu; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");
/* harmony import */ var _auth_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../auth.service */ "./src/app/auth.service.ts");




//import { User } from '../user';
let SscPermissionService = class SscPermissionService {
    constructor(router, authService) {
        this.router = router;
        this.authService = authService;
        this.basePath = "ssc";
        this.root = [
            new Menu("dashboard", true, ["IctDashboard Read"]),
            new Menu("ticket", true, ["IctTickets Read"]),
            new Menu("ticket/list", true, ["IctTickets Read"]),
            new Menu("sla", true, ["IctSla Read"]),
            new Menu("sla/month", true, ["IctSla Read"]),
        ];
        this.authService.currentUser.subscribe(res => this.currentUser = res);
    }
    passPermission(path) {
        var res = false;
        var ms = this.root.filter(m => path.indexOf(this.basePath + '/' + m.link) != -1);
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
    }
};
SscPermissionService.ctorParameters = () => [
    { type: _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"] },
    { type: _auth_service__WEBPACK_IMPORTED_MODULE_3__["AuthService"] }
];
SscPermissionService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
        providedIn: 'root'
    })
], SscPermissionService);

class Menu {
    constructor(link, auth, permission = []) {
        this.link = link;
        this.auth = auth;
        this.permission = permission;
    }
}
Menu.ctorParameters = () => [
    { type: String },
    { type: Boolean },
    { type: Array }
];


/***/ }),

/***/ "./src/app/ssc/ssc-routing.module.ts":
/*!*******************************************!*\
  !*** ./src/app/ssc/ssc-routing.module.ts ***!
  \*******************************************/
/*! exports provided: SscRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SscRoutingModule", function() { return SscRoutingModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");
/* harmony import */ var _ssc_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ssc.component */ "./src/app/ssc/ssc.component.ts");
/* harmony import */ var _ssc_permission_guard__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ssc-permission.guard */ "./src/app/ssc/ssc-permission.guard.ts");
/* harmony import */ var _dashboard_ssc_dashboard_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./dashboard/ssc-dashboard.component */ "./src/app/ssc/dashboard/ssc-dashboard.component.ts");
/* harmony import */ var _ticket_ssc_ticket_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./ticket/ssc-ticket.component */ "./src/app/ssc/ticket/ssc-ticket.component.ts");
/* harmony import */ var _ticket_ssc_ticket_list_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./ticket/ssc-ticket-list.component */ "./src/app/ssc/ticket/ssc-ticket-list.component.ts");
/* harmony import */ var _ticket_ssc_ticket_open_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./ticket/ssc-ticket-open.component */ "./src/app/ssc/ticket/ssc-ticket-open.component.ts");
/* harmony import */ var _sla_ssc_sla_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./sla/ssc-sla.component */ "./src/app/ssc/sla/ssc-sla.component.ts");
/* harmony import */ var _sla_ssc_sla_month_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./sla/ssc-sla-month.component */ "./src/app/ssc/sla/ssc-sla-month.component.ts");











const sscRoutes = [
    { path: '', component: _ssc_component__WEBPACK_IMPORTED_MODULE_3__["SscComponent"], children: [
            { path: 'dashboard', component: _dashboard_ssc_dashboard_component__WEBPACK_IMPORTED_MODULE_5__["SscDashboardComponent"] },
            { path: 'ticket', component: _ticket_ssc_ticket_component__WEBPACK_IMPORTED_MODULE_6__["SscTicketComponent"], children: [
                    { path: 'open', component: _ticket_ssc_ticket_open_component__WEBPACK_IMPORTED_MODULE_8__["SscTicketOpenComponent"], canActivate: [_ssc_permission_guard__WEBPACK_IMPORTED_MODULE_4__["SscPermissionGuard"]] },
                    { path: 'list', component: _ticket_ssc_ticket_list_component__WEBPACK_IMPORTED_MODULE_7__["SscTicketListComponent"], canActivate: [_ssc_permission_guard__WEBPACK_IMPORTED_MODULE_4__["SscPermissionGuard"]] },
                    { path: '', redirectTo: 'open', pathMatch: "full" },
                ] },
            { path: 'sla', component: _sla_ssc_sla_component__WEBPACK_IMPORTED_MODULE_9__["SscSlaComponent"], children: [
                    { path: 'month', component: _sla_ssc_sla_month_component__WEBPACK_IMPORTED_MODULE_10__["SscSlaMonthComponent"], canActivate: [_ssc_permission_guard__WEBPACK_IMPORTED_MODULE_4__["SscPermissionGuard"]] },
                    { path: '', redirectTo: 'month', pathMatch: "full" },
                ] },
            { path: '', redirectTo: 'sla/dashboard', pathMatch: "full" },
        ] },
];
let SscRoutingModule = class SscRoutingModule {
};
SscRoutingModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
        imports: [
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forChild(sscRoutes)
        ],
        exports: [
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"]
        ],
        declarations: []
    })
], SscRoutingModule);



/***/ }),

/***/ "./src/app/ssc/ssc.component.scss":
/*!****************************************!*\
  !*** ./src/app/ssc/ssc.component.scss ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".container {\n  /*position: relative;*/\n  min-height: 200px;\n  margin: 2em;\n}\n\n.container-top-bar {\n  /*position: relative;*/\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-pack: start;\n          justify-content: flex-start;\n  -webkit-box-align: center;\n          align-items: center;\n}\n\n.container-top-bar button {\n  margin: 16px;\n}\n\n.container-content {\n  position: relative;\n  min-height: 200px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvc3NjL0Q6XFxwZXAtYXBwX25ld1xcc3NjXFxDbGllbnRBcHAvc3JjXFxhcHBcXHNzY1xcc3NjLmNvbXBvbmVudC5zY3NzIiwic3JjL2FwcC9zc2Mvc3NjLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0Usc0JBQUE7RUFDQSxpQkFBQTtFQUNBLFdBQUE7QUNDRjs7QURFQTtFQUNDLHNCQUFBO0VBQ0Esb0JBQUE7RUFBQSxhQUFBO0VBQ0MsdUJBQUE7VUFBQSwyQkFBQTtFQUNBLHlCQUFBO1VBQUEsbUJBQUE7QUNDRjs7QURFQTtFQUNFLFlBQUE7QUNDRjs7QURFQTtFQUNDLGtCQUFBO0VBQ0EsaUJBQUE7QUNDRCIsImZpbGUiOiJzcmMvYXBwL3NzYy9zc2MuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIuY29udGFpbmVyIHtcbiAgLypwb3NpdGlvbjogcmVsYXRpdmU7Ki9cbiAgbWluLWhlaWdodDogMjAwcHg7XG4gIG1hcmdpbjogMmVtO1xufVxuXG4uY29udGFpbmVyLXRvcC1iYXIge1xuXHQvKnBvc2l0aW9uOiByZWxhdGl2ZTsqL1xuXHRkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtc3RhcnQ7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG59XG5cbi5jb250YWluZXItdG9wLWJhciBidXR0b24ge1xuICBtYXJnaW46IDE2cHg7XG59XG5cbi5jb250YWluZXItY29udGVudCB7XG5cdHBvc2l0aW9uOiByZWxhdGl2ZTtcblx0bWluLWhlaWdodDogMjAwcHg7XG59IiwiLmNvbnRhaW5lciB7XG4gIC8qcG9zaXRpb246IHJlbGF0aXZlOyovXG4gIG1pbi1oZWlnaHQ6IDIwMHB4O1xuICBtYXJnaW46IDJlbTtcbn1cblxuLmNvbnRhaW5lci10b3AtYmFyIHtcbiAgLypwb3NpdGlvbjogcmVsYXRpdmU7Ki9cbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBmbGV4LXN0YXJ0O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xufVxuXG4uY29udGFpbmVyLXRvcC1iYXIgYnV0dG9uIHtcbiAgbWFyZ2luOiAxNnB4O1xufVxuXG4uY29udGFpbmVyLWNvbnRlbnQge1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIG1pbi1oZWlnaHQ6IDIwMHB4O1xufSJdfQ== */"

/***/ }),

/***/ "./src/app/ssc/ssc.component.ts":
/*!**************************************!*\
  !*** ./src/app/ssc/ssc.component.ts ***!
  \**************************************/
/*! exports provided: SscComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SscComponent", function() { return SscComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm2015/material.js");
/* harmony import */ var _navigation_title_title_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../navigation/title/title.service */ "./src/app/navigation/title/title.service.ts");




let SscComponent = class SscComponent {
    constructor(snackBar, titleService) {
        this.snackBar = snackBar;
        this.titleService = titleService;
        this.titleService.titleSource.next({
            title: "ICT",
            icon: "",
            breadcrumbs: []
        });
    }
};
SscComponent.ctorParameters = () => [
    { type: _angular_material__WEBPACK_IMPORTED_MODULE_2__["MatSnackBar"] },
    { type: _navigation_title_title_service__WEBPACK_IMPORTED_MODULE_3__["TitleService"] }
];
SscComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
        selector: 'app-ssc',
        template: __webpack_require__(/*! raw-loader!./ssc.component.html */ "./node_modules/raw-loader/index.js!./src/app/ssc/ssc.component.html"),
        styles: [__webpack_require__(/*! ./ssc.component.scss */ "./src/app/ssc/ssc.component.scss")]
    })
], SscComponent);



/***/ }),

/***/ "./src/app/ssc/ssc.module.ts":
/*!***********************************!*\
  !*** ./src/app/ssc/ssc.module.ts ***!
  \***********************************/
/*! exports provided: SscModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SscModule", function() { return SscModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm2015/forms.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm2015/http.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm2015/common.js");
/* harmony import */ var _ssc_routing_module__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./ssc-routing.module */ "./src/app/ssc/ssc-routing.module.ts");
/* harmony import */ var _material_material_module__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../material/material.module */ "./src/app/material/material.module.ts");
/* harmony import */ var _xfilter_xfilter_module__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../xfilter/xfilter.module */ "./src/app/xfilter/xfilter.module.ts");
/* harmony import */ var _angular_flex_layout__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/flex-layout */ "./node_modules/@angular/flex-layout/esm2015/flex-layout.js");
/* harmony import */ var _ssc_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./ssc.component */ "./src/app/ssc/ssc.component.ts");
/* harmony import */ var _auth_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../auth.service */ "./src/app/auth.service.ts");
/* harmony import */ var _auth_interceptor__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../auth.interceptor */ "./src/app/auth.interceptor.ts");
/* harmony import */ var _ticket_ssc_ticket_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./ticket/ssc-ticket.component */ "./src/app/ssc/ticket/ssc-ticket.component.ts");
/* harmony import */ var _ticket_ssc_ticket_list_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./ticket/ssc-ticket-list.component */ "./src/app/ssc/ticket/ssc-ticket-list.component.ts");
/* harmony import */ var _ticket_ssc_ticket_open_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./ticket/ssc-ticket-open.component */ "./src/app/ssc/ticket/ssc-ticket-open.component.ts");
/* harmony import */ var _sla_ssc_sla_component__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./sla/ssc-sla.component */ "./src/app/ssc/sla/ssc-sla.component.ts");
/* harmony import */ var _sla_ssc_sla_month_component__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./sla/ssc-sla-month.component */ "./src/app/ssc/sla/ssc-sla-month.component.ts");
/* harmony import */ var _dashboard_ssc_dashboard_component__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./dashboard/ssc-dashboard.component */ "./src/app/ssc/dashboard/ssc-dashboard.component.ts");
/* harmony import */ var _navigation_panel_panel__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../navigation/panel/panel */ "./src/app/navigation/panel/panel.ts");
/* harmony import */ var _navigation_panel_panel_service__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../navigation/panel/panel.service */ "./src/app/navigation/panel/panel.service.ts");
/* harmony import */ var _xfilter_xfilter_component__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ../xfilter/xfilter.component */ "./src/app/xfilter/xfilter.component.ts");
/* harmony import */ var _ssc_permission_service__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./ssc-permission.service */ "./src/app/ssc/ssc-permission.service.ts");



























let SscModule = class SscModule {
    constructor(panelService, sscPermission, authService) {
        this.panelService = panelService;
        this.sscPermission = sscPermission;
        this.authService = authService;
        this.authService.currentUser.subscribe(res => {
            this.panelService.messageSource.next(new _navigation_panel_panel__WEBPACK_IMPORTED_MODULE_18__["Panel"]("ICT", 1, [
                new _navigation_panel_panel__WEBPACK_IMPORTED_MODULE_18__["PanelItem"]("Dashboard", "ssc/dashboard", "dashboard", this.sscPermission.passPermission("ssc/dashboard")),
                new _navigation_panel_panel__WEBPACK_IMPORTED_MODULE_18__["PanelItem"]("Open Tickets", "ssc/ticket/open", "list", this.sscPermission.passPermission("ssc/ticket")),
                new _navigation_panel_panel__WEBPACK_IMPORTED_MODULE_18__["PanelItem"]("All Tickets", "ssc/ticket/list", "list", this.sscPermission.passPermission("ssc/ticket")),
                new _navigation_panel_panel__WEBPACK_IMPORTED_MODULE_18__["PanelItem"]("SLA", "ssc/sla", "show_chart", this.sscPermission.passPermission("ssc/sla")),
            ]));
        });
    }
};
SscModule.ctorParameters = () => [
    { type: _navigation_panel_panel_service__WEBPACK_IMPORTED_MODULE_19__["PanelService"] },
    { type: _ssc_permission_service__WEBPACK_IMPORTED_MODULE_21__["SscPermissionService"] },
    { type: _auth_service__WEBPACK_IMPORTED_MODULE_10__["AuthService"] }
];
SscModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
        declarations: [
            _ssc_component__WEBPACK_IMPORTED_MODULE_9__["SscComponent"],
            _ticket_ssc_ticket_component__WEBPACK_IMPORTED_MODULE_12__["SscTicketComponent"],
            _ticket_ssc_ticket_list_component__WEBPACK_IMPORTED_MODULE_13__["SscTicketListComponent"],
            _ticket_ssc_ticket_open_component__WEBPACK_IMPORTED_MODULE_14__["SscTicketOpenComponent"],
            _sla_ssc_sla_component__WEBPACK_IMPORTED_MODULE_15__["SscSlaComponent"],
            _sla_ssc_sla_month_component__WEBPACK_IMPORTED_MODULE_16__["SscSlaMonthComponent"],
            _dashboard_ssc_dashboard_component__WEBPACK_IMPORTED_MODULE_17__["SscDashboardComponent"],
        ],
        imports: [
            _angular_common__WEBPACK_IMPORTED_MODULE_4__["CommonModule"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormsModule"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_2__["ReactiveFormsModule"],
            _angular_common_http__WEBPACK_IMPORTED_MODULE_3__["HttpClientModule"],
            _ssc_routing_module__WEBPACK_IMPORTED_MODULE_5__["SscRoutingModule"],
            _material_material_module__WEBPACK_IMPORTED_MODULE_6__["MaterialModule"],
            _angular_flex_layout__WEBPACK_IMPORTED_MODULE_8__["FlexLayoutModule"],
            _xfilter_xfilter_module__WEBPACK_IMPORTED_MODULE_7__["xFilterModule"]
        ],
        providers: [
            { provide: _angular_common_http__WEBPACK_IMPORTED_MODULE_3__["HTTP_INTERCEPTORS"], useClass: _auth_interceptor__WEBPACK_IMPORTED_MODULE_11__["AuthInterceptor"], multi: true },
        ],
        bootstrap: [],
        entryComponents: [
            _xfilter_xfilter_component__WEBPACK_IMPORTED_MODULE_20__["xFilterDialogComponent"],
            _xfilter_xfilter_component__WEBPACK_IMPORTED_MODULE_20__["xFilterDialogNumberComponent"],
            _xfilter_xfilter_component__WEBPACK_IMPORTED_MODULE_20__["xFilterDialogDateComponent"],
            _xfilter_xfilter_component__WEBPACK_IMPORTED_MODULE_20__["xFilterDialogTextComponent"],
        ],
    })
], SscModule);



/***/ }),

/***/ "./src/app/ssc/ticket/ssc-ticket-list.component.ts":
/*!*********************************************************!*\
  !*** ./src/app/ssc/ticket/ssc-ticket-list.component.ts ***!
  \*********************************************************/
/*! exports provided: SscTicketListComponent, MatTableApi, ExampleHttpDao */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SscTicketListComponent", function() { return SscTicketListComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MatTableApi", function() { return MatTableApi; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ExampleHttpDao", function() { return ExampleHttpDao; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm2015/http.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm2015/material.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm2015/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm2015/operators/index.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm2015/forms.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");
/* harmony import */ var _ssc_ticket_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./ssc-ticket.service */ "./src/app/ssc/ticket/ssc-ticket.service.ts");
/* harmony import */ var _snackbar_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../snackbar.service */ "./src/app/snackbar.service.ts");
/* harmony import */ var _ssc_permission_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../ssc-permission.service */ "./src/app/ssc/ssc-permission.service.ts");
/* harmony import */ var _navigation_title_title_service__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../navigation/title/title.service */ "./src/app/navigation/title/title.service.ts");
/* harmony import */ var _xfilter_xfilter_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../xfilter/xfilter.component */ "./src/app/xfilter/xfilter.component.ts");













let SscTicketListComponent = class SscTicketListComponent {
    constructor(http, router, dialog, 
    //public snackBar: MatSnackBar,
    ssc_ticketService, snackbarService, sscPermissionService, titleService, route, xfilterService) {
        this.http = http;
        this.router = router;
        this.dialog = dialog;
        this.ssc_ticketService = ssc_ticketService;
        this.snackbarService = snackbarService;
        this.sscPermissionService = sscPermissionService;
        this.titleService = titleService;
        this.route = route;
        this.xfilterService = xfilterService;
        this.displayedColumns = ["id", "type", "displayId", "summary", "customer_fullName", "customer_company", "customer_site", "customer_pa", "customer_psa", "customer_department", "assignee_fullName", "assignee_loginId", "assignee_group", "priority", "status_value", "status_reason", "supportGroup_name", "submitDate", "completedDate", "slaStatus", "modifiedDate", "Actions"];
        this.data = [];
        //dataSource = new MatTableDataSource<any>(this.data);
        //selection = new SelectionModel<any>(true, []);
        //isEditing:boolean = false;
        this.resultsLength = 0;
        this.isLoadingResults = true;
        this.isRateLimitReached = false;
        this.submitting = false;
        this.filterControl = new _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormControl"]('');
        this.idFilter = new _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormControl"]('');
        this.typeFilter = new _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormControl"]('');
        this.displayIdFilter = new _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormControl"]('');
        this.summaryFilter = new _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormControl"]('');
        this.customer_fullNameFilter = new _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormControl"]('');
        this.customer_companyFilter = new _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormControl"]('');
        this.customer_siteFilter = new _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormControl"]('');
        this.customer_paFilter = new _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormControl"]('');
        this.customer_psaFilter = new _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormControl"]('');
        this.customer_departmentFilter = new _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormControl"]('');
        this.assignee_fullNameFilter = new _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormControl"]('');
        this.assignee_loginIdFilter = new _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormControl"]('');
        this.assignee_groupFilter = new _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormControl"]('');
        this.priorityFilter = new _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormControl"]('');
        this.status_valueFilter = new _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormControl"]('');
        this.status_reasonFilter = new _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormControl"]('');
        this.supportGroup_nameFilter = new _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormControl"]('');
        this.submitDateFilter = new _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormControl"]('');
        this.completedDateFilter = new _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormControl"]('');
        this.slaStatusFilter = new _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormControl"]('');
        this.modifiedDateFilter = new _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormControl"]('');
        this.id_xSelected = [];
        this.type_xSelected = [];
        this.displayId_xSelected = [];
        this.summary_xSelected = [];
        this.customer_fullName_xSelected = [];
        this.customer_company_xSelected = [];
        this.customer_site_xSelected = [];
        this.customer_pa_xSelected = [];
        this.customer_psa_xSelected = [];
        this.customer_department_xSelected = [];
        this.assignee_fullName_xSelected = [];
        this.assignee_loginId_xSelected = [];
        this.assignee_group_xSelected = [];
        this.priority_xSelected = [];
        this.status_value_xSelected = [];
        this.status_reason_xSelected = [];
        this.supportGroup_name_xSelected = [];
        this.submitDate_xSelected = [];
        this.completedDate_xSelected = [];
        this.slaStatus_xSelected = [];
        this.modifiedDate_xSelected = [];
    }
    ngOnInit() {
        this.titleService.titleSource.next({
            title: "All Tickets",
            icon: "",
            breadcrumbs: [
                { label: 'ICT', routerLink: '' },
                { label: 'Ticket', routerLink: '' },
                { label: 'All', routerLink: '' }
            ]
        });
        this.exampleDatabase = new ExampleHttpDao(this.http);
        // If the user changes the sort order, reset back to the first page.
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
        this.filterSubscription = this.xfilterService.filter.subscribe(res => {
            if (res)
                this.getColumnValues(res);
        });
        this.selectedSubscription = this.xfilterService.selected.subscribe(res => {
            this[res["column"] + "_xSelected"] = res["selected"];
        });
        this.listSubscription = Object(rxjs__WEBPACK_IMPORTED_MODULE_4__["merge"])(this.sort.sortChange, this.paginator.page, this.filterControl.valueChanges.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["debounceTime"])(300)), this.idFilter.valueChanges.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["debounceTime"])(300)), this.typeFilter.valueChanges.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["debounceTime"])(300)), this.displayIdFilter.valueChanges.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["debounceTime"])(300)), this.summaryFilter.valueChanges.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["debounceTime"])(300)), this.customer_fullNameFilter.valueChanges.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["debounceTime"])(300)), this.customer_companyFilter.valueChanges.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["debounceTime"])(300)), this.customer_siteFilter.valueChanges.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["debounceTime"])(300)), this.customer_paFilter.valueChanges.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["debounceTime"])(300)), this.customer_psaFilter.valueChanges.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["debounceTime"])(300)), this.customer_departmentFilter.valueChanges.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["debounceTime"])(300)), this.assignee_fullNameFilter.valueChanges.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["debounceTime"])(300)), this.assignee_loginIdFilter.valueChanges.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["debounceTime"])(300)), this.assignee_groupFilter.valueChanges.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["debounceTime"])(300)), this.priorityFilter.valueChanges.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["debounceTime"])(300)), this.status_valueFilter.valueChanges.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["debounceTime"])(300)), this.status_reasonFilter.valueChanges.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["debounceTime"])(300)), this.supportGroup_nameFilter.valueChanges.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["debounceTime"])(300)), this.submitDateFilter.valueChanges.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["debounceTime"])(300)), this.completedDateFilter.valueChanges.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["debounceTime"])(300)), this.slaStatusFilter.valueChanges.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["debounceTime"])(300)), this.modifiedDateFilter.valueChanges.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["debounceTime"])(300)), this.xfilterService.selected).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["startWith"])({}), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["switchMap"])(() => {
            this.isLoadingResults = true;
            var columnfilter = this.getColumnFilter();
            return this.exampleDatabase.getRepoIssues(this.sort.active, this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize, this.filterControl.value, columnfilter);
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["map"])(data => {
            // Flip flag to show that loading has finished.
            this.isLoadingResults = false;
            this.isRateLimitReached = false;
            this.resultsLength = data.total_count;
            return data.items;
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["catchError"])(() => {
            this.isLoadingResults = false;
            // Catch if the GitHub API has reached its rate limit. Return empty data.
            this.isRateLimitReached = true;
            return Object(rxjs__WEBPACK_IMPORTED_MODULE_4__["of"])([]);
        })).subscribe(data => this.data = data);
        var submitDateVal = [];
        var p_start_submitDate = this.route.snapshot.paramMap.get('start_submitDate');
        if (p_start_submitDate != null && p_start_submitDate.length > 0) {
            submitDateVal.push({ opr: "gte", val: new Date(Number(p_start_submitDate)).toISOString(), log: "and" });
        }
        var p_end_submitDate = this.route.snapshot.paramMap.get('end_submitDate');
        if (p_end_submitDate != null && p_end_submitDate.length > 0) {
            submitDateVal.push({ opr: "lte", val: new Date(Number(p_end_submitDate)).toISOString(), log: "and" });
        }
        if (submitDateVal.length > 0)
            this.xfilterService.updateSelected({ column: "submitDate", selected: submitDateVal });
        var p_assignee_group = this.route.snapshot.paramMap.get('assignee_group');
        if (p_assignee_group != null && p_assignee_group.length > 0) {
            this.xfilterService.updateSelected({ column: "assignee_group", selected: p_assignee_group.split(",") });
        }
        var p_slaStatus = this.route.snapshot.paramMap.get('slaStatus');
        if (p_slaStatus != null && p_slaStatus.length > 0) {
            this.xfilterService.updateSelected({ column: "slaStatus", selected: p_slaStatus.split(",") });
        }
        var p_status_value = this.route.snapshot.paramMap.get('status_value');
        if (p_status_value != null && p_status_value.length > 0) {
            this.xfilterService.updateSelected({ column: "status_value", selected: p_status_value.split(",") });
        }
    }
    ngOnDestroy() {
        this.filterSubscription.unsubscribe();
        this.selectedSubscription.unsubscribe();
        this.listSubscription.unsubscribe();
    }
    passPermission(path) {
        return this.sscPermissionService.passPermission(path);
    }
    getColumnValues(param) {
        var column = param["column"];
        var filter = param["filter"];
        var selected = param["selected"];
        var clear = param["clear"];
        var columnfilter = this.getColumnFilter();
        if (filter)
            columnfilter[column] = [filter];
        if (selected && selected.length > 0)
            columnfilter[column] = selected.map(s => "^" + s + "$");
        if (clear)
            delete columnfilter[column];
        return this.exampleDatabase.getRepoIssues(this.sort.active, this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize, this.filterControl.value, columnfilter, column).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["map"])((res) => {
            return res;
        })).subscribe(res => {
            this.xfilterService.updateItems({ column: column, items: res.items });
        }, () => {
        });
    }
    getColumnFilter() {
        var columnfilter = {};
        if (this.id_xSelected.length)
            columnfilter["id"] = this.id_xSelected;
        if (this.type_xSelected.length)
            columnfilter["type"] = this.type_xSelected;
        if (this.displayId_xSelected.length)
            columnfilter["displayId"] = this.displayId_xSelected;
        if (this.summary_xSelected.length)
            columnfilter["summary"] = this.summary_xSelected;
        if (this.customer_fullName_xSelected.length)
            columnfilter["customer_fullName"] = this.customer_fullName_xSelected;
        if (this.customer_company_xSelected.length)
            columnfilter["customer_company"] = this.customer_company_xSelected;
        if (this.customer_site_xSelected.length)
            columnfilter["customer_site"] = this.customer_site_xSelected;
        if (this.customer_pa_xSelected.length)
            columnfilter["customer_pa"] = this.customer_pa_xSelected;
        if (this.customer_psa_xSelected.length)
            columnfilter["customer_psa"] = this.customer_psa_xSelected;
        if (this.customer_department_xSelected.length)
            columnfilter["customer_department"] = this.customer_department_xSelected;
        if (this.assignee_fullName_xSelected.length)
            columnfilter["assignee_fullName"] = this.assignee_fullName_xSelected;
        if (this.assignee_loginId_xSelected.length)
            columnfilter["assignee_loginId"] = this.assignee_loginId_xSelected;
        if (this.assignee_group_xSelected.length)
            columnfilter["assignee_group"] = this.assignee_group_xSelected;
        if (this.priority_xSelected.length)
            columnfilter["priority"] = this.priority_xSelected;
        if (this.status_value_xSelected.length)
            columnfilter["status_value"] = this.status_value_xSelected;
        if (this.status_reason_xSelected.length)
            columnfilter["status_reason"] = this.status_reason_xSelected;
        if (this.supportGroup_name_xSelected.length)
            columnfilter["supportGroup_name"] = this.supportGroup_name_xSelected;
        if (this.submitDate_xSelected.length)
            columnfilter["submitDate"] = this.submitDate_xSelected;
        if (this.completedDate_xSelected.length)
            columnfilter["completedDate"] = this.completedDate_xSelected;
        if (this.slaStatus_xSelected.length)
            columnfilter["slaStatus"] = this.slaStatus_xSelected;
        if (this.modifiedDate_xSelected.length)
            columnfilter["modifiedDate"] = this.modifiedDate_xSelected;
        //if(this.start_submitDate != null) columnfilter["start_submitDate"] = this.start_submitDate;
        //if(this.end_submitDate != null) columnfilter["end_submitDate"] = this.end_submitDate;
        //if(this.group != null) columnfilter["group"] = this.group;
        //if(this.status != null) columnfilter["status"] = this.status;
        return columnfilter;
    }
};
SscTicketListComponent.ctorParameters = () => [
    { type: _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"] },
    { type: _angular_router__WEBPACK_IMPORTED_MODULE_7__["Router"] },
    { type: _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatDialog"] },
    { type: _ssc_ticket_service__WEBPACK_IMPORTED_MODULE_8__["SscTicketService"] },
    { type: _snackbar_service__WEBPACK_IMPORTED_MODULE_9__["SnackbarService"] },
    { type: _ssc_permission_service__WEBPACK_IMPORTED_MODULE_10__["SscPermissionService"] },
    { type: _navigation_title_title_service__WEBPACK_IMPORTED_MODULE_11__["TitleService"] },
    { type: _angular_router__WEBPACK_IMPORTED_MODULE_7__["ActivatedRoute"] },
    { type: _xfilter_xfilter_component__WEBPACK_IMPORTED_MODULE_12__["xFilterService"] }
];
tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ViewChild"])(_angular_material__WEBPACK_IMPORTED_MODULE_3__["MatPaginator"], { static: true })
], SscTicketListComponent.prototype, "paginator", void 0);
tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ViewChild"])(_angular_material__WEBPACK_IMPORTED_MODULE_3__["MatSort"], { static: true })
], SscTicketListComponent.prototype, "sort", void 0);
SscTicketListComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Component"])({
        selector: 'ssc-ticket-list',
        template: __webpack_require__(/*! raw-loader!./ssc-ticket-list.component.html */ "./node_modules/raw-loader/index.js!./src/app/ssc/ticket/ssc-ticket-list.component.html"),
        styles: [__webpack_require__(/*! ./ssc-ticket.scss */ "./src/app/ssc/ticket/ssc-ticket.scss")]
    })
], SscTicketListComponent);

/*export interface SscTicket {
  SSC_TICKET_ID: number;
  ASSET_ID: number;
  ASSET_NAME: string;
}*/
class MatTableApi {
    constructor(sort, order, page, pagesize, filter) {
        this.sort = sort;
        this.order = order;
        this.page = page;
        this.pagesize = pagesize;
        this.filter = filter;
    }
}
MatTableApi.ctorParameters = () => [
    { type: String },
    { type: String },
    { type: Number },
    { type: Number },
    { type: String }
];
/** An example database that the data source uses to retrieve data for the table. */
class ExampleHttpDao {
    constructor(http) {
        this.http = http;
    }
    getRepoIssues(sort, order, page, pagesize = 25, filter, columnfilter, mode = "", httpOption = {}) {
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
        return this.http.get('/api/ssc/tickets', httpOption);
    }
}
ExampleHttpDao.ctorParameters = () => [
    { type: _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"] }
];


/***/ }),

/***/ "./src/app/ssc/ticket/ssc-ticket-open.component.ts":
/*!*********************************************************!*\
  !*** ./src/app/ssc/ticket/ssc-ticket-open.component.ts ***!
  \*********************************************************/
/*! exports provided: SscTicketOpenComponent, MatTableApi, ExampleHttpDao */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SscTicketOpenComponent", function() { return SscTicketOpenComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MatTableApi", function() { return MatTableApi; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ExampleHttpDao", function() { return ExampleHttpDao; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm2015/http.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm2015/material.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm2015/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm2015/operators/index.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm2015/forms.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");
/* harmony import */ var _ssc_ticket_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./ssc-ticket.service */ "./src/app/ssc/ticket/ssc-ticket.service.ts");
/* harmony import */ var _snackbar_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../snackbar.service */ "./src/app/snackbar.service.ts");
/* harmony import */ var _ssc_permission_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../ssc-permission.service */ "./src/app/ssc/ssc-permission.service.ts");
/* harmony import */ var _navigation_title_title_service__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../navigation/title/title.service */ "./src/app/navigation/title/title.service.ts");
/* harmony import */ var _xfilter_xfilter_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../xfilter/xfilter.component */ "./src/app/xfilter/xfilter.component.ts");
/* harmony import */ var _common_service__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../common.service */ "./src/app/common.service.ts");














let SscTicketOpenComponent = class SscTicketOpenComponent {
    constructor(http, router, dialog, 
    //public snackBar: MatSnackBar,
    ssc_ticketService, snackbarService, sscPermissionService, titleService, route, xfilterService, commonService) {
        this.http = http;
        this.router = router;
        this.dialog = dialog;
        this.ssc_ticketService = ssc_ticketService;
        this.snackbarService = snackbarService;
        this.sscPermissionService = sscPermissionService;
        this.titleService = titleService;
        this.route = route;
        this.xfilterService = xfilterService;
        this.commonService = commonService;
        this.displayedColumns = ["priority", "displayId", "slaStatus", "customer_fullName", "customer_department", "assignee_fullName", "assignee_group", "summary", "status_value", "modifiedDate"];
        this.data = [];
        //dataSource = new MatTableDataSource<any>(this.data);
        //selection = new SelectionModel<any>(true, []);
        //isEditing:boolean = false;
        this.resultsLength = 0;
        this.isLoadingResults = true;
        this.isRateLimitReached = false;
        this.submitting = false;
        this.filterControl = new _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormControl"]('');
        this.idFilter = new _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormControl"]('');
        this.typeFilter = new _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormControl"]('');
        this.displayIdFilter = new _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormControl"]('');
        this.summaryFilter = new _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormControl"]('');
        this.customer_fullNameFilter = new _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormControl"]('');
        this.customer_companyFilter = new _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormControl"]('');
        this.customer_siteFilter = new _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormControl"]('');
        this.customer_paFilter = new _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormControl"]('');
        this.customer_psaFilter = new _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormControl"]('');
        this.customer_departmentFilter = new _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormControl"]('');
        this.assignee_fullNameFilter = new _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormControl"]('');
        this.assignee_loginIdFilter = new _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormControl"]('');
        this.assignee_groupFilter = new _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormControl"]('');
        this.priorityFilter = new _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormControl"]('');
        this.status_valueFilter = new _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormControl"]('');
        this.status_reasonFilter = new _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormControl"]('');
        this.supportGroup_nameFilter = new _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormControl"]('');
        this.submitDateFilter = new _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormControl"]('');
        this.completedDateFilter = new _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormControl"]('');
        this.slaStatusFilter = new _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormControl"]('');
        this.modifiedDateFilter = new _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormControl"]('');
        this.id_xSelected = [];
        this.type_xSelected = [];
        this.displayId_xSelected = [];
        this.summary_xSelected = [];
        this.customer_fullName_xSelected = [];
        this.customer_company_xSelected = [];
        this.customer_site_xSelected = [];
        this.customer_pa_xSelected = [];
        this.customer_psa_xSelected = [];
        this.customer_department_xSelected = [];
        this.assignee_fullName_xSelected = [];
        this.assignee_loginId_xSelected = [];
        this.assignee_group_xSelected = [];
        this.priority_xSelected = [];
        this.status_value_xSelected = ["Assigned", "In Progress", "Pending"];
        this.status_reason_xSelected = [];
        this.supportGroup_name_xSelected = [];
        this.submitDate_xSelected = [];
        this.completedDate_xSelected = [];
        this.slaStatus_xSelected = [];
        this.modifiedDate_xSelected = [];
    }
    ngOnInit() {
        this.titleService.titleSource.next({
            title: "Open Tickets",
            icon: "",
            breadcrumbs: [
                { label: 'ICT', routerLink: '' },
                { label: 'Ticket', routerLink: '' },
                { label: 'Open', routerLink: '' }
            ]
        });
        if (this.route.snapshot.paramMap.get('fullWindow') != null) {
            this.fullWindow = true;
            this.commonService.messageFs.next(true);
        }
        if (!isNaN(parseInt(this.route.snapshot.paramMap.get('refresh')))) {
            this.refresh = Object(rxjs__WEBPACK_IMPORTED_MODULE_4__["interval"])(parseInt(this.route.snapshot.paramMap.get('refresh')) * 1000);
        }
        else {
            this.refresh = Object(rxjs__WEBPACK_IMPORTED_MODULE_4__["of"])({});
        }
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
        if (this.group != null)
            this.assignee_group_xSelected = [this.group];
        this.status = this.route.snapshot.paramMap.get('status');
        this.exampleDatabase = new ExampleHttpDao(this.http);
        // If the user changes the sort order, reset back to the first page.
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
        this.filterSubscription = this.xfilterService.filter.subscribe(res => {
            if (res)
                this.getColumnValues(res);
        });
        this.selectedSubscription = this.xfilterService.selected.subscribe(res => {
            this[res["column"] + "_xSelected"] = res["selected"];
        });
        this.listSubscription = Object(rxjs__WEBPACK_IMPORTED_MODULE_4__["merge"])(this.sort.sortChange, this.paginator.page, this.filterControl.valueChanges.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["debounceTime"])(300)), this.idFilter.valueChanges.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["debounceTime"])(300)), this.typeFilter.valueChanges.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["debounceTime"])(300)), this.displayIdFilter.valueChanges.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["debounceTime"])(300)), this.summaryFilter.valueChanges.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["debounceTime"])(300)), this.customer_fullNameFilter.valueChanges.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["debounceTime"])(300)), this.customer_companyFilter.valueChanges.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["debounceTime"])(300)), this.customer_siteFilter.valueChanges.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["debounceTime"])(300)), this.customer_paFilter.valueChanges.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["debounceTime"])(300)), this.customer_psaFilter.valueChanges.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["debounceTime"])(300)), this.customer_departmentFilter.valueChanges.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["debounceTime"])(300)), this.assignee_fullNameFilter.valueChanges.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["debounceTime"])(300)), this.assignee_loginIdFilter.valueChanges.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["debounceTime"])(300)), this.assignee_groupFilter.valueChanges.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["debounceTime"])(300)), this.priorityFilter.valueChanges.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["debounceTime"])(300)), this.status_valueFilter.valueChanges.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["debounceTime"])(300)), this.status_reasonFilter.valueChanges.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["debounceTime"])(300)), this.supportGroup_nameFilter.valueChanges.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["debounceTime"])(300)), this.submitDateFilter.valueChanges.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["debounceTime"])(300)), this.completedDateFilter.valueChanges.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["debounceTime"])(300)), this.slaStatusFilter.valueChanges.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["debounceTime"])(300)), this.modifiedDateFilter.valueChanges.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["debounceTime"])(300)), this.xfilterService.selected, this.refresh.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["debounceTime"])(300))).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["startWith"])({}), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["switchMap"])(() => {
            this.isLoadingResults = true;
            var columnfilter = this.getColumnFilter();
            return this.exampleDatabase.getRepoIssues(this.sort.active, this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize, this.filterControl.value, columnfilter);
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["map"])(data => {
            // Flip flag to show that loading has finished.
            this.isLoadingResults = false;
            this.isRateLimitReached = false;
            this.resultsLength = data.total_count;
            return data.items;
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["catchError"])(() => {
            this.isLoadingResults = false;
            // Catch if the GitHub API has reached its rate limit. Return empty data.
            this.isRateLimitReached = true;
            return Object(rxjs__WEBPACK_IMPORTED_MODULE_4__["of"])([]);
        })).subscribe(data => this.data = data);
    }
    ngOnDestroy() {
        this.filterSubscription.unsubscribe();
        this.selectedSubscription.unsubscribe();
        this.listSubscription.unsubscribe();
    }
    passPermission(path) {
        return this.sscPermissionService.passPermission(path);
    }
    getColumnValues(param) {
        var column = param["column"];
        var filter = param["filter"];
        var selected = param["selected"];
        var clear = param["clear"];
        var columnfilter = this.getColumnFilter();
        if (filter)
            columnfilter[column] = [filter];
        if (selected && selected.length > 0)
            columnfilter[column] = selected.map(s => "^" + s + "$");
        if (clear)
            delete columnfilter[column];
        return this.exampleDatabase.getRepoIssues(this.sort.active, this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize, this.filterControl.value, columnfilter, column).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["map"])((res) => {
            return res;
        })).subscribe(res => {
            this.xfilterService.updateItems({ column: column, items: res.items });
        }, () => {
        });
    }
    getColumnFilter() {
        var columnfilter = {};
        if (this.id_xSelected.length)
            columnfilter["id"] = this.id_xSelected;
        if (this.type_xSelected.length)
            columnfilter["type"] = this.type_xSelected;
        if (this.displayId_xSelected.length)
            columnfilter["displayId"] = this.displayId_xSelected;
        if (this.summary_xSelected.length)
            columnfilter["summary"] = this.summary_xSelected;
        if (this.customer_fullName_xSelected.length)
            columnfilter["customer_fullName"] = this.customer_fullName_xSelected;
        if (this.customer_company_xSelected.length)
            columnfilter["customer_company"] = this.customer_company_xSelected;
        if (this.customer_site_xSelected.length)
            columnfilter["customer_site"] = this.customer_site_xSelected;
        if (this.customer_pa_xSelected.length)
            columnfilter["customer_pa"] = this.customer_pa_xSelected;
        if (this.customer_psa_xSelected.length)
            columnfilter["customer_psa"] = this.customer_psa_xSelected;
        if (this.customer_department_xSelected.length)
            columnfilter["customer_department"] = this.customer_department_xSelected;
        if (this.assignee_fullName_xSelected.length)
            columnfilter["assignee_fullName"] = this.assignee_fullName_xSelected;
        if (this.assignee_loginId_xSelected.length)
            columnfilter["assignee_loginId"] = this.assignee_loginId_xSelected;
        if (this.assignee_group_xSelected.length)
            columnfilter["assignee_group"] = this.assignee_group_xSelected;
        if (this.priority_xSelected.length)
            columnfilter["priority"] = this.priority_xSelected;
        if (this.status_value_xSelected.length)
            columnfilter["status_value"] = this.status_value_xSelected;
        if (this.status_reason_xSelected.length)
            columnfilter["status_reason"] = this.status_reason_xSelected;
        if (this.supportGroup_name_xSelected.length)
            columnfilter["supportGroup_name"] = this.supportGroup_name_xSelected;
        if (this.submitDate_xSelected.length)
            columnfilter["submitDate"] = this.submitDate_xSelected;
        if (this.completedDate_xSelected.length)
            columnfilter["completedDate"] = this.completedDate_xSelected;
        if (this.slaStatus_xSelected.length)
            columnfilter["slaStatus"] = this.slaStatus_xSelected;
        if (this.modifiedDate_xSelected.length)
            columnfilter["modifiedDate"] = this.modifiedDate_xSelected;
        //if(this.start_submitDate != null) columnfilter["start_submitDate"] = this.start_submitDate;
        //if(this.end_submitDate != null) columnfilter["end_submitDate"] = this.end_submitDate;
        //if(this.group != null) columnfilter["assignee_group"] = [this.group];
        //if(this.status != null) columnfilter["status"] = this.status;
        return columnfilter;
    }
};
SscTicketOpenComponent.ctorParameters = () => [
    { type: _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"] },
    { type: _angular_router__WEBPACK_IMPORTED_MODULE_7__["Router"] },
    { type: _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatDialog"] },
    { type: _ssc_ticket_service__WEBPACK_IMPORTED_MODULE_8__["SscTicketService"] },
    { type: _snackbar_service__WEBPACK_IMPORTED_MODULE_9__["SnackbarService"] },
    { type: _ssc_permission_service__WEBPACK_IMPORTED_MODULE_10__["SscPermissionService"] },
    { type: _navigation_title_title_service__WEBPACK_IMPORTED_MODULE_11__["TitleService"] },
    { type: _angular_router__WEBPACK_IMPORTED_MODULE_7__["ActivatedRoute"] },
    { type: _xfilter_xfilter_component__WEBPACK_IMPORTED_MODULE_12__["xFilterService"] },
    { type: _common_service__WEBPACK_IMPORTED_MODULE_13__["CommonService"] }
];
tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ViewChild"])(_angular_material__WEBPACK_IMPORTED_MODULE_3__["MatPaginator"], { static: true })
], SscTicketOpenComponent.prototype, "paginator", void 0);
tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ViewChild"])(_angular_material__WEBPACK_IMPORTED_MODULE_3__["MatSort"], { static: true })
], SscTicketOpenComponent.prototype, "sort", void 0);
SscTicketOpenComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Component"])({
        selector: 'ssc-ticket-open',
        template: __webpack_require__(/*! raw-loader!./ssc-ticket-open.component.html */ "./node_modules/raw-loader/index.js!./src/app/ssc/ticket/ssc-ticket-open.component.html"),
        styles: [__webpack_require__(/*! ./ssc-ticket.scss */ "./src/app/ssc/ticket/ssc-ticket.scss")]
    })
], SscTicketOpenComponent);

/*export interface SscTicket {
  SSC_TICKET_ID: number;
  ASSET_ID: number;
  ASSET_NAME: string;
}*/
class MatTableApi {
    constructor(sort, order, page, pagesize, filter) {
        this.sort = sort;
        this.order = order;
        this.page = page;
        this.pagesize = pagesize;
        this.filter = filter;
    }
}
MatTableApi.ctorParameters = () => [
    { type: String },
    { type: String },
    { type: Number },
    { type: Number },
    { type: String }
];
/** An example database that the data source uses to retrieve data for the table. */
class ExampleHttpDao {
    constructor(http) {
        this.http = http;
    }
    getRepoIssues(sort, order, page, pagesize = 10, filter, columnfilter, mode = "", httpOption = {}) {
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
        return this.http.get('/api/ssc/tickets', httpOption);
    }
}
ExampleHttpDao.ctorParameters = () => [
    { type: _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"] }
];


/***/ }),

/***/ "./src/app/ssc/ticket/ssc-ticket.component.ts":
/*!****************************************************!*\
  !*** ./src/app/ssc/ticket/ssc-ticket.component.ts ***!
  \****************************************************/
/*! exports provided: SscTicketComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SscTicketComponent", function() { return SscTicketComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm2015/material.js");



let SscTicketComponent = class SscTicketComponent {
    constructor(snackBar) {
        this.snackBar = snackBar;
    }
};
SscTicketComponent.ctorParameters = () => [
    { type: _angular_material__WEBPACK_IMPORTED_MODULE_2__["MatSnackBar"] }
];
SscTicketComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
        selector: 'app-ssc-ticket',
        template: __webpack_require__(/*! raw-loader!./ssc-ticket.component.html */ "./node_modules/raw-loader/index.js!./src/app/ssc/ticket/ssc-ticket.component.html"),
        styles: [__webpack_require__(/*! ./ssc-ticket.scss */ "./src/app/ssc/ticket/ssc-ticket.scss")]
    })
], SscTicketComponent);



/***/ }),

/***/ "./src/app/ssc/ticket/ssc-ticket.scss":
/*!********************************************!*\
  !*** ./src/app/ssc/ticket/ssc-ticket.scss ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".container {\n  /*position: relative;*/\n  min-height: 200px;\n  margin: 2em;\n}\n\n.container-top-bar {\n  /*position: relative;*/\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-pack: start;\n          justify-content: flex-start;\n  -webkit-box-align: center;\n          align-items: center;\n}\n\n.container-top-bar button {\n  margin: 16px;\n}\n\n.container-top-bar button:first-of-type {\n  margin-left: 0px !important;\n}\n\n.container-top-bar button:first-of-type .mat-icon {\n  font-size: 22px;\n}\n\n.container-content {\n  position: relative;\n  min-height: 200px;\n}\n\n/* form */\n\nmat-card {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-pack: start;\n          justify-content: flex-start;\n  -webkit-box-align: start;\n          align-items: flex-start;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n          flex-direction: column;\n}\n\nmat-progress-bar {\n  width: 332px;\n  margin: -16px 0 16px 0 !important;\n}\n\nmat-form-field {\n  width: 250px;\n}\n\n::ng-deep .mat-card-header-text {\n  margin-left: 0 !important;\n  margin-right: 0 !important;\n}\n\nmat-card-actions {\n  margin-left: 0;\n  margin-right: 0;\n}\n\n/* list */\n\n.container-table {\n  /*position: relative;*/\n  max-height: 400px;\n  overflow: auto;\n}\n\ntable {\n  width: 100%;\n}\n\n.loading-shade {\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 56px;\n  right: 0;\n  background: rgba(0, 0, 0, 0.15);\n  z-index: 999;\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n  -webkit-box-pack: center;\n          justify-content: center;\n}\n\n.rate-limit-reached {\n  color: #980000;\n  max-width: 360px;\n  text-align: center;\n}\n\n/* Column Widths */\n\n.mat-column-number,\n.mat-column-state {\n  max-width: 64px;\n}\n\n.mat-column-created {\n  max-width: 124px;\n}\n\n.ticket-table {\n  border-top: 1px solid rgba(0, 0, 0, 0.12);\n}\n\n.ticket-table .mat-header-row {\n  height: 40px;\n}\n\n.ticket-table .mat-header-row:nth-child(2) .mat-header-cell {\n  top: 40px !important;\n}\n\n.ticket-table .mat-header-row:nth-child(3) .mat-header-cell {\n  top: 80px !important;\n}\n\n.ticket-table .mat-header-cell {\n  white-space: nowrap;\n  padding-right: 7px;\n  padding-left: 7px;\n  text-align: center;\n  border-right: 1px solid rgba(0, 0, 0, 0.12);\n}\n\n.ticket-table .mat-sort-header {\n  padding-top: 0.625em;\n}\n\n.ticket-table .mat-row {\n  height: 32px;\n}\n\n.ticket-table .mat-cell {\n  white-space: nowrap;\n  padding-right: 7px;\n  padding-left: 7px;\n}\n\n.ticket-table .cell-center {\n  text-align: center;\n}\n\n.ticket-table .cell-right {\n  text-align: right;\n}\n\n.ticket-table .cell-error {\n  color: red;\n}\n\n.ticket-table .cell-warning {\n  color: orange;\n}\n\n.ticket-table .mat-cell .mat-icon {\n  font-size: 18px;\n}\n\n.ticket-table .mat-header-cell .mat-form-field {\n  width: auto;\n}\n\n::ng-deep .mat-form-field-infix {\n  width: auto !important;\n}\n\n.priority_low {\n  color: #89c341;\n}\n\n.priority_medium {\n  color: #f1b521;\n}\n\n.priority_high {\n  color: #f98700;\n}\n\n.cell-right {\n  text-align: right;\n}\n\n.cell-center {\n  text-align: center;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvc3NjL3RpY2tldC9EOlxccGVwLWFwcF9uZXdcXHNzY1xcQ2xpZW50QXBwL3NyY1xcYXBwXFxzc2NcXHRpY2tldFxcc3NjLXRpY2tldC5zY3NzIiwic3JjL2FwcC9zc2MvdGlja2V0L3NzYy10aWNrZXQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLHNCQUFBO0VBQ0EsaUJBQUE7RUFDQSxXQUFBO0FDQ0Y7O0FERUE7RUFDRSxzQkFBQTtFQUNBLG9CQUFBO0VBQUEsYUFBQTtFQUNBLHVCQUFBO1VBQUEsMkJBQUE7RUFDQSx5QkFBQTtVQUFBLG1CQUFBO0FDQ0Y7O0FERUE7RUFDRSxZQUFBO0FDQ0Y7O0FERUE7RUFDRSwyQkFBQTtBQ0NGOztBREVBO0VBQ0UsZUFBQTtBQ0NGOztBREVBO0VBQ0Usa0JBQUE7RUFDQSxpQkFBQTtBQ0NGOztBREVBLFNBQUE7O0FBRUE7RUFDRSxvQkFBQTtFQUFBLGFBQUE7RUFDQSx1QkFBQTtVQUFBLDJCQUFBO0VBQ0Esd0JBQUE7VUFBQSx1QkFBQTtFQUNBLDRCQUFBO0VBQUEsNkJBQUE7VUFBQSxzQkFBQTtBQ0FGOztBREdBO0VBQ0UsWUFBQTtFQUNBLGlDQUFBO0FDQUY7O0FER0E7RUFDRyxZQUFBO0FDQUg7O0FER0E7RUFDRSx5QkFBQTtFQUNBLDBCQUFBO0FDQUY7O0FET0E7RUFDRSxjQUFBO0VBQ0EsZUFBQTtBQ0pGOztBRE9BLFNBQUE7O0FBRUE7RUFDRSxzQkFBQTtFQUNBLGlCQUFBO0VBQ0EsY0FBQTtBQ0xGOztBRFFBO0VBQ0UsV0FBQTtBQ0xGOztBRFFBO0VBQ0Usa0JBQUE7RUFDQSxNQUFBO0VBQ0EsT0FBQTtFQUNBLFlBQUE7RUFDQSxRQUFBO0VBQ0EsK0JBQUE7RUFDQSxZQUFBO0VBQ0Esb0JBQUE7RUFBQSxhQUFBO0VBQ0EseUJBQUE7VUFBQSxtQkFBQTtFQUNBLHdCQUFBO1VBQUEsdUJBQUE7QUNMRjs7QURRQTtFQUNFLGNBQUE7RUFDQSxnQkFBQTtFQUNBLGtCQUFBO0FDTEY7O0FEUUEsa0JBQUE7O0FBQ0E7O0VBRUUsZUFBQTtBQ0xGOztBRFFBO0VBQ0UsZ0JBQUE7QUNMRjs7QURRQTtFQUNFLHlDQUFBO0FDTEY7O0FEUUE7RUFDRSxZQUFBO0FDTEY7O0FET0E7RUFDRSxvQkFBQTtBQ0pGOztBRE1BO0VBQ0Usb0JBQUE7QUNIRjs7QURNQTtFQUNFLG1CQUFBO0VBQ0Esa0JBQUE7RUFDQSxpQkFBQTtFQUNBLGtCQUFBO0VBQ0EsMkNBQUE7QUNIRjs7QURNQTtFQUNFLG9CQUFBO0FDSEY7O0FETUE7RUFDRSxZQUFBO0FDSEY7O0FETUE7RUFDRSxtQkFBQTtFQUNBLGtCQUFBO0VBQ0EsaUJBQUE7QUNIRjs7QURNQTtFQUNFLGtCQUFBO0FDSEY7O0FES0E7RUFDRSxpQkFBQTtBQ0ZGOztBRElBO0VBQ0UsVUFBQTtBQ0RGOztBREdBO0VBQ0UsYUFBQTtBQ0FGOztBREVBO0VBQ0UsZUFBQTtBQ0NGOztBREVBO0VBQ0UsV0FBQTtBQ0NGOztBRENBO0VBQ0Usc0JBQUE7QUNFRjs7QURDQTtFQUNFLGNBQUE7QUNFRjs7QURBQTtFQUNFLGNBQUE7QUNHRjs7QUREQTtFQUNFLGNBQUE7QUNJRjs7QURBQTtFQUNFLGlCQUFBO0FDR0Y7O0FEREE7RUFDRSxrQkFBQTtBQ0lGIiwiZmlsZSI6InNyYy9hcHAvc3NjL3RpY2tldC9zc2MtdGlja2V0LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIuY29udGFpbmVyIHtcbiAgLypwb3NpdGlvbjogcmVsYXRpdmU7Ki9cbiAgbWluLWhlaWdodDogMjAwcHg7XG4gIG1hcmdpbjogMmVtO1xufVxuXG4uY29udGFpbmVyLXRvcC1iYXIge1xuICAvKnBvc2l0aW9uOiByZWxhdGl2ZTsqL1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtc3RhcnQ7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG59XG5cbi5jb250YWluZXItdG9wLWJhciBidXR0b24ge1xuICBtYXJnaW46IDE2cHg7XG59XG5cbi5jb250YWluZXItdG9wLWJhciBidXR0b246Zmlyc3Qtb2YtdHlwZSB7XG4gIG1hcmdpbi1sZWZ0OiAwcHggIWltcG9ydGFudDtcbn1cblxuLmNvbnRhaW5lci10b3AtYmFyIGJ1dHRvbjpmaXJzdC1vZi10eXBlIC5tYXQtaWNvbiB7XG4gIGZvbnQtc2l6ZTogMjJweDtcbn1cblxuLmNvbnRhaW5lci1jb250ZW50IHtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBtaW4taGVpZ2h0OiAyMDBweDtcbn1cblxuLyogZm9ybSAqL1xuXG5tYXQtY2FyZCB7IFxuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtc3RhcnQ7XG4gIGFsaWduLWl0ZW1zOiBmbGV4LXN0YXJ0O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xufVxuXG5tYXQtcHJvZ3Jlc3MtYmFyIHtcbiAgd2lkdGg6IDMzMnB4O1xuICBtYXJnaW46IC0xNnB4IDAgMTZweCAwICFpbXBvcnRhbnQ7XG59XG5cbm1hdC1mb3JtLWZpZWxkIHtcbiAgIHdpZHRoOiAyNTBweDtcbn1cblxuOjpuZy1kZWVwIC5tYXQtY2FyZC1oZWFkZXItdGV4dCB7XG4gIG1hcmdpbi1sZWZ0OiAwICFpbXBvcnRhbnQ7XG4gIG1hcmdpbi1yaWdodDogMCAhaW1wb3J0YW50O1xufVxuXG5tYXQtY2FyZC1jb250ZW50IHtcbiAgXG59XG5cbm1hdC1jYXJkLWFjdGlvbnMge1xuICBtYXJnaW4tbGVmdDogMDtcbiAgbWFyZ2luLXJpZ2h0OiAwO1xufVxuXG4vKiBsaXN0ICovXG5cbi5jb250YWluZXItdGFibGUge1xuICAvKnBvc2l0aW9uOiByZWxhdGl2ZTsqL1xuICBtYXgtaGVpZ2h0OiA0MDBweDtcbiAgb3ZlcmZsb3c6IGF1dG87XG59XG5cbnRhYmxlIHtcbiAgd2lkdGg6IDEwMCU7XG59XG5cbi5sb2FkaW5nLXNoYWRlIHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB0b3A6IDA7XG4gIGxlZnQ6IDA7XG4gIGJvdHRvbTogNTZweDtcbiAgcmlnaHQ6IDA7XG4gIGJhY2tncm91bmQ6IHJnYmEoMCwgMCwgMCwgMC4xNSk7XG4gIHotaW5kZXg6IDk5OTtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG59XG5cbi5yYXRlLWxpbWl0LXJlYWNoZWQge1xuICBjb2xvcjogIzk4MDAwMDtcbiAgbWF4LXdpZHRoOiAzNjBweDtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xufVxuXG4vKiBDb2x1bW4gV2lkdGhzICovXG4ubWF0LWNvbHVtbi1udW1iZXIsXG4ubWF0LWNvbHVtbi1zdGF0ZSB7XG4gIG1heC13aWR0aDogNjRweDtcbn1cblxuLm1hdC1jb2x1bW4tY3JlYXRlZCB7XG4gIG1heC13aWR0aDogMTI0cHg7XG59XG5cbi50aWNrZXQtdGFibGUge1xuICBib3JkZXItdG9wOiAxcHggc29saWQgcmdiYSgwLDAsMCwuMTIpO1xufVxuXG4udGlja2V0LXRhYmxlIC5tYXQtaGVhZGVyLXJvdyB7XG4gIGhlaWdodDogNDBweDtcbn1cbi50aWNrZXQtdGFibGUgLm1hdC1oZWFkZXItcm93Om50aC1jaGlsZCgyKSAubWF0LWhlYWRlci1jZWxsIHtcbiAgdG9wOiA0MHB4ICFpbXBvcnRhbnQ7XG59XG4udGlja2V0LXRhYmxlIC5tYXQtaGVhZGVyLXJvdzpudGgtY2hpbGQoMykgLm1hdC1oZWFkZXItY2VsbCB7XG4gIHRvcDogODBweCAhaW1wb3J0YW50O1xufVxuXG4udGlja2V0LXRhYmxlIC5tYXQtaGVhZGVyLWNlbGwge1xuICB3aGl0ZS1zcGFjZTogbm93cmFwO1xuICBwYWRkaW5nLXJpZ2h0OiA3cHg7XG4gIHBhZGRpbmctbGVmdDogN3B4O1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIGJvcmRlci1yaWdodDogMXB4IHNvbGlkIHJnYmEoMCwwLDAsLjEyKTtcbn1cblxuLnRpY2tldC10YWJsZSAubWF0LXNvcnQtaGVhZGVyIHtcbiAgcGFkZGluZy10b3A6IDAuNjI1ZW07XG59XG5cbi50aWNrZXQtdGFibGUgLm1hdC1yb3cge1xuICBoZWlnaHQ6IDMycHg7XG59XG5cbi50aWNrZXQtdGFibGUgLm1hdC1jZWxsIHtcbiAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbiAgcGFkZGluZy1yaWdodDogN3B4O1xuICBwYWRkaW5nLWxlZnQ6IDdweDtcbn1cblxuLnRpY2tldC10YWJsZSAuY2VsbC1jZW50ZXIge1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG59XG4udGlja2V0LXRhYmxlIC5jZWxsLXJpZ2h0IHtcbiAgdGV4dC1hbGlnbjogcmlnaHQ7XG59XG4udGlja2V0LXRhYmxlIC5jZWxsLWVycm9yIHtcbiAgY29sb3I6IHJlZDtcbn1cbi50aWNrZXQtdGFibGUgLmNlbGwtd2FybmluZyB7XG4gIGNvbG9yOiBvcmFuZ2U7XG59XG4udGlja2V0LXRhYmxlIC5tYXQtY2VsbCAubWF0LWljb24ge1xuICBmb250LXNpemU6IDE4cHg7XG59XG5cbi50aWNrZXQtdGFibGUgLm1hdC1oZWFkZXItY2VsbCAubWF0LWZvcm0tZmllbGQge1xuICB3aWR0aDogYXV0bztcbn1cbjo6bmctZGVlcCAubWF0LWZvcm0tZmllbGQtaW5maXgge1xuICB3aWR0aDogYXV0byAhaW1wb3J0YW50O1xufVxuXG4ucHJpb3JpdHlfbG93IHtcbiAgY29sb3I6ICM4OWMzNDE7XG59XG4ucHJpb3JpdHlfbWVkaXVtIHtcbiAgY29sb3I6ICNmMWI1MjE7XG59XG4ucHJpb3JpdHlfaGlnaCB7XG4gIGNvbG9yOiAjZjk4NzAwO1xufVxuXG5cbi5jZWxsLXJpZ2h0IHtcbiAgdGV4dC1hbGlnbjogcmlnaHQ7XG59XG4uY2VsbC1jZW50ZXIge1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG59IiwiLmNvbnRhaW5lciB7XG4gIC8qcG9zaXRpb246IHJlbGF0aXZlOyovXG4gIG1pbi1oZWlnaHQ6IDIwMHB4O1xuICBtYXJnaW46IDJlbTtcbn1cblxuLmNvbnRhaW5lci10b3AtYmFyIHtcbiAgLypwb3NpdGlvbjogcmVsYXRpdmU7Ki9cbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBmbGV4LXN0YXJ0O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xufVxuXG4uY29udGFpbmVyLXRvcC1iYXIgYnV0dG9uIHtcbiAgbWFyZ2luOiAxNnB4O1xufVxuXG4uY29udGFpbmVyLXRvcC1iYXIgYnV0dG9uOmZpcnN0LW9mLXR5cGUge1xuICBtYXJnaW4tbGVmdDogMHB4ICFpbXBvcnRhbnQ7XG59XG5cbi5jb250YWluZXItdG9wLWJhciBidXR0b246Zmlyc3Qtb2YtdHlwZSAubWF0LWljb24ge1xuICBmb250LXNpemU6IDIycHg7XG59XG5cbi5jb250YWluZXItY29udGVudCB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgbWluLWhlaWdodDogMjAwcHg7XG59XG5cbi8qIGZvcm0gKi9cbm1hdC1jYXJkIHtcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBmbGV4LXN0YXJ0O1xuICBhbGlnbi1pdGVtczogZmxleC1zdGFydDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbn1cblxubWF0LXByb2dyZXNzLWJhciB7XG4gIHdpZHRoOiAzMzJweDtcbiAgbWFyZ2luOiAtMTZweCAwIDE2cHggMCAhaW1wb3J0YW50O1xufVxuXG5tYXQtZm9ybS1maWVsZCB7XG4gIHdpZHRoOiAyNTBweDtcbn1cblxuOjpuZy1kZWVwIC5tYXQtY2FyZC1oZWFkZXItdGV4dCB7XG4gIG1hcmdpbi1sZWZ0OiAwICFpbXBvcnRhbnQ7XG4gIG1hcmdpbi1yaWdodDogMCAhaW1wb3J0YW50O1xufVxuXG5tYXQtY2FyZC1hY3Rpb25zIHtcbiAgbWFyZ2luLWxlZnQ6IDA7XG4gIG1hcmdpbi1yaWdodDogMDtcbn1cblxuLyogbGlzdCAqL1xuLmNvbnRhaW5lci10YWJsZSB7XG4gIC8qcG9zaXRpb246IHJlbGF0aXZlOyovXG4gIG1heC1oZWlnaHQ6IDQwMHB4O1xuICBvdmVyZmxvdzogYXV0bztcbn1cblxudGFibGUge1xuICB3aWR0aDogMTAwJTtcbn1cblxuLmxvYWRpbmctc2hhZGUge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogMDtcbiAgbGVmdDogMDtcbiAgYm90dG9tOiA1NnB4O1xuICByaWdodDogMDtcbiAgYmFja2dyb3VuZDogcmdiYSgwLCAwLCAwLCAwLjE1KTtcbiAgei1pbmRleDogOTk5O1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbn1cblxuLnJhdGUtbGltaXQtcmVhY2hlZCB7XG4gIGNvbG9yOiAjOTgwMDAwO1xuICBtYXgtd2lkdGg6IDM2MHB4O1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG59XG5cbi8qIENvbHVtbiBXaWR0aHMgKi9cbi5tYXQtY29sdW1uLW51bWJlcixcbi5tYXQtY29sdW1uLXN0YXRlIHtcbiAgbWF4LXdpZHRoOiA2NHB4O1xufVxuXG4ubWF0LWNvbHVtbi1jcmVhdGVkIHtcbiAgbWF4LXdpZHRoOiAxMjRweDtcbn1cblxuLnRpY2tldC10YWJsZSB7XG4gIGJvcmRlci10b3A6IDFweCBzb2xpZCByZ2JhKDAsIDAsIDAsIDAuMTIpO1xufVxuXG4udGlja2V0LXRhYmxlIC5tYXQtaGVhZGVyLXJvdyB7XG4gIGhlaWdodDogNDBweDtcbn1cblxuLnRpY2tldC10YWJsZSAubWF0LWhlYWRlci1yb3c6bnRoLWNoaWxkKDIpIC5tYXQtaGVhZGVyLWNlbGwge1xuICB0b3A6IDQwcHggIWltcG9ydGFudDtcbn1cblxuLnRpY2tldC10YWJsZSAubWF0LWhlYWRlci1yb3c6bnRoLWNoaWxkKDMpIC5tYXQtaGVhZGVyLWNlbGwge1xuICB0b3A6IDgwcHggIWltcG9ydGFudDtcbn1cblxuLnRpY2tldC10YWJsZSAubWF0LWhlYWRlci1jZWxsIHtcbiAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbiAgcGFkZGluZy1yaWdodDogN3B4O1xuICBwYWRkaW5nLWxlZnQ6IDdweDtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICBib3JkZXItcmlnaHQ6IDFweCBzb2xpZCByZ2JhKDAsIDAsIDAsIDAuMTIpO1xufVxuXG4udGlja2V0LXRhYmxlIC5tYXQtc29ydC1oZWFkZXIge1xuICBwYWRkaW5nLXRvcDogMC42MjVlbTtcbn1cblxuLnRpY2tldC10YWJsZSAubWF0LXJvdyB7XG4gIGhlaWdodDogMzJweDtcbn1cblxuLnRpY2tldC10YWJsZSAubWF0LWNlbGwge1xuICB3aGl0ZS1zcGFjZTogbm93cmFwO1xuICBwYWRkaW5nLXJpZ2h0OiA3cHg7XG4gIHBhZGRpbmctbGVmdDogN3B4O1xufVxuXG4udGlja2V0LXRhYmxlIC5jZWxsLWNlbnRlciB7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbn1cblxuLnRpY2tldC10YWJsZSAuY2VsbC1yaWdodCB7XG4gIHRleHQtYWxpZ246IHJpZ2h0O1xufVxuXG4udGlja2V0LXRhYmxlIC5jZWxsLWVycm9yIHtcbiAgY29sb3I6IHJlZDtcbn1cblxuLnRpY2tldC10YWJsZSAuY2VsbC13YXJuaW5nIHtcbiAgY29sb3I6IG9yYW5nZTtcbn1cblxuLnRpY2tldC10YWJsZSAubWF0LWNlbGwgLm1hdC1pY29uIHtcbiAgZm9udC1zaXplOiAxOHB4O1xufVxuXG4udGlja2V0LXRhYmxlIC5tYXQtaGVhZGVyLWNlbGwgLm1hdC1mb3JtLWZpZWxkIHtcbiAgd2lkdGg6IGF1dG87XG59XG5cbjo6bmctZGVlcCAubWF0LWZvcm0tZmllbGQtaW5maXgge1xuICB3aWR0aDogYXV0byAhaW1wb3J0YW50O1xufVxuXG4ucHJpb3JpdHlfbG93IHtcbiAgY29sb3I6ICM4OWMzNDE7XG59XG5cbi5wcmlvcml0eV9tZWRpdW0ge1xuICBjb2xvcjogI2YxYjUyMTtcbn1cblxuLnByaW9yaXR5X2hpZ2gge1xuICBjb2xvcjogI2Y5ODcwMDtcbn1cblxuLmNlbGwtcmlnaHQge1xuICB0ZXh0LWFsaWduOiByaWdodDtcbn1cblxuLmNlbGwtY2VudGVyIHtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xufSJdfQ== */"

/***/ }),

/***/ "./src/app/ssc/ticket/ssc-ticket.service.ts":
/*!**************************************************!*\
  !*** ./src/app/ssc/ticket/ssc-ticket.service.ts ***!
  \**************************************************/
/*! exports provided: SscTicketService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SscTicketService", function() { return SscTicketService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm2015/http.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm2015/operators/index.js");
/* harmony import */ var _ssc_ticket__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ssc-ticket */ "./src/app/ssc/ticket/ssc-ticket.ts");





let SscTicketService = class SscTicketService {
    constructor(http) {
        this.http = http;
    }
    add(_ssc_ticket) {
        return this.http.post('Ssc/Ticket/Add', _ssc_ticket)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(res => {
            return res;
        }));
    }
    deleteSscTicket(_ssc_ticket) {
        return this.http.post('Ssc/Ticket/Delete', _ssc_ticket)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(res => {
            return res;
        }));
    }
    editSscTicket(_ssc_ticket) {
        return this.http.post('Ssc/Ticket/Edit', _ssc_ticket)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(res => {
            return res;
        }));
    }
    getOne(_ssc_ticket) {
        return this.http.post('Ssc/Ticket/Get', _ssc_ticket)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(res => {
            return new _ssc_ticket__WEBPACK_IMPORTED_MODULE_4__["SscTicket"](res.SSC_TICKET_ID, res.MACHINE_ID, res.PRESENCE_LOCATION_ID, res.DEVICE_ROLE);
        }));
    }
};
SscTicketService.ctorParameters = () => [
    { type: _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"] }
];
SscTicketService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
        providedIn: 'root'
    })
], SscTicketService);



/***/ }),

/***/ "./src/app/ssc/ticket/ssc-ticket.ts":
/*!******************************************!*\
  !*** ./src/app/ssc/ticket/ssc-ticket.ts ***!
  \******************************************/
/*! exports provided: SscTicket */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SscTicket", function() { return SscTicket; });
class SscTicket {
    constructor(ssc_ticket_id = 0, machine_id, presence_location_id, device_role, asset_name = "", location_name = "") {
        this.ssc_ticket_id = ssc_ticket_id;
        this.machine_id = machine_id;
        this.presence_location_id = presence_location_id;
        this.device_role = device_role;
        this.asset_name = asset_name;
        this.location_name = location_name;
    }
}
SscTicket.ctorParameters = () => [
    { type: Number },
    { type: Number },
    { type: Number },
    { type: String },
    { type: String },
    { type: String }
];


/***/ })

}]);
//# sourceMappingURL=ssc-ssc-module-es2015.js.map