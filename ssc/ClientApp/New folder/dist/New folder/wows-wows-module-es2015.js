(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["wows-wows-module"],{

/***/ "./node_modules/raw-loader/index.js!./src/app/wows/dashboard/wows-dashboard.component.html":
/*!****************************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/wows/dashboard/wows-dashboard.component.html ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container-top-bar\" [ngClass.gt-sm]=\"'top-flow'\" [ngClass.lt-md]=\"'top-flow-xs'\">\n  <mat-card style=\"padding: 5px 10px; box-shadow : none\">\r\n    <mat-form-field class=\"filter\" floatLabel=\"never\">\r\n      <mat-label>Date</mat-label>\r\n      <input matInput class=\"input-hidden\" [matDatepicker]=\"datePicker\" [formControl]=\"dateControl\" (dateChange)=\"dateChange($event)\" disabled>\r\n      <input matInput [(ngModel)]=\"dateInput\" disabled>\r\n      <mat-datepicker-toggle matSuffix [for]=\"datePicker\"></mat-datepicker-toggle>\r\n      <mat-datepicker #datePicker disabled=\"false\"></mat-datepicker>\r\n    </mat-form-field>\r\n    <button mat-button (click)=\"commonService.toggleFullwindow()\" class=\"button-fw\" [matTooltip]=\"commonService.fullWindow? 'Exit Fullscreen' : 'Fullscreen'\"><mat-icon>{{commonService.fullWindow? \"fullscreen_exit\" : \"fullscreen\"}}</mat-icon></button>\r\n  </mat-card>\n</div>\n\n<div class=\"container-content\" [ngClass.gt-sm]=\"'top-flow'\" [ngClass.lt-md]=\"'top-flow-xs'\" fxLayout=\"column\" fxLayoutGap=\"5px\">\n  <div class=\"loading-shade\" *ngIf=\"isLoadingProduction\">\r\n    <mat-progress-bar mode=\"indeterminate\"></mat-progress-bar>\r\n  </div>\n\t<div fxLayout=\"row\" fxLayout.lt-md=\"column\" fxLayoutWrap fxLayoutGap=\"5px\" fxLayoutAlign=\"center\">\n\t\t\n    <mat-card fxFlex=\"25%\">\r\n      <mat-card-title class=\"title_dasboard\">Operation</mat-card-title>\r\n      <mat-card-content>\r\n        <div class=\"value\" style=\"color:#5290c9\">{{(valueOperation | number : '1.0-2') || '-'}} </div>\r\n        <div class=\"uom\">BOPD</div>\r\n      </mat-card-content>\r\n    </mat-card>\n\n\t\t<mat-card fxFlex=\"25%\">\n\t\t\t<mat-card-title class=\"title_dasboard\">SOT</mat-card-title>\n\t\t\t<mat-card-content>\n\t\t\t\t<div class=\"value\" *ngIf=\"!isLoadingSOT\" style=\"color:#eb7e35\">{{(valueSOT | number : '1.0-2') || '-'}}</div>\n\t\t\t\t<div class=\"uom\" *ngIf=\"!isLoadingSOT\">BOPD</div>\n\t\t\t</mat-card-content>\n\t\t</mat-card>\n\n    <mat-card fxFlex=\"25%\">\r\n      <div>\r\n        <mat-card-title class=\"title_dasboard\">Figure</mat-card-title>\r\n      </div>\r\n        <mat-card-content>\r\n          <div class=\"value\" style=\"color:#93c373\">{{(valueFigure | number : '1.0-2') || '-'}}</div>\r\n          <div class=\"uom\">BOPD</div>\r\n        </mat-card-content>\r\n    </mat-card>\n\n\t\t<mat-card fxFlex=\"25%\">\n\t\t\t<mat-card-title class=\"title_dasboard\">Gas Production</mat-card-title>\n\t\t\t<mat-card-content>\n\t\t\t\t<div class=\"value\" style=\"color:#f4b183\">{{(valueGas | number : '1.0-2') || '-'}}</div>\n\t\t\t\t<div class=\"uom\">MMSCFD</div>\n\t\t\t</mat-card-content>\n\t\t</mat-card>\n\n\t</div>\n\n\t<div fxLayout=\"row\" fxLayout.lt-md=\"column\" fxLayoutWrap fxLayoutGap=\"5px\" fxLayoutAlign=\"center\">\n\t\t<mat-card fxFlex=\"50%\">\n\t\t\t<div #oil_chart_el class=\"oil_chart\"></div>\n\t\t</mat-card>\n\t\t<mat-card fxFlex=\"50%\">\n\t\t\t<div #gas_chart_el class=\"gas_chart\"></div>\n\t\t</mat-card>\n\t</div>\n\n  <div fxLayout=\"row\" fxLayout.lt-lg=\"column\" fxLayoutWrap fxLayoutGap=\"5px\" fxLayoutAlign=\"center\">\r\n    <div fxFlex=\"35%\" fxLayout=\"column\" fxLayoutGap=\"5px\">\r\n      <mat-card fxFlex=\"100%\">\r\n        <!--<mat-card-title>Active Wells</mat-card-title>-->\r\n        <mat-card-content>\r\n          <div fxFlex=\"20%\">\r\n            <h4>Active Well</h4>\r\n            <p class=\"value\" align=\"center\">{{active_wells_count}}</p>\r\n          </div>\r\n          <div fxFlex=\"80%\">\r\n            <div #active_well_chart_el class=\"active_well_chart\"></div>\r\n          </div>\r\n        </mat-card-content>\r\n      </mat-card>\r\n    </div>\r\n    <div fxFlex=\"35%\" fxLayout=\"column\" fxLayoutGap=\"5px\">\r\n      <mat-card fxFlex=\"100%\">\r\n        <div #wellrank_chart_el class=\"wellrank_chart\"></div>\r\n      </mat-card>\r\n    </div>\r\n    <div fxFlex=\"30%\" fxLayout=\"column\" fxLayoutGap=\"5px\">\r\n      <mat-card fxFlex=\"100%\">\r\n        <div #wellstat_chart_el class=\"wellstat_chart\"></div>\r\n      </mat-card>\r\n    </div>\r\n    <!--\r\n        <div fxFlex=\"100%\" fxLayout=\"row\" fxLayout.xs=\"column\" fxLayoutGap=\"5px\">\r\n          <mat-card fxFlex=\"58%\">\r\n            <div #structprod_chart_el class=\"structprod_chart\"></div>\r\n          </mat-card>\r\n\r\n          <mat-card fxFlex=\"42%\">\r\n            <div #wellprod_chart_el class=\"wellprod_chart\"></div>\r\n          </mat-card>\r\n        </div>\r\n\r\n      </div>\r\n  -->\r\n  </div>\n"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/wows/wows.component.html":
/*!********************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/wows/wows.component.html ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<router-outlet></router-outlet>\n<router-outlet name=\"overlay2\"></router-outlet>"

/***/ }),

