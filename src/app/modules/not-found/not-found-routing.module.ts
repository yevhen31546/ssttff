import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { NotFoundComponent } from './not-found.component'
import { InnerLayoutComponent } from '../../_layouts';


const guestChildRoutes: Routes = [
  {
    path: '',
    component: NotFoundComponent,
    data: { title: 'Messages', breadcrumb: 'messages' }
  }
]

const routes: Routes = [
  { path: '', component: InnerLayoutComponent, children: guestChildRoutes }
]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotFoundRoutingModule {}
