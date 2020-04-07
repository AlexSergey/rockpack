"use strict";
exports.__esModule = true;
exports.getCurrentDate = function () { return new Date().toLocaleString(); };
exports.clone = function (obj) { return JSON.parse(JSON.stringify(obj)); };
