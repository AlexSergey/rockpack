import React, { ComponentType, Component } from 'react';
import { BSODInterface } from './BSOD';
import { Stack, LoggerInterface } from './types';
interface LoggerContextInterface {
    getStackData: () => Stack;
    onError: (stack: Stack) => void;
    getLogger: () => LoggerInterface;
}
export declare const LoggerContext: React.Context<LoggerContextInterface>;
export declare const useLogger: () => LoggerInterface;
interface LoggerApiInterface {
    getStackData: () => Stack;
    triggerError: (stack: Stack) => void;
}
export declare const useLoggerApi: () => LoggerApiInterface;
interface LoggerContainerProps {
    logger?: LoggerInterface;
    active?: boolean;
    bsodActive?: boolean;
    sessionID?: boolean | string | number;
    bsod?: ComponentType<BSODInterface>;
    limit?: number;
    getCurrentDate?: () => string;
    onError?: (stack: Stack) => void;
    onPrepareStack?: (stack: Stack) => Stack;
    stdout?: (level: string, message: string, important?: boolean) => void;
}
interface LoggerContainerState {
    bsod: boolean;
}
export default class LoggerContainer extends Component<LoggerContainerProps, LoggerContainerState> {
    private __hasCriticalError;
    private readonly stack;
    private readonly stackCollection;
    static defaultProps: {
        logger: LoggerInterface;
        active: boolean;
        bsodActive: boolean;
        sessionID: boolean;
        limit: number;
        getCurrentDate: () => string;
    };
    constructor(props: any);
    componentDidMount(): void;
    componentWillUnmount(): void;
    handlerError: (errorMsg: string, url: string, lineNumber: number, lineCount: number, trace: Error) => void;
    getLogger: () => LoggerInterface;
    _onMouseDown: (e: MouseEvent) => void;
    _onKeyDown: (e: KeyboardEvent) => void;
    _onKeyUp: () => void;
    _onMouseUp: () => void;
    getStackData: () => Stack;
    onError: (stackData: Stack) => void;
    closeBsod: () => void;
    bindActions(): void;
    unbindActions(): void;
    render(): JSX.Element;
}
export {};
