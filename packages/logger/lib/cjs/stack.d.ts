import LimitedArray from 'limited-array';
import { Stack, PropsUtils, Action } from './types';
declare const getStackData: (stack: Stack, stackCollection: LimitedArray<Action>, props: PropsUtils) => Stack;
declare const onCriticalError: (stack: Stack, stackCollection: LimitedArray<Action>, props: PropsUtils, trace: Error, lineNumber: number) => Stack;
export { getStackData, onCriticalError };
