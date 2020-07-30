import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MiscService { // miscellaneous services
  constructor() {}
  deepCopy(o: any) {
    let output, v, key;
    output = Array.isArray(o) ? [] : {};
    for (key in o) {
      v = o[key];
      output[key] = (typeof v === 'object') ? this.deepCopy(v) : v;
    }
    return output;
  }
}
