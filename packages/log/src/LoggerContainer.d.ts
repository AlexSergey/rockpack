import React, { ComponentType, Component } from 'react';
import { Logger } from './logger';
import { LoggerInterface, Stack } from './types';
export declare const LoggerContext: React.Context<any>;
export declare const useLogger: () => Logger;
export interface BSODInterface {
    count: number;
    onClose: () => void;
    stackData: any;
}
interface LoggerContainerProps {
    active: boolean;
    bsodActive: boolean;
    sessionID: boolean | string | number;
    bsod?: ComponentType<BSODInterface>;
    limit: number;
    getCurrentDate?: () => string;
    onError?: (stack: Stack) => void;
    onPrepareStack?: (stack: Stack) => Stack;
    stdout?: (stack: Stack) => any;
}
interface LoggerContainerState {
    bsod: boolean;
}
export default class LoggerContainer extends Component<LoggerContainerProps, LoggerContainerState> {
    private __hasCriticalError;
    private readonly logger;
    private readonly stackCollection;
    private readonly stack;
    static defaultProps: {
        active: boolean;
        bsodActive: boolean;
        bsod: (props: any) => React.ReactPortal;
        sessionID: boolean;
        limit: number;
        getCurrentDate: () => string;
    };
    static state: {
        bsod: boolean;
    };
    constructor(props: any);
    componentDidMount(): void;
    componentWillUnmount(): void;
    handlerError: (errorMsg: any, url: string, lineNumber: number, lineCount: any, trace: any) => void;
    getLogger: () => LoggerInterface;
    _onMouseDown: (e: MouseEvent) => void;
    _onKeyDown: (e: KeyboardEvent) => void;
    _onKeyUp: () => void;
    _onMouseUp: () => void;
    getStackData: () => any;
    onError: (stackData: any) => void;
    closeBsod: () => void;
    unbindActions(): void;
    render(): JSX.Element;
}
export {};
