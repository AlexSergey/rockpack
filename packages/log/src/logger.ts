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
  public active = true;

  public stdout: Function | undefined;

  private ignoreLogging = false;

  private stackCollection;
  
  private _count = 0;
  
  constructor(props) {
    this.stackCollection = props.stackCollection;
  }
  
  log(message: string, important = false) {
    this._handler(message, 'log', important);
  }
  
  info(message: string, important = false) {
    this._handler(message, 'info', important);
  }
  
  debug(message: string, important = false) {
    this._handler(message, 'debug', important);
  }
  
  warn(message: string, important = false) {
    this._handler(message, 'warn', important);
  }
  
  error(message: string, important = false) {
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
        } else if (isObject(message)) {
          stackData = message;
        }
        
        if (stackData) {
          this.stackCollection.add(mixParams(stackData, true));
        }
        this._count += 1;
      }
    }
  }
  
  getCounter = (): number => this._count;
}

export { Logger };
