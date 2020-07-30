import { environment } from './../../../environments/environment.prod';
import { StripeCheckoutModule } from 'ng-stripe-checkout';
import { NgxStripeModule } from 'ngx-stripe';
import { UserRoutes } from './../user/user-routing.module'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HttpModule } from '@angular/http'
import { UserComponent } from './user.component'
import { UserAccountComponent } from './user-account/user-account.component'
import { NgbTabsetModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap'
import { UserProfileComponent } from './user-profile/user-profile.component'
import { UserPasswordComponent } from './user-password/user-password.component'
import { UserBillingComponent } from './user-billing/user-billing.component'
import { UserNotificationComponent } from './user-notification/user-notification.component'
import { ProgressHttpModule } from 'angular-progress-http'
import { AgmCoreModule } from '@agm/core'
import { ReactiveFormsModule } from '@angular/forms'
import { SharedModule } from '../shared/shared.module'
import { AlertService } from './../../_services/alert.service'
import { FileUploadModule } from 'ng2-file-upload'
import { LoaderService } from '../../_services'
import { UserReceiptComponent } from './user-receipt/user-receipt.component'
import { SliderModule } from 'primeng/slider';
import { ScrollPanelModule } from 'primeng/scrollpanel'

@NgModule({
  imports: [
    SharedModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBnmK0eoKVg57zj2zKUvI5yz2U1H7gw3Qk',
      libraries: ['places']
    }),
    CommonModule,
    HttpModule,
    ProgressHttpModule,
    UserRoutes,
    NgbTabsetModule,
    NgbModalModule,
    FileUploadModule,
    NgxStripeModule.forRoot(environment.STRIPE_PUBLISH_KEY),
    StripeCheckoutModule,
    SliderModule,
    ScrollPanelModule,
],
  declarations: [
    UserComponent,
    UserAccountComponent,
    UserProfileComponent,
    UserPasswordComponent,
    UserBillingComponent,
    UserNotificationComponent,
    UserPasswordComponent,
    UserNotificationComponent,
    UserReceiptComponent
  ],
  providers: [AlertService, LoaderService],
  exports: [SharedModule]
})
export class UserModule {}
