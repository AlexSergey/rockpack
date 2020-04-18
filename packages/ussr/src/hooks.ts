import { useContext, useState, useRef } from 'react';
import get from 'lodash/get';
import set from 'lodash/set';
import has from 'lodash/has';
import { isBackend } from './utils';
import { UssrContext } from './Ussr';

export const useUssrEffect = (path, defaultValue) => {
  const initHook = useRef(true);
  const { initState, addEffect, skipEffectsOnClient } = useContext(UssrContext);
  
  const isClient = !isBackend();
  const immediatelyRunOnTheClient = skipEffectsOnClient;
  const setOnTheClientAfterBackendRender = isClient && !skipEffectsOnClient && initHook.current;
  
  if (setOnTheClientAfterBackendRender) {
    if (has(initState, path)) {
      console.warn(`${path} is already exist in InitialState`);
    }
  }
  const _state = get(initState, path, defaultValue);
  const [state, setState] = useState(_state);
  
  const _setState = (s, skip) => {
    set(initState, path, s);
    
    if (!skip) {
      setState(s);
    }
  };
  
  return [
    state,
    _setState,
    (cb) => {
      if (immediatelyRunOnTheClient) {
        return false;
      }
      
      if (isClient && initHook.current && typeof cb === 'function') {
        cb();
      }
      
      if (isBackend() && typeof cb === 'function') {
        const effect = cb();
        const isEffect = typeof effect.then === 'function';
        if (isBackend() && isEffect) {
          addEffect(effect);
        }
      }
      
      initHook.current = false;
    }
  ]
};
