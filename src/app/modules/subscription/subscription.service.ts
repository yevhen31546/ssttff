import { environment } from '../../../environments/environment'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private actionUrl: string

  constructor(private http: HttpClient) {}

  upgradeStripePayment(data) {
    return this.http.post(environment.apiUrl + 'planSubscription', data)
  }

  downgradeStripePayment(data) {
    return this.http.post(environment.apiUrl + 'downgradeSubscription', data)
  }

  submissionPayment(data) {
    return this.http.post(environment.apiUrl + 'purchaseSubmission', data)
  }

  getProfileData(data: any) {
    return this.http.get(environment.apiUrl + 'getProfile?username=' + data)
  }
}
