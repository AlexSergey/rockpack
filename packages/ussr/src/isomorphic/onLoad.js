import { useEffect } from 'react';
import isBackend from '../utils/isBackend';

export default function onLoad(cb) {
    if (isBackend()) {
        cb();
    }
    else {
        if (!window.ISOMORPHIC_APP_IS_MOUNTING) {
            useEffect(() => {
                cb();
            }, []);
        }
    }
}
