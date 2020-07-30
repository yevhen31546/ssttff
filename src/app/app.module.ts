import { NgtUniversalModule } from "@ng-toolkit/universal";
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { SharedModule } from "./modules/shared/shared.module";
import { NgbModalModule } from "@ng-bootstrap/ng-bootstrap";
//import { AuthInterceptor,ErrorInterceptor } from './../_helpers/index
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

import { AppComponent } from "./app.component";
import { routing } from "./app.routing";
import { NgbCarouselModule } from "@ng-bootstrap/ng-bootstrap";
import { AuthInterceptor, ErrorInterceptor } from "./_helpers";
import { AuthGuard, GuestGuard, CanDeactivateGuard } from "./_guards";
import { AlertService } from "./_services";
import { reducers, metaReducers } from "./_stores/app.reducers";
import { StoreModule } from "@ngrx/store";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NotificationService } from "./_services/notification.service";
import { AngularFireMessagingModule } from "@angular/fire/messaging";
import { AngularFireDatabaseModule } from "@angular/fire/database";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFireModule } from "@angular/fire";
import { environment } from "../environments/environment";
import { AsyncPipe } from "../../node_modules/@angular/common";
import { NgModule, PLATFORM_ID, APP_ID, Inject } from '@angular/core'

// import { ServerModule } from "@angular/platform-server";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'stf-frontend' }),
    //ServerModule,
    CommonModule,
    NgtUniversalModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireMessagingModule,
    AngularFireModule.initializeApp(environment.firebase),
    BrowserAnimationsModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    HttpClientModule,
    routing,
    NgbCarouselModule,
    NgbModalModule.forRoot(),
    SharedModule
  ],
  providers: [
    AuthGuard,
    CanDeactivateGuard,
    GuestGuard,
    AlertService,
    NotificationService,
    AsyncPipe,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ]
})
export class AppModule { 
  constructor(
  @Inject(PLATFORM_ID) private platformId: Object,
  @Inject(APP_ID) private appId: string) {
  const platform = isPlatformBrowser(platformId) ?
    'in the browser' : 'on the server';
  console.log(`Running ${platform} with appId=${appId}`);
}}
