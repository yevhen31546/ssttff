import { HostListener } from '@angular/core'
import { Observable } from 'rxjs'

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean
}
