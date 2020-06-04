import 'reset-css';
import 'antd/dist/antd.css';
import './assets/styles/global.scss';
import React, { Fragment } from 'react';
import { Redirect, Route } from 'react-router-dom';
import loadable from '@loadable/component';
import { LoggerContainer } from '@rockpack/logger';
import { Switch } from './utils/RouteSwitch';
import { logger } from './utils/logger';
import { notify } from './utils/notifier';
import { useCurrentLanguage } from './features/Localization';
import { Access, useAuthorization } from './features/User';
import { Roles } from './types/User';
import { Index } from './routes/Index';
import config from './config';

const Posts = loadable(() => import('./routes/Posts'));
const Post = loadable(() => import('./routes/Post'));
const Users = loadable(() => import('./routes/Users'));

export const App = (): JSX.Element => {
  const currentLanguage = useCurrentLanguage();

  useAuthorization();

  return (
    <LoggerContainer logger={logger} stdout={notify}>
      <Index>
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
      </Index>
    </LoggerContainer>
  );
};
