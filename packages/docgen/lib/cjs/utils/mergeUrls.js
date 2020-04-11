"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var url_join_1 = __importDefault(require("url-join"));
var mergeUrls = function (route, parent) {
    if (!route) {
        return false;
    }
    if (Array.isArray(route)) {
        route.forEach(function (r) { return mergeUrls(r, parent || {}); });
        return false;
    }
    if (route.url && parent && parent.url) {
        route.url = url_join_1["default"]('/', parent.url, route.url);
    }
    else if (route.url && !parent.url) {
        if (route.url.indexOf('/') !== 0) {
            route.url = "/" + route.url;
        }
    }
    if (route.children) {
        (Array.isArray(route.children) ? route.children : [route.children]).forEach(function (r) {
            mergeUrls(r, route);
        });
    }
};
exports["default"] = mergeUrls;
