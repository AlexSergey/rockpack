import { ReactElement } from 'react';
import { Helmet } from 'react-helmet-async';

import Logo from './logo.component.svg';

const Home = (): ReactElement => (
  <>
    <Helmet>
      <title>Home Page</title>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <meta content="Home page" name="description" />
    </Helmet>
    <div>
      <Logo />
      <p>
        This project generated by <strong>Rockpack</strong>. Please read official{' '}
        <a href="https://alexsergey.github.io/rockpack/" rel="noopener noreferrer" target="_blank">
          documentation
        </a>
        .
      </p>
    </div>
  </>
);

export default Home;
