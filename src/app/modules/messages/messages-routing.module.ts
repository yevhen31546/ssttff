import { Routes, RouterModule } from '@angular/router'
import { MessagesComponent } from './messages.component'
import { InnerLayoutComponent } from '../../_layouts'

const guestChildRoutes: Routes = [
  {
    path: '',
    component: MessagesComponent,
    data: { title: 'Messages', breadcrumb: 'messages' }
  }
]

const routes: Routes = [
  { path: '', component: InnerLayoutComponent, children: guestChildRoutes }
]

export const MessagesRoutes = RouterModule.forChild(routes)
