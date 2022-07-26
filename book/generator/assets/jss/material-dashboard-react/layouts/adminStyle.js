import { drawerWidth, container } from '../../material-dashboard-react.js';

const appStyle = (theme) => ({
  container,
  content: {
    marginTop: '70px',
    maxWidth: '1000px',
    minHeight: 'calc(100vh - 123px)',
    padding: '30px 15px',
  },
  mainPanel: {
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
    float: 'right',
    maxHeight: '100%',
    overflow: 'auto',
    overflowScrolling: 'touch',
    position: 'relative',
    width: '100%',
  },
  map: {
    marginTop: '70px',
  },
  wrapper: {
    height: '100vh',
    position: 'relative',
    top: '0',
  },
});

export default appStyle;
