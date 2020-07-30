import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class StfAwardEntriesService {
  constructor(private http: HttpClient) {}

  getStfAwardData(data) {
    return this.http.get(environment.apiUrl + 'getUserSTFEntries', {
      params: data
    }).retryWhen(errors => {
      return errors.delay(1000).take(2)
    })
  }
  addWinnerData(data) {
    return this.http.put(environment.apiUrl + 'addToWinner', data)
  }
  addShortlistData(data) {
    return this.http.put(environment.apiUrl + 'addToShortlist',data)
  }
  addFinalistData(data) {
    return this.http.put(environment.apiUrl + 'addToFinalist',data)
  }
}
