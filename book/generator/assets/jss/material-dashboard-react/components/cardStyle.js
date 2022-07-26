import { blackColor, whiteColor, hexToRgb } from '../../material-dashboard-react.js';

const cardStyle = {
  card: {
    background: whiteColor,
    border: '0',
    borderRadius: '6px',
    boxShadow: `0 1px 4px 0 rgba(${hexToRgb(blackColor)}, 0.14)`,
    color: `rgba(${hexToRgb(blackColor)}, 0.87)`,
    display: 'flex',
    flexDirection: 'column',
    fontSize: '.875rem',
    marginBottom: '30px',
    marginTop: '30px',
    minWidth: '0',
    position: 'relative',
    width: '100%',
    wordWrap: 'break-word',
  },
  cardChart: {
    '& p': {
      marginTop: '0px',
      paddingTop: '0px',
    },
  },
  cardPlain: {
    background: 'transparent',
    boxShadow: 'none',
  },
  cardProfile: {
    marginTop: '30px',
    textAlign: 'center',
  },
};

export default cardStyle;
