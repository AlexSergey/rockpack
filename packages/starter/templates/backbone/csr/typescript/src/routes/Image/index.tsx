import React from 'react';
import { Helmet } from 'react-helmet';
import styles from './styles.module.scss';
import Image from '../../components/Image';
import { useImage } from '../../features/Image';

export default (): JSX.Element => {
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
