import LimitedArray from 'limited-array';
import { Action, LoggerInterface } from './types';
/**
 * Types:
 * log
 * info
 * warn
 * error
 * debug
 * */
declare class Logger {
    active: boolean;
    stdout?: (level: string, message: string, important: boolean) => void;
    private ignoreLogging;
    private stackCollection;
    private _count;
    constructor(props?: any);
    log(message: string, important?: boolean): void;
    info(message: string, important?: boolean): void;
    debug(message: string, important?: boolean): void;
    warn(message: string, important?: boolean): void;
    error(message: string, important?: boolean): void;
    setUp(props: {
        active?: boolean;
        stdout?: (level: string, message: string, important?: boolean) => void;
        stackCollection?: LimitedArray<Action>;
    }): void;
    _handler(message: string, level: string, important: boolean): void;
    getCounter: () => number;
}
export declare const createLogger: () => LoggerInterface;
export { Logger };
