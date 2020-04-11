import React, { isValidElement } from 'react';
const Footer = ({ footer }) => (isValidElement(footer) ? (React.createElement("div", { style: { padding: '0 20px 20px', textAlign: 'center' } }, footer)) : null);
export default Footer;
