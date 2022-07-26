import { defaultFont, dangerColor, whiteColor } from '../../material-dashboard-react.js';
import dropdownStyle from '../dropdownStyle.js';

const headerLinksStyle = (theme) => ({
  ...dropdownStyle(theme),
  buttonLink: {
    [theme.breakpoints.down('sm')]: {
      '& .fab,& .fas,& .far,& .fal,& .material-icons': {
        fontSize: '24px',
        height: '30px',
        lineHeight: '30px',
        marginLeft: '-15px',
        marginRight: '15px',
        width: '24px',
      },
      '& > span': {
        justifyContent: 'flex-start',
        width: '100%',
      },
      '& svg': {
        height: '30px',
        marginLeft: '-15px',
        marginRight: '15px',
        width: '24px',
      },
      display: 'flex',
      margin: '10px 15px 0',
      width: '-webkit-fill-available',
    },
  },
  linkText: {
    zIndex: '4',
    ...defaultFont,
    fontSize: '14px',
    margin: '0px',
  },
  manager: {
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
    display: 'inline-block',
  },
  margin: {
    margin: '0',
    zIndex: '4',
  },
  notifications: {
    zIndex: '4',
    [theme.breakpoints.up('md')]: {
      background: dangerColor[0],
      border: `1px solid ${whiteColor}`,
      color: whiteColor,
      fontSize: '9px',
      borderRadius: '10px',
      position: 'absolute',
      height: '16px',
      top: '2px',
      display: 'block',
      right: '4px',
      lineHeight: '16px',
      minWidth: '16px',
      textAlign: 'center',
      verticalAlign: 'middle',
    },
    [theme.breakpoints.down('sm')]: {
      ...defaultFont,
      fontSize: '14px',
      marginRight: '8px',
    },
  },
  search: {
    '& > div': {
      marginTop: '0',
    },
    [theme.breakpoints.down('sm')]: {
      float: 'none !important',
      margin: '10px 15px !important',
      marginTop: '40px',
      padding: '0!important',
      '& input': {
        color: whiteColor,
      },
      paddingBottom: '1px',
      paddingTop: '1px',
      width: '60%',
    },
  },
  searchButton: {
    [theme.breakpoints.down('sm')]: {
      float: 'right',
      marginRight: '22px',
      top: '-50px !important',
    },
  },
  searchIcon: {
    width: '17px',
    zIndex: '4',
  },
  searchWrapper: {
    [theme.breakpoints.down('sm')]: {
      margin: '10px 15px 0',
      width: '-webkit-fill-available',
    },
    display: 'inline-block',
  },
});

export default headerLinksStyle;
