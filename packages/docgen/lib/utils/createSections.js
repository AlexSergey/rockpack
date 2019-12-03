import createRoutes from './createRoutes';

function createSections(props) {
  let sections = [];
  let hasSections = false;
  if (props.sections) {
    hasSections = true;
  }
  if (hasSections) {
    sections = props.sections.map(section => {
      let sec = {...section};
      if (section.name) {
        sec.routes = createRoutes(section.name, section.routes)
      }
      return sec;
    })
  }
  else {
    sections.push({
      routes: props.routes
    });
  }

  return sections;
}

export default createSections;
