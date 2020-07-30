import { LOCAL_STORAGE } from '@ng-toolkit/universal';
import { Injectable, Inject, Optional, PLATFORM_ID } from '@angular/core'
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router'
import { Observable } from 'rxjs/Observable'
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class GuestGuard implements CanActivate {
  constructor(@Optional() 
 @Inject(LOCAL_STORAGE) private localStorage: any,
 @Inject(PLATFORM_ID) private platformId: Object,
 private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (isPlatformBrowser(this.platformId)) {
    let currentUser: any = JSON.parse(this.localStorage.getItem('currentUser'));
    if (currentUser && currentUser.user.username != null) { 
      // logged in so redirect to dashboard
      this.router.navigate(['/user/account-settings/profile'])
      return false
    } else {
      // not logged in
      return true
    }
  }
  }
}
