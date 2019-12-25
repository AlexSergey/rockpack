import React, { isValidElement, useContext, createContext, useRef } from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const RestContext = createContext(false);

const Rest = ({ children, options }) => {
    let ref = useRef(false);

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
    )
};

const MockRest = ({ children, mock }) => {
    let ref = useRef(false);

    if (!ref.current) {
        if (typeof mock === 'function') {
            let axios = useRest();
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

export {
    useRest,
    MockRest,
    Rest
};
