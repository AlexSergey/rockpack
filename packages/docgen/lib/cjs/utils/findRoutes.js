"use strict";
exports.__esModule = true;
var react_router_1 = require("react-router");
var getRoutes = function (route, allRoutes) {
    if (!route) {
        return allRoutes;
    }
    if (Array.isArray(route)) {
        route.forEach(function (r) {
            getRoutes(r, allRoutes);
        });
        return allRoutes;
    }
    if (route.url) {
        allRoutes.push({
            url: route.url,
            title: route.title,
            nodeId: route.nodeId
        });
    }
    if (route.children) {
        (Array.isArray(route.children) ?
            route.children :
            [route.children]).forEach(function (r) { return getRoutes(r, allRoutes); });
    }
    return allRoutes;
};
var findRoutes = function (current, route) {
    var allRoutes = getRoutes(route, []);
    var currentIndex = allRoutes.findIndex(function (r) { return react_router_1.matchPath(current, {
        path: r.url,
        exact: true,
        strict: false
    }); });
    var prev = allRoutes[currentIndex - 1] ? {
        url: allRoutes[currentIndex - 1].url,
        title: allRoutes[currentIndex - 1].title,
        nodeId: allRoutes[currentIndex - 1].nodeId
    } : null;
    var next = allRoutes[currentIndex + 1] ? {
        url: allRoutes[currentIndex + 1].url,
        title: allRoutes[currentIndex + 1].title,
        nodeId: allRoutes[currentIndex + 1].nodeId
    } : null;
    return { prev: prev, next: next };
};
exports["default"] = findRoutes;
