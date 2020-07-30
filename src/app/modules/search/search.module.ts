import { SharedModule } from './../shared/shared.module'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SearchComponent } from './search.component'
import { PhotosComponent } from '../profile/photos/photos.component'
import {  NgbTabsetModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap'
import { MembersComponent } from '../explore-menu/members/members.component';
import { CategoriesComponent } from '../explore-menu/categories/categories.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgMasonryGridModule } from 'ng-masonry-grid';
import { SearchRoutes } from './search-routing.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, SharedModule,FormsModule,
    SearchRoutes,
    NgbTabsetModule,NgMasonryGridModule,NgbTooltipModule,
    InfiniteScrollModule,
  ],
  declarations: [SearchComponent]
})
export class SearchModule {}
