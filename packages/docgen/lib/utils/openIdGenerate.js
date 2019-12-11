let uniq = 0;
const openIdGenerate = (route, s, openedIds) => {
    uniq++;
  if (!route) {
      return openedIds;
  }
    if (Array.isArray(route)) {
        route.forEach(route => openIdGenerate(route, s, openedIds));
        return openedIds;
    }
    route.uniqId = uniq;
    if (route.url) {
        let nodeId = String(s += 1);
        openedIds.push(nodeId);
        route.nodeId = nodeId;
    }
    if (route.children) {
        (Array.isArray(route.children) ? route.children : [route.children]).forEach(route => {
            openIdGenerate(route, s, openedIds);
        });
    }
    return openedIds;
};

export default openIdGenerate;
