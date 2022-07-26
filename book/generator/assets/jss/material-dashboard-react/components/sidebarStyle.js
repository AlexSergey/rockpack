import {
  drawerWidth,
  transition,
  boxShadow,
  defaultFont,
  primaryColor,
  primaryBoxShadow,
  infoColor,
  successColor,
  warningColor,
  dangerColor,
  whiteColor,
  grayColor,
  blackColor,
  hexToRgb,
} from '../../material-dashboard-react.js';

const sidebarStyle = (theme) => ({
  background: {
    height: '100%',
    display: 'block',
    position: 'absolute',
    left: '0',
    zIndex: '1',
    backgroundPosition: 'center center',
    width: '100%',
    '&:after': {
      position: 'absolute',
      width: '100%',
      zIndex: '3',
      content: '""',
      height: '100%',
      background: blackColor,
      display: 'block',
      opacity: '.8',
    },
    top: '0',
    backgroundSize: 'cover',
  },
  drawerPaper: {
    border: 'none',
    bottom: '0',
    left: '0',
    position: 'fixed',
    top: '0',
    zIndex: '1',
    ...boxShadow,
    width: drawerWidth,
    [theme.breakpoints.up('md')]: {
      height: '100%',
      position: 'fixed',
      width: drawerWidth,
    },
    [theme.breakpoints.down('sm')]: {
      width: drawerWidth,
      ...boxShadow,
      borderTop: 'none',
      display: 'block',
      height: '100vh',
      left: 'auto',
      overflowY: 'visible',
      paddingLeft: '0',
      paddingRight: '0px',
      position: 'fixed',
      right: '0',
      textAlign: 'left',
      top: '0',
      transform: `translate3d(${drawerWidth}px, 0, 0)`,
      visibility: 'visible',
      zIndex: '1032',
      ...transition,
    },
  },
  drawerPaperRTL: {
    [theme.breakpoints.up('md')]: {
      left: 'auto !important',
      right: '0 !important',
    },
    [theme.breakpoints.down('sm')]: {
      left: '0  !important',
      right: 'auto !important',
    },
  },
  img: {
    border: '0',
    position: 'absolute',
    top: '22px',
    verticalAlign: 'middle',
    width: '35px',
  },
  item: {
    '&:hover,&:focus,&:visited,&': {
      color: whiteColor,
    },
    display: 'block',
    position: 'relative',
    textDecoration: 'none',
  },
  itemIcon: {
    fontSize: '24px',
    float: 'left',
    height: '30px',
    lineHeight: '30px',
    width: '24px',
    color: `rgba(${hexToRgb(whiteColor)}, 0.8)`,
    marginRight: '15px',
    textAlign: 'center',
    verticalAlign: 'middle',
  },
  itemIconRTL: {
    float: 'right',
    marginLeft: '15px',
    marginRight: '3px',
  },
  itemLink: {
    borderRadius: '3px',
    transition: 'all 300ms linear',
    display: 'block',
    width: 'auto',
    backgroundColor: 'transparent',
    margin: '10px 15px 0',
    padding: '10px 15px',
    position: 'relative',
    ...defaultFont,
  },
  logo: {
    '&:after': {
      content: '""',
      bottom: '0',
      position: 'absolute',

      height: '1px',
      right: '15px',
      backgroundColor: `rgba(${hexToRgb(grayColor[6])}, 0.3)`,
      width: 'calc(100% - 30px)'
    },
    padding: '15px 15px',
    position: 'relative',
    zIndex: '4',
  },
  blue: {
    '&:hover,&:focus': {
      backgroundColor: infoColor[0],
      boxShadow:
        `0 12px 20px -10px rgba(${ 
          hexToRgb(infoColor[0]) 
        },.28), 0 4px 20px 0 rgba(${ 
          hexToRgb(blackColor) 
        },.12), 0 7px 8px -5px rgba(${ 
          hexToRgb(infoColor[0]) 
        },.2)`
    },
    backgroundColor: infoColor[0],
    boxShadow: `0 12px 20px -10px rgba(${hexToRgb(infoColor[0])},.28), 0 4px 20px 0 rgba(${hexToRgb(
      blackColor,
    )},.12), 0 7px 8px -5px rgba(${hexToRgb(infoColor[0])},.2)`,
  },
  logoImage: {
    display: 'inline-block',
    width: '30px',
    marginLeft: '10px',
    maxHeight: '30px',
    marginRight: '15px',
  },
  green: {
    '&:hover,&:focus': {
      backgroundColor: successColor[0],
      boxShadow: `0 12px 20px -10px rgba(${hexToRgb(successColor[0])},.28), 0 4px 20px 0 rgba(${hexToRgb(
        blackColor,
      )},.12), 0 7px 8px -5px rgba(${hexToRgb(successColor[0])},.2)`,
    },
    backgroundColor: successColor[0],
    boxShadow: `0 12px 20px -10px rgba(${hexToRgb(successColor[0])},.28), 0 4px 20px 0 rgba(${hexToRgb(
      blackColor,
    )},.12), 0 7px 8px -5px rgba(${hexToRgb(successColor[0])},.2)`,
  },
  logoLink: {
    ...defaultFont,
    padding: '5px 0',
    textTransform: 'uppercase',
    display: 'block',
    fontSize: '18px',
    fontWeight: '400',
    textAlign: 'left',
    lineHeight: '30px',
    backgroundColor: 'transparent',
    textDecoration: 'none',
    '&,&:hover': {
      color: whiteColor,
    },
  },
  activePro: {
    [theme.breakpoints.up('md')]: {
      position: 'absolute',
      bottom: '13px',
      width: '100%'
    },
  },
  logoLinkRTL: {
    textAlign: 'right'
  },
  itemText: {
    ...defaultFont,
    color: whiteColor,
    fontSize: '14px',
    lineHeight: '30px',
    margin: '0',
  },
  itemTextRTL: {
    textAlign: 'right',
  },
  list: {
    marginTop: '20px',
    paddingLeft: '0',
    paddingBottom: '0',
    paddingTop: '0',
    listStyle: 'none',
    marginBottom: '0',
    position: 'unset',
  },
  orange: {
    '&:hover,&:focus': {
      backgroundColor: warningColor[0],
      boxShadow: `0 12px 20px -10px rgba(${hexToRgb(warningColor[0])},.28), 0 4px 20px 0 rgba(${hexToRgb(
        blackColor,
      )},.12), 0 7px 8px -5px rgba(${hexToRgb(warningColor[0])},.2)`,
    },
    backgroundColor: warningColor[0],
    boxShadow: `0 12px 20px -10px rgba(${hexToRgb(warningColor[0])},.28), 0 4px 20px 0 rgba(${hexToRgb(
      blackColor,
    )},.12), 0 7px 8px -5px rgba(${hexToRgb(warningColor[0])},.2)`,
  },
  purple: {
    backgroundColor: primaryColor[0],
    ...primaryBoxShadow,
    '&:hover,&:focus': {
      backgroundColor: primaryColor[0],
      ...primaryBoxShadow,
    },
  },
  red: {
    '&:hover,&:focus': {
      backgroundColor: dangerColor[0],
      boxShadow: `0 12px 20px -10px rgba(${hexToRgb(dangerColor[0])},.28), 0 4px 20px 0 rgba(${hexToRgb(
        blackColor,
      )},.12), 0 7px 8px -5px rgba(${hexToRgb(dangerColor[0])},.2)`,
    },
    backgroundColor: dangerColor[0],
    boxShadow: `0 12px 20px -10px rgba(${hexToRgb(dangerColor[0])},.28), 0 4px 20px 0 rgba(${hexToRgb(
      blackColor,
    )},.12), 0 7px 8px -5px rgba(${hexToRgb(dangerColor[0])},.2)`,
  },
  sidebarWrapper: {
    height: '100vh',
    overflow: 'auto',
    overflowScrolling: 'touch',
    position: 'relative',
    width: '260px',
    zIndex: '4',
  },
  whiteFont: {
    color: whiteColor,
  },
});

export default sidebarStyle;
