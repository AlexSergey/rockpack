const createRoutes = (prefix, routes) => {
  return routes.map(route => {
    let slash = route.url.indexOf('/') === 0 && prefix.indexOf('/') >= 0 ? '' : '/';
    route.url = prefix + slash + route.url;
  });
};

export default createRoutes;
