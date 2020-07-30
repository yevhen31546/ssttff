import { ShareCritiqueComponent } from './share-critique/share-critique.component';
import { CanDeactivateGuard } from './../../_guards/can-deactivate.guard'
import { Routes, RouterModule } from '@angular/router'
import { CritiquesComponent } from './critiques.component'
import { InnerLayoutComponent } from './../../_layouts'

const guestChildRoutes: Routes = [
  {
    path: '',
    component: CritiquesComponent,
    data: { title: 'Critiques | Shoot The Frame', breadcrumb: 'critiques' }
  },
  { path: 'photo/:id',
      component: ShareCritiqueComponent
    }
]

const routes: Routes = [
  { path: '', component: InnerLayoutComponent, children: guestChildRoutes },

]

export const CritiquesRoutes = RouterModule.forChild(routes)
