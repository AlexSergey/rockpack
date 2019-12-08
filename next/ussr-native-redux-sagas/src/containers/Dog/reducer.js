import { createReducer } from 'redux-act';
import { requestDog, requestDogSuccess, requestDogError } from './action';

export default createReducer({
    [requestDog]: () => ({
        url: '',
        loading: true,
        error: false,
    }),
    [requestDogSuccess]: (state, payload) => ({
        url: payload.url,
        loading: false,
        error: false,
    }),
    [requestDogError]: () => ({
        url: '',
        loading: false,
        error: true,
    })
}, {
    url: '',
    loading: false,
    error: false,
});
