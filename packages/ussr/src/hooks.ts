import { useContext, useState, useRef, useMemo, useEffect } from 'react';
import get from 'lodash/get';
import set from 'lodash/set';
import has from 'lodash/has';
import { isBackend } from './utils';
import { UssrContext } from './Ussr';

interface UssrState<T> {
  setState(componentState: T, skip?: boolean): void;
}

export const useUssrState = <T>(key: string, defaultValue: T): [T, (componentState: T, skip?: boolean) => void] => {
  const hook = useRef<false | UssrState<T>>(false);
  const { isLoading, initState } = useContext(UssrContext);
  const loading = isLoading();
  const loaded = !loading;
  const isClient = !isBackend();
  const hookIsNotReady = hook.current === false;
  const setImmediately = isClient && loaded && hookIsNotReady;

  if (setImmediately && has(initState, key) && process.env.NODE_ENV !== 'production') {
    if (typeof get(initState, key) !== 'undefined') {
      /* eslint-disable no-console */
      console.warn(`Key should be unique! The key "${key}" is already exist in InitialState`);
    }
  }

  const appStateFragment: T = useMemo<T>(() => {
    const res: T = get(initState, key, defaultValue);
    return res;
  }, [initState, key, defaultValue]);
  const [state, setState] = useState<T>(appStateFragment);

  useEffect(() => (): void => {
    // Clear Global state when component was unmounted
    set(initState, key, undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!hook.current) {
    hook.current = {
      setState: (componentState: T, skip?: boolean): void => {
        const s = typeof componentState === 'function' ? componentState(state) : componentState;
        set(initState, key, s);

        if (!skip) {
          setState(s);
        }
      }
    };
  }

  return [state, hook.current.setState];
};

export const useWillMount = (cb: () => Promise<unknown>): void => {
  const initHook = useRef(true);
  const { addEffect, isLoading, ignoreWillMount } = useContext(UssrContext);
  const loading = isLoading();
  const loaded = !loading;
  const isClient = !isBackend();
  const onLoadOnTheClient = isClient && loaded && initHook.current && typeof cb === 'function';
  const onLoadOnTheBackend = isBackend() && typeof cb === 'function';

  if (ignoreWillMount) {
    return;
  }

  initHook.current = false;

  if (onLoadOnTheClient) {
    cb();
  } else if (onLoadOnTheBackend) {
    const effect = cb();
    const isEffect = typeof effect.then === 'function';
    if (isBackend() && isEffect) {
      addEffect(effect);
    }
  }
};

export const useApplyEffects = (cb: () => Promise<unknown> | Promise<unknown>[]): void => {
  const initHook = useRef(true);
  const { addEffect } = useContext(UssrContext);

  if (!initHook.current) {
    return;
  }

  const onLoadOnTheBackend = isBackend() && typeof cb === 'function';
  if (onLoadOnTheBackend) {
    const effect = cb();
    if (Array.isArray(effect)) {
      effect.forEach((e) => {
        const isEffect = typeof e.then === 'function';

        if (isEffect) {
          addEffect(e);
        }
      });
    } else {
      const isEffect = typeof effect.then === 'function';

      if (isEffect) {
        addEffect(effect);
      }
    }
  }

  initHook.current = false;
};
