import _withStyles from 'isomorphic-style-loader/withStyles';
import isNotProduction from './isNotProduction';

const withStyles = (styles) => Component => isNotProduction() ?
    _withStyles(styles)(Component) :
    Component;

export default withStyles;
