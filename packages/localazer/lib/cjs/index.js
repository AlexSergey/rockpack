"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var LocalizationObserver_1 = __importDefault(require("./LocalizationObserver"));
exports.LocalizationObserver = LocalizationObserver_1["default"];
var Localization_1 = __importDefault(require("./Localization"));
var jed_1 = require("./jed");
exports.l = jed_1.l;
exports.nl = jed_1.nl;
exports.sprintf = jed_1.sprintf;
var utils_1 = require("./utils");
exports.detectLanguage = utils_1.detectLanguage;
var i18n_1 = __importDefault(require("./i18n"));
exports.jed = i18n_1["default"];
exports["default"] = Localization_1["default"];
