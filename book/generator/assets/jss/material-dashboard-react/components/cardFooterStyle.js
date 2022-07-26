import { grayColor } from '../../material-dashboard-react.js';

const cardFooterStyle = {
  cardFooter: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    border: '0',
    borderRadius: '0',
    display: 'flex',
    justifyContent: 'space-between',
    margin: '0 15px 10px',
    padding: '0',
    paddingTop: '10px',
  },
  cardFooterChart: {
    borderTop: `1px solid ${grayColor[10]}`,
  },
  cardFooterPlain: {
    backgroundColor: 'transparent',
    paddingLeft: '5px',
    paddingRight: '5px',
  },
  cardFooterProfile: {
    marginTop: '-15px',
  },
  cardFooterStats: {
    '& .fab,& .fas,& .far,& .fal,& .material-icons': {
      fontSize: '16px',
      marginLeft: '3px',
      marginRight: '3px',
      position: 'relative',
      top: '4px',
    },
    '& svg': {
      height: '16px',
      marginLeft: '3px',
      marginRight: '3px',
      position: 'relative',
      top: '4px',
      width: '16px',
    },
    borderTop: `1px solid ${grayColor[10]}`,
    marginTop: '20px',
  },
};

export default cardFooterStyle;
