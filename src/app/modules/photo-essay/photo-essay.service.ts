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
export class PhotoEssayService {
  private actionUrl: string

  constructor(private http: HttpClient) {}

  addPhotoEssay(data) {
    ////console.log(data)
    return this.http.post(environment.apiUrl + 'createPhotoEssay', data)
    // return this.http.post(environment.apiUrl + 'createPhotoEssay', data)
  }

  getPhotoEssayData(data) {
    return this.http.get(environment.apiUrl + 'getUploadsEssay', {
      params: data
    })
  }

  addUploadsEssayData(data) {
    return this.http.put(environment.apiUrl + 'addUploadsEssay', data)
  }

  getUserPhotoEssay(data) {
    return this.http.get(environment.apiUrl + 'listUserPhotoEssay', {
      params: data
    }).retryWhen(errors => {
      return errors.delay(3000).take(2)
    });
  }

  editPhotoEssay(data) {
    return this.http.put(environment.apiUrl + 'editPhotoEssay', data)
    // return this.http.post(environment.apiUrl + 'createPhotoEssay', data)
  }

  deletePhotoEssay(data) {
    return this.http.delete(environment.apiUrl + 'deletePhotoEssay', {
      params: data
    })
  }

  getPhotoEssayDetails(data) {
    return this.http.get(environment.apiUrl + 'getPhotoEssayDetails', {
      params: data
    })
  }

  getPhotoEssayImages(data) {
    return this.http.get(environment.apiUrl + 'listPhotoEssayUploads', {
      params: data
    })
  }

  setEssayCover(data) {
    return this.http.put(environment.apiUrl + 'updateEssayCover', data)
  }


  getSharedPhotoEssayImages(data) {
    return this.http.get(environment.apiUrl + 'sharePhotoEssay', {
      params: data
    })
  }
}
