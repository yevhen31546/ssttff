import { CategoriesComponent } from './../explore-menu/categories/categories.component'
import { CollectionsComponent } from './../collections/collections.component'
import { MemberLoaderComponent } from './../../_components/member-loader/member-loader.component'
import { ScrollbarModule } from 'ngx-scrollbar' 
import { LayoutLoaderService } from './../../_services/layout-loader.service'
import { SharedProfileComponent } from './../profile/shared-profile/shared-profile.component'
import { CommentsComponent } from './../profile/comments/comments.component'
import { ViewCriticComponent } from './../profile/view-critic/view-critic.component'
import { InfoComponent } from './info/info.component'
import {
  NgbPopoverModule,
  NgbTooltipModule,
  NgbProgressbarModule,
  NgbTabsetModule
} from '@ng-bootstrap/ng-bootstrap'
import { DataService } from './../../_services/data.service'
import { NotificationService } from './../../_services/notification.service'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { AlertComponent } from './../../_components/alert/alert.component'
import { AuthLayoutComponent, InnerLayoutComponent } from './../../_layouts'
import { RouterModule } from '@angular/router'
import { LoaderComponent } from '../../_components/loader/loader.component'
import { GridLoaderComponent } from '../../_components/grid-loader/grid-loader.component'
import { ProfileLoaderComponent } from '../../_components/profile-loader/profile-loader.component'
import { LayoutLoaderComponent } from '../../_components/layout-loader/layout-loader.component'
import { PaginationLoaderComponent } from '../../_components/pagination-loader/pagination-loader.component'
import { CollectionLoaderComponent } from '../../_components/collection-loader/collection-loader.component'
import { NgxCroppieComponent } from '../../_components/ngx-croppie/ngx-croppie.component'
import { ClickOutsideDirective } from '../../_directives/click-outside.directive'
import { NgInitDirective } from '../../_directives/ng-init.directive'
import { ImageGridModalComponent } from './image-grid-modal/image-grid-modal.component'
import { ImageGridComponent } from './image-grid/image-grid.component'
import { SanitizeHtmlPipe } from './../../_pipes/sanitize-html.pipe'
import { CommonMobileHeaderComponent } from '../../_layouts/common-mobile-header/common-mobile-header.component'
import { NgMasonryGridModule } from 'ng-masonry-grid'
import { LazyLoadDirective } from '../../_directives/lazy-load.directive'
import { InfiniteScrollModule } from 'ngx-infinite-scroll'
import {
  LazyLoadImageModule,
  intersectionObserverPreset
} from 'ng-lazyload-image'
import { StripeUpdateService } from './../../_services/stripeUpdate.service'
import { SafePipe } from './../../_pipes/safe.pipe'
import { ModalTopComponent } from './modal-top/modal-top.component'
import { StfAwardLogoComponent } from './stf-award-logo/stf-award-logo.component'
import { PhotoEssayAddModalComponent } from './../photo-essay/photo-essay-add-modal/photo-essay-add-modal.component'
import { LoaderService } from '../../_services'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { PhotoEssayListModalComponent } from '../photo-essay/photo-essay-list-modal/photo-essay-list-modal.component'
import { CollectionsListModalComponent } from '../collections/collections-list-modal/collections-list-modal.component'
import { CollectionsAddModalComponent } from '../collections/collections-add-modal/collections-add-modal.component'
import { PhotoEssayEditModalComponent } from '../photo-essay/photo-essay-edit-modal/photo-essay-edit-modal.component'
import { PhotoEssayDeleteComponent } from '../photo-essay/photo-essay-delete/photo-essay-delete.component'
import { CollectionsDeleteComponent } from '../collections/collections-delete/collections-delete.component'
import { CollectionsEditModalComponent } from '../collections/collections-edit-modal/collections-edit-modal.component'
import { CollectionListComponent } from '../collections/collection-list/collection-list.component'
import { PhotoEssayListComponent } from '../photo-essay/photo-essay-list/photo-essay-list.component'
import { CriticsComponent } from './../profile/critics/critics.component'
import { SliderModule } from 'primeng/slider'
import { ScrollPanelModule } from 'primeng/scrollpanel'
import { TimeAgoPipe } from 'time-ago-pipe'
import { MentionModule } from 'fvi-angular-mentions/mention'
import { ShareModalComponent } from './share-modal/share-modal.component'
import { JwSocialButtonsModule } from 'jw-angular-social-buttons'
import { AwardHistoryComponent } from './award-history/award-history.component'
import { EssayCollectionLoaderComponent } from './essay-collection-loader/essay-collection-loader.component'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { PickerModule } from '@ctrl/ngx-emoji-mart'
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji'
import { ShareButtonsModule } from '@ngx-share/buttons'
import { MessageService } from '../../_services/message.service'
// import { PusherService } from '../../_services/pusher.service'
import { MessagesComponent } from '../messages/messages.component'
import { MessageListComponent } from '../messages/message-list/message-list.component'
import { MemberListComponent } from '../explore-menu/member-list/member-list.component'
import { PhotosComponent } from '../profile/photos/photos.component'

