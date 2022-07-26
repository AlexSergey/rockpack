import {
  defaultFont,
  primaryColor,
  infoColor,
  successColor,
  warningColor,
  dangerColor,
  grayColor,
} from '../../material-dashboard-react.js';

const typographyStyle = {
  dangerText: {
    color: dangerColor[0]
  },
  defaultFontStyle: {
    ...defaultFont,
    fontSize: '14px',
  },
  defaultHeaderMargins: {
    marginBottom: '10px',
    marginTop: '20px',
  },
  infoText: {
    color: infoColor[0],
  },
  mutedText: {
    color: grayColor[1],
  },
  primaryText: {
    color: primaryColor[0],
  },
  quote: {
    borderLeft: `5px solid ${grayColor[10]}`,
    fontSize: '17.5px',
    margin: '0 0 20px',
    padding: '10px 20px',
  },
  quoteAuthor: {
    color: grayColor[1],
    display: 'block',
    fontSize: '80%',
    lineHeight: '1.42857143',
  },
  quoteText: {
    fontStyle: 'italic',
    margin: '0 0 10px',
  },
  successText: {
    color: successColor[0],
  },
  warningText: {
    color: warningColor[0],
  },
};

export default typographyStyle;
