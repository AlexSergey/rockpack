import { isFunction } from 'valid-types';
import LimitedArray from 'limited-array';
import { StackData, Action, LoggerInterface } from './types';

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

  public stdout?: (level: string, message: string, important: boolean) => void = null;

  private ignoreLogging = false;

  private stackCollection: LimitedArray<Action>;

  private _count = 0;

  constructor(props?) {
    if (props && typeof props.stackCollection === 'object' && typeof props.stackCollection.add === 'function') {
      this.stackCollection = props.stackCollection;
    }
  }

  log(message: string, important = false): void {
    this._handler(message, 'log', important);
  }

  info(message: string, important = false): void {
    this._handler(message, 'info', important);
  }

  debug(message: string, important = false): void {
    this._handler(message, 'debug', important);
  }

  warn(message: string, important = false): void {
    this._handler(message, 'warn', important);
  }

  error(message: string, important = false): void {
    this._handler(message, 'error', important);
  }

  setUp(props: {
    active?: boolean;
    stdout?: (level: string, message: string, important?: boolean) => void;
    stackCollection?: LimitedArray<Action>;
  }): void {
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

  _handler(message: string, level: string, important: boolean): void {
    if (!this.ignoreLogging) {
      if (this.active) {
        if (isFunction(this.stdout)) {
          this.stdout(level, message, important);
        }

        let stackData: StackData;

        if (typeof message === 'string') {
          const temp = {};
          temp[level] = message;
          stackData = temp as StackData;
        } else if (typeof message === 'object') {
          stackData = message;
        }

        if (stackData) {
          this.stackCollection.add(Object.assign({}, stackData));
        }
        this._count += 1;
      }
    }
  }

  getCounter = (): number => this._count;
}

export const createLogger = (): LoggerInterface => new Logger();

export { Logger };
