import React, { Fragment } from 'react';
import { Redirect, Route } from 'react-router-dom';
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
          <Route path={prefix} component={Posts} exact />
          <Route path={`${prefix}/posts/:postId`} component={Post} />
          <Route
            path={`${prefix}/users`}
            component={(): JSX.Element => (
              <Access forRoles={[Roles.admin]} fallback={(): JSX.Element => <Redirect to={`/${currentLanguage}`} />}>
                <Users />
              </Access>
            )}
          />
        </Fragment>
      );
    })}
    <Redirect to={`/${currentLanguage}`} />
  </Switch>
);
