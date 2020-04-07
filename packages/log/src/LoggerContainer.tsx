import React, { ComponentType, Component, createContext, isValidElement, useContext } from 'react';
import { isString, isNumber, isFunction } from 'valid-types';
import LimitedArray from 'limited-array';
import BSOD from './BSOD';
import { getStackData, onCriticalError } from './stack';
import { getCurrentDate } from './utils';
import { Logger } from './logger';
import { LoggerInterface, Stack, Action } from './types';

export const LoggerContext = createContext(null);

const isBackend = () => typeof window === 'undefined';

export const useLogger = (): Logger => useContext(LoggerContext)
  .getLogger();

export interface BSODInterface {
  count: number;
  onClose: () => void;
  stackData: Stack;
}

interface LoggerContainerProps {
  active: boolean;
  bsodActive: boolean;
  sessionID: boolean | string | number;
  bsod?: ComponentType<BSODInterface>;
  limit: number;
  getCurrentDate?: () => string;
  onError?: (stack: Stack) => void;
  onPrepareStack?: (stack: Stack) => Stack;
  stdout?: (stack: Stack) => void;
}

interface LoggerContainerState {
  bsod: boolean;
}

export default class LoggerContainer extends Component<LoggerContainerProps, LoggerContainerState> {
  private __hasCriticalError = false;

  private readonly logger: LoggerInterface;

  private readonly stackCollection;

  private readonly stack;
  
  static defaultProps = {
    active: true,
    bsodActive: true,
    bsod: BSOD,
    sessionID: false,
    limit: 25,
    getCurrentDate
  };
  
  static state = {
    bsod: false
  };
  
  constructor(props) {
    super(props);
    this.stackCollection = new LimitedArray<Action>();
    
    this.logger = new Logger({
      stackCollection: this.stackCollection
    });
    
    this.stack = {
      keyboardPressed: null,
      mousePressed: null,
      session: {},
      env: {},
      actions: this.stackCollection.data
    };
    
    const LIMIT = isNumber(this.props.limit) ? this.props.limit : 25;
    
    this.logger.setUp({
      active: props.active
    });
    
    this.stackCollection.setLimit(LIMIT);
    
    if (isFunction(this.props.onPrepareStack)) {
      this.stack.onPrepareStack = this.props.onPrepareStack;
    }
    
    if (isFunction(this.props.stdout)) {
      this.logger.setUp({
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
  
  componentDidMount() {
    if (this.props.active) {
      if (isBackend()) {
        window.onerror = this.handlerError;
      }
    }
  }
  
  componentWillUnmount() {
    this.unbindActions();
  }
  
  handlerError = (errorMsg: any, url: string, lineNumber: number, lineCount, trace) => {
    this.unbindActions();
    if (!this.__hasCriticalError) {
      this.__hasCriticalError = true;
      
      const stackData = onCriticalError(this.stack, this.stackCollection, {
        getCurrentDate: this.props.getCurrentDate,
        onPrepareStack: this.props.onPrepareStack,
      }, trace, lineNumber);
      
      this.onError(stackData);
      
      this.setState({
        bsod: true
      });
    }
  };
  
  getLogger = () => this.logger;
  
  _onMouseDown = (e: MouseEvent) => {
    this.stack.mousePressed = e && e.button;
  };
  
  _onKeyDown = (e: KeyboardEvent) => {
    this.stack.keyboardPressed = e && e.code;
  };
  
  _onKeyUp = () => {
    setTimeout(() => {
      this.stack.keyboardPressed = null;
    });
  };
  
  _onMouseUp = () => {
    setTimeout(() => {
      this.stack.mousePressed = null;
    });
  };
  
  getStackData = () => getStackData(this.stack, this.stackCollection, {
    getCurrentDate: this.props.getCurrentDate,
    onPrepareStack: this.props.onPrepareStack,
  });
  
  onError = stackData => {
    if (isFunction(this.props.onError)) {
      this.props.onError(stackData);
    }
  };
  
  closeBsod = () => {
    this.setState({
      bsod: false
    });
  };
  
  unbindActions() {
    document.removeEventListener('keydown', this._onKeyDown);
    document.removeEventListener('keyup', this._onKeyUp);
    document.removeEventListener('mousedown', this._onMouseDown);
    document.removeEventListener('mouseup', this._onMouseUp);
  }
  
  render() {
    const Bsod = this.props.bsod;
    
    return (
      <LoggerContext.Provider value={{
        getStackData: this.getStackData,
        onError: this.onError,
        getLogger: this.getLogger
      }}
      >
        {this.props.children}
        
        {this.props.bsodActive && this.state.bsod && isValidElement(Bsod) && (
          <Bsod
            count={this.logger.getCounter()}
            onClose={this.closeBsod}
            stackData={this.getStackData()}
          />
        )}
      </LoggerContext.Provider>
    );
  }
}
