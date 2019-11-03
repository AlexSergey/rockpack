import React, { useEffect, useRef, createElement, memo } from 'react';
import { takeEvery } from 'redux-saga/effects';
import { useStore, connect } from 'react-redux';
import { isFunction, isString, isObject, isUndefined } from 'valid-types';

let uniqID = 0;

interface sharedStateInnerInterface {
    init: boolean,
    detach: any
    sagaActions: any
    actions: any | any[]
    reducerName: any
    sagas: any
}

function createAction(actionName) {
    return function(...args) {
        let [payload, service, metadata] = args;
        return {
            type: actionName,
            payload,
            service,
            metadata
        }
    }
}
function mapActionsToReducers(reducer) {
    return Object.keys(reducer)
        .reduce((inner, actionName) => {
            inner[actionName] = createAction(actionName);
            return inner;
        }, {})
}

function createSagaAction(sagaName, actions) {
    return function(...args: any[]) {
        let [payload, service, metadata] = args;
        console.log(payload);
        return {
            type: sagaName,
            payload,
            service,
            metadata,
            actions
        }
    };
}

function mapActionsToSagas(sagas, actions) {
    return Object.keys(sagas)
        .reduce((inner, sagaName) => {
            inner[sagaName] = createSagaAction(sagaName, actions);
            return inner;
        }, {});
}

function makeSagasWatchers(uniqID, sagaWatchers, sagas) {
    return Object.keys(sagas).reduce((inner: any, sagaName) => {
        const sagaWatcherName = `${uniqID}saga_${sagaName}Watcher`;

        const saga = sagas[sagaName];
        inner[sagaWatcherName] = isObject(sagaWatchers) && isFunction(sagaWatchers[sagaName]) ?
            sagaWatchers[sagaName](sagaName, saga) :
            function* sagaWatcher() {
                yield takeEvery(sagaName, saga);
            }

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
const Less = ({ reducerName, reducer, getData, sagas, sagaWatchers, initialState, children, reduxMergeProps = null, reduxRef = {} }) => {
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
        //sharedState.current.detach();
        sharedState.current.detach = null;
        sharedState.current.actions = null;
        delete sharedState.current;
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
        let actions, sagasAction, sagasWatchers;

        actions = mapActionsToReducers(reducer);
        sharedState.current.actions = actions;

        if (isObject(sagas)) {
            sagasAction = mapActionsToSagas(sagas, actions);
            sagasWatchers = makeSagasWatchers(uniqID, sagaWatchers, sagas);
        }
        sharedState.current.sagaActions = sagasAction;

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

        /*

        if (isObject(sagas)) {
            sharedState.current.sagaActions = makeSagaActions(sagas, actions);
            sharedState.current.sagas = Object.keys(sagas)
                .reduce((inner, sagaName) => {
                    sharedState.current.sagaActions[sagaName] =
                    inner[sagaName] = {
                        saga: sagas[sagaName],
                        sagaWatcherName: `${uniqID}saga_${sagaName}Watcher`
                    };
                    return inner;
                }, {});

            Object.keys(sharedState.current.sagas).forEach(sagaName => {
                const { sagaWatcherName, saga } = sharedState.current.sagas[sagaName];

                sagaWrapper[sagaWatcherName] = isObject(sagaWatchers) && isFunction(sagaWatchers[sagaName]) ?
                    sagaWatchers[sagaName](sagaName, saga) :
                    function* sagaWatcher() {
                        yield takeEvery(sagaName, saga);
                    }
            });
        }
        console.log(store.getState()[reducerName], reducerName, sagaWrapper)
        if (!store.getState()[reducerName]) {
            const finalReducer = (state = initialState, action) => {
                if (isFunction(reducer[action.type])) {
                    return reducer[action.type](state, action.payload);
                }
                return state;
            };
            store.attachReducers({ [reducerName]: finalReducer });

            if (isObject(sagas) && Object.keys(sagaWrapper).length > 0) {
                Object.keys(sagaWrapper).forEach(sagaWatcherName => {
                    store.runSagas({[sagaWatcherName]: sagaWrapper[sagaWatcherName]});

                    if (process.env.NODE_ENV !== 'production') {
                        console.log(`LESS|component ID ${uniqID} reported: saga ${sagaWatcherName} is listening`);
                    }
                });
            }
        }

        if (process.env.NODE_ENV !== 'production') {
            console.log(`LESS|component ID ${uniqID} reported: reducer ${reducerName} attached`);
        }

        sharedState.current.detach = () => {
            if (isObject(sharedState.current.sagas)) {
                Object.keys(sharedState.current.sagas).forEach(sagaName => {
                    let { sagaWatcherName } = sharedState.current.sagas[sagaName];
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
        }*/
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
