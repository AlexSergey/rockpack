import { useEffect, createElement } from 'react';
import ReactGA from 'react-ga';
import { withRouter } from 'react-router';

export const withTracker = (WrappedComponent, options = {}) => {
    const trackPage = page => {
        ReactGA.set({
            page,
            ...options
        });
        ReactGA.pageview(page);
    };

    const HOC = withRouter(props => {
        useEffect(() => trackPage(props.location.pathname), [
            props.location.pathname
        ]);

        return WrappedComponent;
    });

    return createElement(HOC);
};

export default withTracker;
