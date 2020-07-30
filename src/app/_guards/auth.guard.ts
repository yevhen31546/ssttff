import { LOCAL_STORAGE } from "@ng-toolkit/universal";
import { Injectable, Inject, Optional, PLATFORM_ID } from "@angular/core";
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from "@angular/router";
import { isPlatformBrowser } from "@angular/common";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
  constructor(
    @Optional()
    @Inject(LOCAL_STORAGE)
    private localStorage: any,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (isPlatformBrowser(this.platformId)) {
      let currentUser: any = JSON.parse(
        this.localStorage.getItem("currentUser")
      );
      if (currentUser && currentUser.user.username != null) {
        // logged in so return true
        return true;
      }
      this.router.navigate(["/sign-in"], {
        queryParams: { returnUrl: state.url }
      });
      return false;
    }
  }
}
