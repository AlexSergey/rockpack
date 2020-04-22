import React, { createContext, useEffect, isValidElement } from 'react';
import { clone, isBackend } from './utils';

interface InitStateInterface {
  [key: string]: unknown;
}

interface StateInterface {
  [key: string]: unknown;
}

interface UssrContextInterface {
  isLoading: () => boolean;
  initState: InitStateInterface;
  addEffect: (effect: Promise<unknown>) => void;
  ignoreWillMount?: boolean;
}

type ReturnCreateUssr = [() => Promise<StateInterface>, ({ children }: { children: JSX.Element }) => JSX.Element];

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
      onLoad(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

interface OptionsInterface {
  ignoreWillMount?: boolean;
  onlyClient?: boolean;
}

const createUssr = (initState: InitStateInterface, options: OptionsInterface = {
  ignoreWillMount: false
}): ReturnCreateUssr => {
  const app = {
    loading: options.onlyClient ? false : !isBackend(),
    effects: [],
    state: initState
  };

  const addEffect = (effect: Promise<unknown>): void => {
    app.effects.push(effect);
  };

  const runEffects = (): Promise<StateInterface> => (
    new Promise(resolve => (
      Promise.all(app.effects)
        .finally(() => (
          resolve(clone(app.state))
        ))
    ))
  );

  const onLoad = (state): void => {
    app.loading = state;
  };

  const isLoading = (): boolean => app.loading;

  return [runEffects, ({ children }): JSX.Element => (
    <UssrContext.Provider value={{
      isLoading,
      initState,
      addEffect,
      ignoreWillMount: options.ignoreWillMount || false
    }}
    >
      {children}
      <OnComplete loading={app.loading} onLoad={onLoad} />
    </UssrContext.Provider>
  )];
};

export default createUssr;
