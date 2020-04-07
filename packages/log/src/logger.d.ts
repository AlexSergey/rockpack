declare class Logger {
    active: boolean;
    stdout: Function | undefined;
    private ignoreLogging;
    private stackCollection;
    constructor(props: any);
    log(message: string, important?: boolean): void;
    info(message: string, important?: boolean): void;
    debug(message: string, important?: boolean): void;
    warn(message: string, important?: boolean): void;
    error(message: string, important?: boolean): void;
    setUp(props: any): void;
    _handler(message: any, level: any, important: any): void;
}
declare function getCounter(): number;
export { Logger, getCounter };
