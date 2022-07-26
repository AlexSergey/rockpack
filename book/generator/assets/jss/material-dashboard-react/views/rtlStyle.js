import { successColor, whiteColor, grayColor, hexToRgb } from '../../material-dashboard-react.js';

const rtlStyle = {
  cardCategory: {
    color: grayColor[0],
    fontSize: '14px',
    margin: '0',
    marginBottom: '0',
    marginTop: '0',
    paddingTop: '10px',
  },
  cardCategoryWhite: {
    '& a': {
      color: whiteColor,
    },
    color: `rgba(${hexToRgb(whiteColor)},.62)`,
    fontSize: '14px',
    margin: '0',
    marginBottom: '0',
    marginTop: '0',
  },
  cardTitle: {
    '& small': {
      color: grayColor[1],
      fontWeight: '400',
      lineHeight: '1'
    },
    color: grayColor[2],
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    fontWeight: '300',
    marginBottom: '3px',
    marginTop: '0px',
    minHeight: 'auto',
    textDecoration: 'none',
  },
  cardTitleWhite: {
    '& small': {
      color: grayColor[1],
      fontWeight: '400',
      lineHeight: '1'
    },
    color: whiteColor,
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    fontWeight: '300',
    marginBottom: '3px',
    marginTop: '0px',
    minHeight: 'auto',
    textDecoration: 'none',
  },
  stats: {
    '& svg': {
      top: '4px',
      width: '16px',
      height: '16px',
      position: 'relative',
      marginRight: '3px',
      marginLeft: '3px'
    },
    color: grayColor[0],
    '& .fab,& .fas,& .far,& .fal,& .material-icons': {
      fontSize: '16px',
      top: '4px',
      marginRight: '3px',
      position: 'relative',
      marginLeft: '3px',
    },
    display: 'inline-flex',
    fontSize: '12px',
    lineHeight: '22px',
  },
  successText: {
    color: successColor[0],
  },
  upArrowCardCategory: {
    height: '16px',
    width: '16px',
  },
};

export default rtlStyle;
