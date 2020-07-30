import { LOCAL_STORAGE } from '@ng-toolkit/universal';
import { environment } from '../../../environments/environment'
import {
  HttpClient,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http'
import { Injectable, Inject,Optional } from '@angular/core'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { getAuthUser } from './../../_stores/user/user.reducer'
import { UserState } from './../../_stores/user/user.states'
import { AddAuthData } from './../../_stores/user/user.actions'
import { Store } from '@ngrx/store'

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private actionUrl: string

  constructor(@Optional() 
 @Inject(LOCAL_STORAGE) private localStorage: any, private http: HttpClient, private userStore: Store<UserState>) {}

  register(registerData) {
    return this.http.post(environment.apiUrl + 'register', registerData)
  }

  login(username: string, password: string) {
    ////console.log(username)
    return this.http
      .post<any>(environment.apiUrl + 'login', {
        email: username,
        password: password
      })
      .pipe(
        map(user => {
          // login successful if there's a jwt token in the response
          ////console.log(user.data.token)
          if (user && user.data.token) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            this.localStorage.setItem('currentUser', JSON.stringify(user.data))
            this.localStorage.setItem('user', JSON.stringify(user.data.user))
            this.localStorage.setItem('notify', JSON.stringify(user.data.user.notification_status))
            //keep the user data in store for global use
            this.userStore.dispatch(new AddAuthData(user.data.user))
          }

          return user
        })
      )
  }

  socialSignin(data) {
    return this.http.post<any>(environment.apiUrl + 'socialSignin', data).pipe(
      map(user => {
        // login successful if there's a jwt token in the response
        ////console.log(user.data.token)
        if (user && user.data.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          this.localStorage.setItem('currentUser', JSON.stringify(user.data))
          this.localStorage.setItem('user', JSON.stringify(user.data.user))
          this.userStore.dispatch(new AddAuthData(user.data.user))
        }

        return user
      })
    )
  }

  forgotPassword(data) {
    return this.http.get(
      environment.apiUrl + 'forgotPassword?email=' + data.email
    )
  }

  resetPassword(data) {
    return this.http.put(environment.apiUrl + 'resetPassword', data)
  }

  resendEmail(data) {
    return this.http.get(
      environment.apiUrl + 'resendVerifyEmail?email=' + data.email
    )
  }

  getProfileData(data) {
    return this.http.get(environment.apiUrl + 'getProfile?username=' + data)
  }

  verifyEmail(data) {
    let params: any
    if (data.status === undefined) {
      params = 'username=' + data.username + '&token=' + data.token
    } else {
      params =
        'username=' +
        data.username +
        '&token=' +
        data.token +
        '&status=' +
        data.status
    }
    return this.http
      .get<any>(environment.apiUrl + 'verifyEmail?' + params)
      .pipe(
        map(user => {
          // login successful if there's a jwt token in the response
          ////console.log(user.data.token)
          if (user && user.data.token) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            this.localStorage.setItem('currentUser', JSON.stringify(user.data))
            this.localStorage.setItem('user', JSON.stringify(user.data.user))
            this.userStore.dispatch(new AddAuthData(user.data.user))
          }
          return user
        })
      )

    // return this.http.get(
    //   environment.apiUrl +
    //     'verifyEmail?username=' +
    //     data.username +
    //     '&token=' +
    //     data.token
    // )
  }

  logout() {
    // remove user from local storage to log user out
    this.localStorage.removeItem('currentUser')
    this.localStorage.removeItem('user')
    this.localStorage.removeItem('notify')

  }

  getAuthStoreData() {
    return this.userStore.select(getAuthUser)
  }
  // login(loginData) {
  //   return this.http.post(environment.apiUrl + 'login', loginData)
  // }

  // public update<T>(id: number, itemToUpdate: any): Observable<T> {
  //   return this.http.put<T>(this.actionUrl + id, itemToUpdate)
  // }

  // public delete<T>(id: number): Observable<T> {
  //   return this.http.delete<T>(this.actionUrl + id)
  // }
  addEmailToSubscribe(data: any) {
    return this.http.post(environment.apiUrl + 'addSubToListMail', data)
  }
}
