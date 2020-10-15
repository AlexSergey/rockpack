import React from 'react';
import { Helmet } from 'react-helmet-async';
import Logo from './logo.component.svg';

const Home = (): JSX.Element => (
  <>
    <Helmet>
      <title>Home Page</title>
      <meta name="description" content="Home page" />
    </Helmet>
    <div>
      <Logo />
    </div>
  </>
);

export default Home;
