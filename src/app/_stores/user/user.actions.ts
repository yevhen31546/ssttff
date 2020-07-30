import { Action } from '@ngrx/store';

export class AddAuthData implements Action {
  readonly type='ADD_AUTH_DATA';
  constructor(public payload: any) {}
}

export class ClearAuthData implements Action {
  readonly type = 'CLEAR_AUTH_DATA';
}
