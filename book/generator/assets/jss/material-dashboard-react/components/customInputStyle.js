import { primaryColor, dangerColor, successColor, grayColor, defaultFont } from '../../material-dashboard-react.js';

const customInputStyle = {
  disabled: {
    '&:before': {
      backgroundColor: 'transparent !important',
    },
  },
  feedback: {
    display: 'block',
    position: 'absolute',
    height: '24px',
    right: '0',
    pointerEvents: 'none',
    top: '18px',
    textAlign: 'center',
    zIndex: '2',
    width: '24px',
  },
  formControl: {
    margin: '27px 0 0 0',
    paddingBottom: '10px',
    position: 'relative',
    verticalAlign: 'unset',
  },
  labelRoot: {
    ...defaultFont,
    color: `${grayColor[3]} !important`,
    fontSize: '14px',
    fontWeight: '400',
    letterSpacing: 'unset',
    lineHeight: '1.42857',
  },
  labelRootError: {
    color: dangerColor[0],
  },
  labelRootSuccess: {
    color: successColor[0],
  },
  marginTop: {
    marginTop: '16px',
  },
  underline: {
    '&:after': {
      borderColor: primaryColor[0],
    },
    '&:hover:not($disabled):before,&:before': {
      borderColor: `${grayColor[4]} !important`,
      borderWidth: '1px !important',
    },
  },
  underlineError: {
    '&:after': {
      borderColor: dangerColor[0],
    },
  },
  underlineSuccess: {
    '&:after': {
      borderColor: successColor[0],
    },
  },
};

export default customInputStyle;
