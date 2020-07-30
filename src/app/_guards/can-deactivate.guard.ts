import { Injectable } from '@angular/core'
import {
  CanDeactivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router'
import { Observable } from 'rxjs/Observable'
import { CanComponentDeactivate } from './component-can-deactivate'

@Injectable()
export class CanDeactivateGuard
  implements CanDeactivate<CanComponentDeactivate> {
  canDeactivate(
    component: CanComponentDeactivate,
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    let url: string = state.url
    ////console.log('Url: ' + url)
    return component.canDeactivate ? component.canDeactivate() : true
  }
}
