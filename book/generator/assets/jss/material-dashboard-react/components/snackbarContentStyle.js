import {
  defaultFont,
  primaryBoxShadow,
  infoBoxShadow,
  successBoxShadow,
  warningBoxShadow,
  dangerBoxShadow,
  roseBoxShadow,
  whiteColor,
  blackColor,
  grayColor,
  infoColor,
  successColor,
  dangerColor,
  roseColor,
  primaryColor,
  warningColor,
  hexToRgb,
} from '../../material-dashboard-react.js';

const snackbarContentStyle = {
  danger: {
    backgroundColor: dangerColor[3],
    color: whiteColor,
    ...dangerBoxShadow,
  },
  info: {
    backgroundColor: infoColor[3],
    color: whiteColor,
    ...infoBoxShadow,
  },
  message: {
    display: 'block',
    maxWidth: '89%',
    padding: '0',
  },
  close: {
    height: '11px',
    width: '11px',
  },
  primary: {
    backgroundColor: primaryColor[3],
    color: whiteColor,
    ...primaryBoxShadow,
  },
  icon: {
    display: 'block',
    left: '15px',
    marginTop: '-15px',
    height: '30px',
    position: 'absolute',
    top: '50%',
    width: '30px',
  },
  root: {
    ...defaultFont,
    flexWrap: 'unset',
    lineHeight: '20px',
    fontSize: '14px',
    padding: '20px 15px',
    backgroundColor: whiteColor,
    position: 'relative',
    borderRadius: '3px',
    color: grayColor[7],
    marginBottom: '20px',
    boxShadow: `0 12px 20px -10px rgba(${hexToRgb(whiteColor)}, 0.28), 0 4px 20px 0px rgba(${hexToRgb(
      blackColor,
    )}, 0.12), 0 7px 8px -5px rgba(${hexToRgb(whiteColor)}, 0.2)`,
    maxWidth: 'unset',
    minWidth: 'unset',
  },
  iconButton: {
    height: '24px',
    padding: '0px',
    width: '24px',
  },
  success: {
    backgroundColor: successColor[3],
    color: whiteColor,
    ...successBoxShadow,
  },
  dangerIcon: {
    color: dangerColor[3],
  },
  top20: {
    top: '20px',
  },
  infoIcon: {
    color: infoColor[3],
  },
  top40: {
    top: '40px'
  },
  iconMessage: {
    display: 'block',
    paddingLeft: '50px',
  },
  actionRTL: {
    marginLeft: '-8px',
    marginRight: 'auto',
  },
  warning: {
    backgroundColor: warningColor[3],
    color: whiteColor,
    ...warningBoxShadow
  },
  primaryIcon: {
    color: primaryColor[3],
  },
  rose: {
    backgroundColor: roseColor[3],
    color: whiteColor,
    ...roseBoxShadow,
  },
  roseIcon: {
    color: roseColor[3],
  },
  successIcon: {
    color: successColor[3],
  },
  warningIcon: {
    color: warningColor[3],
  },
};

export default snackbarContentStyle;
