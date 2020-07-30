import { Subject } from 'rxjs/Subject'
import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'

@Injectable()
export class LayoutLoaderService {
  // public status: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  status$: Subject<boolean> = new BehaviorSubject<boolean>(false)

  // public percentage: BehaviorSubject<number> = new BehaviorSubject<number>(0)

  constructor() {}
  display() { //console.log("layoutLoaderService")
    this.status$.next(true)
  }

  hide() {
    this.status$.next(false)
  }
}
