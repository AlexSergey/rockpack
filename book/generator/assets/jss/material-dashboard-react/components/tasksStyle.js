import { defaultFont, primaryColor, dangerColor, grayColor } from '../../material-dashboard-react.js';
import checkboxAdnRadioStyle from '../checkboxAdnRadioStyle.js';
import tooltipStyle from '../tooltipStyle.js';

const tasksStyle = {
  ...tooltipStyle,
  ...checkboxAdnRadioStyle,
  close: {
    backgroundColor: 'transparent',
    boxShadow: 'none',
    color: dangerColor[0],
  },
  edit: {
    backgroundColor: 'transparent',
    boxShadow: 'none',
    color: primaryColor[0],
  },
  table: {
    marginBottom: '0',
    overflow: 'visible',
  },
  tableActionButton: {
    height: '27px',
    padding: '0',
    width: '27px',
  },
  tableActionButtonIcon: {
    height: '17px',
    width: '17px',
  },
  tableActions: {
    border: 'none',
    display: 'flex',
    padding: '12px 8px !important',
    verticalAlign: 'middle',
  },
  tableCell: {
    ...defaultFont,
    border: 'none',
    fontSize: '14px',
    lineHeight: '1.42857143',
    padding: '8px',
    verticalAlign: 'middle',
  },
  tableCellRTL: {
    textAlign: 'right',
  },
  tableRow: {
    borderBottom: `1px solid ${grayColor[5]}`,
    position: 'relative',
  },
};
export default tasksStyle;
