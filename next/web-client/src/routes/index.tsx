/* eslint-disable react/no-unstable-nested-components */
import React, { createElement, Fragment } from 'react';
import { Navigate, Route } from 'react-router-dom';
import loadable from '@loadable/component';
import { Access } from '../features/User';
import { Roles } from '../types/User';
import { Switch } from '../utils/RouteSwitch';
import config from '../config';
import { Languages } from '../types/Localization';

const Posts = loadable(() => import('./Posts'));
const Post = loadable(() => import('./Post'));
const Users = loadable(() => import('./Users'));

export const Routes = ({ currentLanguage }: { currentLanguage: Languages }): JSX.Element => (
  <Switch>
    {config.languages.map((language): JSX.Element => {
      const prefix = `/${language}`;

      return (
        <Fragment key={prefix}>
          <Route path={prefix} element={<Posts />} />
          <Route path={`${prefix}/posts/:postId`} element={<Post />} />
          <Route
            path={`${prefix}/users`}
            element={createElement((): JSX.Element => (
              <Access forRoles={[Roles.admin]} fallback={(): JSX.Element => <Navigate to={`/${currentLanguage}`} />}>
                <Users />
              </Access>
            ))}
          />
        </Fragment>
      );
    })}
    <Route
      path="*"
      element={<Navigate to={`/${currentLanguage}`} />}
    />
  </Switch>
);
