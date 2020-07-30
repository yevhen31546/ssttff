import { Routes, RouterModule } from '@angular/router'

import { InnerLayoutComponent } from '../../_layouts'
import { MembersComponent } from './members/members.component'
import { PhotoEssayExploreComponent } from './photo-essay-explore/photo-essay-explore.component'
import { CategoriesComponent } from './categories/categories.component'
import { CategoriesDetailsComponent } from './categories-details/categories-details.component'
import { CollectionExploreComponent } from './collection-explore/collection-explore.component'
import { ExplorePhotosComponent } from './explore-photos/explore-photos.component'

const guestChildRoutes: Routes = [
  {
    path: 'members',
    component: MembersComponent,
    data: { title: 'Explore Members | Shoot The Frame', breadcrumb: 'stf' }
  },
  {
    path: 'photo-essays',
    component: PhotoEssayExploreComponent,
    data: { title: 'Explore Photo Essays | Shoot The Frame', breadcrumb: 'stf' }
  },
  {
    path: 'collections',
    component: CollectionExploreComponent,
    data: { title: 'Explore Collections | Shoot The Frame', breadcrumb: 'stf' }
  },
  {
    path: 'photos',
    component: ExplorePhotosComponent,
    data: { title: 'Explore Photos | Shoot The Frame', breadcrumb: 'stf' }
  },
  {
    path: 'categories',
    component: CategoriesComponent,
    data: { title: 'Explore Categories | Shoot The Frame', breadcrumb: 'stf' }
  },
  {
    path: 'category/:categoryname',
    component: CategoriesDetailsComponent,
    data: { title: 'Shoot the frame', breadcrumb: 'stf' }
  }

  // otherwise redirect to home
  //{ path: '**', redirectTo: '' }
]

const routes: Routes = [
  { path: '', component: InnerLayoutComponent, children: guestChildRoutes }
]

export const ExploreMenuRoutes = RouterModule.forChild(routes)
