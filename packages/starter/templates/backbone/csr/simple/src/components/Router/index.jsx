import { useLayoutEffect, useState } from 'react';
import { Router as BaseRouter } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';

// eslint-disable-next-line import/prefer-default-export
export const Router = ({
  basename,
  children,
  history,
}) => {
  const [state, setState] = useState({
    action: history.action,
    location: history.location,
  });

  useLayoutEffect(() => history.listen(setState), [history]);

  return (
    <BaseRouter
      basename={basename}
      location={state.location}
      navigationType={state.action}
      navigator={history}
    >
      {children}
    </BaseRouter>
  );
};

Router.defaultProps = {
  basename: '/',
};

Router.propTypes = {
  basename: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  history: PropTypes.shape({
    action: PropTypes.string,
    push: PropTypes.func,
    listen: PropTypes.func,
    // eslint-disable-next-line react/forbid-prop-types
    location: PropTypes.object,
  }).isRequired,
};
