import { LOCAL_STORAGE } from '@ng-toolkit/universal';
import { environment } from './../../environments/environment'
import { Injectable, Inject, Optional } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { map } from 'rxjs/operators'

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  constructor(@Optional() 
 @Inject(LOCAL_STORAGE) private localStorage: any, 
  private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http
      .post<any>(`${environment.apiUrl}/users/authenticate`, {
        username,
        password
      })
      .pipe(
        map(user => {
          // login successful if there's a jwt token in the response
          if (user && user.token) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            this.localStorage.setItem('currentUser', JSON.stringify(user))
          }

          return user
        })
      )
  }

  logout() {
    // remove user from local storage to log user out
    this.localStorage.removeItem('currentUser')
    this.localStorage.removeItem('notify')

  }

  saveBrowserUrl(data) {
    return this.http.post(`${environment.apiUrl}saveBrowserUrl`, data);
  }
}
