function mixParams(props = {}, skipHref) {
    if (skipHref) {
        return Object.assign({}, props);
    }
    let href = global && global.location && global.location.href ? global.location.href : '';
    return Object.assign({}, href !== '' ? { url: href } : {}, props);
}

function serializeError(stack, lineNumber) {
    let alt = {
        line: lineNumber
    };

    Object.getOwnPropertyNames(stack).forEach(key => {
        switch (key) {
            case 'stack':
                alt[key] = stack[key].split('\n');
                break;
            default:
                alt[key] = stack[key];
                break;
        }
    }, stack);

    return alt;
}

const CRITICAL = 'critical';

export { mixParams, serializeError, CRITICAL };