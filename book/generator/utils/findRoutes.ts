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
    route.forEach(r => {
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
      [route.children]).forEach(r => getRoutes(r, allRoutes));
  }
  return allRoutes;
};

const findRoutes = (current: string, route: DocgenRouteInterface | DocgenRouteInterface[]): {
  prev: Url | null;
  next: Url | null;
} => {
  const allRoutes = getRoutes(route, []);
  const currentIndex = allRoutes.findIndex(r => matchPath(r.url, current));

  const prev = allRoutes[currentIndex - 1] ? {
    url: allRoutes[currentIndex - 1].url,
    title: allRoutes[currentIndex - 1].title,
    nodeId: allRoutes[currentIndex - 1].nodeId
  } : null;

  const next = allRoutes[currentIndex + 1] ? {
    url: allRoutes[currentIndex + 1].url,
    title: allRoutes[currentIndex + 1].title,
    nodeId: allRoutes[currentIndex + 1].nodeId
  } : null;

  return { prev, next };
};

export default findRoutes;
