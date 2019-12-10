const findRoutes = (current, sections) => {
    let prev;
    let next;

    sections.forEach((section, sectionIndex) => {
        section.routes.forEach((route, index) => {
            if (route.url === current) {
                let prevIndex = index - 1;
                let prevSectionIndex = sectionIndex - 1;
                let nextIndex = index + 1;
                let nextSectionIndex = sectionIndex + 1;
                // Prev
                if (section.routes[prevIndex]) {
                    prev = {
                        url: section.routes[prevIndex].url,
                        title: section.routes[prevIndex].title,
                        nodeId: section.routes[prevIndex].nodeId
                    };
                }
                else {
                    if (sections[prevSectionIndex] &&
                        sections[prevSectionIndex].routes) {
                        if (Array.isArray(sections[prevSectionIndex].routes)) {
                            prev = {
                                url: sections[prevSectionIndex].routes[sections[prevSectionIndex].routes.length - 1].url,
                                title: sections[prevSectionIndex].routes[sections[prevSectionIndex].routes.length - 1].title,
                                nodeId: sections[prevSectionIndex].routes[sections[prevSectionIndex].routes.length - 1].nodeId
                            };
                        }
                        else if (typeof sections[prevSectionIndex].routes.url === 'string') {
                            prev = {
                                url: sections[prevSectionIndex].routes.url,
                                title: sections[prevSectionIndex].routes.title,
                                nodeId: sections[prevSectionIndex].routes.nodeId
                            };
                        }
                    }
                }

                // NEXT
                if (section.routes[nextIndex]) {
                    next = {
                        url: section.routes[nextIndex].url,
                        title: section.routes[nextIndex].title,
                        nodeId: section.routes[nextIndex].nodeId
                    };
                }
                else {
                    if (sections[nextSectionIndex] &&
                        sections[nextSectionIndex].routes) {
                        if (Array.isArray(sections[nextSectionIndex].routes)) {
                            next = {
                                url: sections[nextSectionIndex].routes[0].url,
                                title: sections[nextSectionIndex].routes[0].title,
                                nodeId: sections[nextSectionIndex].routes[0].nodeId
                            };
                        }
                        else if (typeof sections[nextSectionIndex].routes.url === 'string') {
                            next = {
                                url: sections[nextSectionIndex].routes.url,
                                title: sections[nextSectionIndex].routes.title,
                                nodeId: sections[nextSectionIndex].routes.nodeId
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
