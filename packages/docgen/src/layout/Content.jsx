import React from 'react';
import { makeStyles } from '@material-ui/core';
import stylesContent from '../assets/jss/material-dashboard-react/layouts/adminStyle';

const useStylesContent = makeStyles(stylesContent);
const Content = ({ children }) => {
  const classesContent = useStylesContent();
  return (
    <div className={classesContent.content} style={{minHeight: 'auto', float: 'left', width: '100%'}}>
      <div className={classesContent.container}>
        {children}
      </div>
    </div>
  );
};

export default Content;
