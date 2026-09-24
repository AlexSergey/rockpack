import { sum } from './utils/sum.js';

export const total = (values: number[]): number => values.reduce(sum, 0);
