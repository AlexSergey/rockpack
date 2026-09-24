import { sum } from './utils/sum';

export const total = (values: number[]): number => values.reduce(sum, 0);
