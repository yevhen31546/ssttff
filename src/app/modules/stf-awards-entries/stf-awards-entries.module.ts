import { NgSelectModule } from '@ng-select/ng-select';
import { LayoutLoaderService } from './../../_services/layout-loader.service';
import { AlertService } from './../../_services/alert.service'
import { LoaderService } from './../../_services/loader.service'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { StfAwardsEntriesComponent } from './stf-awards-entries.component'
import { StfAwardsEntriesRoutes } from './stf-awards-entries-routing.module'
import { SharedModule } from '../shared/shared.module'
import { HttpModule } from '@angular/http'
import { NgbTabsetModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap'
import { FormsModule } from '@angular/forms';
import { NgxStripeModule } from 'ngx-stripe';
import { environment } from './../../../environments/environment.prod';
import { StripeUpdateService } from './../../_services/stripeUpdate.service';
import { StripeCheckoutModule } from 'ng-stripe-checkout';

@NgModule({
  imports: [CommonModule, FormsModule, SharedModule, HttpModule, StfAwardsEntriesRoutes,
    NgbTabsetModule,
    NgxStripeModule.forRoot(environment.STRIPE_PUBLISH_KEY),
    StripeCheckoutModule,
    NgSelectModule,
    NgbTooltipModule
  ],
  declarations: [StfAwardsEntriesComponent],
  providers: [AlertService, LoaderService, LayoutLoaderService, StripeUpdateService],
  exports: [SharedModule]
})
export class StfAwardsEntriesModule {}
