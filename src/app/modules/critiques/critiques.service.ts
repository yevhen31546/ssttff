import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class CritiquesService {
  constructor(private http: HttpClient) {}

  getCritiqueData(data) {
    return this.http.get(environment.apiUrl + 'getCritiques', {
      params: data
    })
  }

  deleteCritique(data) {
    return this.http.delete(environment.apiUrl + 'deleteCritique/' + data.upload_id, {
      params: data
    });
  }

  getCritiqueDetails(data) {
    return this.http.get(environment.apiUrl + 'getCritiqueDetails', {
      params: data
    })
  }

  editCritique(data) {
    return this.http.put(environment.apiUrl + 'editCritique/' + data.critique_id, data);
  }

}
