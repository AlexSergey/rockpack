import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import type { ReactNode } from 'react';

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import React, { createContext, isValidElement, useContext, useRef } from 'react';

interface MockRestProps {
  children: ReactNode;
  mock: (mocker: MockAdapter) => void;
}

interface RestProps {
  children: ((client: AxiosInstance) => ReactNode) | ReactNode;
  options?: AxiosRequestConfig;
}

const RestContext = createContext<AxiosInstance | false>(false);

const useRest = (): AxiosInstance | false => useContext(RestContext);

const Rest: React.FC<RestProps> = ({ children, options }) => {
  const ref = useRef<AxiosInstance | false>(false);

  if (!ref.current) {
    const mergedProps = Object.assign({}, { timeout: 1000 }, options);
    ref.current = axios.create(mergedProps);
  }

  return (
    <RestContext.Provider value={ref.current}>
      {isValidElement(children) ? children : (children as (c: AxiosInstance) => ReactNode)(ref.current)}
    </RestContext.Provider>
  );
};

const MockRest: React.FC<MockRestProps> = ({ children, mock }) => {
  const ref = useRef(false);
  const client = useRest() as AxiosInstance;

  if (!ref.current && typeof mock === 'function') {
    const mocker = new MockAdapter(client);
    mock(mocker);
    ref.current = true;
  }

  return <>{children}</>;
};

export { MockRest, Rest, useRest };
