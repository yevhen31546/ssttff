import { SharePhotoEssayComponent } from './share-photo-essay/share-photo-essay.component';
import { Routes, RouterModule } from '@angular/router'
import { PhotoEssayDetailsComponent } from './photo-essay-details/photo-essay-details.component'
import { InnerLayoutComponent } from '../../_layouts'

const guestChildRoutes: Routes = [
  {
    path: ':id',
    component: PhotoEssayDetailsComponent,
    data: { title: 'Photo Essay', breadcrumb: 'photo-essay' }
  },
  {
    path: 'share/:shareid',
    component: SharePhotoEssayComponent,
    data: { title: 'Photo Essay' }
  }
]

const routes: Routes = [
  { path: '', component: InnerLayoutComponent, children: guestChildRoutes },
]

export const PhotoEssayRoutes = RouterModule.forChild(routes)
