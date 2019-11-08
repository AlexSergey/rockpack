import React, { useEffect, useRef, createElement } from 'react';
import { takeEvery } from 'redux-saga/effects';
import { useStore, connect } from 'react-redux';
import { isFunction, isString, isObject, isUndefined } from 'valid-types';

interface Action {
    type: string
    payload?: object | undefined
    service?: object | undefined
    metadata?: object | undefined
}
interface SagaAction {
    type: string
    payload?: object | undefined
    service?: object | undefined
    metadata?: object | undefined
    actions: Action[]
}

interface ActionsToReducer {
    [actionName: string]: object
}

interface ActionsToSagas {
    [sagaName: string]: object
}

let uniqID = 0;

interface sharedStateInnerInterface {
    init: boolean,
    detach: any
    sagaActions: any
    actions: any | any[]
    reducerName: any
    sagas: any
}

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

function createSagaAction(sagaName: string, actions: SagaAction[]): () => SagaAction {
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
        .reduce((inner: ActionsToSagas, sagaName: string) => {
            inner[sagaName] = createSagaAction(sagaName, actions);
            return inner;
        }, {});
}

function makeSagasWatchers(uniqID: number, sagaWatchers, sagas) {
    return Object.keys(sagas).reduce((inner: any, sagaName) => {
        const sagaWatcherName = `${uniqID}saga_${sagaName}Watcher`;

        const saga = sagas[sagaName];
        inner[sagaWatcherName] = isObject(sagaWatchers) && isFunction(sagaWatchers[sagaName]) ?
            sagaWatchers[sagaName](sagaName, saga) :
            function* sagaWatcher() {
                yield takeEvery(sagaName, saga);
            };

        return inner;
    }, {});
}

function createReducer(reducer, initialState) {
    const finalReducer = (state = initialState, action) => {
        if (isFunction(reducer[action.type])) {
            return reducer[action.type](state, action.payload);
        }
        return state;
    };

    return finalReducer;
}
/**
 * - Add detach = false
 * - get default reducer if it set
 * - remove uniqID
 * - reducer name is required
 * */
const Less = ({ reducerName, reducer, getData, sagas, sagaWatchers, initialState, children, shouldDetach = false, reduxMergeProps = null, reduxRef = {} }) => {
    const sharedState = useRef<sharedStateInnerInterface>({
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
                renderErrorFallback: true
            });
        }
    }

    if (isUndefined(reducer)) {
        if (process.env.NODE_ENV !== 'production') {
            console.warn(`LESS|component ID ${uniqID} reported: reducer is required argument!`);
            return children({
                renderErrorFallback: true
            });
        }
    }

    useEffect(() => () => {
        if (process.env.NODE_ENV !== 'production') {
            console.log(`LESS|component ID ${uniqID} reported: I am unmounted. Good night!`);
        }
        if (shouldDetach) {
            sharedState.current.detach();
        }
        sharedState.current.detach = null;
        sharedState.current.actions = null;
        sharedState.current = null;
    }, []);

    if (sharedState.current.init) {
        ++uniqID;
        sharedState.current.init = false;
        sharedState.current.actions = null;
        sharedState.current.sagaActions = null;
        sharedState.current.sagas = null;
        sharedState.current.reducerName = reducerName;
        sharedState.current.detach = null;

        let store = useStore();

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

    return createElement(connect(state => {
        if (isFunction(getData)) {
            return getData(state, sharedState.current.reducerName);
        }
        return state[sharedState.current.reducerName];
    }, null, reduxMergeProps, reduxRef)((props) => {
        return children({...props, ...{
            _lessID: uniqID,
            sagaActions: sharedState.current.sagaActions,
            actions: sharedState.current.actions,
            reducerName: sharedState.current.reducerName
        }});
    }));
};
Less.displayName = 'Less';

export default Less;
