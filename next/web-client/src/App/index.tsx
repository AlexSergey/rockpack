import 'reset-css';
import 'antd/dist/antd.css';
import React, { Fragment } from 'react';
import { Route, Redirect } from 'react-router-dom';
import loadable from '@loadable/component';
import { LoggerContainer } from '@rockpack/logger';
import { ToastContainer } from 'react-toastify';
import { Switch } from '../utils/RouteSwitch';
import { Layout } from './_components/Layout';
import { logger } from '../utils/logger';
import { notify } from '../utils/notifier';

import '../assets/styles/global.scss';
import { useCurrentLanguage, getLanguages } from '../localization';

const Index = loadable(() => import('./routes/Index'));
const User = loadable(() => import('./routes/User'));
const Post = loadable(() => import('./routes/Post'));

export const App = (): JSX.Element => {
  const languages = getLanguages();
  const currentLanguage = useCurrentLanguage();

  return (
    <LoggerContainer logger={logger} stdout={notify}>
      <Layout>
        <Switch>
          {languages.map((language) => {
            const prefix = `/${language}`;

            return (
              <Fragment key={prefix}>
                <Route path={prefix} component={Index} exact />
                <Route path={`${prefix}/posts/:postId`} component={Post} />
                <Route path={`${prefix}/users/:userId`} component={User} />
              </Fragment>
            );
          })}
          <Redirect to={`/${currentLanguage}`} />
        </Switch>
        <ToastContainer />
      </Layout>
    </LoggerContainer>
  );
};
