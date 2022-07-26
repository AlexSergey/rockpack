import { drawerWidth, transition, container } from '../../material-dashboard-react.js';

const appStyle = (theme) => ({
  container,
  content: {
    marginTop: '70px',
    minHeight: 'calc(100vh - 123px)',
    padding: '30px 15px',
  },
  mainPanel: {
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
    float: 'left',
    overflow: 'auto',
    position: 'relative',
    ...transition,
    maxHeight: '100%',
    overflowScrolling: 'touch',
    width: '100%',
  },
  map: {
    marginTop: '70px',
  },
  wrapper: {
    direction: 'rtl',
    height: '100vh',
    position: 'relative',
    top: '0',
  },
});

export default appStyle;
