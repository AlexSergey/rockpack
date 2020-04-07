import React, { isValidElement, useContext, createContext, useRef } from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const GraphqlContext = createContext(false);

const useGraphql = () => useContext(GraphqlContext);

const Graphql = ({ children, options }) => {
  const ref = useRef(false);
  
  if (!ref.current) {
    const mergedProps = Object.assign({}, {
      timeout: 1000
    }, options);
    const instance = axios.create(mergedProps);
    ref.current = {
      axios: instance,
      query: (query, variables = {}, config) => {
        if (query) {
          if (query.loc && query.loc.source.body) {
            query = query.loc.source.body;
          }
        }
        return instance.post('', { query, variables }, config);
      },
      mutation: (mutation, variables = {}, config) => {
        if (mutation) {
          if (mutation.loc && mutation.loc.source.body) {
            mutation = mutation.loc.source.body;
          }
        }
        return instance.post('', { query: mutation, variables }, config);
      }
    };
  }
  
  return (
    <GraphqlContext.Provider value={ref.current}>
      {isValidElement(children) ? children : children(ref.current)}
    </GraphqlContext.Provider>
  );
};

const MockGraphql = ({ children, mocks }) => {
  const ref = useRef(false);
  const client = useGraphql();
  
  if (!ref.current) {
    const mockData = {};
    if (mocks) {
      mocks = Array.isArray(mocks) ? mocks : [mocks];
      
      mocks.forEach(item => {
        let query = item.query || item.mutation;
        
        if (query) {
          if (query.loc && query.loc.source.body) {
            query = query.loc.source.body;
          }
          if (query) {
            const q = query
              .replace(/(\r\n|\n|\r)/gm, '')
              .split(' ')
              .join('');
            
            mockData[q] = item.data;
          }
        }
      });
      const mocker = new MockAdapter(client.axios);
      
      mocker.onPost('')
        .reply((config) => {
          const data = JSON.parse(config.data);
          
          if (data.query) {
            const q = data.query.replace(/(\r\n|\n|\r)/gm, '')
              .split(' ')
              .join('');
            
            if (mockData[q]) {
              const queryName = q
                .replace(/([\[(])(.+?)([\])])/g, '')
                .split('{')[1];
              
              const d = {};
              
              d[queryName] = typeof mockData[q] === 'function' ?
                mockData[q](data.variables) :
                mockData[q];
              
              return [200, {
                data: d
              }];
            }
          }
          
          console.error('Query is not found');
          return [400, {
            error: 'Not found'
          }];
        });
      ref.current = true;
    }
  }
  return children;
};

export {
  useGraphql,
  MockGraphql,
  Graphql
};
