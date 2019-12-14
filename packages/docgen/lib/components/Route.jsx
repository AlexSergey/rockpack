import React, { cloneElement, isValidElement } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

const _Route = props => {
    const TreeRouteRender = (route, output) => {
        if (!route) {
            return output;
        }
        if (Array.isArray(route)) {
            route.map(s => TreeRouteRender(s, output));
            return output;
        }
        if (!route.url) {
            output.push(() => props.children(route));
            return output;
        }
        let renderInAnotherRoute = [];
        let renderInside = [];
        renderInside.push(route);

        if (route.children) {
            (Array.isArray(route.children) ? route.children : [route.children]).map(r => {
                if (!r.url) {
                    renderInside.push(r);
                }
                else {
                    renderInAnotherRoute.push(r);
                }
            });
        }

        output.push(<Route exact path={route.url} component={() => props.children(renderInside)}/>);

        if (renderInAnotherRoute.length > 0) {
            renderInAnotherRoute.map(r => {
                TreeRouteRender(r, output);
            })
        }

        return output;
    };
  return (
    <Switch>
        {TreeRouteRender(props.docgen, []).map((route, index) => {
            return isValidElement(route) && cloneElement(route, { key: index });
        })}
      <Redirect from="/" to="/" />
    </Switch>
  )
};

export default _Route;
