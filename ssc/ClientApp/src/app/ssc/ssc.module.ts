import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule }    from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule }   from '@angular/common';

import { SscRoutingModule } from './ssc-routing.module';
import { MaterialModule } from '../material/material.module';
import { xFilterModule } from '../xfilter/xfilter.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SscComponent } from './ssc.component';

import { AuthService } from '../auth.service';
import { AuthInterceptor } from '../auth.interceptor'

import { SscTicketComponent } from './ticket/ssc-ticket.component';
import { SscTicketListComponent } from './ticket/ssc-ticket-list.component';
import { SscTicketOpenComponent } from './ticket/ssc-ticket-open.component';
import { SscSlaComponent } from './sla/ssc-sla.component';
import { SscSlaMonthComponent } from './sla/ssc-sla-month.component';
import { SscDashboardComponent } from './dashboard/ssc-dashboard.component';

import { Panel } from '../navigation/panel/panel';
import { PanelItem } from '../navigation/panel/panel';
import { PanelService } from '../navigation/panel/panel.service';
import { xFilterDialogComponent } from '../xfilter/xfilter.component';
import { xFilterDialogNumberComponent } from '../xfilter/xfilter.component';
import { xFilterDialogDateComponent } from '../xfilter/xfilter.component';
import { xFilterDialogTextComponent } from '../xfilter/xfilter.component';
import { SscPermissionService } from './ssc-permission.service';

@NgModule({
  declarations: [
  SscComponent,
  SscTicketComponent,
  SscTicketListComponent,
  SscTicketOpenComponent,
  SscSlaComponent,
  SscSlaMonthComponent,
  SscDashboardComponent,
  ],
  imports: [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  HttpClientModule,
  SscRoutingModule,
  MaterialModule,
  FlexLayoutModule,
  xFilterModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [],
  entryComponents: [
  xFilterDialogComponent,
  xFilterDialogNumberComponent,
  xFilterDialogDateComponent,
  xFilterDialogTextComponent,
  ],
})

export class SscModule { 
  
  constructor (
    private panelService: PanelService,
    private sscPermission: SscPermissionService,
    private authService: AuthService,
    ) {

    this.authService.currentUser.subscribe(res => {
      this.panelService.messageSource.next(new Panel(
        "ICT", 1, [
        new PanelItem("Dashboard", "ssc/dashboard", "dashboard", this.sscPermission.passPermission("ssc/dashboard")),
        new PanelItem("Open Tickets", "ssc/ticket/open", "list", this.sscPermission.passPermission("ssc/ticket")),
        new PanelItem("All Tickets", "ssc/ticket/list", "list", this.sscPermission.passPermission("ssc/ticket")),
        new PanelItem("SLA", "ssc/sla", "show_chart", this.sscPermission.passPermission("ssc/sla")),
        ]));
    });

    
  }
}
