const BabelUssrPlugin = ({ types: t }) => {
  let effectIndex = 0;
  let setStateIndex = 0;

  return {
    visitor: {
      CallExpression(path, { opts: options }) {
        const effectName = options && typeof options.effect === 'string' ?
          options.effect :
          'ssrEffect';

        const setStateName = options && typeof options.effect === 'string' ?
          options.setState :
          'ssrSetState';

        // eslint-disable-next-line sonarjs/no-collapsible-if
        if (path.node.callee.name === effectName) {
          if (path.node.arguments.length < 2) {
            const effectID = `effect-${effectIndex++}`;
            path.node.arguments.push(t.StringLiteral(effectID));
          }
        }
        // eslint-disable-next-line sonarjs/no-collapsible-if
        if (path.node.callee.name === setStateName) {
          if (path.node.arguments.length < 2) {
            const setStateID = `state-${setStateIndex++}`;
            path.node.arguments.push(t.StringLiteral(setStateID));
          }
        }
      }
    }
  };
};

module.exports = BabelUssrPlugin;
