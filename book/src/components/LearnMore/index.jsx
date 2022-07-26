import React from 'react';
import { Link } from 'react-router-dom';

import style from './style.module.scss';

// eslint-disable-next-line react/prop-types
export const LearnMore = ({ url }) => (
  <Link to={url} className={style['learn-more']}>
    Learn More
  </Link>
);
