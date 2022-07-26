import {
  primaryColor,
  whiteColor,
  primaryBoxShadow,
  defaultFont,
  blackColor,
  grayColor,
  hexToRgb,
} from '../material-dashboard-react.js';

const dropdownStyle = (theme) => ({
  buttonLink: {
    [theme.breakpoints.down('md')]: {
      display: 'flex',
      marginLeft: '30px',
      width: 'auto',
    },
  },
  dropdown: {
    border: '0',
    borderRadius: '3px',
    boxShadow: `0 2px 5px 0 rgba(${hexToRgb(blackColor)}, 0.26)`,
    margin: '2px 0 0',
    fontSize: '14px',
    minWidth: '160px',
    listStyle: 'none',
    top: '100%',
    WebkitBackgroundClip: 'padding-box',
    zIndex: '1000',
    backgroundClip: 'padding-box',
    padding: '5px 0',
    backgroundColor: whiteColor,
    textAlign: 'left',
  },
  dropdownItem: {
    ...defaultFont,
    WebkitTransition: 'all 150ms linear',
    MozTransition: 'all 150ms linear',
    fontSize: '13px',
    MsTransition: 'all 150ms linear',
    margin: '0 5px',
    OTransition: 'all 150ms linear',
    padding: '10px 20px',
    borderRadius: '2px',
    clear: 'both',
    color: grayColor[8],
    display: 'block',
    fontWeight: '400',
    '&:hover': {
      backgroundColor: primaryColor[0],
      color: whiteColor,
      ...primaryBoxShadow
    },
    transition: 'all 150ms linear',
    height: 'unset',
    lineHeight: '1.42857143',
    minHeight: 'unset',
    whiteSpace: 'nowrap',
  },
  linkText: {
    zIndex: '4',
    ...defaultFont,
    fontSize: '14px',
  },
  links: {
    height: '20px',
    width: '20px',
    zIndex: '4',
    [theme.breakpoints.down('md')]: {
      color: grayColor[9],
      display: 'block',
      height: '30px',
      marginRight: '15px',
      width: '30px',
    },
  },
  pooperResponsive: {
    [theme.breakpoints.down('md')]: {
      backgroundColor: 'transparent',
      float: 'none',
      WebkitBoxShadow: 'none',
      marginTop: '0',
      border: '0',
      position: 'static',
      boxShadow: 'none',
      zIndex: '1640',
      color: 'black',
      width: 'auto',
    },
  },
  popperClose: {
    pointerEvents: 'none',
  },
  popperNav: {
    [theme.breakpoints.down('sm')]: {
      '& > div': {
        boxShadow: 'none !important',
        marginLeft: '0rem',
        marginRight: '0rem',
        marginBottom: '0px !important',
        marginTop: '0px !important',
        backgroundColor: 'transparent !important',
        transition: 'none !important',
        '& ul li': {
          color: `${whiteColor} !important`,
          '&:hover': {
            backgroundColor: 'hsla(0,0%,78%,.2)',
            boxShadow: 'none'
          },
          margin: '10px 15px 0!important',
          padding: '10px 15px !important',
        },
        padding: '0px !important',
      },
      left: 'unset !important',
      position: 'static !important',
      top: 'unset !important',
      transform: 'none !important',
      willChange: 'unset !important',
    },
  },
});

export default dropdownStyle;
