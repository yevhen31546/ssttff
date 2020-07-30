import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HomeComponent } from './home.component'
import { HomeStfAwardEntriesComponent } from './home-stf-award-entries/home-stf-award-entries.component'
import { HomeDailyFeedsComponent } from './home-daily-feeds/home-daily-feeds.component'
import { HomeRoutes } from './home-routing.module'
import { SharedModule } from '../shared/shared.module'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { NgSelectModule } from '@ng-select/ng-select'
import { HttpModule } from '@angular/http'
import { NgbTabsetModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap'
import { NgMasonryGridModule } from 'ng-masonry-grid'
import { InfiniteScrollModule } from 'ngx-infinite-scroll'
import { HomeService } from './home.service'
import { HomeImageGridComponent } from './home-image-grid/home-image-grid.component'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    SharedModule,
    HomeRoutes,
    ReactiveFormsModule,
    NgSelectModule,
    NgbTabsetModule,
    NgMasonryGridModule,
    InfiniteScrollModule,
    NgbTooltipModule
  ],
  declarations: [
    HomeComponent,
    HomeDailyFeedsComponent,
    HomeStfAwardEntriesComponent,
    HomeImageGridComponent
  ],
  exports: [SharedModule],
  providers: [HomeService]
})
export class HomeModule {}