/***/ "./src/app/wows/dashboard/wows-dashboard.component.scss":
/*!**************************************************************!*\
  !*** ./src/app/wows/dashboard/wows-dashboard.component.scss ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".oil_chart {\n  height: 330px;\n}\n\n.gas_chart {\n  height: 330px;\n}\n\n.wellstat_chart {\n  height: 290px;\n}\n\n.structprod_chart {\n  height: 250px;\n}\n\n.wellprod_chart {\n  height: 250px;\n}\n\n.wellrank_chart {\n  height: 290px;\n}\n\n.active_well_chart {\n  height: 290px;\n  text-align: center;\n}\n\n.mat-card-title {\n  font-size: 14px;\n}\n\n.value {\n  font-size: 28px;\n  font-weight: bold;\n  text-align: center;\n}\n\n.uom {\n  text-align: center;\n}\n\n/* ds table */\n\n.ds-table .mat-header-row {\n  height: 40px;\n}\n\n.ds-table .mat-header-cell {\n  white-space: nowrap;\n  padding-right: 7px;\n  padding-left: 7px;\n  text-align: center;\n  min-width: 100px;\n}\n\n.ds-table .mat-row {\n  height: 32px;\n}\n\n.ds-table .mat-cell {\n  white-space: nowrap;\n  padding-right: 7px;\n  padding-left: 7px;\n}\n\n.ds-table .cell-center {\n  text-align: center;\n}\n\n.ds-table .cell-right {\n  text-align: right;\n}\n\n.ds-table .cell-error {\n  color: red;\n}\n\n::ng-deep .mat-form-field-wrapper {\n  padding-bottom: 5px !important;\n}\n\n::ng-deep .mat-form-field-wrapper .mat-form-field-underline {\n  bottom: 5px !important;\n}\n\n::ng-deep .mat-form-field-wrapper .mat-form-field-infix {\n  padding: 5px !important;\n}\n\n.title_dasboard {\n  padding: 5px !important;\n  text-align: center;\n  width: 100px;\n  color: #564646;\n  border-radius: 8px;\n  background-color: #ffc6c2;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvd293cy9kYXNoYm9hcmQvRDpcXHBlcC1hcHBfbmV3XFxzc2NcXENsaWVudEFwcC9zcmNcXGFwcFxcd293c1xcZGFzaGJvYXJkXFx3b3dzLWRhc2hib2FyZC5jb21wb25lbnQuc2NzcyIsInNyYy9hcHAvd293cy9kYXNoYm9hcmQvd293cy1kYXNoYm9hcmQuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDQyxhQUFBO0FDQ0Q7O0FERUE7RUFDQyxhQUFBO0FDQ0Q7O0FERUE7RUFDRSxhQUFBO0FDQ0Y7O0FERUE7RUFDRSxhQUFBO0FDQ0Y7O0FERUE7RUFDRSxhQUFBO0FDQ0Y7O0FERUE7RUFDRSxhQUFBO0FDQ0Y7O0FERUE7RUFDRSxhQUFBO0VBQ0Esa0JBQUE7QUNDRjs7QURHQTtFQUNFLGVBQUE7QUNBRjs7QURHQTtFQUNFLGVBQUE7RUFDQSxpQkFBQTtFQUVBLGtCQUFBO0FDREY7O0FER0E7RUFDRSxrQkFBQTtBQ0FGOztBREdBLGFBQUE7O0FBQ0E7RUFDRSxZQUFBO0FDQUY7O0FERUE7RUFDRSxtQkFBQTtFQUNBLGtCQUFBO0VBQ0EsaUJBQUE7RUFDQSxrQkFBQTtFQUNBLGdCQUFBO0FDQ0Y7O0FERUE7RUFDRSxZQUFBO0FDQ0Y7O0FERUE7RUFDRSxtQkFBQTtFQUNBLGtCQUFBO0VBQ0EsaUJBQUE7QUNDRjs7QURFQTtFQUNFLGtCQUFBO0FDQ0Y7O0FEQ0E7RUFDRSxpQkFBQTtBQ0VGOztBREFBO0VBQ0UsVUFBQTtBQ0dGOztBREFBO0VBQ0UsOEJBQUE7QUNHRjs7QURBQTtFQUNFLHNCQUFBO0FDR0Y7O0FEQUE7RUFDRSx1QkFBQTtBQ0dGOztBREFBO0VBQ0UsdUJBQUE7RUFDQSxrQkFBQTtFQUNBLFlBQUE7RUFDQSxjQUFBO0VBQ0Esa0JBQUE7RUFDQSx5QkFBQTtBQ0dGIiwiZmlsZSI6InNyYy9hcHAvd293cy9kYXNoYm9hcmQvd293cy1kYXNoYm9hcmQuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIub2lsX2NoYXJ0IHtcblx0aGVpZ2h0OiAzMzBweDtcbn1cblxuLmdhc19jaGFydCB7XG5cdGhlaWdodDogMzMwcHg7XG59XG5cbi53ZWxsc3RhdF9jaGFydCB7XG4gIGhlaWdodDogMjkwcHg7XG59XG5cbi5zdHJ1Y3Rwcm9kX2NoYXJ0IHtcbiAgaGVpZ2h0OiAyNTBweDtcbn1cblxuLndlbGxwcm9kX2NoYXJ0IHtcbiAgaGVpZ2h0OiAyNTBweDtcbn1cblxuLndlbGxyYW5rX2NoYXJ0IHtcbiAgaGVpZ2h0OiAyOTBweDtcbn1cblxuLmFjdGl2ZV93ZWxsX2NoYXJ0IHtcbiAgaGVpZ2h0OiAyOTBweDtcbiAgdGV4dC1hbGlnbiA6Y2VudGVyO1xufVxuXG5cbi5tYXQtY2FyZC10aXRsZSB7XG4gIGZvbnQtc2l6ZTogMTRweDtcbn1cblxuLnZhbHVlIHtcbiAgZm9udC1zaXplOiAyOHB4O1xuICBmb250LXdlaWdodDogYm9sZDtcbiAgLy9kaXNwbGF5IDogaW5saW5lLWZsZXg7XG4gIHRleHQtYWxpZ24gOiBjZW50ZXI7XG4gIH1cbi51b20ge1xyXG4gIHRleHQtYWxpZ24gOiBjZW50ZXI7XHJcbn1cblxuLyogZHMgdGFibGUgKi9cbi5kcy10YWJsZSAubWF0LWhlYWRlci1yb3cge1xuICBoZWlnaHQ6IDQwcHg7XG59XG4uZHMtdGFibGUgLm1hdC1oZWFkZXItY2VsbCB7XG4gIHdoaXRlLXNwYWNlOiBub3dyYXA7XG4gIHBhZGRpbmctcmlnaHQ6IDdweDtcbiAgcGFkZGluZy1sZWZ0OiA3cHg7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgbWluLXdpZHRoOiAxMDBweDtcbn1cblxuLmRzLXRhYmxlIC5tYXQtcm93IHtcbiAgaGVpZ2h0OiAzMnB4O1xufVxuXG4uZHMtdGFibGUgLm1hdC1jZWxsIHtcbiAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbiAgcGFkZGluZy1yaWdodDogN3B4O1xuICBwYWRkaW5nLWxlZnQ6IDdweDtcbn1cblxuLmRzLXRhYmxlIC5jZWxsLWNlbnRlciB7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbn1cbi5kcy10YWJsZSAuY2VsbC1yaWdodCB7XG4gIHRleHQtYWxpZ246IHJpZ2h0O1xufVxuLmRzLXRhYmxlIC5jZWxsLWVycm9yIHtcbiAgY29sb3I6IHJlZDtcbn1cblxuOjpuZy1kZWVwIC5tYXQtZm9ybS1maWVsZC13cmFwcGVyIHtcbiAgcGFkZGluZy1ib3R0b206IDVweCAhaW1wb3J0YW50O1xufVxuXG46Om5nLWRlZXAgLm1hdC1mb3JtLWZpZWxkLXdyYXBwZXIgLm1hdC1mb3JtLWZpZWxkLXVuZGVybGluZSB7XG4gIGJvdHRvbTogNXB4ICFpbXBvcnRhbnQ7XG59XG5cbjo6bmctZGVlcCAubWF0LWZvcm0tZmllbGQtd3JhcHBlciAubWF0LWZvcm0tZmllbGQtaW5maXgge1xuICBwYWRkaW5nOiA1cHggIWltcG9ydGFudDtcbn1cblxuLnRpdGxlX2Rhc2JvYXJkIHtcbiAgcGFkZGluZzogNXB4ICFpbXBvcnRhbnQ7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgd2lkdGg6IDEwMHB4O1xuICBjb2xvcjogIzU2NDY0NjtcbiAgYm9yZGVyLXJhZGl1czogOHB4O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZjNmMyO1xufVxuXG4iLCIub2lsX2NoYXJ0IHtcbiAgaGVpZ2h0OiAzMzBweDtcbn1cblxuLmdhc19jaGFydCB7XG4gIGhlaWdodDogMzMwcHg7XG59XG5cbi53ZWxsc3RhdF9jaGFydCB7XG4gIGhlaWdodDogMjkwcHg7XG59XG5cbi5zdHJ1Y3Rwcm9kX2NoYXJ0IHtcbiAgaGVpZ2h0OiAyNTBweDtcbn1cblxuLndlbGxwcm9kX2NoYXJ0IHtcbiAgaGVpZ2h0OiAyNTBweDtcbn1cblxuLndlbGxyYW5rX2NoYXJ0IHtcbiAgaGVpZ2h0OiAyOTBweDtcbn1cblxuLmFjdGl2ZV93ZWxsX2NoYXJ0IHtcbiAgaGVpZ2h0OiAyOTBweDtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xufVxuXG4ubWF0LWNhcmQtdGl0bGUge1xuICBmb250LXNpemU6IDE0cHg7XG59XG5cbi52YWx1ZSB7XG4gIGZvbnQtc2l6ZTogMjhweDtcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbn1cblxuLnVvbSB7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbn1cblxuLyogZHMgdGFibGUgKi9cbi5kcy10YWJsZSAubWF0LWhlYWRlci1yb3cge1xuICBoZWlnaHQ6IDQwcHg7XG59XG5cbi5kcy10YWJsZSAubWF0LWhlYWRlci1jZWxsIHtcbiAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbiAgcGFkZGluZy1yaWdodDogN3B4O1xuICBwYWRkaW5nLWxlZnQ6IDdweDtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICBtaW4td2lkdGg6IDEwMHB4O1xufVxuXG4uZHMtdGFibGUgLm1hdC1yb3cge1xuICBoZWlnaHQ6IDMycHg7XG59XG5cbi5kcy10YWJsZSAubWF0LWNlbGwge1xuICB3aGl0ZS1zcGFjZTogbm93cmFwO1xuICBwYWRkaW5nLXJpZ2h0OiA3cHg7XG4gIHBhZGRpbmctbGVmdDogN3B4O1xufVxuXG4uZHMtdGFibGUgLmNlbGwtY2VudGVyIHtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xufVxuXG4uZHMtdGFibGUgLmNlbGwtcmlnaHQge1xuICB0ZXh0LWFsaWduOiByaWdodDtcbn1cblxuLmRzLXRhYmxlIC5jZWxsLWVycm9yIHtcbiAgY29sb3I6IHJlZDtcbn1cblxuOjpuZy1kZWVwIC5tYXQtZm9ybS1maWVsZC13cmFwcGVyIHtcbiAgcGFkZGluZy1ib3R0b206IDVweCAhaW1wb3J0YW50O1xufVxuXG46Om5nLWRlZXAgLm1hdC1mb3JtLWZpZWxkLXdyYXBwZXIgLm1hdC1mb3JtLWZpZWxkLXVuZGVybGluZSB7XG4gIGJvdHRvbTogNXB4ICFpbXBvcnRhbnQ7XG59XG5cbjo6bmctZGVlcCAubWF0LWZvcm0tZmllbGQtd3JhcHBlciAubWF0LWZvcm0tZmllbGQtaW5maXgge1xuICBwYWRkaW5nOiA1cHggIWltcG9ydGFudDtcbn1cblxuLnRpdGxlX2Rhc2JvYXJkIHtcbiAgcGFkZGluZzogNXB4ICFpbXBvcnRhbnQ7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgd2lkdGg6IDEwMHB4O1xuICBjb2xvcjogIzU2NDY0NjtcbiAgYm9yZGVyLXJhZGl1czogOHB4O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZjNmMyO1xufSJdfQ== */"

/***/ }),

