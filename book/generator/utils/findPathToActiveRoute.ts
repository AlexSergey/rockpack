import { matchPath } from 'react-router';
import { DocgenRouteInterface } from '../types';

const findPathToActiveRoute = (
  currentUrl: string,
  route: DocgenRouteInterface,
  pathToRoute: string[],
  isFound = false
): string[] | [] => {
  if (!route) {
    return isFound ? pathToRoute : [];
  }
  if (!route.url) {
    return isFound ? pathToRoute : [];
  }

  if (!isFound) {
    pathToRoute.push(route.nodeId);
  }

  if (matchPath(route.url, currentUrl)) {
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
