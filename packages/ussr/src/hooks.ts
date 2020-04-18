import { useContext, useState } from 'react';
import get from 'lodash/get';
import set from 'lodash/set';
import has from 'lodash/has';
import { UssrContext } from './Ussr';

let first = true;

export const useUssrEffect = (path, defaultValue) => {
  const { initState, addEffect } = useContext(UssrContext);
  if (has(initState, path)) {
    console.warn(`${path} is already exist in InitialState`);
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
      if (first) {
        //isBackend && typeof cb === 'function' && cb();
        const effect = cb();
        first = false;
        const isEffect = typeof effect.then === 'function';
        if (isEffect) {
          addEffect(effect);
        }
      }
    }
  ];
};
