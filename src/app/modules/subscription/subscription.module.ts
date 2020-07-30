import { environment } from './../../../../src/environments/environment'
import { LoaderService } from './../../_services/loader.service'
import { AlertService } from './../../_services/alert.service'
import { SharedModule } from './../shared/shared.module'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SubscriptionComponent } from './subscription.component'
import { ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http'
import { SubscriptionRoutes } from './subscription-routing.module'
import { NgxStripeModule } from 'ngx-stripe'
import { SubscriptionPlansComponent } from './subscription-plans/subscription-plans.component'
import { SubscriptionDowngradeComponent } from './subscription-downgrade/subscription-downgrade.component'
import { SubscriptionUpgradeComponent } from './subscription-upgrade/subscription-upgrade.component'
import { DataService } from '../../_services'
import { StripeCheckoutModule } from 'ng-stripe-checkout'
import { SubscriptionSubmissionComponent } from './subscription-submission/subscription-submission.component'

@NgModule({
  imports: [
    SharedModule,
    NgxStripeModule.forRoot(environment.STRIPE_PUBLISH_KEY),
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    CommonModule,
    HttpModule,
    SubscriptionRoutes,
    NgxStripeModule,
    StripeCheckoutModule
  ],
  declarations: [
    SubscriptionComponent,
    SubscriptionPlansComponent,
    SubscriptionDowngradeComponent,
    SubscriptionUpgradeComponent,
    SubscriptionSubmissionComponent
  ],
  providers: [AlertService, LoaderService, DataService],
  exports: [SharedModule]
})
export class SubscriptionModule {}
