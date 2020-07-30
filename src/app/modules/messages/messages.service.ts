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
export class MessagesService {
  private actionUrl: string

  constructor(private http: HttpClient) {}

  authPusher(data) {
    return this.http.post(environment.apiUrl + 'auth', data)
  }

  sendMessageData(data) {
    return this.http.post(environment.apiUrl + 'sendMessage', data)
  }

  createThread(data) {
    return this.http.post(environment.apiUrl + 'createInbox', data)
  }

  loadInbox(data) {
    return this.http.post(environment.apiUrl + 'loadInbox', data)
  }

  loadMessageData(data) {
    return this.http.post(environment.apiUrl + 'loadMessages', data)
  }

  deleteMessage(data) {
    return this.http.delete(environment.apiUrl + 'deleteMessage', {
      params: data
    })
  }

  deleteInbox(data) {
    return this.http.delete(environment.apiUrl + 'deleteInbox', {
      params: data
    })
  }

  readInbox(data) {
    return this.http.get(environment.apiUrl + 'readInbox', {
      params: data
    })
  }


  getMessageFollowers(data){
    return this.http.get(environment.apiUrl + 'getNewMembers', {
      params: data
    })
  }
}
