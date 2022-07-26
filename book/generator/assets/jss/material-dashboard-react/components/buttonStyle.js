import {
  grayColor,
  primaryColor,
  infoColor,
  successColor,
  warningColor,
  dangerColor,
  roseColor,
  whiteColor,
  blackColor,
  hexToRgb,
} from '../../material-dashboard-react.js';

const buttonStyle = {
  button: {
    backgroundColor: grayColor[0],
    border: 'none',
    borderRadius: '3px',
    boxShadow: `0 2px 2px 0 rgba(${hexToRgb(grayColor[0])}, 0.14), 0 3px 1px -2px rgba(${hexToRgb(
      grayColor[0],
    )}, 0.2), 0 1px 5px 0 rgba(${hexToRgb(grayColor[0])}, 0.12)`,
    color: whiteColor,
    fontSize: '12px',
    fontWeight: '400',
    letterSpacing: '0',
    lineHeight: '1.42857143',
    minHeight: 'auto',
    margin: '.3125rem 1px',
    minWidth: 'auto',
    cursor: 'pointer',
    '& .fab,& .fas,& .far,& .fal, &.material-icons': {
      position: 'relative',
      display: 'inline-block',
      top: '0',
      marginTop: '-1em',
      marginBottom: '-1em',
      fontSize: '1.1rem',
      marginRight: '4px',
      verticalAlign: 'middle'
    },
    padding: '12px 30px',
    '& svg': {
      display: 'inline-block',
      position: 'relative',
      top: '0',
      height: '18px',
      width: '18px',
      marginRight: '4px',
      verticalAlign: 'middle',
    },
    position: 'relative',
    '&$justIcon': {
      '& .fab,& .fas,& .far,& .fal,& .material-icons': {
        marginTop: '0px',
        position: 'absolute',
        transform: 'none',
        left: '0px',
        width: '100%',
        height: '100%',
        fontSize: '20px',
        top: '0px',
        lineHeight: '41px',
      },
    },
    textAlign: 'center',
    '&:hover,&:focus': {
      backgroundColor: grayColor[0],
      color: whiteColor,
      boxShadow: `0 14px 26px -12px rgba(${hexToRgb(grayColor[0])}, 0.42), 0 4px 23px 0px rgba(${hexToRgb(
        blackColor,
      )}, 0.12), 0 8px 10px -5px rgba(${hexToRgb(grayColor[0])}, 0.2)`,
    },
    textTransform: 'uppercase',
    touchAction: 'manipulation',
    transition: 'box-shadow 0.2s cubic-bezier(0.4, 0, 1, 1), background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    verticalAlign: 'middle',
    willChange: 'box-shadow, transform',
    whiteSpace: 'nowrap',
  },
  danger: {
    '&:hover,&:focus': {
      backgroundColor: dangerColor[0],
      boxShadow: `0 14px 26px -12px rgba(${hexToRgb(dangerColor[0])}, 0.42), 0 4px 23px 0px rgba(${hexToRgb(
        blackColor,
      )}, 0.12), 0 8px 10px -5px rgba(${hexToRgb(dangerColor[0])}, 0.2)`,
    },
    backgroundColor: dangerColor[0],
    boxShadow: `0 2px 2px 0 rgba(${hexToRgb(dangerColor[0])}, 0.14), 0 3px 1px -2px rgba(${hexToRgb(
      dangerColor[0],
    )}, 0.2), 0 1px 5px 0 rgba(${hexToRgb(dangerColor[0])}, 0.12)`,
  },
  disabled: {
    opacity: '0.65',
    pointerEvents: 'none',
  },
  info: {
    '&:hover,&:focus': {
      backgroundColor: infoColor[0],
      boxShadow: `0 14px 26px -12px rgba(${hexToRgb(infoColor[0])}, 0.42), 0 4px 23px 0px rgba(${hexToRgb(
        blackColor,
      )}, 0.12), 0 8px 10px -5px rgba(${hexToRgb(infoColor[0])}, 0.2)`,
    },
    backgroundColor: infoColor[0],
    boxShadow: `0 2px 2px 0 rgba(${hexToRgb(infoColor[0])}, 0.14), 0 3px 1px -2px rgba(${hexToRgb(
      infoColor[0],
    )}, 0.2), 0 1px 5px 0 rgba(${hexToRgb(infoColor[0])}, 0.12)`,
  },
  lg: {
    borderRadius: '0.2rem',
    fontSize: '0.875rem',
    lineHeight: '1.333333',
    padding: '1.125rem 2.25rem',
  },
  primary: {
    '&:hover,&:focus': {
      backgroundColor: primaryColor[0],
      boxShadow: `0 14px 26px -12px rgba(${hexToRgb(primaryColor[0])}, 0.42), 0 4px 23px 0px rgba(${hexToRgb(
        blackColor,
      )}, 0.12), 0 8px 10px -5px rgba(${hexToRgb(primaryColor[0])}, 0.2)`,
    },
    backgroundColor: primaryColor[0],
    boxShadow: `0 2px 2px 0 rgba(${hexToRgb(primaryColor[0])}, 0.14), 0 3px 1px -2px rgba(${hexToRgb(
      primaryColor[0],
    )}, 0.2), 0 1px 5px 0 rgba(${hexToRgb(primaryColor[0])}, 0.12)`,
  },
  rose: {
    '&:hover,&:focus': {
      backgroundColor: roseColor[0],
      boxShadow: `0 14px 26px -12px rgba(${hexToRgb(roseColor[0])}, 0.42), 0 4px 23px 0px rgba(${hexToRgb(
        blackColor,
      )}, 0.12), 0 8px 10px -5px rgba(${hexToRgb(roseColor[0])}, 0.2)`,
    },
    backgroundColor: roseColor[0],
    boxShadow: `0 2px 2px 0 rgba(${hexToRgb(roseColor[0])}, 0.14), 0 3px 1px -2px rgba(${hexToRgb(
      roseColor[0],
    )}, 0.2), 0 1px 5px 0 rgba(${hexToRgb(roseColor[0])}, 0.12)`,
  },
  round: {
    borderRadius: '30px',
  },
  block: {
    width: '100% !important',
  },
  simple: {
    '&$info': {
      '&,&:focus,&:hover,&:visited': {
        color: infoColor[0]
      }
    },
    '&$rose': {
      '&,&:focus,&:hover,&:visited': {
        color: roseColor[0],
      },
    },
    '&$primary': {
      '&,&:focus,&:hover,&:visited': {
        color: primaryColor[0],
      },
    },
    '&,&:focus,&:hover': {
      color: whiteColor,
      background: 'transparent',
      boxShadow: 'none'
    },
    '&$danger': {
      '&,&:focus,&:hover,&:visited': {
        color: dangerColor[0],
      },
    },
    '&$success': {
      '&,&:focus,&:hover,&:visited': {
        color: successColor[0],
      },
    },
    '&$warning': {
      '&,&:focus,&:hover,&:visited': {
        color: warningColor[0],
      },
    },
  },
  justIcon: {
    fontSize: '20px',
    height: '41px',
    '& .fab,& .fas,& .far,& .fal,& svg,& .material-icons': {
      marginRight: '0px'
    },
    paddingLeft: '12px',
    '&$lg': {
      height: '57px',
      minWidth: '57px',
      lineHeight: '56px',
      width: '57px',
      '& .fab,& .fas,& .far,& .fal,& .material-icons': {
        fontSize: '32px',
        lineHeight: '56px',
      },
      '& svg': {
        height: '32px',
        width: '32px'
      },
    },
    paddingRight: '12px',
    '&$sm': {
      height: '30px',
      '& .fab,& .fas,& .far,& .fal,& .material-icons': {
        fontSize: '17px',
        lineHeight: '29px'
      },
      minWidth: '30px',
      '& svg': {
        height: '17px',
        width: '17px'
      },
      width: '30px',
    },
    minWidth: '41px',
    width: '41px',
  },
  white: {
    '&,&:focus,&:hover': {
      backgroundColor: whiteColor,
      color: grayColor[0]
    }
  },
  link: {
    '&,&:hover,&:focus': {
      backgroundColor: 'transparent',
      boxShadow: 'none',
      color: grayColor[0],
    },
  },
  sm: {
    borderRadius: '0.2rem',
    fontSize: '0.6875rem',
    lineHeight: '1.5',
    padding: '0.40625rem 1.25rem',
  },
  success: {
    backgroundColor: successColor[0],
    '&:hover,&:focus': {
      backgroundColor: successColor[0],
      boxShadow:
        `0 14px 26px -12px rgba(${ 
          hexToRgb(successColor[0]) 
        }, 0.42), 0 4px 23px 0px rgba(${ 
          hexToRgb(blackColor) 
        }, 0.12), 0 8px 10px -5px rgba(${ 
          hexToRgb(successColor[0]) 
        }, 0.2)`
    },
    boxShadow:
      `0 2px 2px 0 rgba(${ 
        hexToRgb(successColor[0]) 
      }, 0.14), 0 3px 1px -2px rgba(${ 
        hexToRgb(successColor[0]) 
      }, 0.2), 0 1px 5px 0 rgba(${ 
        hexToRgb(successColor[0]) 
      }, 0.12)`
  },
  transparent: {
    '&,&:focus,&:hover': {
      background: 'transparent',
      boxShadow: 'none',
      color: 'inherit',
    },
  },
  warning: {
    backgroundColor: warningColor[0],
    boxShadow:
      `0 2px 2px 0 rgba(${ 
        hexToRgb(warningColor[0]) 
      }, 0.14), 0 3px 1px -2px rgba(${ 
        hexToRgb(warningColor[0]) 
      }, 0.2), 0 1px 5px 0 rgba(${ 
        hexToRgb(warningColor[0]) 
      }, 0.12)`,
    '&:hover,&:focus': {
      backgroundColor: warningColor[0],
      boxShadow:
        `0 14px 26px -12px rgba(${ 
          hexToRgb(warningColor[0]) 
        }, 0.42), 0 4px 23px 0px rgba(${ 
          hexToRgb(blackColor) 
        }, 0.12), 0 8px 10px -5px rgba(${ 
          hexToRgb(warningColor[0]) 
        }, 0.2)`
    }
  },
};

export default buttonStyle;
