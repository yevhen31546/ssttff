import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { ErrorComponent } from './error.component'
import { InnerLayoutComponent } from '../../_layouts';


const guestChildRoutes: Routes = [
  {
    path: '',
    component: ErrorComponent,
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
export class ErrorRoutingModule {}
