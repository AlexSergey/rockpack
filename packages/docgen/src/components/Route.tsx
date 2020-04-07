import React, { cloneElement, isValidElement } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import MetaTags from 'react-meta-tags';
import { isString } from 'valid-types';
import withTracker from '../utils/tracker';

const _Route = props => {
  const TreeRouteRender = (route, output, prefix) => {
    if (!route) {
      return output;
    }
    if (Array.isArray(route)) {
      route.map(s => TreeRouteRender(s, output, prefix));
      return output;
    }
    if (!route.url) {
      output.push(() => props.children(route));
      return output;
    }
    const renderInAnotherRoute = [];
    const renderInside = [];
    renderInside.push(route);
    
    if (route.children) {
      (Array.isArray(route.children) ? route.children : [route.children]).map(r => {
        if (!r.url) {
          renderInside.push(r);
        } else {
          renderInAnotherRoute.push(r);
        }
      });
    }
    
    output.push(
      <Route
        exact
        path={typeof prefix === 'string' ? `/${prefix}${route.url}` : route.url}
        component={() => (
          <>
            {route.meta && (
              <MetaTags>
                {isValidElement(route.meta) ?
                  route.meta :
                  (Array.isArray(route.meta) ?
                    route.meta.map((m, index) => (isValidElement(m) ?
                      cloneElement(m, { key: index }) :
                      null)) :
                    null)}
              </MetaTags>
            )}
            {isString(props.ga) ?
              withTracker(props.children(renderInside)) :
              props.children(renderInside)}
          </>
        )}
      />
    );
    
    if (renderInAnotherRoute.length > 0) {
      renderInAnotherRoute.map(r => {
        TreeRouteRender(r, output, prefix);
      });
    }
    
    return output;
  };
  return (
    <Switch>
      {props.isLocalized && Array.isArray(props.languages) ? props.languages.map(lang => (
        TreeRouteRender(props.docgen, [], lang, true)
          .map((route, index) => isValidElement(route) && cloneElement(route, { key: index }))
      )) : (
        TreeRouteRender(props.docgen, [])
          .map((route, index) => isValidElement(route) && cloneElement(route, { key: index }))
      )}
      {props.isLocalized && Array.isArray(props.languages) ? <Redirect from="/" to={`/${props.activeLang}`} /> :
        <Redirect from="/" to="/" />}
    
    </Switch>
  );
};

export default _Route;
