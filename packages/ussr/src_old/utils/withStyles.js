import _withStyles from 'isomorphic-style-loader/withStyles';

const withStyles = styles => Component => {
    return !!global.USSR_IN_PRODUCTION ? Component : _withStyles(styles)(Component);
};

export default withStyles;
