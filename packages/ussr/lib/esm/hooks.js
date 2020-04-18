import { useContext, useState, useRef } from 'react';
import get from 'lodash/get';
import set from 'lodash/set';
import has from 'lodash/has';
import { isBackend } from './utils';
import { UssrContext } from './Ussr';
export const useUssrEffect = (key, defaultValue) => {
    const initHook = useRef(true);
    const { initState, addEffect, loading } = useContext(UssrContext);
    const loaded = !loading;
    const isClient = !isBackend();
    const setOnTheClient = isClient && loaded && initHook.current;
    if (setOnTheClient && has(initState, key) && process.env.NODE_ENV !== 'production') {
        /* eslint-disable no-console */
        console.error('key should be unique!');
        /* eslint-disable no-console */
        console.error(`The key "${key}" is already exist in InitialState`);
    }
    const appStateFragment = get(initState, key, defaultValue);
    const [state, _setState] = useState(appStateFragment);
    const setState = (componentState, skip) => {
        set(initState, key, componentState);
        if (!skip) {
            _setState(componentState);
        }
    };
    const willMount = (cb) => {
        const onLoadOnTheClient = isClient && initHook.current && typeof cb === 'function';
        const onLoadOnTheBackend = isBackend() && typeof cb === 'function';
        initHook.current = false;
        if (onLoadOnTheClient) {
            cb();
        }
        else if (onLoadOnTheBackend) {
            const effect = cb();
            const isEffect = typeof effect.then === 'function';
            if (isBackend() && isEffect) {
                addEffect(effect);
            }
        }
    };
    return [
        state,
        setState,
        willMount
    ];
};
