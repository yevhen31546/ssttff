import { Observable } from 'rxjs'
import { Subject } from 'rxjs/Subject'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { map } from 'rxjs/operators'

import { environment as env } from '../../../environments/environment'
import { ResponseContentType } from '@angular/http'

export type responseType = 'arraybuffer' | 'blob' | 'json' | 'text'
@Injectable({
  providedIn: 'root'
})
export class PhotoUploadService {
  baseUrl = env.apiUrl
  photoDetails$: Subject<any> = new Subject()
  subject: Subject<any> = new Subject()
  imageData: any
  public imageContent: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([])
  constructor(private http: HttpClient) {}

  getCategory(): Observable<any> {
    return this.http
      .get(this.baseUrl + 'getCategory')
      .pipe(map((res: any) => res))
  }

  getPhotoEssay(): Observable<any> {
    return this.http
      .get(this.baseUrl + 'getPhotoEssay')
      .pipe(map((res: any) => res))
  }

  searchTags(searchKey: string) {
    return this.http
      .get(this.baseUrl + 'searchTags', {
        params: { searchKey }
      })
      .pipe(map((res: any) => res))
  }

  getPhotoDetails(photoId: string) {
    return this.http
      .get(this.baseUrl + 'getPhotoDetails', {
        params: { upload_id: photoId }
      })
      .pipe(map((res: any) => res.uploadDetails))
  }

  updatePhotoDetails(photoDetails: any) {
    return this.http
      .post(this.baseUrl + 'updateUploadPhotoDetails', photoDetails)
      .pipe(map((res: any) => res))
  }

  dailyUploadLimitService() {
    return this.http
      .get(this.baseUrl + 'dailyUploadsLimit')
      .pipe(map((res: any) => res))
  }

  deletePhotoDetails(id) {
    return this.http
      .delete(this.baseUrl + 'deleteUploadPhoto' + '?upload_id=' + id)
      .pipe(map((res: any) => res))
  }

  getStfCategories() {
    return this.http
      .get(this.baseUrl + 'getAwardsCategory')
      .pipe(map((res: any) => res))
  }

  awardSubmission(data: any) {
    return this.http
      .post(this.baseUrl + 'awardSubmission', data)
      .pipe(map((res: any) => res))
  }

  getstfSumbissionCategories() {
    return this.http
      .get(this.baseUrl + 'getSubmissionPlans')
      .pipe(map((res: any) => res))
  }

  sendStfMessage(): void {
    this.subject.next({ data: 'update' })
    ////console.log(this.subject)
  }

  getStfMessage(): Observable<any> {
    ////console.log('nexttt')
    return this.subject.asObservable()
  }

  stfSubmissionPurchase(data: any) {
    return this.http
      .post(this.baseUrl + 'purchaseSubmission', data)
      .pipe(map((res: any) => res))
  }

  updateCard(data) {
    return this.http
      .put(this.baseUrl + 'updateCardDetails', data)
      .pipe(map((res: any) => res))
  }

  backGroupApi(uploadId: any) {
    // alert(uploadId)
    return this.http
      .get(this.baseUrl + 'updateImageAttributes?upload_id=' + uploadId)
      .pipe(map((res: any) => res))
  }

  getGlide(media: any) {
    return this.http.get(media + '--glide?q=' + env.GLIDE_SIZE)
  }

  getImage(imageUrl: string) {
    return this.http
      .get(imageUrl, { responseType: 'blob' })
      .map((res: any) => res)
  }
}
