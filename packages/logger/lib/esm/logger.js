import { isFunction } from 'valid-types';
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
        this.stdout = null;
        this.ignoreLogging = false;
        this._count = 0;
        this.getCounter = () => this._count;
        if (props && typeof props.stackCollection === 'object' && typeof props.stackCollection.add === 'function') {
            this.stackCollection = props.stackCollection;
        }
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
        if (typeof props.active === 'boolean') {
            this.active = Boolean(props.active);
        }
        if (typeof props.stdout === 'function') {
            this.stdout = props.stdout;
        }
        if (typeof props.stackCollection === 'object' && typeof props.stackCollection.add === 'function') {
            this.stackCollection = props.stackCollection;
        }
    }
    _handler(message, level, important) {
        if (!this.ignoreLogging &&
            this.active) {
            if (isFunction(this.stdout)) {
                this.stdout(level, message, important);
            }
            let stackData;
            if (typeof message === 'string') {
                const temp = {};
                temp[level] = message;
                stackData = temp;
            }
            else if (typeof message === 'object') {
                stackData = message;
            }
            if (stackData) {
                this.stackCollection.add(Object.assign({}, stackData));
            }
            this._count += 1;
        }
    }
}
export const createLogger = () => new Logger();
export { Logger };
