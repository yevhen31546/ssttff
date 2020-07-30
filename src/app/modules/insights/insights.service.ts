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
export class InsightsService {
  private actionUrl: string

  constructor(private http: HttpClient) {}

  getInsights(data) {
    return this.http.get(environment.apiUrl + 'insights', { params: data })
  }

  getInsightsGraph(data) {
    return this.http.get(environment.apiUrl + 'insightsGraph', { params: data })
  }
}
