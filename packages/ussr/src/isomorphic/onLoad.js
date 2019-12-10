import { useRef, useEffect } from 'react';
import isBackend from '../utils/isBackend';

//@ts-ignore
export default function onLoad(cb) {
    let first = useRef(true);
    if (isBackend() && first.current) {
        cb();
        first.current = false;
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
