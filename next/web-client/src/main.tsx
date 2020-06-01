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
import { getLanguages, useCurrentLanguage } from './features/Localization';
import { Access, useGuard } from './features/AuthManager';
import { Roles } from './types/AuthManager';
import { Index } from './routes/Index';

const Posts = loadable(() => import('./routes/Posts'));
const PostDetails = loadable(() => import('./routes/PostDetails'));
const Users = loadable(() => import('./routes/Users'));

export const App = (): JSX.Element => {
  const languages = getLanguages();
  const currentLanguage = useCurrentLanguage();
  useGuard();

  return (
    <LoggerContainer logger={logger} stdout={notify}>
      <Index>
        <Switch>
          {languages.map((language) => {
            const prefix = `/${language}`;

            return (
              <Fragment key={prefix}>
                <Route path={prefix} component={Posts} exact />
                <Route path={`${prefix}/posts/:postId`} component={PostDetails} />
                <Route
                  path={`${prefix}/users`}
                  component={() => (
                    <Access forRoles={[Roles.admin]} fallback={() => <Redirect to={`/${currentLanguage}`} />}>
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
