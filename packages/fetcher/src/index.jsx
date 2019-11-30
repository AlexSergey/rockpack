import React, { useContext, createContext, useRef } from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const RestContext = createContext(false);
const GraphqlContext = createContext(false);
const HeadersContext = createContext(false);

const Headers = ({ children, headers = {} }) => {
    return <HeadersContext.Provider value={{
        register: axios => {
            axios.interceptors.request.use(
                request => {
                    const _headers = request.headers;
                    request.headers = Object.assign({}, _headers, headers);
                    return request;
                }
            )
        }
    }}>
        {children}
    </HeadersContext.Provider>
};

const Rest = ({ children, options }) => {
    let ref = useRef(false);

    if (!ref.current) {
        const mergedProps = Object.assign({}, {
            timeout: 1000
        }, options);
        const instance = axios.create(mergedProps);
        ref.current = instance;
        const cloneHeaders = useContext(HeadersContext);

        if (cloneHeaders) {
            if (typeof cloneHeaders.register) {
                cloneHeaders.register(instance);
            }
        }
    }

    return <RestContext.Provider value={ref.current}>
        {children}
    </RestContext.Provider>
};

const MockRest = ({ children, mock }) => {
    let ref = useRef(false);

    if (!ref.current) {
        if (typeof mock === 'function') {
            let axios = useAxios();
            let mocker = new MockAdapter(axios);
            mock(mocker);
            ref.current = true;
        }
    }
    return children;
};

const useRest = () => {
    return useContext(RestContext);
};
const useGraphql = () => {
    return useContext(GraphqlContext);
};

const Graphql = ({ children, options }) => {
    let ref = useRef(false);

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
        const cloneHeaders = useContext(HeadersContext);

        if (cloneHeaders) {
            if (typeof cloneHeaders.register) {
                cloneHeaders.register(instance);
            }
        }
    }

    return <GraphqlContext.Provider value={ref.current}>
        {children}
    </GraphqlContext.Provider>
};

const MockGraphql = ({ children, mocks }) => {
    let ref = useRef(false);
    let client = useGraphql();

    if (!ref.current) {
        let mockData = {};
        if (!!mocks) {
            mocks = Array.isArray(mocks) ? mocks : [mocks];

            mocks.forEach(item => {
                let query = item.query || item.mutation;

                if (query) {
                    if (query.loc && query.loc.source.body) {
                        query = query.loc.source.body;
                    }
                    if (query) {
                        let q = query
                            .replace(/(\r\n|\n|\r)/gm, "")
                            .split(' ')
                            .join('');

                        mockData[q] = item.data;
                    }
                }
            });
            let mocker = new MockAdapter(client.axios);

            mocker.onPost('')
                .reply(function(config) {
                    let data = JSON.parse(config.data);

                    if (data.query) {
                        let q = data.query.replace(/(\r\n|\n|\r)/gm, "")
                            .split(' ').join('');

                        if (mockData[q]) {
                            let queryName = q
                                .replace(/([\[(])(.+?)([\])])/g, '')
                                .split('{')[1];

                            let d = {};

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
    useRest,
    MockRest,
    Rest,
    useGraphql,
    MockGraphql,
    Graphql,
    Headers
};
