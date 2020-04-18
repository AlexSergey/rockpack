import React, { createContext, useState, useEffect } from 'react';
import { clone, isBackend } from './utils';

export const UssrContext = createContext<any>({});

const OnComplete = ({ init, setSkipState }) => {
  useEffect(() => {
    if (!isBackend() && init) {
      setSkipState(false);
    }
  }, []);
  
  return null;
}

const createUssr = (initState) => {
  const app = {
    effects: [],
    state: initState
  };
  
  const addEffect = (effect) => {
    app.effects.push(effect);
  };
  
  const runEffects = () => new Promise(resolve => (
    Promise.all(app.effects)
      .then(() => {
        resolve(clone(app.state))
      })
  ));
  
  return [runEffects, ({ children }) => {
    const [skipEffectsOnClient, setSkipState] = useState(!isBackend());
    
    return (
      <UssrContext.Provider value={{
        skipEffectsOnClient,
        initState,
        addEffect
      }}
      >
        {children}
        <OnComplete init={skipEffectsOnClient} setSkipState={setSkipState} />
      </UssrContext.Provider>
    )
  }];
};

export default createUssr;
