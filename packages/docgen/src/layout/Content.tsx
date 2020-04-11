import React from 'react';
import { makeStyles } from '@material-ui/core';
import stylesContent from '../assets/jss/material-dashboard-react/layouts/adminStyle';

// @ts-ignore
const useStylesContent = makeStyles(stylesContent);

interface ContentInterface {
  children: JSX.Element;
}

const Content = ({ children }: ContentInterface) => {
  const classesContent = useStylesContent();
  
  return (
    <div className={classesContent.content} style={{ minHeight: 'auto', float: 'left', width: '100%' }}>
      <div className={classesContent.container}>
        {children}
      </div>
    </div>
  );
};

export default Content;
