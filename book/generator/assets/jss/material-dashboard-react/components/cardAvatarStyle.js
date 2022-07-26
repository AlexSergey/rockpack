import { hexToRgb, blackColor } from '../../material-dashboard-react.js';

const cardAvatarStyle = {
  cardAvatar: {
    '&$cardAvatarProfile img': {
      height: 'auto',
      width: '100%',
    },
  },
  cardAvatarPlain: {},
  cardAvatarProfile: {
    '&$cardAvatarPlain': {
      marginTop: '0',
    },
    borderRadius: '50%',
    boxShadow: `0 16px 38px -12px rgba(${hexToRgb(blackColor)}, 0.56), 0 4px 25px 0px rgba(${hexToRgb(
      blackColor,
    )}, 0.12), 0 8px 10px -5px rgba(${hexToRgb(blackColor)}, 0.2)`,
    margin: '-50px auto 0',
    maxHeight: '130px',
    maxWidth: '130px',
    overflow: 'hidden',
    padding: '0',
  },
};

export default cardAvatarStyle;