import { NgxMasonryModule } from 'ngx-masonry'
import { MasonryGalleryModule } from 'ngx-masonry-gallery'
import { WebNotificationComponent } from '../web-notification/web-notification.component'
import { OnboardComponent } from '../../modals/onboard/onboard.component'
import { CritiqueInfoComponent } from '../../modals/critique-info/critique-info.component'
import { UploadInfoComponent } from '../../modals/upload-info/upload-info.component'
import { CollectiveScoreInfoComponent } from '../../modals/collective-score-info/collective-score-info.component'
import { MasterCollectiveInfoComponent } from '../../modals/master-collective-info/master-collective-info.component'
import { CritiqueComponentInfoComponent } from '../../modals/critique-component-info/critique-component-info.component';
import { InsightInfoComponent } from '../../modals/insight-info/insight-info.component';
import { StfModalComponent } from './stf-modal/stf-modal.component';

const customConfig: any = {
  autoSetMeta: false
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InfiniteScrollModule,
    RouterModule,
    NgbPopoverModule,
    NgMasonryGridModule,
    NgxMasonryModule,
    MasonryGalleryModule,

    NgbTabsetModule,
    NgbTooltipModule,
    NgbProgressbarModule,
    LazyLoadImageModule.forRoot({
      preset: intersectionObserverPreset
    }),
    SliderModule,
    MentionModule,
    ScrollbarModule,
    ScrollPanelModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    MentionModule,
    FormsModule,
    JwSocialButtonsModule,
    PickerModule,
    EmojiModule,
    ShareButtonsModule
  ],
  declarations: [
    AuthLayoutComponent,
    CommonMobileHeaderComponent,
    InnerLayoutComponent,
    AlertComponent,
    LoaderComponent,
    LayoutLoaderComponent,
    PaginationLoaderComponent,
    ClickOutsideDirective,
    CommonMobileHeaderComponent,
    InfoComponent,
    LazyLoadDirective,
    ImageGridComponent,
    ImageGridModalComponent,
    SanitizeHtmlPipe,
    SafePipe,
    ViewCriticComponent,
    ModalTopComponent,
    GridLoaderComponent,
    ProfileLoaderComponent,
    CollectionLoaderComponent,
    NgxCroppieComponent,
    PhotoEssayAddModalComponent,
    PhotoEssayListModalComponent,
    CollectionsListModalComponent,
    CollectionsAddModalComponent,
    PhotoEssayListComponent,
    CollectionListComponent,
    PhotoEssayEditModalComponent,
    PhotoEssayDeleteComponent,
    CollectionsEditModalComponent,
    CollectionsDeleteComponent,
    CollectionsComponent,
    CriticsComponent,
    CommentsComponent,
    TimeAgoPipe,
    ShareModalComponent,
    SharedProfileComponent,
    AwardHistoryComponent,
    EssayCollectionLoaderComponent,
    MemberLoaderComponent,
    MessagesComponent,
    MessageListComponent,
    MemberListComponent,
    CategoriesComponent,
    PhotosComponent,
    NgInitDirective,
    StfAwardLogoComponent,
    NgInitDirective,
    WebNotificationComponent,
    OnboardComponent,
    CritiqueInfoComponent,
    UploadInfoComponent,
    CollectiveScoreInfoComponent,
    MasterCollectiveInfoComponent,
    CritiqueComponentInfoComponent,
    InsightInfoComponent,
    StfModalComponent
  ],
  exports: [
    InnerLayoutComponent,
    AlertComponent,
    LoaderComponent,
    LayoutLoaderComponent,
    PaginationLoaderComponent,
    AuthLayoutComponent,
    CommonMobileHeaderComponent,
    ImageGridComponent,
    ImageGridModalComponent,
    ModalTopComponent,
    PhotoEssayEditModalComponent,
    PhotoEssayDeleteComponent,
    ProfileLoaderComponent,
    MemberLoaderComponent,
    CollectionListComponent,
    PhotoEssayListComponent,
    CollectionLoaderComponent,
    NgxCroppieComponent,
    EssayCollectionLoaderComponent,
    CollectionsComponent,
    MemberListComponent,
    CategoriesComponent,
    PhotosComponent,
    StfAwardLogoComponent,
    WebNotificationComponent
  ],
  entryComponents: [
    InfoComponent,
    ImageGridComponent,
    ImageGridModalComponent,
    PhotoEssayAddModalComponent,
    PhotoEssayListModalComponent,
    PhotoEssayEditModalComponent,
    PhotoEssayDeleteComponent,
    CollectionsEditModalComponent,
    CollectionsDeleteComponent,
    CollectionsListModalComponent,
    CollectionsAddModalComponent,
    CriticsComponent,
    ShareModalComponent,
    AwardHistoryComponent,
    ModalTopComponent,
    MessagesComponent,
    MessageListComponent,
    WebNotificationComponent,
    OnboardComponent,
    CritiqueInfoComponent,
    UploadInfoComponent,
    CollectiveScoreInfoComponent,
    MasterCollectiveInfoComponent,
    CritiqueComponentInfoComponent,
    InsightInfoComponent,
    StfModalComponent
  ],
  providers: [
    DataService,
    StripeUpdateService,
    LoaderService,
    LayoutLoaderService,
    MessageService,
    // PusherService,
    NgbActiveModal,
    NotificationService
  ]
})
export class SharedModule {}