/***/ "./src/app/wows/dashboard/wows-dashboard.component.ts":
/*!************************************************************!*\
  !*** ./src/app/wows/dashboard/wows-dashboard.component.ts ***!
  \************************************************************/
/*! exports provided: WowsDashboardComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WowsDashboardComponent", function() { return WowsDashboardComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm2015/http.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm2015/forms.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");
/* harmony import */ var highcharts__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! highcharts */ "./node_modules/highcharts/highcharts.js");
/* harmony import */ var highcharts__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(highcharts__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var highcharts_modules_exporting__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! highcharts/modules/exporting */ "./node_modules/highcharts/modules/exporting.js");
/* harmony import */ var highcharts_modules_exporting__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(highcharts_modules_exporting__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _common_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../common.service */ "./src/app/common.service.ts");
/* harmony import */ var _navigation_title_title_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../navigation/title/title.service */ "./src/app/navigation/title/title.service.ts");







highcharts_modules_exporting__WEBPACK_IMPORTED_MODULE_6___default()(highcharts__WEBPACK_IMPORTED_MODULE_5__);


let WowsDashboardComponent = class WowsDashboardComponent {
    constructor(http, titleService, commonService, route, router) {
        this.http = http;
        this.titleService = titleService;
        this.commonService = commonService;
        this.route = route;
        this.router = router;
        this.oil_chart_options = {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                //type: "pie",
                style: {
                    fontFamily: 'Roboto, Helvetica Neue, sans-serif'
                }
            },
            title: {
                text: "Oil Production"
            },
            xAxis: {
                categories: [],
                labels: {
                    // autoRotation: [-90],
                    step: 3,
                }
            },
            yAxis: {
                title: "Net (BOPD)"
            },
            tooltip: {
                pointFormat: "{series.name}: <b>{point.y:.2f}</b>"
            },
            plotOptions: {},
            series: [{
                    name: "Operation",
                    color: '#5b9bd5',
                    data: []
                }, {
                    name: "SOT",
                    color: '#ed7d31',
                    data: []
                }, {
                    name: "Figure",
                    color: '#a9d18e',
                    data: []
                }]
        };
        this.gas_chart_options = {
            chart: {
                //type: 'bar',
                style: {
                    fontFamily: 'Roboto, Helvetica Neue, sans-serif'
                }
            },
            title: {
                text: 'Gas Production'
            },
            xAxis: {
                categories: [],
                labels: {
                    // autoRotation: [-90],
                    step: 3,
                }
            },
            yAxis: {
                title: "Gas Rate (MMSCFD)"
            },
            tooltip: {
                pointFormat: "{series.name}: <b>{point.y:.2f}</b>"
            },
            legend: {
                reversed: true
            },
            plotOptions: {},
            series: [{
                    name: "Gas",
                    color: '#f4b183',
                    data: []
                }]
        };
        this.active_well_chart_options = {
            chart: {
                //type: 'bar',
                style: {
                    fontFamily: 'Roboto, Helvetica Neue, sans-serif'
                }
            },
            title: {
                text: 'Active Well History'
            },
            xAxis: {
                categories: [],
                labels: {
                    type: "datetime",
                    format: '{value:%d-%b-%y}',
                    autoRotation: [-45]
                }
            },
            yAxis: {
                title: "null",
                tickInterval: 1
            },
            tooltip: {
                useHTML: true,
                headerFormat: '{point.x:%d %b %Y}',
                pointFormat: "</br>{series.name}: <b>{point.y}</b>"
            },
            plotOptions: {
                series: {
                    dataLabels: {
                        enabled: true,
                        format: '{point.y}',
                        style: {
                            fontWeight: 'small'
                        }
                    }
                }
            },
            legend: {
                enabled: false,
            },
            series: [{
                    name: "Active Well",
                    color: '#4fc3f7',
                    data: []
                }]
        };
        this.wellstat_chart_options = {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: "pie",
                style: {
                    fontFamily: 'Roboto, Helvetica Neue, sans-serif'
                }
            },
            title: {
                text: "Well Status",
                align: 'left',
                floating: true,
            },
            tooltip: {
                pointFormat: "<b>{point.y} ({point.percentage:.1f}%)</b>"
            },
            legend: {
                enabled: true,
                align: 'left',
                layout: 'vertical',
                floating: true,
                itemStyle: {
                    fontWeight: 'normal'
                }
                //align: 'right',
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: "pointer",
                    showInLegend: true,
                    dataLabels: {
                        enabled: true,
                        distance: -30,
                        format: "{point.y}",
                        style: {
                            fontWeight: 'normal'
                        }
                    }
                }
            },
            series: [{
                    type: "pie",
                    name: "Status",
                    colorByPoint: true,
                    data: []
                }]
        };
        this.wellrank_chart_options = {
            chart: {
                type: 'column',
                style: {
                    fontFamily: 'Roboto, Helvetica Neue, sans-serif'
                }
            },
            title: {
                text: 'Well Rank'
            },
            xAxis: {
                categories: [],
                labels: {
                    autoRotation: [-45]
                }
            },
            tooltip: {
                pointFormat: "Oil : <strong>{point.y:.2f}</strong>"
            },
            yAxis: {
                title: null,
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                column: {
                    dataLabels: {
                        enabled: true,
                        format: '{point.y:.0f}',
                        rotation: 0,
                        x: 0,
                        y: -2,
                        style: {
                            fontWeight: 'normal'
                        }
                    }
                }
            },
            series: []
        };
        this.dateControl = new _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormControl"](new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 1));
        this.dateInput = this.dateControl.value.toLocaleDateString("en-US", { month: "short", year: "numeric", day: "numeric" });
        this.isLoadingSOT = false;
        this.isLoadingProduction = false;
    }
    ngOnInit() {
        this.titleService.titleSource.next({
            title: "Dashboard",
            icon: "dashboard",
            breadcrumbs: [
                { label: 'WOWS', routerLink: '' },
                { label: 'Dashboard', routerLink: '' }
            ]
        });
        this.dateControl.valueChanges.subscribe(r => {
            this.refresh_Production();
            //this.refresh_Gas();
            this.refresh_WellStatus();
            // this.refresh_StructureProduction();
            // this.refresh_WellProduction();
            this.refresh_WellRank();
            //this.refresh_SOT();
        });
        this.refresh_WellStatus();
        //  this.refresh_StructureProduction();
        // this.refresh_WellProduction();
        this.refresh_WellRank();
        this.refresh_Production();
        //this.refresh_Gas();
        //this.refresh_SOT();
    }
    dateChange(evt) {
        this.dateInput = evt.value.toLocaleDateString("en-US", { month: "short", year: "numeric", day: "numeric" });
    }
    refresh_SOT() {
        this.isLoadingSOT = true;
        this.http.get('/api/pe/production/ProdVolume', { params: { FacilityName: "SANGASANGA", date: this.dateControl.value.toISOString() } }).subscribe(res => {
            this.valueSOT = res["PeriodVolumeValue"];
            this.isLoadingSOT = false;
        }, error => {
        }, () => {
        });
    }
    refresh_Production() {
        this.isLoadingProduction = true;
        var end_date = this.dateControl.value;
        var start_date = new Date(end_date.getFullYear(), end_date.getMonth() - 1, end_date.getDate());
        this.http.get('/api/pe/production', { params: { sort: 'date', order: 'asc', columnfilter: '{"date":[{"opr":"gte","val":"' + start_date.toISOString() + '","log":"and"},{"opr":"lte","val":"' + end_date.toISOString() + '","log":"and"}]}' } }).subscribe(res => {
            var categories = [];
            var series_operation = [];
            var series_sot = [];
            var series_figure = [];
            var series_gas = [];
            res["items"].map(d => {
                var xdt = new Date(d.date);
                var dt = [xdt.getDate(), xdt.getMonth() + 1, xdt.getFullYear().toString().substr(-2)].join("/");
                categories.push(dt);
                series_operation.push({ name: dt, y: d.operation });
                series_sot.push({ name: dt, y: d.sot });
                series_figure.push({ name: dt, y: d.figure });
                series_gas.push({ name: dt, y: d.gas / 1000 });
                if (this.dateControl.value.toLocaleDateString("id-ID") == new Date(d.date).toLocaleDateString("id-ID")) {
                    this.valueSOT = d.sot;
                    this.valueFigure = d.figure;
                    this.valueGas = d.gas / 1000;
                    this.valueOperation = d.operation;
                }
            });
            this.oil_chart_options["xAxis"]["categories"] = categories;
            this.oil_chart_options["series"][0]["data"] = series_operation;
            this.oil_chart_options["series"][1]["data"] = series_sot;
            this.oil_chart_options["series"][2]["data"] = series_figure;
            highcharts__WEBPACK_IMPORTED_MODULE_5__["chart"](this.oil_chart_el.nativeElement, this.oil_chart_options);
            this.gas_chart_options["xAxis"]["categories"] = categories;
            this.gas_chart_options["series"][0]["data"] = series_gas;
            highcharts__WEBPACK_IMPORTED_MODULE_5__["chart"](this.gas_chart_el.nativeElement, this.gas_chart_options);
            this.isLoadingProduction = false;
        }, error => {
        }, () => {
        });
    }
    refresh_Gas() {
        this.http.get('/api/pe/data', { params: { type: "structure_production", date: this.dateControl.value.toISOString() } }).subscribe(res => {
            var categories = [];
            var series = [{ name: "Oil", data: [] }, { name: "Gas", data: [] }];
            res["data"].map(function (d) {
                categories.push(d.structure);
                series[0]["data"].push(d.oil_count);
                series[1]["data"].push(d.gas_count);
            });
            this.gas_chart_options["xAxis"]["categories"] = categories;
            this.gas_chart_options["series"] = series;
            highcharts__WEBPACK_IMPORTED_MODULE_5__["chart"](this.gas_chart_el.nativeElement, this.gas_chart_options);
        }, error => {
        }, () => {
        });
    }
    refresh_WellStatus() {
        this.http.get('/api/pe/data', { params: { type: "well_status", date: this.dateControl.value.toISOString() } }).subscribe(res => {
            var series_data = [];
            res["data"].map(function (d) {
                d.count < 10 ? series_data.push({ name: d.status, y: d.count, dataLabels: { distance: 10 } }) : series_data.push({ name: d.status, y: d.count });
            });
            this.wellstat_chart_options["series"][0]["data"] = series_data;
            highcharts__WEBPACK_IMPORTED_MODULE_5__["chart"](this.wellstat_chart_el.nativeElement, this.wellstat_chart_options);
            this.active_wells_count = res["active_wells_count"];
            var act_well_series_data = [];
            var date_category = [];
            res["data_active_well"].map(function (daw) {
                var xdt = new Date(daw.dates);
                //var dt = [xdt.getDate(), xdt.getMonth() + 1, xdt.getFullYear().toString().substr(-2)].join("/");
                date_category.push(xdt);
                act_well_series_data.push(Math.round(daw.count));
            });
            this.active_well_chart_options["xAxis"]["categories"] = date_category;
            this.active_well_chart_options["series"][0]["data"] = act_well_series_data;
            highcharts__WEBPACK_IMPORTED_MODULE_5__["chart"](this.active_well_chart_el.nativeElement, this.active_well_chart_options);
        }, error => {
        }, () => {
        });
    }
    /* refresh_StructureProduction() {
       this.http.get('/api/pe/data', {params: {type:"structure_production", date: this.dateControl.value.toISOString()}}).subscribe(res => {
   
         var categories = [];
         var series = [{name: "Oil", color: "#A9D18E", data: []}, {name: "Gas", color: "#F4B183", data: []}];
         res["data"].map(function(d) {
           categories.push(d.structure);
           series[0]["data"].push(d.oil_count);
           series[1]["data"].push(d.gas_count);
         });
         this.structprod_chart_options["xAxis"]["categories"] = categories;
         this.structprod_chart_options["series"] = series;
         Highcharts.chart(this.structprod_chart_el.nativeElement, this.structprod_chart_options);
         
       }, error => {
   
       }, () => {
   
       });
     }
   
     refresh_WellProduction() {
       this.http.get('/api/pe/data', {params: {type:"well_production", date: this.dateControl.value.toISOString()}}).subscribe(res => {
   
         var series_data = [];
         res["data"].map(function (d) {
           d.count < 10 ? series_data.push({ name: d.prod, y: d.count, dataLabels: { distance: 30 } }) : series_data.push({ name: d.prod, y: d.count })
         });
         this.wellprod_chart_options["series"][0]["data"] = series_data;
         Highcharts.chart(this.wellprod_chart_el.nativeElement, this.wellprod_chart_options);
   
       }, error => {
   
       }, () => {
   
       });
     }
     */
    refresh_WellRank() {
        this.http.get('/api/pe/data', { params: { type: "well_rank", date: this.dateControl.value.toISOString() } }).subscribe(res => {
            var categories = [];
            var series = [{ name: "Oil", color: "#A9D18E", data: [] }];
            res["data"].map(function (d, index) {
                if (index < 10) {
                    categories.push(d.well);
                    series[0]["data"].push(d.net);
                }
            });
            this.wellrank_chart_options["yAxis"].max = Math.max(...series[0]["data"]);
            this.wellrank_chart_options["xAxis"]["categories"] = categories;
            this.wellrank_chart_options["series"] = series;
            highcharts__WEBPACK_IMPORTED_MODULE_5__["chart"](this.wellrank_chart_el.nativeElement, this.wellrank_chart_options);
        }, error => {
        }, () => {
        });
    }
};
WowsDashboardComponent.ctorParameters = () => [
    { type: _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"] },
    { type: _navigation_title_title_service__WEBPACK_IMPORTED_MODULE_8__["TitleService"] },
    { type: _common_service__WEBPACK_IMPORTED_MODULE_7__["CommonService"] },
    { type: _angular_router__WEBPACK_IMPORTED_MODULE_4__["ActivatedRoute"] },
    { type: _angular_router__WEBPACK_IMPORTED_MODULE_4__["Router"] }
];
tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('oil_chart_el', { static: true })
], WowsDashboardComponent.prototype, "oil_chart_el", void 0);
tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('gas_chart_el', { static: true })
], WowsDashboardComponent.prototype, "gas_chart_el", void 0);
tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('active_well_chart_el', { static: true })
], WowsDashboardComponent.prototype, "active_well_chart_el", void 0);
tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('wellstat_chart_el', { static: true })
], WowsDashboardComponent.prototype, "wellstat_chart_el", void 0);
tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('wellrank_chart_el', { static: true })
], WowsDashboardComponent.prototype, "wellrank_chart_el", void 0);
tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('datePicker', { static: true })
], WowsDashboardComponent.prototype, "datePicker", void 0);
WowsDashboardComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
        selector: 'app-wows-dashboard',
        template: __webpack_require__(/*! raw-loader!./wows-dashboard.component.html */ "./node_modules/raw-loader/index.js!./src/app/wows/dashboard/wows-dashboard.component.html"),
        styles: [__webpack_require__(/*! ./wows-dashboard.component.scss */ "./src/app/wows/dashboard/wows-dashboard.component.scss")]
    })
], WowsDashboardComponent);



