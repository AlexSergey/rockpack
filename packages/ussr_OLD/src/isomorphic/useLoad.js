import { useRef, useEffect } from 'react';
import isBackend from '../utils/isBackend';

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

export default useLoad;
