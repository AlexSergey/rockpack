import { createElement } from 'react';
//@ts-ignore
import _withStyles from 'isomorphic-style-loader/withStyles';

//@ts-ignore
const withStyles = styles => Component => {
    //@ts-ignore
    return !!global.USSR_IN_PRODUCTION ? Component : createElement(_withStyles(styles)(Component));
};

export default withStyles;
