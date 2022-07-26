import { defaultFont, container, primaryColor, grayColor } from '../../material-dashboard-react.js';

const footerStyle = {
  a: {
    backgroundColor: 'transparent',
    color: primaryColor,
    textDecoration: 'none',
  },
  block: {
    borderRadius: '3px',
    color: 'inherit',
    display: 'block',
    padding: '15px',
    position: 'relative',
    textDecoration: 'none',
    textTransform: 'uppercase',
    ...defaultFont,
    fontSize: '12px',
    fontWeight: '500',
  },
  container,
  footer: {
    borderTop: `1px solid ${grayColor[11]}`,
    bottom: '0',
    padding: '15px 0',
    ...defaultFont,
  },
  inlineBlock: {
    display: 'inline-block',
    padding: '0px',
    width: 'auto',
  },
  left: {
    display: 'block',
    float: 'left!important',
  },
  list: {
    marginBottom: '0',
    marginTop: '0',
    padding: '0',
  },
  right: {
    float: 'right!important',
    fontSize: '14px',
    margin: '0',
    padding: '15px 0',
  },
};
export default footerStyle;
