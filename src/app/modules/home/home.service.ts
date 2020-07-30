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
export class HomeService {
  private actionUrl: string

  constructor(private http: HttpClient) {}

  getDailyFeedsData(data) {
    return this.http.get(environment.apiUrl + 'dailyFeeds', { params: data })
  }

  getStfAwardEntriesData(data) {
    return this.http.get(environment.apiUrl + 'getSTFAwardEntries', {
      params: data
    }).retryWhen(errors => {
      return errors.delay(1000).take(2)
    })
  }

  getAdminAwardEntriesData(data) {
    return this.http.get(environment.apiUrl + 'getAllEntries', {
      params: data
    }).retryWhen(errors => {
      return errors.delay(3000).take(2)
    });
  }

  getBannerData() {
    return this.http.get(environment.apiUrl + 'banner', {
    }).retryWhen(errors => {
      return errors.delay(3000).take(2)
    });
  }

  getRandomBannerData(){
    return this.http.get(environment.apiUrl + 'random-banner', {
    }).retryWhen(errors => {
      return errors.delay(3000).take(2)
    });
  }
}
