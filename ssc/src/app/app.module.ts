import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule }    from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMenuModule } from '@angular/material/menu';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material/material.module';
import { xFilterModule } from './xfilter/xfilter.module';
import { PanelComponent } from './navigation/panel/panel.component';
import { HeaderComponent } from './navigation/header/header.component';
import { TitleComponent } from './navigation/title/title.component';
import { SnackbarComponent } from './snackbar.component';
import { LoginComponent } from './account/login.component';
import { LogoutComponent } from './account/logout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LocationComponent } from './location/location.component';
import { LocationListComponent } from './location/location-list.component';
import { LocationDeleteDialogComponent } from './location/location-list.component';
import { LocationAddComponent } from './location/location-add.component';
import { xFilterDialogComponent } from './xfilter/xfilter.component';
import { xFilterDialogNumberComponent } from './xfilter/xfilter.component';
import { xFilterDialogDateComponent } from './xfilter/xfilter.component';
import { xFilterDialogTextComponent } from './xfilter/xfilter.component';
import { AuthInterceptor } from './auth.interceptor'

@NgModule({
  declarations: [
    AppComponent,
    PanelComponent,
    HeaderComponent,
    TitleComponent,
    SnackbarComponent,
    LoginComponent,
    LogoutComponent,
    DashboardComponent,

    LocationComponent,
    LocationListComponent,
    LocationAddComponent,
    LocationDeleteDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
  	ReactiveFormsModule,
  	HttpClientModule,
    BrowserAnimationsModule,
  	MaterialModule,
    FlexLayoutModule,
    xFilterModule,
    MatMenuModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
  entryComponents: [
  xFilterDialogComponent,
  xFilterDialogNumberComponent,
  xFilterDialogDateComponent,
  xFilterDialogTextComponent,
  LocationDeleteDialogComponent,
  ],
})
export class AppModule {
}
