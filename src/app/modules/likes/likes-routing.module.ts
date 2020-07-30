import { Routes, RouterModule } from '@angular/router'
import { LikesComponent } from './likes.component'
import { InnerLayoutComponent } from '../../_layouts'

const guestChildRoutes: Routes = [
  {
    path: '',
    component: LikesComponent,
    data: { title: 'Likes', breadcrumb: 'likes' }
  }
]

const routes: Routes = [
  { path: '', component: InnerLayoutComponent, children: guestChildRoutes }
]

export const LikesRoutes = RouterModule.forChild(routes)
