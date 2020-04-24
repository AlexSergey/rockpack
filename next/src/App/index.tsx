import 'normalize.css';
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import loadable from '@loadable/component';
import '../assets/styles/global.scss';
import { Layout } from './_components/Layout';
import { RightBar } from './_components/Rightbar';

const Home = loadable(() => import('./routes/Home'));
/*const Books = loadable(() => import('./routes/Books'));
const Posts = loadable(() => import('./routes/Posts'));*/

export const App = (): JSX.Element => (
  <Layout>
    <>
      <RightBar>
        <div>Test</div>
      </RightBar>
      <Switch>
        <Route path="/" component={Home} exact />
        {/*<Route path="/books" component={Books} />
      <Route path="/posts" component={Posts} />*/}
      </Switch>
    </>
  </Layout>
);
