import LimitedArray from 'limited-array';
import { Stack, PropsUtils, Action } from './types';
declare function getStackData(stack: Stack, stackCollection: LimitedArray<Action>, props: PropsUtils): any;
declare function onCriticalError(stack: Stack, stackCollection: LimitedArray<any>, props: PropsUtils, trace: any, lineNumber: any): any;
export { getStackData, onCriticalError };
