import React, { createContext, useRef, useEffect } from 'react';
import isBackend from '../utils/isBackend';

export const EffectsContext = createContext(null);

//@ts-ignore
const useLoad = (cb) => {
    let first = useRef(true);

    useEffect(() => {
        if (!isBackend()) {
            //@ts-ignore
            if (!window.ISOMORPHIC_APP_IS_MOUNTING) {
                cb();
            }
        }
    }, []);

    return () => {
        if (isBackend() && first.current) {
            cb();
            first.current = false;
        }
    }
};

const Effects = () => {

    return (
        <EffectsContext.Provider value={

        }>

        </EffectsContext.Provider>
    )
};

export default Effects;
