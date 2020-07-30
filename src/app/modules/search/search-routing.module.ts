import { Routes, RouterModule } from '@angular/router'
import { SearchComponent } from './search.component'
import { InnerLayoutComponent } from '../../_layouts'

const guestChildRoutes: Routes = [
  {
    path: ':keyword',
    component: SearchComponent,
    data: {
      title: 'Search | Shoot The Frame'
    }
  }
]

const routes: Routes = [
  { path: '', component: InnerLayoutComponent, children: guestChildRoutes }
]

export const SearchRoutes = RouterModule.forChild(routes)
