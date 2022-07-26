import { makeStyles } from '@material-ui/core';
import React from 'react';

import stylesContent from '../assets/jss/material-dashboard-react/layouts/adminStyle';

const useStylesContent = makeStyles(stylesContent);

interface ContentInterface {
  children: JSX.Element;
}

const Content = ({ children }: ContentInterface): JSX.Element => {
  const classesContent = useStylesContent();

  return (
    <div
      className={`${classesContent.content} content-section`}
      style={{ float: 'left', minHeight: 'auto', width: '100%' }}
    >
      <div className={classesContent.container}>{children}</div>
    </div>
  );
};

export default Content;
