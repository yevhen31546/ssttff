import { ImageGridModalComponent } from './../shared/image-grid-modal/image-grid-modal.component';
import { ModalTopComponent } from './../shared/modal-top/modal-top.component';
import { ViewCriticComponent } from './../profile/view-critic/view-critic.component';
// import { UserAccountComponent } from './user-account/user-account.component';
import { UserAccountComponent } from './user-account/user-account.component'
import { UserReceiptComponent } from './user-receipt/user-receipt.component'

import { Routes, RouterModule, UrlSegment } from '@angular/router'

import { AuthLayoutComponent, InnerLayoutComponent } from './../../_layouts';


export function startWithPhoto(url: UrlSegment[]) {
  let currentUrl =  url.length === 2 &&  url[0].path.startsWith('photo')    ? ({consumed: url,  posParams: {
    id: new UrlSegment(url[1].path, {})
  }}) : null;
  return currentUrl;
}

const guestChildRoutes: Routes = [
  {
    path: 'account-settings/profile',
    component: UserAccountComponent,
    data: { title: 'Account Settings | Shoot The Frame', breadcrumb: 'profile' }
  },
  {
    path: 'account-settings/:type',
    component: UserAccountComponent,
    data: { title: 'Account Settings | Shoot The Frame', breadcrumb: 'profile' }
  },
  {
    path: 'account-settings/billing/receipt/:id',
    component: UserReceiptComponent,
    data: { title: 'Receipt', breadcrumb: 'receipt' }
  },
  {
    path: 'upload-photo',
    loadChildren: '../photo-upload/photo-upload.module#PhotoUploadModule'
  },
  {
    path: 'photos/:name',
    component: ImageGridModalComponent
  }
]

const routes: Routes = [
  { path: '', component: InnerLayoutComponent, children: guestChildRoutes }
]

export const UserRoutes = RouterModule.forChild(routes)
