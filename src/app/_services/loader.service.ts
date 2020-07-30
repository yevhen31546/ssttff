import { Subject } from 'rxjs/Subject'
import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'

@Injectable()
export class LoaderService {
  // public status: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  status$: Subject<any[]> = new BehaviorSubject<any[]>([])

  // public percentage: BehaviorSubject<number> = new BehaviorSubject<number>(0)

  constructor() {}
  display(percentage = 0, isPublish = false, text = ''): void {
    const isLoader = true
    this.status$.next([isLoader, percentage, isPublish, text]);  //console.log(this.status$,"testr status")
  }

  hide() {
    this.status$.next([false])
  }

  ngOnDestroy(): void {
   this.status$.unsubscribe();
  }
}