/***/ }),

/***/ "./src/app/wows/wows-permission.guard.ts":
/*!***********************************************!*\
  !*** ./src/app/wows/wows-permission.guard.ts ***!
  \***********************************************/
/*! exports provided: WowsPermissionGuard */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WowsPermissionGuard", function() { return WowsPermissionGuard; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");
/* harmony import */ var _wows_permission_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./wows-permission.service */ "./src/app/wows/wows-permission.service.ts");




let WowsPermissionGuard = class WowsPermissionGuard {
    constructor(router, wowsPermissionService) {
        this.router = router;
        this.wowsPermissionService = wowsPermissionService;
    }
    canActivate(route, state) {
        var res = this.wowsPermissionService.passPermission(state.url);
        if (!res) {
            this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        }
        return res;
    }
};
WowsPermissionGuard.ctorParameters = () => [
    { type: _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"] },
    { type: _wows_permission_service__WEBPACK_IMPORTED_MODULE_3__["WowsPermissionService"] }
];
WowsPermissionGuard = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
        providedIn: 'root'
    })
], WowsPermissionGuard);



/***/ }),

/***/ "./src/app/wows/wows-permission.service.ts":
/*!*************************************************!*\
  !*** ./src/app/wows/wows-permission.service.ts ***!
  \*************************************************/
