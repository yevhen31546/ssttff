import { ShareCollectionComponent } from './share-collection/share-collection.component';
import { Routes, RouterModule } from '@angular/router'
import { CollectionsDetailsComponent } from './collections-details/collections-details.component'
import { InnerLayoutComponent } from '../../_layouts'

const guestChildRoutes: Routes = [
  {
    path: ':id',
    component: CollectionsDetailsComponent,
    data: { title: 'Collections', breadcrumb: 'collections' }
  },
  {
    path: 'share/:collectionid',
    component: ShareCollectionComponent,
    data: { title: 'Collections' }
  }
]

const routes: Routes = [
  { path: '', component: InnerLayoutComponent, children: guestChildRoutes },
]

export const CollectionsRoutes = RouterModule.forChild(routes)
