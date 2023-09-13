import { Modal } from 'antd';
import { useState } from 'react';
import Masonry from 'react-masonry-css';

import { config } from '../../../config';

import styles from './style.module.scss';

export const Images = ({ images }: { images: { uri: string; thumbnail: string }[] }): JSX.Element => {
  const [full, setFull] = useState<string | false>(false);

  return (
    <div className={styles.images}>
      <Masonry breakpointCols={3} className={styles.grid} columnClassName={styles['grid-column']}>
        {images.map((image) => (
          <img
            key={image.thumbnail}
            src={`${config.api}/${image.thumbnail}`}
            alt=""
            onClick={(): void => setFull(image.uri)}
          />
        ))}
      </Masonry>
      <Modal
        className={styles.full}
        open={typeof full === 'string'}
        onCancel={(): void => setFull(false)}
        footer={null}
        title={null}
      >
        <img src={`${config.api}/${full}`} alt="" />
      </Modal>
    </div>
  );
};
