import 'normalize.css';
import React, { Fragment } from 'react';
import { Route, Redirect } from 'react-router-dom';
import loadable from '@loadable/component';
import { Switch } from '../utils/RouteSwitch';
import { Layout } from './_components/Layout';
import { RightBar } from './_components/Rightbar';

import '../assets/styles/global.scss';

const Home = loadable(() => import('./routes/Home'));
const Books = loadable(() => import('./routes/Books'));
/*
const Posts = loadable(() => import('./routes/Posts'));*/

export const App = ({
  currentLanguage,
  languages
}: { currentLanguage: string; languages: string[] }): JSX.Element => (
  <Layout>
    <>
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
    </>
  </Layout>
);