/*! exports provided: WowsPermissionService, Menu */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WowsPermissionService", function() { return WowsPermissionService; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Menu", function() { return Menu; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");
/* harmony import */ var _auth_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../auth.service */ "./src/app/auth.service.ts");




//import { User } from '../user';
let WowsPermissionService = class WowsPermissionService {
    constructor(router, authService) {
        this.router = router;
        this.authService = authService;
        this.basePath = "wows";
        this.root = [
            new Menu("dashboard", true, ["WowsDashboard Read"]),
            new Menu("rigchart", true, ["WowsRigchart Read"]),
        ];
        this.authService.currentUser.subscribe(res => this.currentUser = res);
    }
    passPermission(path) {
        if (path.charAt(0) == "/")
            path = path.substring(1);
        var res = false;
        var ms = this.root.filter(m => path == this.basePath + '/' + m.link);
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
WowsPermissionService.ctorParameters = () => [
    { type: _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"] },
    { type: _auth_service__WEBPACK_IMPORTED_MODULE_3__["AuthService"] }
];
WowsPermissionService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
        providedIn: 'root'
    })
], WowsPermissionService);

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

/***/ "./src/app/wows/wows-routing.module.ts":
/*!*********************************************!*\
  !*** ./src/app/wows/wows-routing.module.ts ***!
  \*********************************************/
/*! exports provided: WowsRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WowsRoutingModule", function() { return WowsRoutingModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");
/* harmony import */ var _wows_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./wows.component */ "./src/app/wows/wows.component.ts");
/* harmony import */ var _wows_permission_guard__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./wows-permission.guard */ "./src/app/wows/wows-permission.guard.ts");
/* harmony import */ var _dashboard_wows_dashboard_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./dashboard/wows-dashboard.component */ "./src/app/wows/dashboard/wows-dashboard.component.ts");






const wowsRoutes = [
    { path: '', component: _wows_component__WEBPACK_IMPORTED_MODULE_3__["WowsComponent"], children: [
            { path: 'dashboard', component: _dashboard_wows_dashboard_component__WEBPACK_IMPORTED_MODULE_5__["WowsDashboardComponent"], canActivate: [_wows_permission_guard__WEBPACK_IMPORTED_MODULE_4__["WowsPermissionGuard"]] },
            { path: '', redirectTo: 'dashboard', pathMatch: "full" },
        ] },
];
let WowsRoutingModule = class WowsRoutingModule {
};
WowsRoutingModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
        imports: [
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forChild(wowsRoutes)
        ],
        exports: [
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"]
        ],
        declarations: []
    })
], WowsRoutingModule);



/***/ }),

