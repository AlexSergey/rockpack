import {
  warningColor,
  primaryColor,
  dangerColor,
  successColor,
  infoColor,
  roseColor,
  grayColor,
  defaultFont,
} from '../../material-dashboard-react.js';

const tableStyle = (theme) => ({
  dangerTableHeader: {
    color: dangerColor[0],
  },
  grayTableHeader: {
    color: grayColor[0],
  },
  infoTableHeader: {
    color: infoColor[0],
  },
  primaryTableHeader: {
    color: primaryColor[0],
  },
  roseTableHeader: {
    color: roseColor[0],
  },
  successTableHeader: {
    color: successColor[0],
  },
  table: {
    backgroundColor: 'transparent',
    borderCollapse: 'collapse',
    borderSpacing: '0',
    marginBottom: '0',
    maxWidth: '100%',
    width: '100%',
  },
  tableBodyRow: {
    color: 'inherit',
    display: 'table-row',
    height: '48px',
    outline: 'none',
    verticalAlign: 'middle',
  },
  tableCell: {
    ...defaultFont,
    fontSize: '0.8125rem',
    lineHeight: '1.42857143',
    padding: '12px 8px',
    verticalAlign: 'middle',
  },
  tableHeadCell: {
    color: 'inherit',
    ...defaultFont,
    '&, &$tableCell': {
      fontSize: '1em',
    },
  },
  warningTableHeader: {
    color: warningColor[0]
  },
  tableHeadRow: {
    color: 'inherit',
    display: 'table-row',
    height: '56px',
    outline: 'none',
    verticalAlign: 'middle',
  },
  tableResponsive: {
    marginTop: theme.spacing(3),
    overflowX: 'auto',
    width: '100%',
  },
});

export default tableStyle;
