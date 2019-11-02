import LimitedArray from 'limited-array';
import { isArray, isFunction } from 'valid-types';
import { getCurrentDate, clone } from './utils';
import { mixParams, serializeError, CRITICAL } from './errorHelpers';

let stackCollection = new LimitedArray();

let stack = {
    keyboardPressed: null,
    mousePressed: null,
    session: {},
    env: {},
    actions: stackCollection.data
};

function getStackData(props) {
    let nav = global.navigator || {};
    let lang = nav && nav.languages && isArray(nav.languages) ? nav.languages[0] : '';
    let href = global.location && global.location.href ? global.location.href : '';
    let actions = stackCollection.getData();

    stack.session.end = isFunction(props.getCurrentDate) ? props.getCurrentDate() : getCurrentDate();
    stack.actions = actions;
    stack.env.lang = lang;
    stack.env.href = href;

    if (isFunction(props.onPrepareStack)) {
        props.onPrepareStack(stack);
    }
    return clone(stack);
}

function onCriticalError(trace, lineNumber, props) {
    let critical = {};
    critical[CRITICAL] = serializeError(trace, lineNumber);
    let criticalData = mixParams(critical, true);
    stackCollection.add(criticalData);
    return getStackData(props);
}

export { stack, stackCollection, getStackData, onCriticalError }