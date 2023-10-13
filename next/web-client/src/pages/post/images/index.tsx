import { Modal } from 'antd';
import { ReactElement, useState } from 'react';
import Masonry from 'react-masonry-css';

import { config } from '../../../config';
import styles from './style.module.scss';

export const Images = ({ images }: { images: { thumbnail: string; uri: string }[] }): ReactElement => {
  const [full, setFull] = useState<false | string>(false);

  return (
    <div className={styles.images}>
      <Masonry breakpointCols={3} className={styles.grid} columnClassName={styles['grid-column']}>
        {images.map((image) => (
          <img
            alt=""
            key={image.thumbnail}
            onClick={(): void => setFull(image.uri)}
            src={`${config.api}/${image.thumbnail}`}
          />
        ))}
      </Masonry>
      <Modal
        className={styles.full}
        footer={null}
        onCancel={(): void => setFull(false)}
        open={typeof full === 'string'}
        title={null}
      >
        <img alt="" src={`${config.api}/${full}`} />
      </Modal>
    </div>
  );
};
