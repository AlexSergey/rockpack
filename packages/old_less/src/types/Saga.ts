import {Action} from "./Action";

export interface SagaAction {
    type: string
    payload?: object | undefined
    service?: object | undefined
    metadata?: object | undefined
    actions: Action[]
}

export interface Saga {
    [key: string]: (state: any, payload: any) => string;
}

export interface SagaWatchers {
    [key: string]: (state: any, payload: any) => string;
}

export type SagaWrapper = () => SagaAction;

export type SagaWatcherWrapper = () => void;
