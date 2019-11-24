import { useEffect } from 'react';
import isBackend from '../utils/isBackend';

//@ts-ignore
export default function onLoad(cb) {
    if (isBackend()) {
        cb();
    }
    else {
        useEffect(() => {
            //@ts-ignore
            if (!window.ISOMORPHIC_APP_IS_MOUNTING) {
                cb();
            }
        }, []);
    }
}
