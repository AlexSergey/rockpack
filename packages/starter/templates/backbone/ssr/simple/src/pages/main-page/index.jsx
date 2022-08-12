import PropTypes from 'prop-types';

import { Navigation } from './components/navigation';
import styles from './styles.module.scss';

export const MainPage = ({ children }) => (
  <div>
    <Navigation />
    <div className={styles.wrapper}>{children}</div>
  </div>
);

MainPage.propTypes = {
  children: PropTypes.element.isRequired,
};
