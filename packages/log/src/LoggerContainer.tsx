import React, { ComponentType, Component, createContext, isValidElement, useContext } from 'react';
import { isString, isNumber, isFunction } from 'valid-types';
import LimitedArray from 'limited-array';
import BSOD, { BSODInterface } from './BSOD';
import { getStackData, onCriticalError } from './stack';
import { getCurrentDate } from './utils';
import { Logger } from './logger';
import { Stack, Action } from './types';

export const LoggerContext = createContext(null);

const stackCollection = new LimitedArray<Action>();

export const logger = new Logger({
  stackCollection
});

const isBackend = (): boolean => typeof window === 'undefined';

export const useLogger = (): [Logger, () => Stack, (stack: Stack) => void] => {
  const ctx = useContext(LoggerContext);

  return [ctx.getLogger(), ctx.getStackData, ctx.onError];
};

interface LoggerContainerProps {
  active: boolean;
  bsodActive: boolean;
  sessionID: boolean | string | number;
  bsod: ComponentType<BSODInterface>;
  limit: number;
  getCurrentDate?: () => string;
  onError?: (stack: Stack) => void;
  onPrepareStack?: (stack: Stack) => Stack;
  stdout?: (level: string, message: string, important?: boolean) => void;
}

interface LoggerContainerState {
  bsod: boolean;
}

export default class LoggerContainer extends Component<LoggerContainerProps, LoggerContainerState> {
  private __hasCriticalError = false;

  private readonly stack;

  static defaultProps = {
    active: true,
    bsodActive: true,
    sessionID: false,
    limit: 25,
    getCurrentDate
  };

  constructor(props) {
    super(props);

    this.state = {
      bsod: false
    };

    this.stack = {
      keyboardPressed: null,
      mousePressed: null,
      session: {},
      env: {},
      actions: stackCollection.data
    };

    const LIMIT = isNumber(this.props.limit) ? this.props.limit : 25;

    logger.setUp({
      active: props.active
    });

    stackCollection.setLimit(LIMIT);

    if (isFunction(this.props.onPrepareStack)) {
      this.stack.onPrepareStack = this.props.onPrepareStack;
    }

    if (isFunction(this.props.stdout)) {
      logger.setUp({
        stdout: this.props.stdout
      });
    }

    this.stack.session.start = isFunction(this.props.getCurrentDate) ? this.props.getCurrentDate() : getCurrentDate();

    if (isString(this.props.sessionID) || isNumber(this.props.sessionID)) {
      this.stack.sessionId = this.props.sessionID;
    }

    document.addEventListener('mousedown', this._onMouseDown);
    document.addEventListener('mouseup', this._onMouseUp);
    document.addEventListener('keydown', this._onKeyDown);
    document.addEventListener('keyup', this._onKeyUp);
  }

  componentDidMount(): void {
    if (this.props.active) {
      if (!isBackend()) {
        window.onerror = this.handlerError;
      }
    }
  }

  componentWillUnmount(): void {
    this.unbindActions();
  }

  handlerError = (errorMsg: string, url: string, lineNumber: number, lineCount: number, trace: Error): void => {
    this.unbindActions();
    if (!this.__hasCriticalError) {
      this.__hasCriticalError = true;

      const stackData = onCriticalError(this.stack, stackCollection, {
        getCurrentDate: this.props.getCurrentDate,
        onPrepareStack: this.props.onPrepareStack,
      }, trace, lineNumber);

      this.onError(stackData);

      this.setState({
        bsod: true
      });
    }
  };

  getLogger = (): Logger => logger;

  _onMouseDown = (e: MouseEvent): void => {
    this.stack.mousePressed = e && e.button;
  };

  _onKeyDown = (e: KeyboardEvent): void => {
    this.stack.keyboardPressed = e && e.code;
  };

  _onKeyUp = (): void => {
    setTimeout(() => {
      this.stack.keyboardPressed = null;
    });
  };

  _onMouseUp = (): void => {
    setTimeout(() => {
      this.stack.mousePressed = null;
    });
  };

  getStackData = (): Stack => getStackData(this.stack, stackCollection, {
    getCurrentDate: this.props.getCurrentDate,
    onPrepareStack: this.props.onPrepareStack,
  });

  onError = (stackData: Stack): void => {
    if (isFunction(this.props.onError)) {
      this.props.onError(stackData);
    }
  };

  closeBsod = (): void => {
    this.setState({
      bsod: false
    });
  };

  unbindActions(): void {
    window.onerror = null;
    document.removeEventListener('keydown', this._onKeyDown);
    document.removeEventListener('keyup', this._onKeyUp);
    document.removeEventListener('mousedown', this._onMouseDown);
    document.removeEventListener('mouseup', this._onMouseUp);
  }

  render(): JSX.Element {
    const Bsod = isValidElement(this.props.bsod) ? this.props.bsod : BSOD;

    return (
      <LoggerContext.Provider value={{
        getStackData: this.getStackData,
        onError: this.onError,
        getLogger: this.getLogger
      }}
      >
        {this.props.children}

        {this.props.bsodActive && this.state.bsod && (
          <Bsod
            count={logger.getCounter()}
            onClose={this.closeBsod}
            stackData={this.getStackData()}
          />
        )}
      </LoggerContext.Provider>
    );
  }
}
