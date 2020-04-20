import React, { createContext, useState, useEffect, isValidElement } from 'react';
import { clone, isBackend } from './utils';

interface InitStateInterface {
  [key: string]: unknown;
}

interface StateInterface {
  [key: string]: unknown;
}

interface UssrContextInterface {
  loading: boolean;
  initState: InitStateInterface;
  addEffect: (effect: Promise<unknown>) => void;
  ignoreWillMount?: boolean;
}

type ReturnCreateUssr = [() => Promise<StateInterface>, ({ children }: { children: JSX.Element }) => JSX.Element];

export const UssrContext = createContext<UssrContextInterface>({} as UssrContextInterface);

type ExcludeFn = (...args: any[]) => JSX.Element;

export const ExcludeUssr = ({ children }: { children: JSX.Element | ExcludeFn }) => (
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

const createUssr = (initState: InitStateInterface, ignoreWillMount?: boolean): ReturnCreateUssr => {
  const app = {
    loading: !isBackend(),
    effects: [],
    state: initState
  };
  
  const addEffect = (effect: Promise<unknown>): void => {
    app.effects.push(effect);
  };
  
  const runEffects = (): Promise<StateInterface> => new Promise(resolve => (
    Promise.all(app.effects)
      .finally(() => resolve(clone(app.state)))
  ));
  
  const onLoad = (state) => {
    app.loading = state;
  }
  
  return [runEffects, ({ children }): JSX.Element => {
    return (
      <UssrContext.Provider value={{
        loading: app.loading,
        initState,
        addEffect,
        ignoreWillMount
      }}
      >
        {children}
        <OnComplete loading={app.loading} onLoad={onLoad} />
      </UssrContext.Provider>
    );
  }];
};

export default createUssr;
