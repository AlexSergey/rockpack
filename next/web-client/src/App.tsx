import 'reset-css';
import 'antd/dist/antd.css';
import './assets/styles/global.scss';
import React, { Fragment } from 'react';
import logger, { LoggerContainer } from 'logrock';
import loadable from '@loadable/component';
import { Navigate, Route, Routes } from 'react-router-dom';
import { notify } from './utils/notifier';
import { useCurrentLanguage } from './features/Localization';
import { useAuthorization, Access } from './features/User';
import { Main } from './pages/Main';
import { Roles } from './types/User';
import config from './config';

const Posts = loadable(() => import('./pages/Posts'));
const Post = loadable(() => import('./pages/Post'));
const Users = loadable(() => import('./pages/Users'));

export const App = (): JSX.Element => {
  const currentLanguage = useCurrentLanguage();

  useAuthorization();

  return (
    <LoggerContainer logger={logger} stdout={notify}>
      <Main>
        <Routes>
          {config.languages.map((language): JSX.Element => {
            const prefix = `/${language}`;

            return (
              <Fragment key={prefix}>
                <Route path={prefix} index element={<Posts />} />
                <Route path={`${prefix}/posts/:postId`} element={<Post />} />
                <Route
                  path={`${prefix}/users`}
                  element={(
                    <Access
                      forRoles={[Roles.admin]}
                      /* eslint-disable-next-line react/no-unstable-nested-components */
                      fallback={(): JSX.Element => <Navigate to={`/${currentLanguage}`} />}
                    >
                      <Users />
                    </Access>
                  )}
                />
              </Fragment>
            );
          })}
          <Route
            path="*"
            element={<Navigate to={`/${currentLanguage}`} />}
          />
        </Routes>
      </Main>
    </LoggerContainer>
  );
};
