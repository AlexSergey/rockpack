// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import styles from './styles.module.scss';

const Image = ({ loading, error, url }) => (
  <div className={styles.img}>
    {loading && <p>Loading...</p>}
    {error && <p>Error, try again</p>}
    <img width="200px" alt="random" src={url} />
  </div>
);

Image.propTypes = {
  loading: PropTypes.bool.isRequired,
  error: PropTypes.bool.isRequired,
  url: PropTypes.string.isRequired,
};

export default Image;
