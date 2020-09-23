import React, { createContext, useEffect, isValidElement } from 'react';
import { clone, isBackend } from './utils';

export interface InitStateInterface {
  [key: string]: unknown;
}

enum Statuses {
  wait = 'wait',
  done = 'done',
}

interface Effect {
  id: string;
  status: Statuses;
  callback: Promise<unknown>;
}

interface StateInterface {
  [key: string]: unknown;
}

interface UssrContextInterface {
  isLoading: () => boolean;
  initState: InitStateInterface | {};
  addEffect: (effectId: string, effect: Promise<unknown>) => void;
  createEffect: (effectId: string) => () => void;
  hasEffect: (effectId: string) => boolean;
}

type ReturnCreateUssr = [(callbacks: Promise<unknown>[], effects: Effect[]) => Promise<StateInterface>,
  ({ children }: { children: JSX.Element }) => JSX.Element, () => Effect[], () => StateInterface];

export const UssrContext = createContext<UssrContextInterface>({} as UssrContextInterface);

type ExcludeFn = (...args: unknown[]) => JSX.Element;

export const ExcludeUssr = ({ children }: { children: JSX.Element | ExcludeFn }): JSX.Element => (
  isBackend() ?
    null :
    (isValidElement(children) ?
      children :

      (typeof children === 'function' ?
        children() :
        null)
    )
);

const OnComplete = ({ loading, onLoad }): JSX.Element => {
  useEffect(() => {
    if (!isBackend() && loading) {
      setTimeout(() => onLoad(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

interface OptionsInterface {
  onlyClient?: boolean;
}

const createUssr = (initState: InitStateInterface = {}, options: OptionsInterface = {}): ReturnCreateUssr => {
  const app = {
    loading: options.onlyClient ? false : !isBackend(),
    effects: new Map(),
    state: initState
  };

  const hasEffect = (effectId: string): boolean => Boolean(app.effects.get(effectId));

  const createEffect = (effectId: string): () => void => {
    let r = (): void => {};

    if (!hasEffect(effectId)) {
      app.effects.set(effectId, {
        id: effectId,
        status: 'wait',
        callback: ((): Promise<unknown> => new Promise(resolve => {
          r = resolve;
        }))()
      });
    }

    return r;
  };

  const getEffects = (): Effect[] => Array.from(app.effects.values());

  const getState = (): StateInterface => clone(app.state);

  const addEffect = (effectId: string, effect: Promise<unknown>): void => {
    if (!hasEffect(effectId)) {
      app.effects.set(effectId, {
        id: effectId,
        status: 'wait',
        callback: effect
      });
    }
  };

  const runEffects = (callbacks: Promise<unknown>[], effects: Effect[]): Promise<StateInterface> => {
    if (!Array.isArray(callbacks)) {
      return;
    }
    return (
      new Promise(resolve => {
        // eslint-disable-next-line promise/catch-or-return
        Promise.all(callbacks)
          .finally(() => {
            if (Array.isArray(effects)) {
              effects.forEach(({ id }) => {
                if (hasEffect(id)) {
                  app.effects.set(id, { id, status: 'done' });
                }
              });
            }
            resolve(clone(app.state));
          });
      })
    );
  };

  const onLoad = (state): void => {
    app.loading = state;
  };

  const isLoading = (): boolean => app.loading;

  return [runEffects, ({ children }): JSX.Element => (
    <UssrContext.Provider value={{
      isLoading,
      initState,
      addEffect,
      hasEffect,
      createEffect
    }}
    >
      {children}
      <OnComplete loading={app.loading} onLoad={onLoad} />
    </UssrContext.Provider>
  ), getEffects, getState];
};

export default createUssr;
