"use strict";
exports.__esModule = true;
exports.isBackend = function () { return typeof window === 'undefined'; };
exports.clone = function (state) { return (JSON.parse(JSON.stringify(state))); };
