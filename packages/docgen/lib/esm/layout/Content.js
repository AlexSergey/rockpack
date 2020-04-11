import React from 'react';
import { makeStyles } from '@material-ui/core';
import stylesContent from '../assets/jss/material-dashboard-react/layouts/adminStyle';
// @ts-ignore
const useStylesContent = makeStyles(stylesContent);
const Content = ({ children }) => {
    const classesContent = useStylesContent();
    return (React.createElement("div", { className: classesContent.content, style: { minHeight: 'auto', float: 'left', width: '100%' } },
        React.createElement("div", { className: classesContent.container }, children)));
};
export default Content;
