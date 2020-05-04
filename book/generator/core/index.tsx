import React from 'react';
import { render } from 'react-dom';
import GoogleAnalytics from 'react-ga';
import { isObject, isString } from 'valid-types';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router-dom';
import Layout from '../layout';
import findPathToActiveRoute from '../utils/findPathToActiveRoute';
import openIdGenerate from '../utils/openIdGenerate';
import mergeUrls from '../utils/mergeUrls';
import validation from '../utils/validation';
import { LangWrapper } from './LangWrapper';
import { OpenIds } from './OpenIds';
import { ExternalPropsInterface } from '../types';

const history = createBrowserHistory();

export const createDocumentation = (props: ExternalPropsInterface, el: HTMLDivElement) => {
  if (!(el instanceof HTMLElement)) {
    // eslint-disable-next-line no-console
    console.error('DOM element is invalid');
    return false;
  }
  const isValid = validation(props);

  if (!isValid) {
    // eslint-disable-next-line no-console
    console.error('props is invalid');
    return false;
  }

  const hasRoutes = Array.isArray(props.docgen);

  if (hasRoutes) {
    mergeUrls(props.docgen);
  }
  const allOpened = hasRoutes ? openIdGenerate(props.docgen, []) : [];

  let openIds = [];
  openIds = allOpened;
  let found = false;

  if (isString(props.ga)) {
    GoogleAnalytics.initialize(props.ga);
  }

  if (Array.isArray(props.docgen)) {
    props.docgen.forEach(section => {
      const pathToRoute = findPathToActiveRoute(document.location.pathname, section, []);

      if (pathToRoute.length > 0) {
        if (!found) {
          openIds = pathToRoute;
          found = true;
        }
        setTimeout(() => {
          const activeElement = document.getElementById(pathToRoute[pathToRoute.length - 1]);

          if (activeElement) {
            activeElement.scrollIntoView();
          }
        }, 300);
      }
    });
  }

  const languages = isObject(props.localization) ? Object.keys(props.localization) : false;

  const handleOpen = (setOpenIds) => {
    setTimeout(() => {
      let found = false;

      if (Array.isArray(props.docgen)) {
        props.docgen.forEach(section => {
          const pathToRoute = findPathToActiveRoute(document.location.pathname, section, []);

          if (pathToRoute.length > 0) {
            if (!found) {
              setOpenIds(pathToRoute);

              setTimeout(() => {
                const activeElement = document.getElementById(pathToRoute[pathToRoute.length - 1]);

                if (activeElement) {
                  activeElement.scrollIntoView();
                }
              }, 300);
              found = true;
            }
          }
        });
      }
    });
  };

  render((
    <Router history={history}>
      <LangWrapper {...props}>
        {(isLocalized, activeLang, changeLocal) => (
          <OpenIds {...props} openIds={openIds}>
            {(openIds, setOpenIds) => (
              <Layout {...Object.assign({}, props, {
                openIds,
                hasRoutes,
                isLocalized,
                activeLang,
                changeLocal,
                languages,
                toggleOpenId: () => {
                  console.log(setOpenIds);
                  handleOpen(openIds);
                }
              })}
              />
            )}
          </OpenIds>
        )}
      </LangWrapper>
    </Router>
  ), el);
};
