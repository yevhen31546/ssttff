import { LOCAL_STORAGE } from '@ng-toolkit/universal';
import { Injectable, Inject, Optional, PLATFORM_ID } from '@angular/core'
import { Router } from '@angular/router';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http'
import { Observable } from 'rxjs'
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
 constructor(@Optional() 
 @Inject(LOCAL_STORAGE) private localStorage: any,
 @Inject(PLATFORM_ID) private platformId: Object,
 private router: Router) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    if (isPlatformBrowser(this.platformId)) {
    let currentUser = JSON.parse(this.localStorage.getItem('currentUser'))
    if (currentUser && currentUser.token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.token}`
        }
      })
    }
    }

    return next.handle(request)
  }
}
