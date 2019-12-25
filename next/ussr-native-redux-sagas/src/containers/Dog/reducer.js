import { createReducer } from '@reduxjs/toolkit';
import { requestDog, requestDogSuccess, requestDogError } from './action';

export default createReducer({
    url: '',
    loading: false,
    error: false,
}, {
    [requestDog.type]: () => ({
        url: '',
        loading: true,
        error: false,
    }),
    [requestDogSuccess.type]: (state, { payload }) => ({
        url: payload.url,
        loading: false,
        error: false,
    }),
    [requestDogError.type]: () => ({
        url: '',
        loading: false,
        error: true,
    })
});
