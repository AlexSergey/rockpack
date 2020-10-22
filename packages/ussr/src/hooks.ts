import { useContext, useState, useRef, useMemo, useEffect } from 'react';
import get from 'lodash/get';
import set from 'lodash/set';
import has from 'lodash/has';
import { isBackend } from './utils';
import { UssrContext } from './Ussr';
import { Effect } from './Effect';

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

  if (
    setImmediately &&
    has(initState, key) &&
    process.env.NODE_ENV !== 'production' &&
    typeof get(initState, key) !== 'undefined'
  ) {
    // eslint-disable-next-line no-console
    console.warn(`Key should be unique! The key "${key}" is already exist in InitialState`);
  }

  const appStateFragment: T = useMemo<T>(
    () => get(initState, key, defaultValue),
    [initState, key, defaultValue]
  );
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

export const useUssrEffect = (cb?: Function): void => {
  const initHook = useRef(true);
  const { isLoading, effectCollection, getId } = useContext(UssrContext);
  const loading = isLoading();
  const loaded = !loading;
  const isClient = !isBackend();
  const onLoadOnTheClient = isClient && loaded && initHook.current;
  const onLoadOnTheBackend = isBackend() && initHook.current;

  initHook.current = false;

  if (onLoadOnTheClient) {
    if (typeof cb === 'function') {
      cb();
    }
  } else if (onLoadOnTheBackend) {
    const effectId = getId();

    if (!effectCollection.getEffect(effectId)) {
      const effect = new Effect({ id: effectId });
      effectCollection.addEffect(effect);

      if (typeof cb === 'function') {
        const res = cb();

        if (res instanceof Promise && effect instanceof Effect) {
          effect.addCallback(res);
        }
      }
    }
  }
};
