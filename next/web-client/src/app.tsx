import loadable from '@loadable/component';
import 'antd/dist/antd.css';
import logger, { LoggerContainer } from 'logrock';
import { Fragment, ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import 'reset-css';

import './assets/styles/global.scss';
import { config } from './config';
import { useCurrentLanguage } from './features/localization';
import { Access, useAuthorization } from './features/user';
import { Main } from './pages/main';
import { Roles } from './types/user';
import { notify } from './utils/notifier';

const Posts = loadable(() => import('./pages/posts/posts.loadable'));
const Post = loadable(() => import('./pages/post/post.loadable'));
const Users = loadable(() => import('./pages/users/users.loadable'));

export const App = (): ReactElement => {
  const currentLanguage = useCurrentLanguage();

  useAuthorization();

  return (
    <LoggerContainer logger={logger} stdout={notify}>
      <Main>
        <Routes>
          {config.languages.map((language): ReactElement => {
            const prefix = `/${language}`;

            return (
              <Fragment key={prefix}>
                <Route element={<Posts />} path={prefix} />
                <Route element={<Post />} path={`${prefix}/posts/:postId`} />
                <Route
                  element={
                    <Access
                      fallback={(): ReactElement => <Navigate to={`/${currentLanguage}`} />}
                      forRoles={[Roles.admin]}
                    >
                      <Users />
                    </Access>
                  }
                  path={`${prefix}/users`}
                />
              </Fragment>
            );
          })}
          <Route element={<Navigate to={`/${currentLanguage}`} />} path="*" />
        </Routes>
      </Main>
    </LoggerContainer>
  );
};
