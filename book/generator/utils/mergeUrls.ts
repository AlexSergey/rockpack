import ulrJoin from 'url-join';

import { DocgenRouteInterface } from '../types';

const mergeUrls = (route: DocgenRouteInterface | DocgenRouteInterface[], parent?: DocgenRouteInterface): void => {
  if (!route) {
    return;
  }

  if (Array.isArray(route)) {
    route.forEach((r) => mergeUrls(r, parent || {}));

    return;
  }

  if (route.url && parent && parent.url) {
    route.url = ulrJoin('/', parent.url, route.url);
  } else if (route.url && !parent.url && route.url.indexOf('/') !== 0) {
    route.url = `/${route.url}`;
  }

  if (route.children) {
    (Array.isArray(route.children) ? route.children : [route.children]).forEach((r) => {
      mergeUrls(r, route);
    });
  }
};

export default mergeUrls;
