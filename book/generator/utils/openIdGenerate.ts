import { DocgenRouteInterface } from '../types';

let uniq = 0;
const openIdGenerate = (route: DocgenRouteInterface | DocgenRouteInterface[], openedIds: string[]): string[] => {
  uniq++;
  if (!route) {
    return openedIds;
  }
  if (Array.isArray(route)) {
    route.forEach((r) => openIdGenerate(r, openedIds));

    return openedIds;
  }

  route.uniqId = String(uniq);
  if (route.url) {
    const nodeId = String(uniq);
    openedIds.push(nodeId);
    route.nodeId = nodeId;
  }
  if (route.children) {
    (Array.isArray(route.children) ? route.children : [route.children]).forEach((r) => openIdGenerate(r, openedIds));
  }

  return openedIds;
};

export default openIdGenerate;
