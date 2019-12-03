const openIdGenerate = (props) => {
  let s = 0;
  let openedId = [];

  props.sections.forEach(section => {
    let nodeId = String(s += 1);
    section.nodeId = nodeId;
    openedId.push(nodeId);

    if (Array.isArray(section.routes)) {
      section.routes.forEach(route => {
        let nodeId = String(s += 1);
        route.nodeId = nodeId;
        openedId.push(nodeId);

        if (Array.isArray(route.content.component)) {
          route.content.component.forEach(c => {
            let nodeId = String(s += 1);
            c.nodeId = nodeId;
          })
        }
      });
    }
  });

  return openedId;
};

export default openIdGenerate;
