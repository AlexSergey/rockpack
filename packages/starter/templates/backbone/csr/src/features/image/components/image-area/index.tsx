import { ReactElement } from 'react';

import { Image } from '../../../../components/image';
import { useImage } from '../../image.hooks';
import * as styles from './styles.module.scss';

export const ImageArea = (): ReactElement => {
  const [loading, error, url] = useImage();

  return (
    <div className={styles['image-holder']}>
      <Image error={error} loading={loading} url={url} />
    </div>
  );
};
