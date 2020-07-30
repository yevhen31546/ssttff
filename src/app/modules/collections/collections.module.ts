import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CollectionListComponent } from './collection-list/collection-list.component'
import { CollectionsDetailsComponent } from './collections-details/collections-details.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { SharedModule } from '../shared/shared.module'
import { CollectionsService } from './collections.service'
import { CollectionsRoutes } from './collections-routing.module'
import { InfiniteScrollModule } from 'ngx-infinite-scroll'
import { NgMasonryGridModule } from 'ng-masonry-grid'
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ShareCollectionComponent } from './share-collection/share-collection.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CollectionsRoutes,
    SharedModule,
    InfiniteScrollModule,
    NgMasonryGridModule,
    NgbTooltipModule
  ],
  declarations: [CollectionsDetailsComponent,
    ShareCollectionComponent
],
  providers: [CollectionsService],
  exports: [ReactiveFormsModule, SharedModule]
})
export class CollectionsModule {}
