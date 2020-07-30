import { ViewCriticComponent } from './view-critic/view-critic.component';
import { CanDeactivateGuard } from './../../_guards/can-deactivate.guard';
import { Routes, RouterModule, UrlSegment } from '@angular/router'
import { ProfileComponent } from './profile.component'
import { InnerLayoutComponent } from './../../_layouts'
import { SharedProfileComponent } from './shared-profile/shared-profile.component';

 
export function startWithchar(url: UrlSegment[]) {
  let currentUrl =  url.length === 1 && url[0].path.startsWith('@') ||  url.length === 2 && url[0].path.startsWith('@')   ? ({consumed: url,  posParams: {
    username: new UrlSegment(url[0].path.substr(1), {})
  }}) : null;
  return currentUrl;
} 

export function startWithPhoto(url: UrlSegment[]) {
  let currentUrl =  url.length === 2 &&  url[0].path.startsWith('photo')    ? ({consumed: url,  posParams: {
    id: new UrlSegment(url[1].path, {})
  }}) : null;
  return currentUrl;
  
}


const guestChildRoutes: Routes = [ 
  {
    canDeactivate: [CanDeactivateGuard],
     path: ':username',
     matcher: startWithchar,
    component: ProfileComponent,
    data: { title: 'Profile', breadcrumb: 'profile' }
  },
  {
    canDeactivate: [CanDeactivateGuard],
     path: ':username/:param',
     pathMatch: 'full',
     matcher: startWithchar,
    component: ProfileComponent,
    data: { title: 'Profile', breadcrumb: 'profile' }
  },
  {
    path: 'photo/:id',
    matcher: startWithPhoto,
    pathMatch: 'full',
    component: SharedProfileComponent
  }

]

const routes: Routes = [
  { path: '', component: InnerLayoutComponent, children: guestChildRoutes }
]

export const ProfileRoutes = RouterModule.forChild(routes)
