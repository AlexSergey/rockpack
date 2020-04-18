import { SetStateAction } from 'react';
declare type useUssrEffectInterface = [unknown, SetStateAction<unknown>, (cb: () => unknown) => void];
export declare const useUssrEffect: (key: string, defaultValue: unknown) => useUssrEffectInterface;
export {};
