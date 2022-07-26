import {
  container,
  defaultFont,
  primaryColor,
  defaultBoxShadow,
  infoColor,
  successColor,
  warningColor,
  dangerColor,
  whiteColor,
  grayColor,
} from '../../material-dashboard-react.js';

const headerStyle = () => ({
  appBar: {
    border: '0',
    borderBottom: '0',
    borderRadius: '3px',
    boxShadow: 'none',
    color: grayColor[7],
    display: 'block',
    marginBottom: '0',
    minHeight: '50px',
    padding: '10px 0',
    paddingTop: '10px',
    position: 'absolute',
    transition: 'all 150ms ease 0s',
    width: '100%',
    zIndex: '1029',
  },
  appResponsive: {
    top: '8px',
  },
  container: {
    ...container,
    minHeight: '50px',
  },
  danger: {
    backgroundColor: dangerColor[0],
    color: whiteColor,
    ...defaultBoxShadow,
  },
  flex: {
    flex: 1,
  },
  info: {
    backgroundColor: infoColor[0],
    color: whiteColor,
    ...defaultBoxShadow,
  },
  primary: {
    backgroundColor: primaryColor[0],
    color: whiteColor,
    ...defaultBoxShadow,
  },
  success: {
    backgroundColor: successColor[0],
    color: whiteColor,
    ...defaultBoxShadow,
  },
  title: {
    ...defaultFont,
    borderRadius: '3px',
    color: 'inherit',
    fontSize: '18px',
    '&:hover,&:focus': {
      background: 'transparent',
    },
    letterSpacing: 'unset',
    lineHeight: '30px',
    margin: '0',
    textTransform: 'none',
  },
  warning: {
    backgroundColor: warningColor[0],
    color: whiteColor,
    ...defaultBoxShadow,
  },
});

export default headerStyle;
