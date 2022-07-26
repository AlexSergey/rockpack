import { boxShadow, whiteColor, grayColor, hexToRgb } from '../../material-dashboard-react.js';

const iconsStyle = {
  cardCategoryWhite: {
    '& a,& a:hover,& a:focus': {
      color: whiteColor,
    },
    '&,& a,& a:hover,& a:focus': {
      color: `rgba(${hexToRgb(whiteColor)},.62)`,
      fontSize: '14px',
      margin: '0',
      marginBottom: '0',
      marginTop: '0',
    },
  },
  cardTitleWhite: {
    '& small': {
      color: grayColor[1],
      fontWeight: '400',
      lineHeight: '1',
    },
    color: whiteColor,
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    fontWeight: '300',
    marginBottom: '3px',
    marginTop: '0px',
    minHeight: 'auto',
    textDecoration: 'none',
  },
  iframe: {
    border: '0',
    height: '500px',
    width: '100%',
    ...boxShadow,
  },
  iframeContainer: {
    margin: '0 -20px 0',
  },
};

export default iconsStyle;
