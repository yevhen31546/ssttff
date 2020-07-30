import { Routes, RouterModule } from '@angular/router'
import { InnerLayoutComponent } from '../../_layouts'
import { InsightsComponent } from './insights.component'

const guestChildRoutes: Routes = [
  {
    path: '',
    component: InsightsComponent
  }
]

const routes: Routes = [
  { path: '', component: InnerLayoutComponent, children: guestChildRoutes }
]

export const InsightsRoutes = RouterModule.forChild(routes)
