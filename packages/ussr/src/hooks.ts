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

  if (
    setImmediately &&
    has(initState, key) &&
    process.env.NODE_ENV !== 'production' &&
    typeof get(initState, key) !== 'undefined'
  ) {
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

export const useWillMount = (cb: (resolver?: () => void) => Promise<unknown>): void => {
  const initHook = useRef(true);
  const { isLoading, createEffect, hasEffect } = useContext(UssrContext);
  const loading = isLoading();
  const loaded = !loading;
  const isClient = !isBackend();
  const onLoadOnTheClient = isClient && loaded && initHook.current && typeof cb === 'function';
  const onLoadOnTheBackend = isBackend() && typeof cb === 'function';

  initHook.current = false;

  if (onLoadOnTheClient) {
    cb();
  } else if (onLoadOnTheBackend) {
    const effectId = cb.toString();

    if (!hasEffect(effectId)) {
      const resolver = createEffect(effectId);
      const effect = cb(resolver);
      const isEffect = effect && typeof effect.then === 'function';
      if (isBackend() && isEffect) {
        // eslint-disable-next-line promise/catch-or-return
        effect.finally(resolver);
      }
    }
  }
};
