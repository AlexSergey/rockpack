import React, { createElement, cloneElement, isValidElement } from 'react';
import MetaTags from 'react-meta-tags';
import { Navigate, Route, Routes } from 'react-router-dom';
import { isString } from 'valid-types';

import { InnerInterface } from '../types';
import withTracker from '../utils/tracker';

const _Route = (props: InnerInterface): JSX.Element => {
  const TreeRouteRender = (route, output, prefix?): JSX.Element[] => {
    if (!route) {
      return output;
    }
    if (Array.isArray(route)) {
      // eslint-disable-next-line sonarjs/no-ignored-return
      route.map((s) => TreeRouteRender(s, output, prefix));

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
      (Array.isArray(route.children) ? route.children : [route.children]).forEach((r) => {
        if (!r.url) {
          renderInside.push(r);
        } else {
          renderInAnotherRoute.push(r);
        }
      });
    }

    output.push(
      <Route
        path={typeof prefix === 'string' ? `/${prefix}${route.url}` : route.url}
        element={createElement(
          (): JSX.Element => (
            <>
              {route.meta && (
                <MetaTags>
                  {isValidElement(route.meta)
                    ? route.meta
                    : Array.isArray(route.meta)
                    ? route.meta.map((m, index) => (isValidElement(m) ? cloneElement(m, { key: index }) : null))
                    : null}
                </MetaTags>
              )}
              {isString(props.ga) ? withTracker(props.children(renderInside)) : props.children(renderInside)}
            </>
          ),
        )}
      />,
    );

    if (renderInAnotherRoute.length > 0) {
      // eslint-disable-next-line sonarjs/no-ignored-return
      renderInAnotherRoute.map((r) => TreeRouteRender(r, output, prefix));
    }

    return output;
  };

  return (
    <Routes>
      {props.isLocalized && Array.isArray(props.languages)
        ? props.languages.map((lang) =>
            TreeRouteRender(props.docgen, [], lang).map(
              (route, index) => isValidElement(route) && cloneElement(route, { key: index }),
            ),
          )
        : TreeRouteRender(props.docgen, []).map(
            (route, index) => isValidElement(route) && cloneElement(route, { key: index }),
          )}

      {props.isLocalized && Array.isArray(props.languages) ? (
        <Route path="/" element={<Navigate to={`/${props.activeLang}`} />} />
      ) : null}
    </Routes>
  );
};

export default _Route;
