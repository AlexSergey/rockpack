import React, { useEffect, useRef, createElement, ReactNode } from 'react';
import { takeEvery } from 'redux-saga/effects';
import { useStore, connect } from 'react-redux';
import {AnyAction, Store} from 'redux';
import { isFunction, isObject, isUndefined } from 'valid-types';
import { Action, ActionsToReducer, ActionsToSagas } from '../types/Action';
import { SagaAction, SagaWatcherWrapper, SagaWrapper } from '../types/Saga';
import { ChildrenType, InnerProps, Less, sharedStateInnerInterface } from '../types/Main';

let uniqID = 0;

function createAction(actionName: string): () => Action {
    return function(...args: [object?, object?, object?]): Action {
        let [payload, service, metadata] = args;
        return {
            type: actionName,
            payload,
            service,
            metadata
        }
    }
}

function mapActionsToReducers(reducer: object) {
    return Object.keys(reducer)
        .reduce((inner: ActionsToReducer, actionName: string) => {
            inner[actionName] = createAction(actionName);
            return inner;
        }, {})
}

function createSagaAction(sagaName: string, actions: SagaAction[]): SagaWrapper {
    return function(...args: [object?, object?, object?]): SagaAction {
        let [payload, service, metadata] = args;

        return {
            type: sagaName,
            payload,
            service,
            metadata,
            actions
        }
    };
}

function mapActionsToSagas(sagas: object, actions: SagaAction[]) {
    return Object.keys(sagas)
        .reduce((inner: ActionsToSagas, sagaName: string): object => {
            const sagaAction: SagaWrapper = createSagaAction(sagaName, actions);
            inner[sagaName] = sagaAction;
            return inner;
        }, {});
}

function makeSagasWatchers(uniqID: number, sagaWatchers: () => {}, sagas: SagaAction[]) {
    return Object.keys(sagas).reduce((inner: any, sagaName: string) => {
        const sagaWatcherName: string = `${uniqID}saga_${sagaName}Watcher`;

        const saga: SagaWrapper = sagas[sagaName];
        const sagaWatcherWrapper: SagaWatcherWrapper = isObject(sagaWatchers) && isFunction(sagaWatchers[sagaName]) ?
            sagaWatchers[sagaName](sagaName, saga) :
            function* sagaWatcher() {
                yield takeEvery(sagaName, saga);
            };

        inner[sagaWatcherName] = sagaWatcherWrapper;

        return inner;
    }, {});
}

function createReducer(reducer: object, initialState: any) {
    const finalReducer = (state: any = initialState, action: Action) => {
        if (isFunction(reducer[action.type])) {
            return reducer[action.type](state, action.payload);
        }
        return state;
    };

    return finalReducer;
}
export interface StoreLess extends Store {
    detachReducers():any

}
/**
 * - Add detach = false
 * - get default reducer if it set
 * - remove uniqID
 * - reducer name is required
 * */
const Less = ({
        reducerName,
        reducer,
        getData,
        sagas,
        sagaWatchers,
        initialState,
        children,
        shouldDetach = false
    }: Less) => {
    const sharedState = useRef<sharedStateInnerInterface>({
        initComponent: true,
        init: true,
        actions: null,
        sagaActions: null,
        sagas: null,
        reducerName: reducerName || null,
        detach: null
    });

    if (isUndefined(reducerName)) {
        if (process.env.NODE_ENV !== 'production') {
            console.warn(`LESS|component ID ${uniqID} reported: reducerName is required argument!`);
            return children({
                initComponent: sharedState.current.initComponent,
                _lessID: uniqID,
                renderErrorFallback: true
            });
        }
    }

    if (isUndefined(reducer)) {
        if (process.env.NODE_ENV !== 'production') {
            console.warn(`LESS|component ID ${uniqID} reported: reducer is required argument!`);
            return children({
                initComponent: sharedState.current.initComponent,
                _lessID: uniqID,
                renderErrorFallback: true
            });
        }
    }

    useEffect(() => {
        sharedState.current.initComponent = false;
        return () => {
            if (process.env.NODE_ENV !== 'production') {
                console.log(`LESS|component ID ${uniqID} reported: I am unmounted. Good night!`);
            }
            if (shouldDetach) {
                sharedState.current.detach();
            }
            sharedState.current.detach = null;
            sharedState.current.actions = null;
            sharedState.current = null;
        }
    }, []);

    if (sharedState.current.init) {
        ++uniqID;
        sharedState.current.init = false;
        sharedState.current.actions = null;
        sharedState.current.sagaActions = null;
        sharedState.current.sagas = null;
        sharedState.current.reducerName = reducerName;
        sharedState.current.detach = null;

        let store = useStore<StoreLess<any, AnyAction>>();

        let actions, sagasWatchers;

        actions = mapActionsToReducers(reducer);
        sharedState.current.actions = actions;

        if (isObject(sagas)) {
            sharedState.current.sagaActions = mapActionsToSagas(sagas, actions);
            sagasWatchers = makeSagasWatchers(uniqID, sagaWatchers, sagas);
        }

        if (!store.getState()[reducerName]) {
            store.attachReducers({[reducerName]: createReducer(reducer, initialState)});

            if (isObject(sagasWatchers)) {
                Object.keys(sagasWatchers).forEach(sagaWatcherName => {
                    store.runSagas({[sagaWatcherName]: sagasWatchers[sagaWatcherName]});

                    if (process.env.NODE_ENV !== 'production') {
                        console.log(`LESS|component ID ${uniqID} reported: saga ${sagaWatcherName} is listening`);
                    }
                });
            }
        }

        sharedState.current.detach = () => {
            if (isObject(sagas)) {
                Object.keys(sagasWatchers).forEach(sagaWatcherName => {
                    store.cancelSagas([sagaWatcherName]);

                    if (process.env.NODE_ENV !== 'production') {
                        console.log(`LESS|component ID ${uniqID} reported: saga ${sagaWatcherName} canceled`);
                    }
                })
            }

            store.detachReducers([reducerName]);

            if (process.env.NODE_ENV !== 'production') {
                console.log(`LESS|component ID ${uniqID} reported: reducer ${reducerName} detached`);
            }
        }
    }

    let innerProps: InnerProps = {
        initComponent: sharedState.current.initComponent,
        _lessID: uniqID,
        sagaActions: sharedState.current.sagaActions,
        actions: sharedState.current.actions,
        reducerName: sharedState.current.reducerName
    };

    return createElement(connect(state => {
        if (isFunction(getData)) {
            return getData(state, sharedState.current.reducerName);
        }
        return state[sharedState.current.reducerName];
    })((props: object = {}): ReactNode => {
        return children({...props, ...innerProps});
    }));
};
Less.displayName = 'Less';

export default Less;
