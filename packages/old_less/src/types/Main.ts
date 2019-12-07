import { Saga, SagaAction, SagaWatchers } from './Saga';
import { Action } from './Action';
import { Reducer } from './Reducer';
import { ReactNode } from 'react';

export interface InnerProps {
    initComponent: boolean,
    _lessID: number,
    sagaActions?: SagaAction[],
    actions?: Action[],
    reducerName?: string
    renderErrorFallback?: boolean
}

export type ChildrenType = (props: InnerProps) => ReactNode;

export interface LessProp {
    reducerName: string
    reducer: Reducer
    getData?: (store: any, payload: any) => string;
    sagas?: Saga,
    sagaWatchers?: SagaWatchers
    initialState?: any
    children: ChildrenType
    shouldDetach?: boolean
}

export interface sharedStateInnerInterface {
    initComponent: boolean,
    init: boolean,
    detach: any
    sagaActions: any
    actions: any | any[]
    reducerName: any
    sagas: any
}
