import { matchPath } from 'react-router';

import { DocgenRouteInterface } from '../types';

interface Url {
  url: string;
  title: string;
  nodeId: string;
}

const getRoutes = (route: DocgenRouteInterface | DocgenRouteInterface[], allRoutes: Url[]): Url[] => {
  if (!route) {
    return allRoutes;
  }
  if (Array.isArray(route)) {
    route.forEach((r) => {
      getRoutes(r, allRoutes);
    });

    return allRoutes;
  }
  if (route.url) {
    allRoutes.push({
      nodeId: route.nodeId,
      title: route.title,
      url: route.url,
    });
  }
  if (route.children) {
    (Array.isArray(route.children) ? route.children : [route.children]).forEach((r) => getRoutes(r, allRoutes));
  }

  return allRoutes;
};

const findRoutes = (
  current: string,
  route: DocgenRouteInterface | DocgenRouteInterface[],
): {
  prev: Url | null;
  next: Url | null;
} => {
  const allRoutes = getRoutes(route, []);
  const currentIndex = allRoutes.findIndex((r) => matchPath(r.url, current));

  const prev = allRoutes[currentIndex - 1]
    ? {
        nodeId: allRoutes[currentIndex - 1].nodeId,
        title: allRoutes[currentIndex - 1].title,
        url: allRoutes[currentIndex - 1].url,
      }
    : null;

  const next = allRoutes[currentIndex + 1]
    ? {
        nodeId: allRoutes[currentIndex + 1].nodeId,
        title: allRoutes[currentIndex + 1].title,
        url: allRoutes[currentIndex + 1].url,
      }
    : null;

  return { next, prev };
};

export default findRoutes;
