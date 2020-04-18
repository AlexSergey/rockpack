import useUssr from './isomorphic/useUssr';
import loadableExtractor from './utils/loadableExtractor';

const createMiddleware = ({
    stats
}) => {
    const webExtractor = loadableExtractor({
        stats
    });
    return ({
        createStore,
        render,
        isProduction,
        liveReloadPort
    }) => {
        return async (ctx, next) => {
            await useUssr(ctx, {
                webExtractor,
                createStore,
                render,
                isProduction,
                liveReloadPort
            });
            await next();
        }
    }
}

export {
    createMiddleware
};
