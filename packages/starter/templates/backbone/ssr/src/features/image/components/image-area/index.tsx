import { Image } from '../../../../components/image';
import { useImage } from '../../hooks';

import styles from './styles.module.scss';

export const ImageArea = (): JSX.Element => {
  const [loading, error, url] = useImage();

  return (
    <div className={styles['image-holder']}>
      <Image loading={loading} error={error} url={url} />
    </div>
  );
};
