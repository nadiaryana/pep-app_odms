import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../auth.guard';
import { CanDeactivateGuard } from '../can-deactivate.guard';
import { SscComponent } from './ssc.component';
import { SscPermissionGuard } from './ssc-permission.guard';

import { SscDashboardComponent } from './dashboard/ssc-dashboard.component';

import { SscTicketComponent } from './ticket/ssc-ticket.component';
import { SscTicketListComponent } from './ticket/ssc-ticket-list.component';
import { SscTicketOpenComponent } from './ticket/ssc-ticket-open.component';

import { SscSlaComponent } from './sla/ssc-sla.component';
import { SscSlaMonthComponent } from './sla/ssc-sla-month.component';

const sscRoutes: Routes = [
  { path: '', component: SscComponent, children: [
    { path: 'dashboard', component: SscDashboardComponent },
    { path: 'ticket', component: SscTicketComponent, children: [
    	{ path: 'open', component: SscTicketOpenComponent, canActivate: [SscPermissionGuard] },
      { path: 'list', component: SscTicketListComponent, canActivate: [SscPermissionGuard] },
      { path: '', redirectTo: 'open', pathMatch:"full" },
    ]},
    { path: 'sla', component: SscSlaComponent, children: [
      { path: 'month', component: SscSlaMonthComponent, canActivate: [SscPermissionGuard] },
      { path: '', redirectTo: 'month', pathMatch:"full" },
    ]},
    { path: '', redirectTo: 'sla/dashboard', pathMatch:"full" },
  ]},
];

@NgModule({
  imports: [
  RouterModule.forChild(sscRoutes)
  ],
  exports: [
  RouterModule
  ],
  declarations: []
})

export class SscRoutingModule { 
  
}