import isBackend from './isBackend';
import objectPath from 'object-path';

export default function(pth, defaultValue) {
    if (isBackend()) {
        return defaultValue;
    }

    let result = objectPath.get(window, `REDUX_DATA.${pth}`);

    if (!!result) {
        return result;
    }
    return defaultValue;
}
