import ulrJoin from 'url-join';

const mergeUrls = (route, parent?) => {
  if (!route) {
    return false;
  }
  if (Array.isArray(route)) {
    route.forEach(r => mergeUrls(r, parent || {}));
    return false;
  }
  
  if (route.url && parent && parent.url) {
    route.url = ulrJoin('/', parent.url, route.url);
  } else if (route.url && !parent.url) {
    if (route.url.indexOf('/') !== 0) {
      route.url = `/${route.url}`;
    }
  }
  
  if (route.children) {
    (Array.isArray(route.children) ? route.children : [route.children]).forEach(r => {
      mergeUrls(r, route);
    });
  }
};

export default mergeUrls;
