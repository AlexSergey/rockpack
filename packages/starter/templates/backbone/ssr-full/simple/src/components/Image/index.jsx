import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import useStyles from 'isomorphic-style-loader/useStyles';
import styles from './styles.module.scss';

const Image = ({ loading, error, url }) => {
  useStyles(styles);

  return (
    <div className={styles.img}>
      {loading && <p>Loading...</p>}
      {error && <p>Error, try again</p>}
      <img width="200px" alt="random" src={url} />
    </div>
  );
};

Image.propTypes = {
  loading: PropTypes.bool.isRequired,
  error: PropTypes.bool.isRequired,
  url: PropTypes.string.isRequired,
};

export default Image;
