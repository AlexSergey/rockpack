"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var url_parse_1 = __importDefault(require("url-parse"));
var valid_types_1 = require("valid-types");
var parseLanguageFromUrl = function (url, languages) {
    var pathname = url_parse_1["default"](url).pathname;
    if (pathname.indexOf('/') === 0) {
        var l = pathname.substr(1);
        if (l.indexOf('/') > 0) {
            l = l.split('/')[0];
        }
        if (valid_types_1.isArray(languages) && languages.indexOf(l) >= 0) {
            return l;
        }
        if (valid_types_1.isObject(languages)) {
            return Object.keys(languages)
                .indexOf(l) >= 0 ? l : false;
        }
    }
    return false;
};
exports["default"] = parseLanguageFromUrl;
