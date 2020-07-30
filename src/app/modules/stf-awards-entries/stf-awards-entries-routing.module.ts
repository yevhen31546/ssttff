import { Routes, RouterModule } from '@angular/router'
import { InnerLayoutComponent } from './../../_layouts'
import { StfAwardsEntriesComponent } from './stf-awards-entries.component'

const guestChildRoutes: Routes = [
  {
    path: '',
    component: StfAwardsEntriesComponent,
    data: { title: 'STF Awards Entries | Shoot The Frame', breadcrumb: 'stf-awards-entries' }
  }
]

const routes: Routes = [
  { path: '', component: InnerLayoutComponent, children: guestChildRoutes }
]

export const StfAwardsEntriesRoutes = RouterModule.forChild(routes)
