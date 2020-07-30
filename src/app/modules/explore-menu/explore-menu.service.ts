import { environment } from '../../../environments/environment'
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
export class ExploreMenuService {
  private actionUrl: string

  constructor(private http: HttpClient) {}

  getMemberData(data) {
    return this.http.get(environment.apiUrl + 'listUsers', { params: data })
  }

  getPhotoEssayExploreData(data) {
    return this.http.get(environment.apiUrl + 'explorePhotoEssay', {
      params: data
    })
  }

  getCollectionExploreData(data) {
    return this.http.get(environment.apiUrl + 'exploreCollections', {
      params: data
    })
  }

  getCategoriesData(data) {
    return this.http.get(environment.apiUrl + 'exploreCategories', {
      params: data
    })
  }

  getCategoriesDetailsData(data) {
    return this.http.get(environment.apiUrl + 'categoryPhotos', {
      params: data
    })
  }

  getPhotosData(data) {
    return this.http.get(environment.apiUrl + 'explorePhotos', {
      params: data
    })
    .retryWhen(errors => {
      return errors.delay(3000).take(2)
    });
  }

  getEachCategoriesData(data) {
    return this.http.get(environment.apiUrl + 'getCategoryDetails', {
      params: data
    })
  }

  // getCategoriesData(data) {
  //   return this.http.get(environment.apiUrl + 'categoryPhotos', {
  //     params: data
  //   })
  // }
}
