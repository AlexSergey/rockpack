import React, { createContext } from 'react';
import { clone } from './utils';
export const UssrContext = createContext({});
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
    return [runEffects, ({ children }) => (React.createElement(UssrContext.Provider, { value: {
                initState,
                addEffect
            } }, children))];
};
export default createUssr;
