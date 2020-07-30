import { Routes, RouterModule } from '@angular/router'
import { InnerLayoutComponent } from '../../_layouts'
import { AdminStfEntriesComponent } from './admin-stf-entries.component'

const guestChildRoutes: Routes = [
  {
    path: '',
    component: AdminStfEntriesComponent,
    data: { title: 'Home', breadcrumb: 'home' }
  }
]

const routes: Routes = [
  { path: '', component: InnerLayoutComponent, children: guestChildRoutes }
]

export const AdminStfEntriesRoutes = RouterModule.forChild(routes)
