import styles from './styles.module.scss';
import { useImage } from '../../hooks';
import Image from '../../../../components/Image';

export const ImageArea = () => {
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
