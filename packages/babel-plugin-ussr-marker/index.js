const md5 = require('md5');
const pathNode = require('path');

function getTarget(caller) {
  return caller && caller.target;
}

const createDummy = (globalCache, id, field) => {
  if (!globalCache[id]) {
    globalCache[id] = {
      setState: 0,
      effect: 0
    };
  }
  if (!globalCache[id][field]) {
    globalCache[id][field] = 0;
  }
};

const BabelUssrPlugin = (api) => {
  const t = api.types;
  const globalCache = {};

  api.caller(getTarget);

  return {
    name: 'ussr-marker',
    visitor: {
      CallExpression(path, { opts: options, file }) {
        const { filename, cwd } = file.opts;

        const id = md5(pathNode.relative(cwd, filename));

        const effectName = options && (
          typeof options.effect === 'string' ||
          Array.isArray(options.effect)
        ) ?
          options.effect :
          'useUssrEffect';

        const setStateName = options && (
          typeof options.setState === 'string' ||
          Array.isArray(options.setState)
        ) ?
          options.setState :
          'useUssrState';

        const effects = Array.isArray(effectName) ?
          effectName :
          [effectName];

        const stateNames = Array.isArray(setStateName) ?
          setStateName :
          [setStateName];

        effects.forEach(effect => {
          // eslint-disable-next-line sonarjs/no-collapsible-if
          if (path.node.callee.name === effect) {
            if (path.node.arguments.length < 2) {
              createDummy(globalCache, id, 'effect');
              const effectID = `effect-${id}-${globalCache[id].effect++}`;
              path.node.arguments.push(t.StringLiteral(effectID));
            }
          }
        });

        stateNames.forEach(stateName => {
          // eslint-disable-next-line sonarjs/no-collapsible-if
          if (path.node.callee.name === stateName) {
            if (path.node.arguments.length < 2) {
              createDummy(globalCache, id, 'setState');
              const setStateID = `state-${id}-${globalCache[id].setState++}`;
              path.node.arguments.push(t.StringLiteral(setStateID));
            }
          }
        });
      }
    }
  };
};

module.exports = BabelUssrPlugin;
