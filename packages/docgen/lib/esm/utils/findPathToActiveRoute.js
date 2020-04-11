import { matchPath } from 'react-router';
const findPathToActiveRoute = (currentUrl, route, pathToRoute, isFound = false) => {
    if (!route) {
        return isFound ? pathToRoute : [];
    }
    if (!route.url) {
        return isFound ? pathToRoute : [];
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
    return isFound ? pathToRoute : [];
};
export default findPathToActiveRoute;
