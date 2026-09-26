import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import type { ReactNode } from 'react';

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import React, { createContext, isValidElement, useContext, useState } from 'react';

type GraphqlClient = {
  axios: AxiosInstance;
  mutation: (
    mutation: GraphqlQuery,
    variables?: Record<string, unknown>,
    config?: AxiosRequestConfig,
  ) => Promise<{ data: unknown }>;
  query: (
    query: GraphqlQuery,
    variables?: Record<string, unknown>,
    config?: AxiosRequestConfig,
  ) => Promise<{ data: unknown }>;
};

type GraphqlProps = {
  children: ((client: GraphqlClient) => ReactNode) | ReactNode;
  options?: AxiosRequestConfig;
};

type GraphqlQuery = string | { loc?: { source: { body: string } } };

type MockGraphqlProps = {
  children: ReactNode;
  mocks?: MockItem | MockItem[];
};

type MockItem = {
  data: unknown;
  mutation?: GraphqlQuery;
  query?: GraphqlQuery;
};

const GraphqlContext = createContext<false | GraphqlClient>(false);

const useGraphql = (): false | GraphqlClient => useContext(GraphqlContext);

const resolveQuery = (q: GraphqlQuery): string => {
  if (q && typeof q === 'object' && 'loc' in q && q.loc.source.body) {
    return q.loc.source.body;
  }

  return q as string;
};

const normalizeQuery = (q: string): string =>
  q
    .replace(/\r\n|\n|\r/g, '')
    .split(' ')
    .join('');

const Graphql: React.FC<GraphqlProps> = ({ children, options }) => {
  // The initializer runs once: one client for the lifetime of the provider.
  const [client] = useState((): GraphqlClient => {
    const instance = axios.create(Object.assign({}, { timeout: 1000 }, options));

    return {
      axios: instance,
      mutation: (mutation, variables = {}, config) =>
        instance.post('', { query: resolveQuery(mutation), variables }, config),
      query: (query, variables = {}, config) => instance.post('', { query: resolveQuery(query), variables }, config),
    };
  });

  return (
    <GraphqlContext.Provider value={client}>
      {isValidElement(children) ? children : (children as (c: GraphqlClient) => ReactNode)(client)}
    </GraphqlContext.Provider>
  );
};

const MockGraphql: React.FC<MockGraphqlProps> = ({ children, mocks }) => {
  const client = useGraphql() as GraphqlClient;

  // Installs the mocks once, before the children render and send their requests.
  useState(() => {
    if (!mocks) {
      return true;
    }
    const mockData: Record<string, unknown> = {};
    const mockList = Array.isArray(mocks) ? mocks : [mocks];

    mockList.forEach((item) => {
      const q = resolveQuery((item.query ?? item.mutation) as GraphqlQuery);
      if (q) {
        const key = normalizeQuery(q);
        mockData[key] = item.data;
      }
    });

    const mocker = new MockAdapter(client.axios);
    mocker.onPost('').reply((config) => {
      const data = JSON.parse(config.data as string) as { query: string; variables: unknown };
      if (data.query) {
        const key = normalizeQuery(data.query);
        if (mockData[key]) {
          const queryName = /^[a-z_]\w*/i.exec(key.split('{')[1] ?? '')?.[0] ?? '';
          const d: Record<string, unknown> = {};
          d[queryName] =
            typeof mockData[key] === 'function'
              ? (mockData[key] as (v: unknown) => unknown)(data.variables)
              : mockData[key];

          return [200, { data: d }];
        }
      }
      // eslint-disable-next-line no-console
      console.error('Query is not found');

      return [400, { error: 'Not found' }];
    });

    return true;
  });

  return <>{children}</>;
};

export { Graphql, MockGraphql, useGraphql };
