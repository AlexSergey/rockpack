import React, { createContext, useState, useEffect } from 'react';
import { clone, isBackend } from './utils';
export const UssrContext = createContext({});
const OnComplete = ({ loading, onLoad }) => {
    useEffect(() => {
        if (!isBackend() && loading) {
            onLoad(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return null;
};
const createUssr = (initState) => {
    const app = {
        effects: [],
        state: initState
    };
    const addEffect = (effect) => {
        app.effects.push(effect);
    };
    const runEffects = () => new Promise(resolve => (Promise.all(app.effects)
        .then(() => resolve(clone(app.state)))));
    return [runEffects, ({ children }) => {
            const [loading, onLoad] = useState(!isBackend());
            return (React.createElement(UssrContext.Provider, { value: {
                    loading,
                    initState,
                    addEffect
                } },
                children,
                React.createElement(OnComplete, { loading: loading, onLoad: onLoad })));
        }];
};
export default createUssr;
