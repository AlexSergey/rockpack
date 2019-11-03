import _withStyles from 'isomorphic-style-loader/withStyles';

const withStyles = (styles, isProduction = false) => Component => {
    return isProduction ? Component : _withStyles(styles)(Component);
};

export default withStyles;
