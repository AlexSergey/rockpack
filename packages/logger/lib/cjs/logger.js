"use strict";
exports.__esModule = true;
var valid_types_1 = require("valid-types");
/**
 * Types:
 * log
 * info
 * warn
 * error
 * debug
 * */
var Logger = /** @class */ (function () {
    function Logger(props) {
        var _this = this;
        this.active = true;
        this.stdout = null;
        this.ignoreLogging = false;
        this._count = 0;
        this.getCounter = function () { return _this._count; };
        if (props && typeof props.stackCollection === 'object' && typeof props.stackCollection.add === 'function') {
            this.stackCollection = props.stackCollection;
        }
    }
    Logger.prototype.log = function (message, important) {
        if (important === void 0) { important = false; }
        this._handler(message, 'log', important);
    };
    Logger.prototype.info = function (message, important) {
        if (important === void 0) { important = false; }
        this._handler(message, 'info', important);
    };
    Logger.prototype.debug = function (message, important) {
        if (important === void 0) { important = false; }
        this._handler(message, 'debug', important);
    };
    Logger.prototype.warn = function (message, important) {
        if (important === void 0) { important = false; }
        this._handler(message, 'warn', important);
    };
    Logger.prototype.error = function (message, important) {
        if (important === void 0) { important = false; }
        this._handler(message, 'error', important);
    };
    Logger.prototype.setUp = function (props) {
        if (typeof props.active === 'boolean') {
            this.active = Boolean(props.active);
        }
        if (typeof props.stdout === 'function') {
            this.stdout = props.stdout;
        }
        if (typeof props.stackCollection === 'object' && typeof props.stackCollection.add === 'function') {
            this.stackCollection = props.stackCollection;
        }
    };
    Logger.prototype._handler = function (message, level, important) {
        if (!this.ignoreLogging &&
            this.active) {
            if (valid_types_1.isFunction(this.stdout)) {
                this.stdout(level, message, important);
            }
            var stackData = void 0;
            if (typeof message === 'string') {
                var temp = {};
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
    };
    return Logger;
}());
exports.Logger = Logger;
exports.createLogger = function () { return new Logger(); };
