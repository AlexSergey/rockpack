import { isFunction, isObject, isString } from 'valid-types';
import { mixParams } from './errorHelpers';
/**
 * Types:
 * log
 * info
 * warn
 * error
 * debug
 * */
class Logger {
    constructor(props) {
        this.active = true;
        this.ignoreLogging = false;
        this._count = 0;
        this.getCounter = () => this._count;
        this.stackCollection = props.stackCollection;
    }
    log(message, important = false) {
        this._handler(message, 'log', important);
    }
    info(message, important = false) {
        this._handler(message, 'info', important);
    }
    debug(message, important = false) {
        this._handler(message, 'debug', important);
    }
    warn(message, important = false) {
        this._handler(message, 'warn', important);
    }
    error(message, important = false) {
        this._handler(message, 'error', important);
    }
    setUp(props) {
        this.active = Boolean(props.active);
        this.stdout = props.stdout;
    }
    _handler(message, level, important) {
        if (!this.ignoreLogging) {
            if (this.active) {
                if (isFunction(this.stdout)) {
                    this.stdout(level, message, important);
                }
                let stackData;
                if (isString(message)) {
                    const temp = {};
                    temp[level] = message;
                    stackData = temp;
                }
                else if (isObject(message)) {
                    stackData = message;
                }
                if (stackData) {
                    this.stackCollection.add(mixParams(stackData, true));
                }
                this._count += 1;
            }
        }
    }
}
export { Logger };
