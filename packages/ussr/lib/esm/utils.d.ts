interface StateInterface {
    [key: string]: unknown;
}
export declare const isBackend: () => boolean;
export declare const clone: (state: StateInterface) => StateInterface;
export {};
