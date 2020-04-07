import React, { Component, createContext, isValidElement, useContext } from 'react';
import { isString, isNumber, isFunction } from 'valid-types';
import LimitedArray from 'limited-array';
import BSOD from './BSOD';
import { getStackData, onCriticalError } from './stack';
import { getCurrentDate } from './utils';
import { Logger } from './logger';
export const LoggerContext = createContext(null);
const isBackend = () => typeof window === 'undefined';
export const useLogger = () => useContext(LoggerContext)
    .getLogger();
export default class LoggerContainer extends Component {
    constructor(props) {
        super(props);
        this.__hasCriticalError = false;
        this.handlerError = (errorMsg, url, lineNumber, lineCount, trace) => {
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
        this.getLogger = () => this.logger;
        this._onMouseDown = (e) => {
            this.stack.mousePressed = e && e.button;
        };
        this._onKeyDown = (e) => {
            this.stack.keyboardPressed = e && e.code;
        };
        this._onKeyUp = () => {
            setTimeout(() => {
                this.stack.keyboardPressed = null;
            });
        };
        this._onMouseUp = () => {
            setTimeout(() => {
                this.stack.mousePressed = null;
            });
        };
        this.getStackData = () => getStackData(this.stack, this.stackCollection, {
            getCurrentDate: this.props.getCurrentDate,
            onPrepareStack: this.props.onPrepareStack,
        });
        this.onError = stackData => {
            if (isFunction(this.props.onError)) {
                this.props.onError(stackData);
            }
        };
        this.closeBsod = () => {
            this.setState({
                bsod: false
            });
        };
        this.stackCollection = new LimitedArray();
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
    unbindActions() {
        document.removeEventListener('keydown', this._onKeyDown);
        document.removeEventListener('keyup', this._onKeyUp);
        document.removeEventListener('mousedown', this._onMouseDown);
        document.removeEventListener('mouseup', this._onMouseUp);
    }
    render() {
        const Bsod = this.props.bsod;
        return (React.createElement(LoggerContext.Provider, { value: {
                getStackData: this.getStackData,
                onError: this.onError,
                getLogger: this.getLogger
            } },
            this.props.children,
            this.props.bsodActive && this.state.bsod && isValidElement(Bsod) && (React.createElement(Bsod, { count: this.logger.getCounter(), onClose: this.closeBsod, stackData: this.getStackData() }))));
    }
}
LoggerContainer.defaultProps = {
    active: true,
    bsodActive: true,
    bsod: BSOD,
    sessionID: false,
    limit: 25,
    getCurrentDate
};
LoggerContainer.state = {
    bsod: false
};
