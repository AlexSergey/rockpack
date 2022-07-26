import React, { isValidElement } from 'react';

interface FooterInterface {
  footer: JSX.Element;
}

const Footer = ({ footer }: FooterInterface): JSX.Element =>
  isValidElement(footer) ? <div style={{ padding: '0 20px 20px', textAlign: 'center' }}>{footer}</div> : null;

export default Footer;
