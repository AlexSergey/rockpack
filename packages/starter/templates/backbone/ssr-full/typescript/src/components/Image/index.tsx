import React from 'react';
import useStyles from 'isomorphic-style-loader/useStyles';
import styles from './styles.module.scss';

interface ImageInterface {
  loading: boolean;
  error: boolean;
  url: string;
}

const Image = ({ loading, error, url }: ImageInterface): JSX.Element => {
  useStyles(styles);

  return (
    <div className={styles.img}>
      {loading && <p>Loading...</p>}
      {error && <p>Error, try again</p>}
      <img width="200px" alt="random" src={url} />
    </div>
  );
};

export default Image;
