export const middleware = store => next => action => {
    return next(action);
};
