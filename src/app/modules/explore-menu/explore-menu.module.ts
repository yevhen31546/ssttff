import { CollectionLoaderComponent } from './../../_components/collection-loader/collection-loader.component'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ExploreMenuComponent } from './explore-menu.component'
import { MembersComponent } from './members/members.component'
import { ExploreMenuRoutes } from './explore-menu-routing.module'
import { SharedModule } from '../shared/shared.module'
import { AlertService } from '../../_services/alert.service'
import { LoaderService } from '../../_services/loader.service'
import { HttpModule } from '@angular/http'
import { PhotoEssayExploreComponent } from './photo-essay-explore/photo-essay-explore.component'
import { CollectionExploreComponent } from './collection-explore/collection-explore.component'
import { NgbTabsetModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap'
import { InfiniteScrollModule } from 'ngx-infinite-scroll'
import { CategoriesDetailsComponent } from './categories-details/categories-details.component'
import { CategoriesImageGridComponent } from './categories-image-grid/categories-image-grid.component'
import { NgMasonryGridModule } from 'ng-masonry-grid'
import { ExplorePhotosComponent } from './explore-photos/explore-photos.component'
import { PhotoEssayTabComponent } from './photo-essay-tab/photo-essay-tab.component'
import { CollectionTabComponent } from './collection-tab/collection-tab.component'

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    SharedModule,
    ExploreMenuRoutes,
    NgbTabsetModule,
    InfiniteScrollModule,
    NgbTooltipModule,
    NgMasonryGridModule
  ],
  declarations: [
    ExploreMenuComponent,
    PhotoEssayExploreComponent,
    CollectionExploreComponent,
    CategoriesDetailsComponent,
    CategoriesImageGridComponent,
    ExplorePhotosComponent,
    MembersComponent,
    PhotoEssayTabComponent,
    CollectionTabComponent
  ],
  providers: [AlertService, LoaderService],
  exports: [SharedModule]
})
export class ExploreMenuModule {}
