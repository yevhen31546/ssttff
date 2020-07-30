
import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromActions from './user.actions';
import { UserState } from './user.states';

export const deafultState: UserState = {
  authUser: null
};

export function userReducer(state = deafultState, action): UserState {
  switch(action.type) {
    case 'ADD_AUTH_DATA': {
      return {authUser: action.payload}
    }
    case 'CLEAR_AUTH_DATA': {
      return {authUser: []}
    }
    default: {
      return state
    }
  }	
}

export const getUserState = createFeatureSelector<UserState>('userState');

export const getAuthUser = createSelector(
  getUserState, 
  (state: UserState) => state.authUser 
);