/***/ "./src/app/wows/wows.component.scss":
/*!******************************************!*\
  !*** ./src/app/wows/wows.component.scss ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ":host {\n  position: relative;\n  top: 5px;\n}\n\n:host ::ng-deep .container-top-bar {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-pack: end;\n          justify-content: flex-end;\n}\n\n:host ::ng-deep .container-top-bar button {\n  margin: 0;\n}\n\n:host ::ng-deep .container-content {\n  min-height: 200px;\n}\n\n:host ::ng-deep .top-flow {\n  position: relative;\n  top: -45px;\n}\n\n:host ::ng-deep .top-flow-xs {\n  position: relative;\n  top: -15px;\n  -webkit-box-pack: start;\n          justify-content: flex-start;\n}\n\n/* PE table */\n\n:host ::ng-deep {\n  /* freeze first 3 column */\n  /* */\n}\n\n:host ::ng-deep .container-table {\n  /*position: relative;*/\n  /*max-height: 400px;*/\n  overflow: auto;\n}\n\n:host ::ng-deep .loading-shade {\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 56px;\n  right: 0;\n  background: rgba(0, 0, 0, 0.15);\n  z-index: 999;\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: start;\n          align-items: flex-start;\n  -webkit-box-pack: center;\n          justify-content: center;\n}\n\n:host ::ng-deep .pe-table {\n  width: 100%;\n}\n\n:host ::ng-deep .pe-table .mat-header-row {\n  height: 40px;\n}\n\n:host ::ng-deep .pe-table .mat-header-row:nth-child(2) .mat-header-cell {\n  top: 40px !important;\n}\n\n:host ::ng-deep .pe-table .mat-header-row:nth-child(3) .mat-header-cell {\n  top: 80px !important;\n}\n\n:host ::ng-deep .pe-table .mat-header-row:nth-child(1) .mat-table-sticky:nth-child(1),\n:host ::ng-deep .pe-table .mat-row .mat-table-sticky:nth-child(1) {\n  min-width: 16px !important;\n}\n\n:host ::ng-deep .pe-table .mat-header-row:nth-child(1) .mat-table-sticky:nth-child(2),\n:host ::ng-deep .pe-table .mat-row .mat-table-sticky:nth-child(2) {\n  left: 31px !important;\n}\n\n:host ::ng-deep .pe-table .mat-header-row:nth-child(1) .mat-table-sticky:nth-child(3),\n:host ::ng-deep .pe-table .mat-row .mat-table-sticky:nth-child(3) {\n  left: 128.75px !important;\n}\n\n:host ::ng-deep .pe-table .mat-header-cell {\n  white-space: nowrap;\n  padding-right: 7px;\n  padding-left: 7px;\n  text-align: center;\n  border-right: 1px solid rgba(0, 0, 0, 0.12);\n}\n\n:host ::ng-deep .pe-table .mat-sort-header {\n  padding-top: 0.625em;\n}\n\n:host ::ng-deep .pe-table .mat-row {\n  height: 32px;\n}\n\n:host ::ng-deep .pe-table .mat-cell {\n  white-space: nowrap;\n  padding-right: 7px;\n  padding-left: 7px;\n}\n\n:host ::ng-deep .pe-table .cell-center {\n  text-align: center;\n}\n\n:host ::ng-deep .pe-table .cell-right {\n  text-align: right;\n}\n\n:host ::ng-deep .pe-table .cell-error {\n  color: red;\n}\n\n:host ::ng-deep .pe-table .cell-warning {\n  color: orange;\n}\n\n:host ::ng-deep .pe-table .mat-cell .mat-icon {\n  font-size: 18px;\n}\n\n:host ::ng-deep .pe-table .mat-header-cell .mat-form-field {\n  width: auto;\n}\n\n:host ::ng-deep .input-hidden {\n  position: absolute;\n  width: 0px;\n  border: none;\n  height: 100%;\n}\n\n:host ::ng-deep .button-fw {\n  font-size: 24px;\n  /*position: absolute;\n  right: 0;\n  top: 0;*/\n  min-width: auto;\n  padding: 0;\n  margin-left: 6px;\n}\n\n:host ::ng-deep .mat-secondary {\n  color: green;\n}\n\n:host ::ng-deep .mat-tertiary {\n  color: dodgerblue;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvd293cy9EOlxccGVwLWFwcF9uZXdcXHNzY1xcQ2xpZW50QXBwL3NyY1xcYXBwXFx3b3dzXFx3b3dzLmNvbXBvbmVudC5zY3NzIiwic3JjL2FwcC93b3dzL3dvd3MuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxrQkFBQTtFQUNBLFFBQUE7QUNDRjs7QURFQTtFQUNDLG9CQUFBO0VBQUEsYUFBQTtFQUNDLHFCQUFBO1VBQUEseUJBQUE7QUNDRjs7QURFQTtFQUNFLFNBQUE7QUNDRjs7QURFQTtFQUNDLGlCQUFBO0FDQ0Q7O0FERUE7RUFDRSxrQkFBQTtFQUNBLFVBQUE7QUNDRjs7QURDQTtFQUNFLGtCQUFBO0VBQ0EsVUFBQTtFQUNBLHVCQUFBO1VBQUEsMkJBQUE7QUNFRjs7QURDQSxhQUFBOztBQUVBO0VBcUNFLDBCQUFBO0VBZUEsSUFBQTtBQ2pERjs7QURERTtFQUNFLHNCQUFBO0VBQ0EscUJBQUE7RUFDQSxjQUFBO0FDR0o7O0FEQUU7RUFDRSxrQkFBQTtFQUNBLE1BQUE7RUFDQSxPQUFBO0VBQ0EsWUFBQTtFQUNBLFFBQUE7RUFDQSwrQkFBQTtFQUNBLFlBQUE7RUFDQSxvQkFBQTtFQUFBLGFBQUE7RUFDQSx3QkFBQTtVQUFBLHVCQUFBO0VBQ0Esd0JBQUE7VUFBQSx1QkFBQTtBQ0VKOztBRENFO0VBQ0UsV0FBQTtBQ0NKOztBREdFO0VBQ0UsWUFBQTtBQ0RKOztBRElFO0VBQ0Usb0JBQUE7QUNGSjs7QURLRTtFQUNFLG9CQUFBO0FDSEo7O0FETUU7O0VBRUUsMEJBQUE7QUNKSjs7QURPRTs7RUFFRSxxQkFBQTtBQ0xKOztBRFFFOztFQUVFLHlCQUFBO0FDTko7O0FEU0U7RUFDRSxtQkFBQTtFQUNBLGtCQUFBO0VBQ0EsaUJBQUE7RUFDQSxrQkFBQTtFQUNBLDJDQUFBO0FDUEo7O0FEVUU7RUFDRSxvQkFBQTtBQ1JKOztBRFdFO0VBQ0UsWUFBQTtBQ1RKOztBRFlFO0VBQ0UsbUJBQUE7RUFDQSxrQkFBQTtFQUNBLGlCQUFBO0FDVko7O0FEYUU7RUFDRSxrQkFBQTtBQ1hKOztBRGNFO0VBQ0UsaUJBQUE7QUNaSjs7QURlRTtFQUNFLFVBQUE7QUNiSjs7QURnQkU7RUFDRSxhQUFBO0FDZEo7O0FEaUJFO0VBQ0UsZUFBQTtBQ2ZKOztBRGtCRTtFQUNFLFdBQUE7QUNoQko7O0FEbUJFO0VBQ0Usa0JBQUE7RUFDQSxVQUFBO0VBQ0EsWUFBQTtFQUNBLFlBQUE7QUNqQko7O0FEb0JFO0VBQ0UsZUFBQTtFQUNBOztVQUFBO0VBR0EsZUFBQTtFQUNBLFVBQUE7RUFDQSxnQkFBQTtBQ2xCSjs7QURxQkU7RUFDRSxZQUFBO0FDbkJKOztBRHNCRTtFQUNFLGlCQUFBO0FDcEJKIiwiZmlsZSI6InNyYy9hcHAvd293cy93b3dzLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiOmhvc3Qge1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIHRvcDogNXB4O1xufVxuXG46aG9zdCA6Om5nLWRlZXAgLmNvbnRhaW5lci10b3AtYmFyIHtcblx0ZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBmbGV4LWVuZDtcbn1cblxuOmhvc3QgOjpuZy1kZWVwIC5jb250YWluZXItdG9wLWJhciBidXR0b24ge1xuICBtYXJnaW46IDA7XG59XG5cbjpob3N0IDo6bmctZGVlcCAuY29udGFpbmVyLWNvbnRlbnQge1xuXHRtaW4taGVpZ2h0OiAyMDBweDtcbn1cblxuOmhvc3QgOjpuZy1kZWVwIC50b3AtZmxvdyB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgdG9wOiAtNDVweDtcbn1cbjpob3N0IDo6bmctZGVlcCAudG9wLWZsb3cteHMge1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIHRvcDogLTE1cHg7XG4gIGp1c3RpZnktY29udGVudDogZmxleC1zdGFydDtcbn1cblxuLyogUEUgdGFibGUgKi9cblxuOmhvc3QgOjpuZy1kZWVwIHtcblxuICAuY29udGFpbmVyLXRhYmxlIHtcbiAgICAvKnBvc2l0aW9uOiByZWxhdGl2ZTsqL1xuICAgIC8qbWF4LWhlaWdodDogNDAwcHg7Ki9cbiAgICBvdmVyZmxvdzogYXV0bztcbiAgfVxuXG4gIC5sb2FkaW5nLXNoYWRlIHtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgdG9wOiAwO1xuICAgIGxlZnQ6IDA7XG4gICAgYm90dG9tOiA1NnB4O1xuICAgIHJpZ2h0OiAwO1xuICAgIGJhY2tncm91bmQ6IHJnYmEoMCwgMCwgMCwgMC4xNSk7XG4gICAgei1pbmRleDogOTk5O1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGZsZXgtc3RhcnQ7XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIH1cblxuICAucGUtdGFibGUge1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIC8vYm9yZGVyLXRvcDogMXB4IHNvbGlkIHJnYmEoMCwwLDAsLjEyKTtcbiAgfVxuXG4gIC5wZS10YWJsZSAubWF0LWhlYWRlci1yb3cge1xuICAgIGhlaWdodDogNDBweDtcbiAgfVxuXG4gIC5wZS10YWJsZSAubWF0LWhlYWRlci1yb3c6bnRoLWNoaWxkKDIpIC5tYXQtaGVhZGVyLWNlbGwge1xuICAgIHRvcDogNDBweCAhaW1wb3J0YW50O1xuICB9XG5cbiAgLnBlLXRhYmxlIC5tYXQtaGVhZGVyLXJvdzpudGgtY2hpbGQoMykgLm1hdC1oZWFkZXItY2VsbCB7XG4gICAgdG9wOiA4MHB4ICFpbXBvcnRhbnQ7XG4gIH1cbiAgLyogZnJlZXplIGZpcnN0IDMgY29sdW1uICovXG4gIC5wZS10YWJsZSAubWF0LWhlYWRlci1yb3c6bnRoLWNoaWxkKDEpIC5tYXQtdGFibGUtc3RpY2t5Om50aC1jaGlsZCgxKSxcbiAgLnBlLXRhYmxlIC5tYXQtcm93IC5tYXQtdGFibGUtc3RpY2t5Om50aC1jaGlsZCgxKSB7XG4gICAgbWluLXdpZHRoOiAxNnB4ICFpbXBvcnRhbnQ7XG4gIH1cblxuICAucGUtdGFibGUgLm1hdC1oZWFkZXItcm93Om50aC1jaGlsZCgxKSAubWF0LXRhYmxlLXN0aWNreTpudGgtY2hpbGQoMiksXG4gIC5wZS10YWJsZSAubWF0LXJvdyAubWF0LXRhYmxlLXN0aWNreTpudGgtY2hpbGQoMikge1xuICAgIGxlZnQ6IDMxcHggIWltcG9ydGFudDtcbiAgfVxuXG4gIC5wZS10YWJsZSAubWF0LWhlYWRlci1yb3c6bnRoLWNoaWxkKDEpIC5tYXQtdGFibGUtc3RpY2t5Om50aC1jaGlsZCgzKSxcbiAgLnBlLXRhYmxlIC5tYXQtcm93IC5tYXQtdGFibGUtc3RpY2t5Om50aC1jaGlsZCgzKSB7XG4gICAgbGVmdDogMTI4Ljc1cHggIWltcG9ydGFudDtcbiAgfVxuICAvKiAqL1xuICAucGUtdGFibGUgLm1hdC1oZWFkZXItY2VsbCB7XG4gICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbiAgICBwYWRkaW5nLXJpZ2h0OiA3cHg7XG4gICAgcGFkZGluZy1sZWZ0OiA3cHg7XG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgIGJvcmRlci1yaWdodDogMXB4IHNvbGlkIHJnYmEoMCwwLDAsLjEyKTtcbiAgfVxuXG4gIC5wZS10YWJsZSAubWF0LXNvcnQtaGVhZGVyIHtcbiAgICBwYWRkaW5nLXRvcDogMC42MjVlbTtcbiAgfVxuXG4gIC5wZS10YWJsZSAubWF0LXJvdyB7XG4gICAgaGVpZ2h0OiAzMnB4O1xuICB9XG5cbiAgLnBlLXRhYmxlIC5tYXQtY2VsbCB7XG4gICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbiAgICBwYWRkaW5nLXJpZ2h0OiA3cHg7XG4gICAgcGFkZGluZy1sZWZ0OiA3cHg7XG4gIH1cblxuICAucGUtdGFibGUgLmNlbGwtY2VudGVyIHtcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIH1cblxuICAucGUtdGFibGUgLmNlbGwtcmlnaHQge1xuICAgIHRleHQtYWxpZ246IHJpZ2h0O1xuICB9XG5cbiAgLnBlLXRhYmxlIC5jZWxsLWVycm9yIHtcbiAgICBjb2xvcjogcmVkO1xuICB9XG5cbiAgLnBlLXRhYmxlIC5jZWxsLXdhcm5pbmcge1xuICAgIGNvbG9yOiBvcmFuZ2U7XG4gIH1cblxuICAucGUtdGFibGUgLm1hdC1jZWxsIC5tYXQtaWNvbiB7XG4gICAgZm9udC1zaXplOiAxOHB4O1xuICB9XG5cbiAgLnBlLXRhYmxlIC5tYXQtaGVhZGVyLWNlbGwgLm1hdC1mb3JtLWZpZWxkIHtcbiAgICB3aWR0aDogYXV0bztcbiAgfVxuXG4gIC5pbnB1dC1oaWRkZW4ge1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICB3aWR0aDogMHB4O1xuICAgIGJvcmRlcjogbm9uZTtcbiAgICBoZWlnaHQ6IDEwMCU7XG4gIH1cblxuICAuYnV0dG9uLWZ3IHtcbiAgICBmb250LXNpemU6IDI0cHg7XG4gICAgLypwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgcmlnaHQ6IDA7XG4gICAgdG9wOiAwOyovXG4gICAgbWluLXdpZHRoOiBhdXRvO1xuICAgIHBhZGRpbmc6IDA7XG4gICAgbWFyZ2luLWxlZnQ6IDZweDtcbiAgfVxuXG4gIC5tYXQtc2Vjb25kYXJ5IHtcbiAgICBjb2xvcjogZ3JlZW47XG4gIH1cblxuICAubWF0LXRlcnRpYXJ5IHtcbiAgICBjb2xvcjogZG9kZ2VyYmx1ZTtcbiAgfVxufVxuIiwiOmhvc3Qge1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIHRvcDogNXB4O1xufVxuXG46aG9zdCA6Om5nLWRlZXAgLmNvbnRhaW5lci10b3AtYmFyIHtcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBmbGV4LWVuZDtcbn1cblxuOmhvc3QgOjpuZy1kZWVwIC5jb250YWluZXItdG9wLWJhciBidXR0b24ge1xuICBtYXJnaW46IDA7XG59XG5cbjpob3N0IDo6bmctZGVlcCAuY29udGFpbmVyLWNvbnRlbnQge1xuICBtaW4taGVpZ2h0OiAyMDBweDtcbn1cblxuOmhvc3QgOjpuZy1kZWVwIC50b3AtZmxvdyB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgdG9wOiAtNDVweDtcbn1cblxuOmhvc3QgOjpuZy1kZWVwIC50b3AtZmxvdy14cyB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgdG9wOiAtMTVweDtcbiAganVzdGlmeS1jb250ZW50OiBmbGV4LXN0YXJ0O1xufVxuXG4vKiBQRSB0YWJsZSAqL1xuOmhvc3QgOjpuZy1kZWVwIHtcbiAgLyogZnJlZXplIGZpcnN0IDMgY29sdW1uICovXG4gIC8qICovXG59XG46aG9zdCA6Om5nLWRlZXAgLmNvbnRhaW5lci10YWJsZSB7XG4gIC8qcG9zaXRpb246IHJlbGF0aXZlOyovXG4gIC8qbWF4LWhlaWdodDogNDAwcHg7Ki9cbiAgb3ZlcmZsb3c6IGF1dG87XG59XG46aG9zdCA6Om5nLWRlZXAgLmxvYWRpbmctc2hhZGUge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogMDtcbiAgbGVmdDogMDtcbiAgYm90dG9tOiA1NnB4O1xuICByaWdodDogMDtcbiAgYmFja2dyb3VuZDogcmdiYSgwLCAwLCAwLCAwLjE1KTtcbiAgei1pbmRleDogOTk5O1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogZmxleC1zdGFydDtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG59XG46aG9zdCA6Om5nLWRlZXAgLnBlLXRhYmxlIHtcbiAgd2lkdGg6IDEwMCU7XG59XG46aG9zdCA6Om5nLWRlZXAgLnBlLXRhYmxlIC5tYXQtaGVhZGVyLXJvdyB7XG4gIGhlaWdodDogNDBweDtcbn1cbjpob3N0IDo6bmctZGVlcCAucGUtdGFibGUgLm1hdC1oZWFkZXItcm93Om50aC1jaGlsZCgyKSAubWF0LWhlYWRlci1jZWxsIHtcbiAgdG9wOiA0MHB4ICFpbXBvcnRhbnQ7XG59XG46aG9zdCA6Om5nLWRlZXAgLnBlLXRhYmxlIC5tYXQtaGVhZGVyLXJvdzpudGgtY2hpbGQoMykgLm1hdC1oZWFkZXItY2VsbCB7XG4gIHRvcDogODBweCAhaW1wb3J0YW50O1xufVxuOmhvc3QgOjpuZy1kZWVwIC5wZS10YWJsZSAubWF0LWhlYWRlci1yb3c6bnRoLWNoaWxkKDEpIC5tYXQtdGFibGUtc3RpY2t5Om50aC1jaGlsZCgxKSxcbjpob3N0IDo6bmctZGVlcCAucGUtdGFibGUgLm1hdC1yb3cgLm1hdC10YWJsZS1zdGlja3k6bnRoLWNoaWxkKDEpIHtcbiAgbWluLXdpZHRoOiAxNnB4ICFpbXBvcnRhbnQ7XG59XG46aG9zdCA6Om5nLWRlZXAgLnBlLXRhYmxlIC5tYXQtaGVhZGVyLXJvdzpudGgtY2hpbGQoMSkgLm1hdC10YWJsZS1zdGlja3k6bnRoLWNoaWxkKDIpLFxuOmhvc3QgOjpuZy1kZWVwIC5wZS10YWJsZSAubWF0LXJvdyAubWF0LXRhYmxlLXN0aWNreTpudGgtY2hpbGQoMikge1xuICBsZWZ0OiAzMXB4ICFpbXBvcnRhbnQ7XG59XG46aG9zdCA6Om5nLWRlZXAgLnBlLXRhYmxlIC5tYXQtaGVhZGVyLXJvdzpudGgtY2hpbGQoMSkgLm1hdC10YWJsZS1zdGlja3k6bnRoLWNoaWxkKDMpLFxuOmhvc3QgOjpuZy1kZWVwIC5wZS10YWJsZSAubWF0LXJvdyAubWF0LXRhYmxlLXN0aWNreTpudGgtY2hpbGQoMykge1xuICBsZWZ0OiAxMjguNzVweCAhaW1wb3J0YW50O1xufVxuOmhvc3QgOjpuZy1kZWVwIC5wZS10YWJsZSAubWF0LWhlYWRlci1jZWxsIHtcbiAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbiAgcGFkZGluZy1yaWdodDogN3B4O1xuICBwYWRkaW5nLWxlZnQ6IDdweDtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICBib3JkZXItcmlnaHQ6IDFweCBzb2xpZCByZ2JhKDAsIDAsIDAsIDAuMTIpO1xufVxuOmhvc3QgOjpuZy1kZWVwIC5wZS10YWJsZSAubWF0LXNvcnQtaGVhZGVyIHtcbiAgcGFkZGluZy10b3A6IDAuNjI1ZW07XG59XG46aG9zdCA6Om5nLWRlZXAgLnBlLXRhYmxlIC5tYXQtcm93IHtcbiAgaGVpZ2h0OiAzMnB4O1xufVxuOmhvc3QgOjpuZy1kZWVwIC5wZS10YWJsZSAubWF0LWNlbGwge1xuICB3aGl0ZS1zcGFjZTogbm93cmFwO1xuICBwYWRkaW5nLXJpZ2h0OiA3cHg7XG4gIHBhZGRpbmctbGVmdDogN3B4O1xufVxuOmhvc3QgOjpuZy1kZWVwIC5wZS10YWJsZSAuY2VsbC1jZW50ZXIge1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG59XG46aG9zdCA6Om5nLWRlZXAgLnBlLXRhYmxlIC5jZWxsLXJpZ2h0IHtcbiAgdGV4dC1hbGlnbjogcmlnaHQ7XG59XG46aG9zdCA6Om5nLWRlZXAgLnBlLXRhYmxlIC5jZWxsLWVycm9yIHtcbiAgY29sb3I6IHJlZDtcbn1cbjpob3N0IDo6bmctZGVlcCAucGUtdGFibGUgLmNlbGwtd2FybmluZyB7XG4gIGNvbG9yOiBvcmFuZ2U7XG59XG46aG9zdCA6Om5nLWRlZXAgLnBlLXRhYmxlIC5tYXQtY2VsbCAubWF0LWljb24ge1xuICBmb250LXNpemU6IDE4cHg7XG59XG46aG9zdCA6Om5nLWRlZXAgLnBlLXRhYmxlIC5tYXQtaGVhZGVyLWNlbGwgLm1hdC1mb3JtLWZpZWxkIHtcbiAgd2lkdGg6IGF1dG87XG59XG46aG9zdCA6Om5nLWRlZXAgLmlucHV0LWhpZGRlbiB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgd2lkdGg6IDBweDtcbiAgYm9yZGVyOiBub25lO1xuICBoZWlnaHQ6IDEwMCU7XG59XG46aG9zdCA6Om5nLWRlZXAgLmJ1dHRvbi1mdyB7XG4gIGZvbnQtc2l6ZTogMjRweDtcbiAgLypwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHJpZ2h0OiAwO1xuICB0b3A6IDA7Ki9cbiAgbWluLXdpZHRoOiBhdXRvO1xuICBwYWRkaW5nOiAwO1xuICBtYXJnaW4tbGVmdDogNnB4O1xufVxuOmhvc3QgOjpuZy1kZWVwIC5tYXQtc2Vjb25kYXJ5IHtcbiAgY29sb3I6IGdyZWVuO1xufVxuOmhvc3QgOjpuZy1kZWVwIC5tYXQtdGVydGlhcnkge1xuICBjb2xvcjogZG9kZ2VyYmx1ZTtcbn0iXX0= */"

/***/ }),

