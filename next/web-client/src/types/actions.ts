import { Action } from 'redux';

export interface IActionWithPayload<T> extends Action {
  payload: T;
}
