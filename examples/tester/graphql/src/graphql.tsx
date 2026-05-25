import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import type { ReactNode } from 'react';

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import React, { createContext, isValidElement, useContext, useRef } from 'react';

interface GraphqlClient {
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
}

interface GraphqlProps {
  children: ((client: GraphqlClient) => ReactNode) | ReactNode;
  options?: AxiosRequestConfig;
}

type GraphqlQuery = string | { loc?: { source: { body: string } } };

interface MockGraphqlProps {
  children: ReactNode;
  mocks?: MockItem | MockItem[];
}

interface MockItem {
  data: unknown;
  mutation?: GraphqlQuery;
  query?: GraphqlQuery;
}

const GraphqlContext = createContext<false | GraphqlClient>(false);

const useGraphql = (): false | GraphqlClient => useContext(GraphqlContext);

const resolveQuery = (q: GraphqlQuery): string => {
  if (q && typeof q === 'object' && 'loc' in q && q.loc?.source.body) {
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
  const ref = useRef<false | GraphqlClient>(false);

  if (!ref.current) {
    const mergedProps = Object.assign({}, { timeout: 1000 }, options);
    const instance = axios.create(mergedProps);
    ref.current = {
      axios: instance,
      mutation: (mutation, variables = {}, config) =>
        instance.post('', { query: resolveQuery(mutation), variables }, config),
      query: (query, variables = {}, config) => instance.post('', { query: resolveQuery(query), variables }, config),
    };
  }

  return (
    <GraphqlContext.Provider value={ref.current}>
      {isValidElement(children) ? children : (children as (c: GraphqlClient) => ReactNode)(ref.current)}
    </GraphqlContext.Provider>
  );
};

const MockGraphql: React.FC<MockGraphqlProps> = ({ children, mocks }) => {
  const ref = useRef(false);
  const client = useGraphql() as GraphqlClient;

  if (!ref.current && mocks) {
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
    ref.current = true;
  }

  return <>{children}</>;
};

export { Graphql, MockGraphql, useGraphql };
