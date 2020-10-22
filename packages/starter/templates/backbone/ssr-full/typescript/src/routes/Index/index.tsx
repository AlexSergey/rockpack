import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import useStyles from 'isomorphic-style-loader/useStyles';
import Navigation from './components/Navigation';
import styles from './styles.module.scss';

const Index = ({ children }): JSX.Element => {
  useStyles(styles);

  return (
    <div>
      <Navigation />
      <div className={styles.wrapper}>
        {children}
      </div>
    </div>
  );
};

Index.propTypes = {
  children: PropTypes.element.isRequired,
};

export default Index;
