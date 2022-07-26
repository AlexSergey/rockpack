import {
  warningCardHeader,
  successCardHeader,
  dangerCardHeader,
  infoCardHeader,
  primaryCardHeader,
  roseCardHeader,
  grayColor,
} from '../../material-dashboard-react.js';

const cardIconStyle = {
  cardIcon: {
    '&$warningCardHeader,&$successCardHeader,&$dangerCardHeader,&$infoCardHeader,&$primaryCardHeader,&$roseCardHeader':
      {
        backgroundColor: grayColor[0],
        borderRadius: '3px',
        float: 'left',
        marginRight: '15px',
        marginTop: '-20px',
        padding: '15px',
      },
  },
  dangerCardHeader,
  infoCardHeader,
  primaryCardHeader,
  roseCardHeader,
  successCardHeader,
  warningCardHeader,
};

export default cardIconStyle;
