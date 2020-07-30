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

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private actionUrl: string
  progress$: any
  progressObserver: any
  progress: number

  constructor(@Optional() 
 @Inject(LOCAL_STORAGE) private localStorage: any, private http: HttpClient) {}

  getProfileData(data: any = '') {
    return this.http.get(environment.apiUrl + 'getProfile?username=' + data)
  }

  editProfile(data) {
    return this.http.post<any>(environment.apiUrl + 'editProfile', data)
  }

  updatePassword(data) {
    return this.http.put<any>(environment.apiUrl + 'changePassword', data)
  }

  updateNotification(data) {
    return this.http.put<any>(environment.apiUrl + 'notificationSettings', data)
  }

  getNotificationData() {
    return this.http.get(environment.apiUrl + 'getNotificationSettings')
  }

  uploadProfilePhoto(data) {
    return this.http.post<any>(environment.apiUrl + 'uploadProfilePhoto', data)
  }

  deleteProfileImage() {
    return this.http.delete<any>(environment.apiUrl + 'deleteProfileImage')
  }

  deleteAccount() {
    return this.http.delete<any>(environment.apiUrl + 'deleteAccount')
  }

  getSubmissionCount() {
    return this.http.get(environment.apiUrl + 'dailyUploadsLimit')
  }

  getReceiptData(data) {
    return this.http.get(
      environment.apiUrl + 'viewOrderDetails?order_id=' + data.id
    )
  }

  logout() {
    // remove user from local storage to log user out
    this.localStorage.removeItem('currentUser')
    this.localStorage.removeItem('notify')
  }

  // login(username: string, password: string) {
  //   ////console.log(username)
  //   return this.http
  //     .post<any>(environment.apiUrl + 'login', {
  //       email: username,
  //       password: password
  //     })
  //     .pipe(
  //       map(user => {
  //         // login successful if there's a jwt token in the response
  //         ////console.log(user.data.token)
  //         if (user && user.data.token) {
  //           // store user details and jwt token in local storage to keep user logged in between page refreshes
  //           localStorage.setItem('currentUser', JSON.stringify(user.data))
  //         }

  //         return user
  //       })
  //     )
  // }

  getCardDetails() {
    return this.http.get(environment.apiUrl + 'getStripeCardDetails')
  }

  getOrderHistory() {
    return this.http.get(environment.apiUrl + 'getOrderHistory')
  }

  updateNotificationToken(data) {
    return this.http.post<any>(environment.apiUrl + 'add-token', data)
  }

  checkCouponCode(data) {
    return this.http.get(environment.apiUrl + 'checkVoucherCode', {params: data});
  }
}
