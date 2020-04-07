"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var react_1 = __importStar(require("react"));
var valid_types_1 = require("valid-types");
var limited_array_1 = __importDefault(require("limited-array"));
var BSOD_1 = __importDefault(require("./BSOD"));
var stack_1 = require("./stack");
var utils_1 = require("./utils");
var logger_1 = require("./logger");
exports.LoggerContext = react_1.createContext(null);
var isBackend = function () { return typeof window === 'undefined'; };
exports.useLogger = function () { return react_1.useContext(exports.LoggerContext)
    .getLogger(); };
var LoggerContainer = /** @class */ (function (_super) {
    __extends(LoggerContainer, _super);
    function LoggerContainer(props) {
        var _this = _super.call(this, props) || this;
        _this.__hasCriticalError = false;
        _this.handlerError = function (errorMsg, url, lineNumber, lineCount, trace) {
            _this.unbindActions();
            if (!_this.__hasCriticalError) {
                _this.__hasCriticalError = true;
                var stackData = stack_1.onCriticalError(_this.stack, _this.stackCollection, {
                    getCurrentDate: _this.props.getCurrentDate,
                    onPrepareStack: _this.props.onPrepareStack
                }, trace, lineNumber);
                _this.onError(stackData);
                _this.setState({
                    bsod: true
                });
            }
        };
        _this.getLogger = function () { return _this.logger; };
        _this._onMouseDown = function (e) {
            _this.stack.mousePressed = e && e.button;
        };
        _this._onKeyDown = function (e) {
            _this.stack.keyboardPressed = e && e.code;
        };
        _this._onKeyUp = function () {
            setTimeout(function () {
                _this.stack.keyboardPressed = null;
            });
        };
        _this._onMouseUp = function () {
            setTimeout(function () {
                _this.stack.mousePressed = null;
            });
        };
        _this.getStackData = function () { return stack_1.getStackData(_this.stack, _this.stackCollection, {
            getCurrentDate: _this.props.getCurrentDate,
            onPrepareStack: _this.props.onPrepareStack
        }); };
        _this.onError = function (stackData) {
            if (valid_types_1.isFunction(_this.props.onError)) {
                _this.props.onError(stackData);
            }
        };
        _this.closeBsod = function () {
            _this.setState({
                bsod: false
            });
        };
        _this.stackCollection = new limited_array_1["default"]();
        _this.logger = new logger_1.Logger({
            stackCollection: _this.stackCollection
        });
        _this.stack = {
            keyboardPressed: null,
            mousePressed: null,
            session: {},
            env: {},
            actions: _this.stackCollection.data
        };
        var LIMIT = valid_types_1.isNumber(_this.props.limit) ? _this.props.limit : 25;
        _this.logger.setUp({
            active: props.active
        });
        _this.stackCollection.setLimit(LIMIT);
        if (valid_types_1.isFunction(_this.props.onPrepareStack)) {
            _this.stack.onPrepareStack = _this.props.onPrepareStack;
        }
        if (valid_types_1.isFunction(_this.props.stdout)) {
            _this.logger.setUp({
                stdout: _this.props.stdout
            });
        }
        _this.stack.session.start = valid_types_1.isFunction(_this.props.getCurrentDate) ? _this.props.getCurrentDate() : utils_1.getCurrentDate();
        if (valid_types_1.isString(_this.props.sessionID) || valid_types_1.isNumber(_this.props.sessionID)) {
            _this.stack.sessionId = _this.props.sessionID;
        }
        document.addEventListener('mousedown', _this._onMouseDown);
        document.addEventListener('mouseup', _this._onMouseUp);
        document.addEventListener('keydown', _this._onKeyDown);
        document.addEventListener('keyup', _this._onKeyUp);
        return _this;
    }
    LoggerContainer.prototype.componentDidMount = function () {
        if (this.props.active) {
            if (isBackend()) {
                window.onerror = this.handlerError;
            }
        }
    };
    LoggerContainer.prototype.componentWillUnmount = function () {
        this.unbindActions();
    };
    LoggerContainer.prototype.unbindActions = function () {
        document.removeEventListener('keydown', this._onKeyDown);
        document.removeEventListener('keyup', this._onKeyUp);
        document.removeEventListener('mousedown', this._onMouseDown);
        document.removeEventListener('mouseup', this._onMouseUp);
    };
    LoggerContainer.prototype.render = function () {
        var Bsod = this.props.bsod;
        return (react_1["default"].createElement(exports.LoggerContext.Provider, { value: {
                getStackData: this.getStackData,
                onError: this.onError,
                getLogger: this.getLogger
            } },
            this.props.children,
            this.props.bsodActive && this.state.bsod && react_1.isValidElement(Bsod) && (react_1["default"].createElement(Bsod, { count: this.logger.getCounter(), onClose: this.closeBsod, stackData: this.getStackData() }))));
    };
    LoggerContainer.defaultProps = {
        active: true,
        bsodActive: true,
        bsod: BSOD_1["default"],
        sessionID: false,
        limit: 25,
        getCurrentDate: utils_1.getCurrentDate
    };
    LoggerContainer.state = {
        bsod: false
    };
    return LoggerContainer;
}(react_1.Component));
exports["default"] = LoggerContainer;
