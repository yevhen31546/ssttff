import { Injectable } from '@angular/core'
import { Subject } from 'rxjs/Subject'
import { Observable } from 'rxjs'
import { EventEmitter, Output } from '@angular/core'

@Injectable()
export class DataService {
  @Output() change: EventEmitter<any> = new EventEmitter()
  @Output() reload: EventEmitter<any> = new EventEmitter()
  @Output() alert: EventEmitter<any> = new EventEmitter()
  @Output() refresh: EventEmitter<any> = new EventEmitter()
  @Output() critic: EventEmitter<any> = new EventEmitter()
  @Output() share: EventEmitter<any> = new EventEmitter()
  @Output() like: EventEmitter<any> = new EventEmitter()
  @Output() likeData: EventEmitter<any> = new EventEmitter()
  @Output() scrollUpdation: EventEmitter<any> = new EventEmitter()
  @Output() searchData: EventEmitter<any> = new EventEmitter()
  @Output() removeCriticBtn: EventEmitter<any> = new EventEmitter()
  @Output() image: EventEmitter<any> = new EventEmitter()
  // private likeData = new Subject<any>();

  public data: any = {}

  setData(value: any) {
    this.data = value //it is publishing this value to all the subscribers that have already subscribed to this message
  }

  clearData() {
    this.data = {}
  }

  getData() {
    return this.data
  }

  changeData(data: any) {
    this.change.emit(data)
  }

  scrollUpdate() {
    this.scrollUpdation.emit()
  }

  passData(data) {
    this.reload.emit(data)
  }

  alertData(data) {
    this.alert.emit(data)
  }

  refreshData() {
    this.refresh.emit()
  }

  criticData(data) {
    this.critic.emit(data)
  }

  shareData(data: any) {
    this.share.emit(data)
  }

  passLike(data) {
    ////console.log(data, 'passlike')
    this.likeData.emit(data)
  }

  searchService(data) {
    this.searchData.emit(data)
  }

  //   getLikeData() { ////console.log("get")
  //     return this.likeData.asObservable();
  //   }

  //   passToLike(data) { ////console.log(data,"oass")
  //   this.likeData.next(data);
  // }

  //   getToLikeData() { ////console.log("get")
  //     return this.likeData.asObservable();
  //   }

  passurLike(data) {
    this.share.emit(data)
  }

  removeCritic(data) {
    this.removeCriticBtn.emit(data)
  }

  passImgageData(data) {
    this.image.emit(data)
  }
}
