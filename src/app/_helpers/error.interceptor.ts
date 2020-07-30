import { Injectable, Inject, PLATFORM_ID } from '@angular/core'
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'

import { AuthenticationService } from '../_services'
import { Router } from '@angular/router'
import { isPlatformBrowser } from '@angular/common'

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
 @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
   
    return next.handle(request).pipe(
      catchError(err => {
        if (isPlatformBrowser(this.platformId)) {
          if (err.status === 401) {
            // auto logout if 401 response returned from api
            this.authenticationService.logout()
            location.reload(true)
          }
          if (err.status === 500) {
            this.router.navigate(['/error'])
          }
        }
        //////console.log(err)
        // const error = err.error.message || err.statusText
        return throwError(err)
      })
    )
  }
}
