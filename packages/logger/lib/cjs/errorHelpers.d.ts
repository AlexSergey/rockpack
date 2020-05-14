import { LoggerTypes, CriticalError } from './types';
export declare const mixUrl: (props: CriticalError) => CriticalError;
export declare const serializeError: (stack: Error, lineNumber: number) => CriticalError;
export declare const isCritical: (type: string) => boolean;
export declare const getCritical: () => string;
export declare const createCritical: (trace: Error, lineNumber: number) => {
    critical: CriticalError;
};
