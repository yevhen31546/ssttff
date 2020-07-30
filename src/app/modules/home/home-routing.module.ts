import { Routes, RouterModule } from '@angular/router'
import { HomeComponent } from './home.component'
import { InnerLayoutComponent } from '../../_layouts'

const guestChildRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: { title: 'Shoot The Frame', breadcrumb: 'stf' }
  },
  {
    path: 'daily-feed',
    component: HomeComponent,
    data: { title: 'Shoot The Frame', breadcrumb: 'stf' }
  }
]

const routes: Routes = [
  { path: '', component: InnerLayoutComponent, children: guestChildRoutes }
]

export const HomeRoutes = RouterModule.forChild(routes)
