"use strict";
exports.__esModule = true;
var valid_types_1 = require("valid-types");
var errorHelpers_1 = require("./errorHelpers");
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
        this.ignoreLogging = false;
        this._count = 0;
        this.getCounter = function () { return _this._count; };
        this.stackCollection = props.stackCollection;
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
        this.active = Boolean(props.active);
        this.stdout = props.stdout;
    };
    Logger.prototype._handler = function (message, level, important) {
        if (!this.ignoreLogging) {
            if (this.active) {
                if (valid_types_1.isFunction(this.stdout)) {
                    this.stdout(level, message, important);
                }
                var stackData = void 0;
                if (valid_types_1.isString(message)) {
                    var temp = {};
                    temp[level] = message;
                    stackData = temp;
                }
                else if (valid_types_1.isObject(message)) {
                    stackData = message;
                }
                if (stackData) {
                    this.stackCollection.add(errorHelpers_1.mixParams(stackData, true));
                }
                this._count += 1;
            }
        }
    };
    return Logger;
}());
exports.Logger = Logger;
