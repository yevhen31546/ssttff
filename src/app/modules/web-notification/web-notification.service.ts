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
export class WebNotificationService {
  private actionUrl: string

  constructor(private http: HttpClient) {}

  getNotification(data) {
    return this.http.get(environment.apiUrl + 'get-notification-data', {
      params: data
    })
  }

  deleteNotificationData() {
    return this.http.delete(environment.apiUrl + 'delete-notification-data')
  }
}
