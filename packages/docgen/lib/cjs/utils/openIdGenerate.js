"use strict";
exports.__esModule = true;
var uniq = 0;
var openIdGenerate = function (route, openedIds) {
    uniq++;
    if (!route) {
        return openedIds;
    }
    if (Array.isArray(route)) {
        route.forEach(function (route) { return openIdGenerate(route, openedIds); });
        return openedIds;
    }
    route.uniqId = uniq;
    if (route.url) {
        var nodeId = String(uniq);
        openedIds.push(nodeId);
        route.nodeId = nodeId;
    }
    if (route.children) {
        (Array.isArray(route.children) ? route.children : [route.children]).forEach(function (route) {
            openIdGenerate(route, openedIds);
        });
    }
    return openedIds;
};
exports["default"] = openIdGenerate;
