import { primaryColor, blackColor, hexToRgb } from '../material-dashboard-react.js';

const checkboxAdnRadioStyle = {
  checked: {
    color: `${primaryColor[0]}!important`,
  },
  checkedIcon: {
    border: `1px solid rgba(${hexToRgb(blackColor)}, .54)`,
    borderRadius: '3px',
    height: '20px',
    width: '20px',
  },
  labelRoot: {
    marginLeft: '-14px',
  },
  radio: {
    color: `${primaryColor[0]}!important`,
  },
  radioChecked: {
    border: `1px solid ${primaryColor[0]}`,
    borderRadius: '50%',
    height: '20px',
    width: '20px',
  },
  radioUnchecked: {
    border: `1px solid rgba(${hexToRgb(blackColor)}, .54)`,
    borderRadius: '50%',
    height: '0px',
    padding: '10px',
    width: '0px',
  },
  root: {
    '&:hover': {
      backgroundColor: 'unset',
    },
    padding: '13px',
  },
  uncheckedIcon: {
    border: `1px solid rgba(${hexToRgb(blackColor)}, .54)`,
    borderRadius: '3px',
    height: '0px',
    padding: '10px',
    width: '0px',
  },
};

export default checkboxAdnRadioStyle;
