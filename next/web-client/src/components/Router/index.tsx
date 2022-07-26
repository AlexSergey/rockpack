import { History } from 'history';
import React, { useLayoutEffect, useState } from 'react';
import { Router as BaseRouter } from 'react-router-dom';

interface ICustomRouter {
  basename?: string;
  children: JSX.Element;
  history: History;
}

// eslint-disable-next-line import/prefer-default-export
export const Router = ({ basename, children, history }: ICustomRouter): JSX.Element => {
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
