import { Link } from 'react-router-dom';
import React from 'react';
import MetaTags from 'react-meta-tags';

const Secondary = (): JSX.Element => (
  <>
    <MetaTags>
      <title>Secondary</title>
      <meta name="description" content="Secondary page" />
    </MetaTags>
    <div>
      <h1>GRAPHQL BOOKS</h1>
      <Link to="/">Home</Link>
    </div>
  </>
);

export default Secondary;
