import React, { createContext, useState, useEffect } from 'react';
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
}

type ReturnCreateUssr = [() => Promise<StateInterface>, ({ children }: { children: JSX.Element }) => JSX.Element];

export const UssrContext = createContext<UssrContextInterface>({} as UssrContextInterface);

const OnComplete = ({ loading, onLoad }): JSX.Element => {
  useEffect(() => {
    if (!isBackend() && loading) {
      onLoad(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return null;
};

const createUssr = (initState: InitStateInterface): ReturnCreateUssr => {
  const app = {
    effects: [],
    state: initState
  };
  
  const addEffect = (effect: Promise<unknown>): void => {
    app.effects.push(effect);
  };
  
  const runEffects = (): Promise<StateInterface> => new Promise(resolve => (
    Promise.all(app.effects)
      .then(() => resolve(clone(app.state)))
  ));
  
  return [runEffects, ({ children }): JSX.Element => {
    const [loading, onLoad] = useState(!isBackend());
    
    return (
      <UssrContext.Provider value={{
        loading,
        initState,
        addEffect
      }}
      >
        {children}
        <OnComplete loading={loading} onLoad={onLoad} />
      </UssrContext.Provider>
    );
  }];
};

export default createUssr;
