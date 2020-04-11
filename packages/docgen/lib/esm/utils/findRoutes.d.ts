declare const findRoutes: (current: any, route: any) => {
    prev: {
        url: any;
        title: any;
        nodeId: any;
    };
    next: {
        url: any;
        title: any;
        nodeId: any;
    };
};
export default findRoutes;
