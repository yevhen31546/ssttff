import { DataService } from './../../_services/data.service';
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { LikesComponent } from './likes.component'
import { LikesService } from './likes.service'
import { SharedModule } from '../shared/shared.module'
import { NgbTabsetModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap'
import { NgMasonryGridModule } from 'ng-masonry-grid'
import { InfiniteScrollModule } from 'ngx-infinite-scroll'
import { LikesRoutes } from './likes-routing.module'
import { CriticsComponent } from './../profile/critics/critics.component'


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    LikesRoutes,
    NgMasonryGridModule,
    NgbTooltipModule,
    NgbTabsetModule,
    InfiniteScrollModule
  ],
  declarations: [LikesComponent],
  providers: [LikesService,DataService],
  entryComponents:[CriticsComponent]
})
export class LikesModule {}
