import { useEffect, createElement } from 'react';
import ReactGA from 'react-ga';
import { withRouter } from 'react-router';

const withTracker = (WrappedComponent, options = {}): JSX.Element => {
  const trackPage = (page): void => {
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
