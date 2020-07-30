import { ShareModalComponent } from './../shared/share-modal/share-modal.component'
import { LoaderService } from './../../_services/loader.service'
import { LayoutLoaderService } from './../../_services/layout-loader.service'
import { ProfileRoutes } from './../profile/profile-routing.module'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HttpModule } from '@angular/http'
import { ProfileComponent } from './profile.component'
import { ReactiveFormsModule } from '@angular/forms'
import { SharedModule } from '../shared/shared.module'
import { AlertService } from './../../_services/alert.service'
import { NgxMasonryModule } from 'ngx-masonry'
import {
  NgbTabsetModule,
  NgbModalModule,
  NgbPopoverModule,
  NgbTooltipModule,
  NgbProgressbarModule
} from '@ng-bootstrap/ng-bootstrap'
// Import NgMasonryGridModule
import { NgMasonryGridModule } from 'ng-masonry-grid'
import { PhotosComponent } from './photos/photos.component'
import { FollowersComponent } from './followers/followers.component'
import { FollowingsComponent } from './followings/followings.component'
import { PhotoEssaysComponent } from './photo-essays/photo-essays.component'
import { InfiniteScrollModule } from 'ngx-infinite-scroll'
import { CriticsComponent } from './critics/critics.component'
import { SliderModule } from 'primeng/slider'
import { FormsModule } from '@angular/forms'
import { MentionModule } from 'angular-mentions/mention'
import { HighlightPipe } from './highlight.pipe'
// import { NgMentionModule } from 'angular-mention'
import { ViewCriticComponent } from './view-critic/view-critic.component'
import { NgxStripeModule } from 'ngx-stripe'
import { StripeCheckoutModule } from 'ng-stripe-checkout'
import { PhotoUploadService } from './../photo-upload/photo-upload.service'
import { StripeUpdateService } from './../../_services/stripeUpdate.service'
import { environment } from './../../../environments/environment.prod'
import { CollectionListComponent } from '../collections/collection-list/collection-list.component'
import { ReportComponent } from './report/report.component'
import { ScrollPanelModule } from 'primeng/scrollpanel'
import { SharedProfileComponent } from './shared-profile/shared-profile.component'
import { MasonryGalleryModule } from 'ngx-masonry-gallery'
// import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    SharedModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    CommonModule,
    HttpModule,
    ProfileRoutes,
    NgbModalModule,
    NgbPopoverModule,
    NgMasonryGridModule,
    NgbTabsetModule,
    NgbTooltipModule,
    NgbProgressbarModule,
    NgxStripeModule.forRoot(environment.STRIPE_PUBLISH_KEY),
    StripeCheckoutModule,
    SliderModule,
    FormsModule,
    // MentionModule,
    // NgMentionModule,
    InfiniteScrollModule,
    ScrollPanelModule,
    NgxMasonryModule,
    MasonryGalleryModule

    // BrowserAnimationsModule
  ],
  declarations: [
    ProfileComponent,
    FollowersComponent,
    FollowingsComponent,
    HighlightPipe,
    PhotoEssaysComponent,
    ReportComponent
  ],
  providers: [
    AlertService,
    LoaderService,
    LayoutLoaderService,
    StripeUpdateService,
    PhotoUploadService
  ],
  exports: [SharedModule, NgxMasonryModule],
  entryComponents: [CriticsComponent, ReportComponent]
})
export class ProfileModule {}
