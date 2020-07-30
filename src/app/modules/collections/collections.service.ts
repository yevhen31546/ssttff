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
export class CollectionsService {
  private actionUrl: string

  constructor(private http: HttpClient) {}

  addCollection(data) {
    return this.http.post(environment.apiUrl + 'createCollection', data)
    // return this.http.post(environment.apiUrl + 'createPhotoEssay', data)
  }

  getCollectionData(data) {
    return this.http.get(environment.apiUrl + 'getUploadsCollection', {
      params: data
    })
  }

  addUploadsCollectionData(data) {
    return this.http.put(environment.apiUrl + 'addCollection', data)
  }

  getUserCollections(data) {
    return this.http.get(environment.apiUrl + 'listUserCollections', {
      params: data
    }).retryWhen(errors => {
      return errors.delay(3000).take(2)
    });
  }

  editCollection(data) {
    return this.http.put(environment.apiUrl + 'editCollection', data)
    // return this.http.post(environment.apiUrl + 'createPhotoEssay', data)
  }

  deleteCollection(data) {
    return this.http.delete(environment.apiUrl + 'deleteCollection', {
      params: data
    })
  }

  getCollectionDetails(data) {
    return this.http.get(environment.apiUrl + 'getCollectionDetails', {
      params: data
    })
  }

  getCollectionImages(data) {
    return this.http.get(environment.apiUrl + 'listCollectionUploads', {
      params: data
    })
  }

  setCollectionCover(data) {
    return this.http.put(environment.apiUrl + 'updateCollectionCover', data)
  }

  setPhotoEssayCover(data) {
    return this.http.put(environment.apiUrl + 'updateEssayCover', data)
  }

  getSharedCollection(data) {
    return this.http.get(environment.apiUrl + 'shareCollections', {
      params: data
    });
  }

}
