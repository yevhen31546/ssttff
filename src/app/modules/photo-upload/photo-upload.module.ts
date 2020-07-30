import { StripeCheckoutModule } from 'ng-stripe-checkout'
import { NgxStripeModule } from 'ngx-stripe'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { NgSelectModule } from '@ng-select/ng-select'
import { PhotoUploadRoutingModule } from './photo-upload-routing.module'
import { FileUploadModule } from 'ng2-file-upload'

import { PhotoUploadComponent } from './photo-upload.component'
import { FileUpComponent } from './file-up/file-up.component'
import { ComposeComponent } from './compose/compose.component'
import { StoryComponent } from './story/story.component'
import { DetailsComponent } from './details/details.component'
import { StfAwardSubmitComponent } from './stf-award-submit/stf-award-submit.component'

import { CategoryComponent } from './category/category.component'
import { AwardsComponent } from './awards/awards.component'
import { UploadCompleteComponent } from './upload-complete/upload-complete.component'
import { UploadTabsComponent } from './upload-tabs/upload-tabs.component'
import { SharedModule } from '../shared/shared.module'
import { AlertService } from '../../_services/alert.service'
import { AgmCoreModule } from '@agm/core'
import { NgbModalModule, NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap'
import { environment } from './../../../../src/environments/environment'
import { ScrollbarModule } from 'ngx-scrollbar'

@NgModule({
  imports: [
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBnmK0eoKVg57zj2zKUvI5yz2U1H7gw3Qk',
      libraries: ['places']
    }),
    CommonModule,
    FormsModule,
    NgSelectModule,
    FileUploadModule,
    SharedModule,
    PhotoUploadRoutingModule,
    NgbModalModule,
    NgbTabsetModule,
    NgxStripeModule.forRoot(environment.STRIPE_PUBLISH_KEY),
    StripeCheckoutModule,
    ScrollbarModule,
  ],
  declarations: [
    PhotoUploadComponent,
    FileUpComponent,
    ComposeComponent,
    StoryComponent,
    DetailsComponent,
    CategoryComponent,
    AwardsComponent,
    UploadCompleteComponent,
    UploadTabsComponent,
    StfAwardSubmitComponent
  ],
  providers: [AlertService],
  exports: [SharedModule]
})
export class PhotoUploadModule {}
