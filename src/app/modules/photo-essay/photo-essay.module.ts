import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PhotoEssayComponent } from './photo-essay.component'
import { PhotoEssayDetailsComponent } from './photo-essay-details/photo-essay-details.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { SharedModule } from '../shared/shared.module'
import { PhotoEssayService } from './photo-essay.service'
import { PhotoEssayRoutes } from './photo-essay-routing.module'
import { NgbTabsetModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap'
import { NgMasonryGridModule } from 'ng-masonry-grid'
import { InfiniteScrollModule } from 'ngx-infinite-scroll'
import { SharePhotoEssayComponent } from './share-photo-essay/share-photo-essay.component';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    PhotoEssayRoutes,
    ReactiveFormsModule,
    NgbTooltipModule,
    NgbTabsetModule,
    NgMasonryGridModule,
    InfiniteScrollModule
  ],
  declarations: [PhotoEssayComponent, PhotoEssayDetailsComponent,
    SharePhotoEssayComponent
],
  providers: [PhotoEssayService],
  exports: [ReactiveFormsModule]
})
export class PhotoEssayModule {}
