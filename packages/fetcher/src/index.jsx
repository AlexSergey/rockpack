import React, { useContext, createContext, useRef } from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const AxiosContext = createContext(false);
const AxiosHeadersContext = createContext(false);

const AxiosHeaders = ({ children, headers = {} }) => {
    let instance = useRef();
    return <AxiosHeadersContext.Provider value={{
        register: axios => {
            if (!instance.current) {
                instance.current = axios;

                instance.current.interceptors.request.use(
                    request => {
                        const _headers = request.headers;
                        request.headers = Object.assign({}, _headers, headers);
                        return request;
                    }
                )
            }
        }
    }}>
        {children}
    </AxiosHeadersContext.Provider>
};

const Axios = ({ children, props }) => {
    const mergedProps = Object.assign({}, {
        timeout: 1000
    }, props);
    const instance = axios.create(mergedProps);
    const cloneHeaders = useContext(AxiosHeadersContext);
    if (cloneHeaders) {
        if (typeof cloneHeaders.register) {
            cloneHeaders.register(instance);
        }
    }

    return <AxiosContext.Provider value={instance}>
        {children}
    </AxiosContext.Provider>
};

const MockAxios = ({ children, mock }) => {
    let axios = useAxios();
    let mocker = new MockAdapter(axios);
    if (typeof mock === 'function') {
        mock(mocker);
    }
    return children;
};

const useAxios = () => {
    return useContext(AxiosContext);
};

export {
    useAxios,
    MockAxios,
    Axios,
    AxiosHeaders
};
