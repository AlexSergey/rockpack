import PropTypes from 'prop-types';

import styles from './styles.module.scss';

export const Image = ({ loading, error, url }) => (
  <div className={styles.img}>
    {loading && <p>Loading...</p>}
    {error && <p>Error, try again</p>}
    <img width="200px" alt="random" src={url} />
  </div>
);

Image.propTypes = {
  error: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  url: PropTypes.string.isRequired,
};
