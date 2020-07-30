import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable()
export class StripeUpdateService {
  @Output() change: EventEmitter<any> = new EventEmitter();
  private subject = new Subject<any>();

constructor(private http: HttpClient) {

}

changeData(data: any) {
  this.change.emit(data); ////console.log(data, this.change);
}

passStripe() {
  this.subject.next('data');
}

getStripe() { ////console.log('get stripe');
  return this.subject.asObservable();
}


updateCardExpire(data: any = []) {
  return this.http.put<any>(environment.apiUrl + 'updateCardExpirePopup', data);
}

}
