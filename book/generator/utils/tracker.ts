import { useEffect, createElement } from 'react';
import ReactGA from 'react-ga';
import { useLocation } from 'react-router-dom';

const withTracker = (WrappedComponent: JSX.Element, options = {}): JSX.Element => {
  const trackPage = (page): void => {
    ReactGA.set({
      page,
      ...options
    });
    ReactGA.pageview(page);
  };

  const HOC = (): JSX.Element => {
    const location = useLocation();
    useEffect(() => trackPage(location.pathname), [
      location.pathname
    ]);

    return WrappedComponent;
  };

  return createElement(HOC);
};

export default withTracker;
