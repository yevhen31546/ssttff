import { Routes, RouterModule } from '@angular/router'
import { InnerLayoutComponent } from '../../_layouts'
import { FindPhotosComponent } from './find-photos.component'

const guestChildRoutes: Routes = [
  {
    path: ':type/:search',
    component: FindPhotosComponent,
    data: { title: 'Tags | Shoot The Frame', breadcrumb: 'home' }
  }
]

const routes: Routes = [
  { path: '', component: InnerLayoutComponent, children: guestChildRoutes }
]

export const FindPhotosRoutes = RouterModule.forChild(routes)
