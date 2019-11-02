import React, { useEffect, useRef, createElement } from 'react';
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
        reducerName: reducerName || `reducer${uniqID}`,
        detach: null
    });
    console.log(sharedState);
    if (isUndefined(reducer)) {
        if (process.env.NODE_ENV !== 'production') {
            console.warn(`LESS|component ID ${uniqID} reported: reducer is required argument!`);
            return children({
                renderErrorFallback: true
            });
        }
    }

    if (!isObject(reducer)) {
        if (process.env.NODE_ENV !== 'production') {
            console.warn(`LESS|component ID ${uniqID} reported: reducer must be object!`);
            return children({
                renderErrorFallback: true
            });
        }
    }
    useEffect(() => () => {
        if (process.env.NODE_ENV !== 'production') {
            console.log(`LESS|component ID ${uniqID} reported: I am unmounted. Good night!`);
        }
        sharedState.current.detach();
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
        sharedState.current.reducerName = reducerName || `reducer${uniqID}`;
        sharedState.current.detach = null;
        /*sharedState.current = {
            actions: null,
            sagaActions: null,
            sagas: null,
            reducerName: reducerName || `reducer${uniqID}`,
            detach: null
        };*/

        let store = useStore();

        sharedState.current.actions = Object.keys(reducer)
            .reduce((inner, actionName) => {
                inner[actionName] = function(...args) {
                    let [payload, service, metadata] = args;
                    return {
                        type: actionName,
                        payload,
                        service,
                        metadata
                    }
                };
                return inner;
            }, {});

        if (isObject(sagas)) {
            sharedState.current.sagaActions = {};
            sharedState.current.sagas = Object.keys(sagas)
                .reduce((inner, sagaName) => {
                    sharedState.current.sagaActions[sagaName] = function(...args) {
                        let [payload, service, metadata] = args;
                        return {
                            type: sagaName,
                            payload,
                            service,
                            metadata,
                            actions: sharedState.current.actions
                        }
                    };
                    inner[sagaName] = {
                        saga: sagas[sagaName],
                        sagaWatcherName: `${uniqID}saga_${sagaName}Watcher`
                    };
                    return inner;
                }, {});

            let sagaWrapper = {};

            Object.keys(sharedState.current.sagas).forEach(sagaName => {
                const { sagaWatcherName, saga } = sharedState.current.sagas[sagaName];

                sagaWrapper[sagaWatcherName] = isObject(sagaWatchers) && isFunction(sagaWatchers[sagaName]) ?
                    sagaWatchers[sagaName](sagaName, saga) :
                    function* sagaWatcher() {
                        yield takeEvery(sagaName, saga);
                    }
            });
            Object.keys(sagaWrapper).forEach(sagaWatcherName => {
                store.runSagas({ [sagaWatcherName]: sagaWrapper[sagaWatcherName] });

                if (process.env.NODE_ENV !== 'production') {
                    console.log(`LESS|component ID ${uniqID} reported: saga ${sagaWatcherName} is listening`);
                }
            });

            /*
            //sharedState.current.sagaAction = function(payload) {
            //    return {
            //        type: sharedState.current.sagaActionName,
            //        payload,
            //        actions: sharedState.current.actions
            //    }
            //};

            sharedState.current.sagaWatcherName = `sagaWatcher${uniqID}`;
            let sagaWatcherName = sharedState.current.sagaWatcherName;

            let sagaWrapper = {
                [sagaWatcherName]: isFunction(sagaWatcher) ? () => {
                    return sagaWatcher(saga);
                } : (isFunction(takeEvery) ? function* sagaWatcher() {
                    yield takeEvery(sharedState.current.sagaActionName, saga);
                } : false)
            };
            if (isFunction(sagaWrapper[sagaWatcherName])) {
                store.runSagas({ [sagaWatcherName]: sagaWrapper[sagaWatcherName] });

                if (process.env.NODE_ENV !== 'production') {
                    console.log(`LESS|component ID ${uniqID} reported: saga ${sagaWatcherName} is listening`);
                }
            }*/
        }

        const finalReducer = (state = initialState, action) => {
            if (isFunction(reducer[action.type])) {
                return reducer[action.type](state, action.payload);
            }
            return state;
        };
        store.attachReducers({ [reducerName]: finalReducer });

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
