import { Action } from 'redux';

export interface ActionWithPayload<T> extends Action {
  payload: T;
}