/***/ "./src/app/wows/wows.component.ts":
/*!****************************************!*\
  !*** ./src/app/wows/wows.component.ts ***!
  \****************************************/
/*! exports provided: WowsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WowsComponent", function() { return WowsComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm2015/material.js");
/* harmony import */ var _navigation_title_title_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../navigation/title/title.service */ "./src/app/navigation/title/title.service.ts");




let WowsComponent = class WowsComponent {
    constructor(snackBar, titleService) {
        this.snackBar = snackBar;
        this.titleService = titleService;
        this.titleService.titleSource.next({
            title: "WOWS",
            icon: "",
            breadcrumbs: []
        });
    }
};
WowsComponent.ctorParameters = () => [
    { type: _angular_material__WEBPACK_IMPORTED_MODULE_2__["MatSnackBar"] },
    { type: _navigation_title_title_service__WEBPACK_IMPORTED_MODULE_3__["TitleService"] }
];
WowsComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
        selector: 'app-pe',
        template: __webpack_require__(/*! raw-loader!./wows.component.html */ "./node_modules/raw-loader/index.js!./src/app/wows/wows.component.html"),
        styles: [__webpack_require__(/*! ./wows.component.scss */ "./src/app/wows/wows.component.scss")]
    })
], WowsComponent);



