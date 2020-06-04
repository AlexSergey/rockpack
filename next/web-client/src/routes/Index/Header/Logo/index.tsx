import React from 'react';
import { Link } from 'react-router-dom';
import { useCurrentLanguage } from '../../../../features/Localization';

export const Logo = (): JSX.Element => {
  const currentLanguage = useCurrentLanguage();

  return (
    <Link to={`/${currentLanguage}/`}>Posts</Link>
  );
};
