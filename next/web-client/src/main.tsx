import 'reset-css';
import 'antd/dist/antd.css';
import './assets/styles/global.scss';
import React, { Fragment } from 'react';
import { Route, Redirect } from 'react-router-dom';
import loadable from '@loadable/component';
import { LoggerContainer } from '@rockpack/logger';
import { ToastContainer } from 'react-toastify';
import { Switch } from './utils/RouteSwitch';
import { logger } from './utils/logger';
import { notify } from './utils/notifier';
import { useCurrentLanguage, getLanguages } from './features/Localization';

import { Index } from './routes/Index';

const Posts = loadable(() => import('./routes/Posts'));
const PostDetails = loadable(() => import('./routes/PostDetails'));

export const App = (): JSX.Element => {
  const languages = getLanguages();
  const currentLanguage = useCurrentLanguage();

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
              </Fragment>
            );
          })}
          <Redirect to={`/${currentLanguage}`} />
        </Switch>
      </Index>
      <ToastContainer />
    </LoggerContainer>
  );
};