/***/ }),

/***/ "./src/app/wows/wows.module.ts":
/*!*************************************!*\
  !*** ./src/app/wows/wows.module.ts ***!
  \*************************************/
/*! exports provided: PeModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PeModule", function() { return PeModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm2015/forms.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm2015/http.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm2015/common.js");
/* harmony import */ var _angular_material_grid_list__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/grid-list */ "./node_modules/@angular/material/esm2015/grid-list.js");
/* harmony import */ var _angular_material_slide_toggle__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/slide-toggle */ "./node_modules/@angular/material/esm2015/slide-toggle.js");
/* harmony import */ var _angular_material_chips__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/chips */ "./node_modules/@angular/material/esm2015/chips.js");
/* harmony import */ var _wows_routing_module__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./wows-routing.module */ "./src/app/wows/wows-routing.module.ts");
/* harmony import */ var _material_material_module__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../material/material.module */ "./src/app/material/material.module.ts");
/* harmony import */ var _xfilter_xfilter_module__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../xfilter/xfilter.module */ "./src/app/xfilter/xfilter.module.ts");
/* harmony import */ var _angular_flex_layout__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/flex-layout */ "./node_modules/@angular/flex-layout/esm2015/flex-layout.js");
/* harmony import */ var _wows_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./wows.component */ "./src/app/wows/wows.component.ts");
/* harmony import */ var _auth_service__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../auth.service */ "./src/app/auth.service.ts");
/* harmony import */ var _auth_interceptor__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../auth.interceptor */ "./src/app/auth.interceptor.ts");
/* harmony import */ var _dashboard_wows_dashboard_component__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./dashboard/wows-dashboard.component */ "./src/app/wows/dashboard/wows-dashboard.component.ts");
/* harmony import */ var _navigation_panel_panel__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../navigation/panel/panel */ "./src/app/navigation/panel/panel.ts");
/* harmony import */ var _navigation_panel_panel_service__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../navigation/panel/panel.service */ "./src/app/navigation/panel/panel.service.ts");
/* harmony import */ var _xfilter_xfilter_component__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../xfilter/xfilter.component */ "./src/app/xfilter/xfilter.component.ts");
/* harmony import */ var _wows_permission_service__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./wows-permission.service */ "./src/app/wows/wows-permission.service.ts");
/* harmony import */ var angular_highcharts__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! angular-highcharts */ "./node_modules/angular-highcharts/fesm2015/angular-highcharts.js");






//import { MatFileUploadModule } from 'angular-material-fileupload';




















let PeModule = class PeModule {
    constructor(panelService, wowsPermission, authService) {
        this.panelService = panelService;
        this.wowsPermission = wowsPermission;
        this.authService = authService;
        this.authService.currentUser.subscribe(res => {
            this.panelService.messageSource.next(new _navigation_panel_panel__WEBPACK_IMPORTED_MODULE_16__["Panel"]("WOWS", 2, [
                new _navigation_panel_panel__WEBPACK_IMPORTED_MODULE_16__["PanelItem"]("Dashboard", "wows/dashboard", "dashboard", this.wowsPermission.passPermission("wows/dashboard")),
                new _navigation_panel_panel__WEBPACK_IMPORTED_MODULE_16__["PanelItem"]("Rig Barchart", "wows/rigchart", "bar_chart", this.wowsPermission.passPermission("wows/rigchart")),
            ]));
        });
    }
};
PeModule.ctorParameters = () => [
    { type: _navigation_panel_panel_service__WEBPACK_IMPORTED_MODULE_17__["PanelService"] },
    { type: _wows_permission_service__WEBPACK_IMPORTED_MODULE_19__["WowsPermissionService"] },
    { type: _auth_service__WEBPACK_IMPORTED_MODULE_13__["AuthService"] }
];
PeModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
        declarations: [
            _wows_component__WEBPACK_IMPORTED_MODULE_12__["WowsComponent"],
            _dashboard_wows_dashboard_component__WEBPACK_IMPORTED_MODULE_15__["WowsDashboardComponent"],
        ],
        imports: [
            _angular_common__WEBPACK_IMPORTED_MODULE_4__["CommonModule"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormsModule"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_2__["ReactiveFormsModule"],
            _angular_common_http__WEBPACK_IMPORTED_MODULE_3__["HttpClientModule"],
            _wows_routing_module__WEBPACK_IMPORTED_MODULE_8__["WowsRoutingModule"],
            _material_material_module__WEBPACK_IMPORTED_MODULE_9__["MaterialModule"],
            _angular_flex_layout__WEBPACK_IMPORTED_MODULE_11__["FlexLayoutModule"],
            //MatFileUploadModule,
            angular_highcharts__WEBPACK_IMPORTED_MODULE_20__["ChartModule"],
            _angular_material_grid_list__WEBPACK_IMPORTED_MODULE_5__["MatGridListModule"],
            _xfilter_xfilter_module__WEBPACK_IMPORTED_MODULE_10__["xFilterModule"],
            _angular_material_slide_toggle__WEBPACK_IMPORTED_MODULE_6__["MatSlideToggleModule"],
            _angular_material_chips__WEBPACK_IMPORTED_MODULE_7__["MatChipsModule"],
        ],
        providers: [
            { provide: _angular_common_http__WEBPACK_IMPORTED_MODULE_3__["HTTP_INTERCEPTORS"], useClass: _auth_interceptor__WEBPACK_IMPORTED_MODULE_14__["AuthInterceptor"], multi: true },
        ],
        bootstrap: [],
        entryComponents: [
            _xfilter_xfilter_component__WEBPACK_IMPORTED_MODULE_18__["xFilterDialogComponent"],
            _xfilter_xfilter_component__WEBPACK_IMPORTED_MODULE_18__["xFilterDialogNumberComponent"],
            _xfilter_xfilter_component__WEBPACK_IMPORTED_MODULE_18__["xFilterDialogDateComponent"],
            _xfilter_xfilter_component__WEBPACK_IMPORTED_MODULE_18__["xFilterDialogTextComponent"],
        ],
    })
], PeModule);



/***/ })

}]);
//# sourceMappingURL=wows-wows-module-es2015.js.map