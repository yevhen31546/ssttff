import { LOCAL_STORAGE } from '@ng-toolkit/universal';
import { environment } from '../../../environments/environment'
import {  Inject,Optional } from '@angular/core';
import {
  HttpClient,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private actionUrl: string

  constructor(@Optional() 
 @Inject(LOCAL_STORAGE) private localStorage: any, private http: HttpClient) {}

  getProfileData(data) {
    return this.http.get(environment.apiUrl + 'getProfile', { params: data })
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
          }
          return user
        })
      )
  }

  getUserUploadPhotos(data) {
    return this.http.get(environment.apiUrl + 'getUsersUploads', {
      params: data
    }).retryWhen(errors => {
      return errors.delay(3000).take(2)
    });
  }

  getUserImageData(data) {
    return this.http.get(
      environment.apiUrl + 'getUploadPhoto?upload_id=' + data.id
    )
  }

  logout(data) {
    // localStorage.removeItem('currentUser')
    // localStorage.removeItem('user');
    return this.http.get(environment.apiUrl + 'logout', { params: data })

    // remove user from local storage to log user out
  }

  addCritic(data: any) {
    return this.http.post(environment.apiUrl + 'addCritique', data)
  }

  getPeople(term: String = '') {
    return this.http.get(
      environment.apiUrl + 'searchUsername?searchKey=' + term
    )
  }

  getCritics(upload_id: any, user_id: any = '') {
    return this.http.get(
      environment.apiUrl +
        'getCritiqueDetails?upload_id=' +
        upload_id +
        '&user_id=' +
        user_id
    )
  }

  updateLikeStatus(data) {
    return this.http.put(environment.apiUrl + 'likeUploadPhoto', data)
  }

  deletePhotoDetails(id) {
    return this.http
      .delete(environment.apiUrl + 'deleteUploadPhoto' + '?upload_id=' + id)
      .pipe(map((res: any) => res))
  }

  listFriends(data) {
    return this.http
      .get(environment.apiUrl + 'getFollowingsFollowers', { params: data })
      .pipe(map((res: any) => res))
  }

  followUser(data) {
    return this.http
      .post(environment.apiUrl + 'followUser', data)
      .pipe(map((res: any) => res))
  }

  addPhotoEssay(data) {
    ////console.log(data)
    return this.http.post(environment.apiUrl + 'createPhotoEssay', data)
  }

  getComments(data: any) {
    return this.http.get(
      environment.apiUrl +
        'listComments?upload_id=' +
        data.upload_id +
        '&per_page=' +
        data.per_page
    )
  }

  addComment(data: any) {
    return this.http
      .put(environment.apiUrl + 'commentUploadPhoto', data)
      .retryWhen(errors => {
        return errors.delay(1000).take(2)
      })
  }

  deleteComment(id: any) {
    return this.http
      .delete(environment.apiUrl + 'deleteComment' + '?comment_id=' + id)
      .pipe(map((res: any) => res))
  }

  /** Get profile data from share ID */
  getProfile(shareId) {
    return this.http.get(environment.apiUrl + 'getPhoto?id=' + shareId)
  }

  getHistory(data) {
    return this.http.get(environment.apiUrl + 'getAwardHistory', {
      params: data
    })
  }

  updatePhotoViewsData(data) {
    return this.http.get(environment.apiUrl + 'updatePhotoViews', {
      params: data
    })
  }

  searchUserData(data) {
    return this.http.get(environment.apiUrl + 'search', {
      params: data
    })
  }

  getReportData(data) {
    return this.http.get(environment.apiUrl + 'getReportContent', {
      params: data
    })
  }

  getCardsData() {
    return this.http.get(environment.apiUrl + 'getCards')
  }

  addReport(data) {
    return this.http.post(environment.apiUrl + 'addReport', data)
  }

  addSubscription(data) {
    return this.http.post(environment.apiUrl + 'addReport', data)
  }
}
