import { blackColor, hexToRgb } from '../material-dashboard-react.js';

const tooltipStyle = {
  tooltip: {
    border: 'none',
    borderRadius: '3px',
    boxShadow: `0 8px 10px 1px rgba(${hexToRgb(blackColor)}, 0.14), 0 3px 14px 2px rgba(${hexToRgb(
      blackColor,
    )}, 0.12), 0 5px 5px -3px rgba(${hexToRgb(blackColor)}, 0.2)`,
    fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
    fontSize: '12px',
    fontStyle: 'normal',
    fontWeight: '400',
    letterSpacing: 'normal',
    minWidth: '130px',
    lineHeight: '1.7em',
    padding: '10px 15px',
    lineBreak: 'auto',
    maxWidth: '200px',
    textAlign: 'center',
    textShadow: 'none',
    textTransform: 'none',
    whiteSpace: 'normal',
    wordBreak: 'normal',
    wordSpacing: 'normal',
    wordWrap: 'normal',
  },
};
export default tooltipStyle;
