import 'reset-css';
import 'antd/dist/antd.css';
import './assets/styles/global.scss';
import loadable from '@loadable/component';
import logger, { LoggerContainer } from 'logrock';
import React, { Fragment } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { config } from './config';
import { useCurrentLanguage } from './features/Localization';
import { useAuthorization, Access } from './features/User';
import { Main } from './pages/Main';
import { Roles } from './types/user';
import { notify } from './utils/notifier';

const Posts = loadable(() => import('./pages/Posts/posts.loadable'));
const Post = loadable(() => import('./pages/Post/post.loadable'));
const Users = loadable(() => import('./pages/Users/users.loadable'));

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
                <Route path={prefix} element={<Posts />} />
                <Route path={`${prefix}/posts/:postId`} element={<Post />} />
                <Route
                  path={`${prefix}/users`}
                  element={
                    <Access
                      forRoles={[Roles.admin]}
                      /* eslint-disable-next-line react/no-unstable-nested-components */
                      fallback={(): JSX.Element => <Navigate to={`/${currentLanguage}`} />}
                    >
                      <Users />
                    </Access>
                  }
                />
              </Fragment>
            );
          })}
          <Route path="*" element={<Navigate to={`/${currentLanguage}`} />} />
        </Routes>
      </Main>
    </LoggerContainer>
  );
};
