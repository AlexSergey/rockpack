import React from 'react';
import useStyles from 'isomorphic-style-loader/useStyles';
import styles from './style.modules.scss';
import Image from '../../components/Image';
import { useImage } from '../../features/Image';

export default (): JSX.Element => {
  useStyles(styles);
  const [loading, error, url] = useImage();

  return (
    <div className={styles['image-holder']}>
      <Image
        loading={loading}
        error={error}
        url={url}
      />
    </div>
  );
};
