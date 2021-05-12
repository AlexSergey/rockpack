import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ImageArea } from '../../features/Image';

const Image = () => (
  <>
    <Helmet>
      <title>Image Page</title>
      <meta name="description" content="Image page" />
    </Helmet>
    <ImageArea />
  </>
);

export default Image;
