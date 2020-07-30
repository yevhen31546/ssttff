import { Injectable } from '@angular/core'
import { Router, NavigationStart } from '@angular/router'
import { Observable } from 'rxjs'
import { Subject } from 'rxjs/Subject'

@Injectable()
export class AlertService {
  private subject = new Subject<any>()
  private keepAfterNavigationChange = false

  constructor(private router: Router) {
    // clear alert message on route change
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (this.keepAfterNavigationChange) {
          // only keep for a single location change
          this.keepAfterNavigationChange = false
        } else {
          // clear alert
          this.subject.next()
        }
      }
    })
  }

  success(title: any, message: any, keepAfterNavigationChange = false) {
    this.keepAfterNavigationChange = keepAfterNavigationChange
    //console.log(title)
    this.subject.next({ type: 'success', title: title, text: message })
  }

  error(title: string, message: string, keepAfterNavigationChange = false) {
    this.keepAfterNavigationChange = keepAfterNavigationChange
    this.subject.next({ type: 'error', text: message, title: title })
  }

  warning(title: string, message: string, keepAfterNavigationChange = false) {
    this.keepAfterNavigationChange = keepAfterNavigationChange
    this.subject.next({ type: 'warning', text: message, title: title })
  }

  info(title: string, message: string, keepAfterNavigationChange = false) {
    this.keepAfterNavigationChange = keepAfterNavigationChange
    this.subject.next({ type: 'info', text: message, title: title })
  }

  notification(
    title: string,
    message: string,
    keepAfterNavigationChange = false
  ) {
    this.keepAfterNavigationChange = keepAfterNavigationChange
    this.subject.next({ type: 'notification', text: message, title: title })
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable()
  }

}
