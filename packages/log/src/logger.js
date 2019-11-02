import { isFunction, isObject, isString, isBoolean } from 'valid-types';
import { mixParams } from './errorHelpers';
import { stackCollection } from './stack';
/**
 * Types:
 * log
 * info
 * warn
 * error
 * debug
 * */
let count = 0;

class Base {
    setUp(props) {
        this.active = !!props.active;
        this.stdout = props.stdout;
    }
    handler(message, level, important) {
        if (!this.ignoreLogging) {
            if (this.active) {
                if (isFunction(this.stdout)) {
                    this.stdout(level, message, important);
                }

                let stackData;

                if (isString(message)) {
                    let temp = {};
                    temp[level] = message;
                    stackData = temp;
                } else if (isObject(message)) {
                    stackData = message;
                }

                if (stackData) {
                    stackCollection.add(mixParams(stackData, true));
                }
                count += 1;
            }
        }
    }
}

class Logger extends Base {
    log(message, important = false) {
        this.handler(message, 'log', important);
    }
    info(message, important = false) {
        this.handler(message, 'info', important);
    }
    debug(message, important = false) {
        this.handler(message, 'debug', important);
    }
    warn(message, important = false) {
        this.handler(message, 'warn', important);
    }
    error(message, important = false) {
        this.handler(message, 'error', important);
    }
}

let logger = new Logger();

function getCounter() {
    return count;
}

export { logger, getCounter };