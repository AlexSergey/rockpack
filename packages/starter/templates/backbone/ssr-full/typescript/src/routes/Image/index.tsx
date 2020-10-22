import React from 'react';
import { Helmet } from 'react-helmet-async';
import useStyles from 'isomorphic-style-loader/useStyles';
import styles from './styles.module.scss';
import Image from '../../components/Image';
import { useImage } from '../../features/Image';

export default (): JSX.Element => {
  useStyles(styles);
  const [loading, error, url] = useImage();

  return (
    <>
      <Helmet>
        <title>Image Page</title>
        <meta name="description" content="Image page" />
      </Helmet>
      <div className={styles['image-holder']}>
        <Image
          loading={loading}
          error={error}
          url={url}
        />
      </div>
    </>
  );
};
