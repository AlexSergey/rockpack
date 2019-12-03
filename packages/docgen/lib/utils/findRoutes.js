const findRoutes = (current, sections) => {
  let prev;
  let next;

  sections.forEach((section, sectionIndex) => {
    section.routes.forEach((route, index) => {
      if (route.url === current) {
        let prevIndex = index - 1;
        let prevSectionIndex = index - 1;
        let nextIndex = index + 1;
        let nextSectionIndex = index + 1;
        // Prev
        if (section.routes[prevIndex]) {
          prev = {
            url: section.routes[prevIndex].url,
            title: section.routes[prevIndex].title
          };
        }
        else {
          if (sections[prevSectionIndex] &&
            sections[prevSectionIndex].routes) {
            if (Array.isArray(sections[prevSectionIndex].routes)) {
              prev = {
                url: sections[prevSectionIndex].routes[sections[prevSectionIndex].routes.length].url,
                title: sections[prevSectionIndex].routes[sections[prevSectionIndex].routes.length].title
              };
            }
            else if (typeof sections[prevSectionIndex].routes.url === 'string') {
              prev = {
                url: sections[prevSectionIndex].routes.url,
                title: sections[prevSectionIndex].routes.title
              };
            }
          }
        }
        // NEXT
        if (section.routes[nextIndex]) {
          next = {
            url: section.routes[nextIndex].url,
            title: section.routes[nextIndex].title
          };
        }
        else {
          if (sections[nextSectionIndex] &&
            sections[nextSectionIndex].routes) {
            if (Array.isArray(sections[nextSectionIndex].routes)) {
              next = {
                url: sections[nextSectionIndex].routes[0].url,
                title: sections[nextSectionIndex].routes[0].title
              };
            }
            else if (typeof sections[nextSectionIndex].routes.url === 'string') {
              next = {
                url: sections[prevSectionIndex].routes.url,
                title: sections[prevSectionIndex].routes.title
              };
            }
          }
        }
      }
    });
  });
  return { prev, next };
};

export default findRoutes;
