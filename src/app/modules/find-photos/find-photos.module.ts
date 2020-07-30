import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FindPhotosComponent } from './find-photos.component'
import { SharedModule } from '../shared/shared.module'
import { FindPhotosRoutes } from './find-photos-routing.module'
import { NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap'

@NgModule({
  imports: [CommonModule, SharedModule, FindPhotosRoutes, NgbTabsetModule],
  declarations: [FindPhotosComponent]
})
export class FindPhotosModule {}
