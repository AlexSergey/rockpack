import _withStyles from 'isomorphic-style-loader/withStyles';
import { notProduction } from '../utils/mode';

const withStyles = (styles) => Component => notProduction ? _withStyles(styles)(Component) : Component;

export default withStyles;
