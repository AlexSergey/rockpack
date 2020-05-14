"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
var LoggerContainer_1 = __importStar(require("./LoggerContainer"));
exports.LoggerContainer = LoggerContainer_1["default"];
exports.useLoggerApi = LoggerContainer_1.useLoggerApi;
exports.useLogger = LoggerContainer_1.useLogger;
var logger_1 = require("./logger");
exports.createLogger = logger_1.createLogger;
