import React, { useState } from 'react';
import { Modal } from 'antd';
import Masonry from 'react-masonry-css';
import useStyles from 'isomorphic-style-loader/useStyles';
import styles from './style.module.scss';
import config from '../../../config';

export const Images = ({ images }: { images: { uri: string; thumbnail: string }[] }): JSX.Element => {
  useStyles(styles);

  const [full, setFull] = useState<string|false>(false);

  return (
    <div className={styles.images}>
      <Masonry
        breakpointCols={3}
        className={styles.grid}
        columnClassName={styles['grid-column']}
      >
        {images.map(image => (
          // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
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
        visible={typeof full === 'string'}
        onCancel={(): void => setFull(false)}
        footer={null}
        title={null}
      >
        <img src={`${config.api}/${full}`} alt="" />
      </Modal>
    </div>
  );
};
