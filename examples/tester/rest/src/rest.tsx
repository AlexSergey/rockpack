import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import type { ReactNode } from 'react';

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import React, { createContext, isValidElement, useContext, useState } from 'react';

type MockRestProps = {
  children: ReactNode;
  mock: (mocker: MockAdapter) => void;
};

type RestProps = {
  children: ((client: AxiosInstance) => ReactNode) | ReactNode;
  options?: AxiosRequestConfig;
};

const RestContext = createContext<AxiosInstance | false>(false);

const useRest = (): AxiosInstance | false => useContext(RestContext);

const Rest: React.FC<RestProps> = ({ children, options }) => {
  // The initializer runs once: one client for the lifetime of the provider.
  const [client] = useState(() => axios.create(Object.assign({}, { timeout: 1000 }, options)));

  return (
    <RestContext.Provider value={client}>
      {isValidElement(children) ? children : (children as (c: AxiosInstance) => ReactNode)(client)}
    </RestContext.Provider>
  );
};

const MockRest: React.FC<MockRestProps> = ({ children, mock }) => {
  const client = useRest() as AxiosInstance;

  // Installs the mocks once, before the children render and send their requests.
  useState(() => {
    if (typeof mock === 'function') {
      mock(new MockAdapter(client));
    }

    return true;
  });

  return <>{children}</>;
};

export { MockRest, Rest, useRest };
