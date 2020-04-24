import './fonts.scss';

export const googleFontsInstall = (): string => (
  /*
  * font-family: 'Oswald', sans-serif;
  * font-weight: 300;
  * font-weight: 400;
  * font-weight: 500;
  * font-weight: 700;
  * */
  [
    '<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;700&display=swap" rel="stylesheet">',
    '<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">'
  ].join('')
);
