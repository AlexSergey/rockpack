import { matchPath } from 'react-router';

const findPathToActiveRoute = (currentUrl, route, pathToRoute, isFound = false) => {
    if (!route) {
        return pathToRoute;
    }
    if (!route.url) {
        return pathToRoute;
    }

    if (!isFound) {
        pathToRoute.push(route.nodeId);
    }

    if (matchPath(currentUrl, {
        path: route.url,
        exact: true,
        strict: false
    })) {
        isFound = true;
    }
    if (Array.isArray(route)) {
        route.forEach(r => {
            findPathToActiveRoute(currentUrl, r, pathToRoute, isFound);
        });
    }

    if (route.children) {
        (Array.isArray(route.children) ? route.children : [route.children]).forEach(r => {
            findPathToActiveRoute(currentUrl, r, pathToRoute, isFound);
        });
    }

    return pathToRoute;
};

export default findPathToActiveRoute;
