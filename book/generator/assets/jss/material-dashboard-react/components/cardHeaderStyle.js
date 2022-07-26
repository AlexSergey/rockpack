import {
  warningCardHeader,
  successCardHeader,
  dangerCardHeader,
  infoCardHeader,
  primaryCardHeader,
  roseCardHeader,
  whiteColor,
} from '../../material-dashboard-react.js';

const cardHeaderStyle = {
  cardHeader: {
    '&$cardHeaderPlain,&$cardHeaderIcon,&$cardHeaderStats,&$warningCardHeader,&$successCardHeader,&$dangerCardHeader,&$infoCardHeader,&$primaryCardHeader,&$roseCardHeader':
      {
        color: whiteColor,
        margin: '0 15px',
        padding: '0',
        position: 'relative',
      },
    '&$cardHeaderStats i,&$cardHeaderStats .material-icons': {
      fontSize: '36px',
      height: '56px',
      lineHeight: '56px',
      overflow: 'unset',
      width: '56px',
      marginBottom: '1px',
      textAlign: 'center',
    },
    '&$cardHeaderStats svg': {
      fontSize: '36px',
      lineHeight: '56px',
      height: '36px',
      textAlign: 'center',
      margin: '10px 10px 4px',
      width: '36px',
    },
    '&$cardHeaderStats$cardHeaderIcon': {
      textAlign: 'right',
    },
    '&$warningCardHeader,&$successCardHeader,&$dangerCardHeader,&$infoCardHeader,&$primaryCardHeader,&$roseCardHeader':
      {
        '&:not($cardHeaderIcon)': {
          borderRadius: '3px',
          marginTop: '-20px',
          padding: '15px',
        },
      },
    '&:first-child': {
      borderRadius: 'calc(.25rem - 1px) calc(.25rem - 1px) 0 0',
    },
    background: 'transparent',
    borderBottom: 'none',
    marginBottom: '0',
    padding: '0.75rem 1.25rem',
    zIndex: '3 !important',
  },
  cardHeaderIcon: {
    '& i,& .material-icons': {
      height: '33px',
      lineHeight: '33px',
      textAlign: 'center',
      width: '33px',
    },
    '& svg': {
      height: '24px',
      lineHeight: '33px',
      margin: '5px 4px 0px',
      textAlign: 'center',
      width: '24px',
    },
    '&$warningCardHeader,&$successCardHeader,&$dangerCardHeader,&$infoCardHeader,&$primaryCardHeader,&$roseCardHeader':
      {
        background: 'transparent',
        boxShadow: 'none',
      },
  },
  cardHeaderPlain: {
    marginLeft: '0px !important',
    marginRight: '0px !important',
  },
  cardHeaderStats: {
    '& $cardHeaderIcon': {
      textAlign: 'right',
    },
    '& h1,& h2,& h3,& h4,& h5,& h6': {
      margin: '0 !important',
    },
  },
  dangerCardHeader: {
    '&:not($cardHeaderIcon)': {
      ...dangerCardHeader,
    },
    color: whiteColor,
  },
  infoCardHeader: {
    '&:not($cardHeaderIcon)': {
      ...infoCardHeader,
    },
    color: whiteColor,
  },
  primaryCardHeader: {
    '&:not($cardHeaderIcon)': {
      ...primaryCardHeader,
    },
    color: whiteColor,
  },
  roseCardHeader: {
    '&:not($cardHeaderIcon)': {
      ...roseCardHeader,
    },
    color: whiteColor,
  },
  successCardHeader: {
    '&:not($cardHeaderIcon)': {
      ...successCardHeader,
    },
    color: whiteColor,
  },
  warningCardHeader: {
    '&:not($cardHeaderIcon)': {
      ...warningCardHeader,
    },
    color: whiteColor,
  },
};

export default cardHeaderStyle;
