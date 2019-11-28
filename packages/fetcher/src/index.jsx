import React, { useContext, createContext, useRef } from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const AxiosContext = createContext(false);
const AxiosHeadersContext = createContext(false);

const AxiosHeaders = ({ children, headers = {} }) => {
    return <AxiosHeadersContext.Provider value={{
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
    </AxiosHeadersContext.Provider>
};

const Axios = ({ children, props }) => {
    let ref = useRef(false);

    if (!ref.current) {
        const mergedProps = Object.assign({}, {
            timeout: 1000
        }, props);
        const instance = axios.create(mergedProps);
        ref.current = instance;
        const cloneHeaders = useContext(AxiosHeadersContext);

        if (cloneHeaders) {
            if (typeof cloneHeaders.register) {
                cloneHeaders.register(instance);
            }
        }
    }

    return <AxiosContext.Provider value={ref.current}>
        {children}
    </AxiosContext.Provider>
};

const MockAxios = ({ children, mock }) => {
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

const useAxios = () => {
    return useContext(AxiosContext);
};

export {
    useAxios,
    MockAxios,
    Axios,
    AxiosHeaders
};
