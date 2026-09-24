import React from 'react';

import './style.css';

type LinkProps = {
  title: string;
  url: string;
};

export const Link: React.FC<LinkProps> = ({ title, url }) => <a href={url}>{title}</a>;
