import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

const _Route = props => {
  return (
    <Switch>
      {props.sections.reduce((prev, curr) => {
        prev = prev.concat(curr.routes);
        return prev;
      }, []).map(route => {
        return <Route exact={true} key={route.url} path={route.url} component={() => props.children(route.content, props.sections)} />
      })}
      <Redirect from="/" to="/" />
    </Switch>
  )
};

export default _Route;
