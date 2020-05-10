import 'normalize.css';
import React, { Fragment } from 'react';
import { Route, Redirect } from 'react-router-dom';
import loadable from '@loadable/component';
import { l, useI18n } from '@rock/localazer';
import { LoggerContainer } from '@rock/log';
import { toast, ToastContainer } from 'react-toastify';
import { Switch } from '../utils/RouteSwitch';
import { Layout } from './_components/Layout';
import { RightBar } from './_components/Rightbar';
import { logger } from '../utils/logger';

import '../assets/styles/global.scss';
import { useCurrentLanguage, getLanguages } from '../localization';

const Home = loadable(() => import('./routes/Home'));
const Books = loadable(() => import('./routes/Books'));
/*
const Posts = loadable(() => import('./routes/Posts'));*/

const notify = (level, text, isImportant): void => {
  if (isImportant) {
    switch (level) {
      case 'log':
        toast.success(text);
        break;
      case 'info':
        toast.info(text);
        break;
      case 'warn':
        toast.warn(text);
        break;
      case 'error':
        toast.error(text);
        break;
    }
  }
};

export const App = (): JSX.Element => {
  const i18n = useI18n();
  const languages = getLanguages();
  const currentLanguage = useCurrentLanguage();

  setTimeout(() => {
    logger.log(l('Hello super test')(i18n), true);
  }, 1000);

  return (
    <LoggerContainer logger={logger} stdout={notify}>
      <Layout>
        <RightBar>
          <div>Test</div>
        </RightBar>
        <Switch>
          {languages.map((language) => {
            const prefix = `/${language}`;

            return (
              <Fragment key={prefix}>
                <Route path={prefix} component={Home} exact />
                <Route path={`${prefix}/books`} component={Books} />
              </Fragment>
            );
          })}
          <Redirect to={`/${currentLanguage}`} />

          {/*<Route path="/books" component={Books} />
      <Route path="/posts" component={Posts} />*/}
        </Switch>
        <ToastContainer />
      </Layout>
    </LoggerContainer>
  );
};
