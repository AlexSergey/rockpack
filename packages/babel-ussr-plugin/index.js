function getTarget(caller) {
  return caller && caller.target;
}

const BabelUssrPlugin = (api) => {
  const t = api.types;
  let effectIndex = 0;
  let setStateIndex = 0;

  api.caller(getTarget);

  return {
    name: 'ussr',
    visitor: {
      CallExpression(path, { opts: options }) {
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
              const effectID = `effect-${effectIndex++}`;
              path.node.arguments.push(t.StringLiteral(effectID));
            }
          }
        });

        stateNames.forEach(stateName => {
          // eslint-disable-next-line sonarjs/no-collapsible-if
          if (path.node.callee.name === stateName) {
            if (path.node.arguments.length < 2) {
              const setStateID = `state-${setStateIndex++}`;
              path.node.arguments.push(t.StringLiteral(setStateID));
            }
          }
        });
      }
    }
  };
};

module.exports = BabelUssrPlugin;
