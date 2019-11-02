import React, { useState } from 'react';
import { onLoad } from '@rock/ussr/client';
import Less, { getSafetyData } from '@rock/less';
import { delay, put, takeLatest } from 'redux-saga/effects';

function HomePage() {
    let [state, setState] = useState(true);

    return <>
        {state && <Less
            reducerName="counter1"
            initialState={{ count: getSafetyData('REDUX_DATA.counter1.count', 0) }}
            reducer={{
                INCREMENT1: (state = {}, payload) => ({ ...state, count: payload })
            }}
            sagaWatchers={{
                INCREMENT_WITH_DELAY_100: (sagaName, saga) => {
                    return function* sagaWatcher() {
                        console.log('FIIIIIIIIIIIIIIIIIIIIIII')
                        yield takeLatest(sagaName, saga);
                    }
                }
            }}
            sagas={{
                INCREMENT_WITH_DELAY_1000: function* fetchPostsAsync({ payload, actions }) {
                    try {
                        yield delay(1000);
                        yield put(actions.INCREMENT1(payload));

                    } catch (error) {
                    }
                },
                INCREMENT_WITH_DELAY_100: function* fetchPostsAsync({ payload, actions }) {
                    try {
                        yield delay(100);
                        yield put(actions.INCREMENT1(payload));

                    } catch (error) {
                    }
                },
            }}
            getData={(state, reducerName) => {
                return {
                    count: state[reducerName] && state[reducerName].count
                }
            }}
        >
            {({ init, count, dispatch, sagaActions, renderErrorFallback }) => {
                if (renderErrorFallback) {
                    return <div>Render Error!</div>;
                }
                onLoad(() => dispatch(sagaActions.INCREMENT_WITH_DELAY_1000(++count)));
                return <div >
                    <button onClick={() => dispatch(sagaActions.INCREMENT_WITH_DELAY_1000(++count))}>
                        increment 1000
                    </button>
                    <button onClick={() => dispatch(sagaActions.INCREMENT_WITH_DELAY_100(++count))}>
                        increment 100
                    </button>
                    <h2>{count}</h2>
                </div>
            }}
        </Less>}
        <Less
            reducerName="counter2"
            initialState={{ count: 0 }}
            reducer={{
                INCREMENT2: (state = {}, payload) => ({ ...state, count: payload })
            }}
            saga={{}}
        >
            {({ actions, dispatch, count, renderErrorFallback }) => {
                if (renderErrorFallback) {
                    return <div>Render Error!</div>;
                }
                return <div >
                    <button onClick={() => dispatch(actions.INCREMENT2(++count))}>
                        increment
                    </button>
                    <h2>{count}</h2>
                </div>
            }}
        </Less>
        <button onClick={() => {
            setState(!state);

        }}>{state ? 'Unmount' : 'Mount'}</button>
    </>
}

export default HomePage;
