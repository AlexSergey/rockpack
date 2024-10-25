import { History } from 'history';
import { ReactElement, useLayoutEffect, useState } from 'react';
import { Router as BaseRouter } from 'react-router-dom';

interface CustomRouter {
  basename?: string;
  children: ReactElement;
  history: History;
}

export const Router = ({ basename, children, history }: CustomRouter): ReactElement => {
  const [state, setState] = useState({
    action: history.action,
    location: history.location,
  });

  useLayoutEffect(() => history.listen(setState), [history]);

  return (
    <BaseRouter basename={basename} location={state.location} navigationType={state.action} navigator={history}>
      {children}
    </BaseRouter>
  );
};

Router.defaultProps = {
  basename: '/',
};
