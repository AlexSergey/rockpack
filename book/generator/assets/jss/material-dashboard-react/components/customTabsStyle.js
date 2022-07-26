import { hexToRgb, whiteColor } from '../../material-dashboard-react.js';

const customTabsStyle = {
  cardTitle: {
    float: 'left',
    lineHeight: '24px',
    padding: '10px 10px 10px 0px',
  },
  cardTitleRTL: {
    float: 'right',
    padding: '10px 0px 10px 10px !important',
  },
  displayNone: {
    display: 'none !important',
  },
  tabRootButton: {
    border: '0 !important',
    borderRadius: '3px',
    color: `${whiteColor} !important`,
    height: 'unset !important',
    '&:last-child': {
      marginLeft: '0px',
    },
    maxHeight: 'unset !important',
    lineHeight: '24px',
    minHeight: 'unset !important',
    marginLeft: '4px',
    minWidth: 'unset !important',
    maxWidth: 'unset !important',
    width: 'unset !important',
    padding: '10px 15px',
  },
  tabSelected: {
    backgroundColor: `rgba(${hexToRgb(whiteColor)}, 0.2)`,
    transition: '0.2s background-color 0.1s',
  },
  tabWrapper: {
    display: 'inline-block',
    '& > svg,& > .material-icons': {
      verticalAlign: 'middle',
      margin: '-1px 5px 0 0 !important'
    },
    fontSize: '12px',
    fontWeight: '500',
    height: 'unset !important',
    marginTop: '1px',
    maxHeight: 'unset !important',
    maxWidth: 'unset !important',
    minHeight: 'unset !important',
    minWidth: 'unset !important',
    width: 'unset !important',
  },
  tabsRoot: {
    '& $tabRootButton': {
      fontSize: '0.875rem',
    },
    minHeight: 'unset !important',
    overflowX: 'visible',
  },
};

export default customTabsStyle;
