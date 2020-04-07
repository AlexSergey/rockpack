import { Stack } from './types';

export const getCurrentDate = (): string => new Date().toLocaleString();

export const clone = (obj: Stack): Stack => JSON.parse(JSON.stringify(obj));
