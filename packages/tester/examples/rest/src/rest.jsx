import React, { isValidElement, useContext, createContext, useRef } from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const RestContext = createContext(false);

const useRest = () => useContext(RestContext);

const Rest = ({ children, options }) => {
  const ref = useRef(false);
  
  if (!ref.current) {
    const mergedProps = Object.assign({}, {
      timeout: 1000
    }, options);
    const instance = axios.create(mergedProps);
    ref.current = instance;
  }
  
  return (
    <RestContext.Provider value={ref.current}>
      {isValidElement(children) ? children : children(ref.current)}
    </RestContext.Provider>
  );
};

const MockRest = ({ children, mock }) => {
  const ref = useRef(false);
  const axios = useRest();
  
  if (!ref.current) {
    if (typeof mock === 'function') {
      const mocker = new MockAdapter(axios);
      mock(mocker);
      ref.current = true;
    }
  }
  return children;
};

export {
  useRest,
  MockRest,
  Rest
};
