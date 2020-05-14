import { isArray, isFunction } from 'valid-types';
import LimitedArray from 'limited-array';
import { getCurrentDate, clone } from './utils';
import { createCritical } from './errorHelpers';
import { Stack, PropsUtils, Action } from './types';

const getStackData = (stack: Stack, stackCollection: LimitedArray<Action>, props: PropsUtils): Stack => {
  const lang = globalThis.navigator && globalThis.navigator.languages && isArray(globalThis.navigator.languages) ?
    globalThis.navigator.languages[0] :
    '';
  const href = globalThis.location && globalThis.location.href ? globalThis.location.href : '';
  const actions = stackCollection.getData();

  stack.session.end = isFunction(props.getCurrentDate) ? props.getCurrentDate() : getCurrentDate();
  stack.actions = actions;
  stack.env.lang = lang;
  stack.env.href = href;

  if (isFunction(props.onPrepareStack)) {
    props.onPrepareStack(stack);
  }

  return clone(stack);
};

// eslint-disable-next-line max-len
const onCriticalError = (stack: Stack, stackCollection: LimitedArray<Action>, props: PropsUtils, trace: Error, lineNumber: number): Stack => {
  stackCollection.add(createCritical(trace, lineNumber));
  return getStackData(stack, stackCollection, props);
};

export { getStackData, onCriticalError };
