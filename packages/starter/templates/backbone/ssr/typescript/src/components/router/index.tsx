import { History } from 'history';
import { ReactNode, useLayoutEffect, useState } from 'react';
import { Router as BaseRouter } from 'react-router-dom';

interface IRouterProps {
  basename?: string;
  children: ReactNode;
  history: History;
}

export const Router = ({ basename, children, history }: IRouterProps): JSX.Element => {
  const [state, setState] = useState({
    action: history.action,
    location: history.location,
  });

  useLayoutEffect(() => history.listen(setState), [history]);

  return (
    <BaseRouter
      basename={basename as string}
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
