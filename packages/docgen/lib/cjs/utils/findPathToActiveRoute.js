"use strict";
exports.__esModule = true;
var react_router_1 = require("react-router");
var findPathToActiveRoute = function (currentUrl, route, pathToRoute, isFound) {
    if (isFound === void 0) { isFound = false; }
    if (!route) {
        return isFound ? pathToRoute : [];
    }
    if (!route.url) {
        return isFound ? pathToRoute : [];
    }
    if (!isFound) {
        pathToRoute.push(route.nodeId);
    }
    if (react_router_1.matchPath(currentUrl, {
        path: route.url,
        exact: true,
        strict: false
    })) {
        isFound = true;
    }
    if (Array.isArray(route)) {
        route.forEach(function (r) {
            findPathToActiveRoute(currentUrl, r, pathToRoute, isFound);
        });
    }
    if (route.children) {
        (Array.isArray(route.children) ? route.children : [route.children]).forEach(function (r) {
            findPathToActiveRoute(currentUrl, r, pathToRoute, isFound);
        });
    }
    return isFound ? pathToRoute : [];
};
exports["default"] = findPathToActiveRoute;
