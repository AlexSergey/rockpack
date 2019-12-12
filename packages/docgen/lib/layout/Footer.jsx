import React, { isValidElement } from 'react';

const Footer = (props) => {
    return isValidElement(props.footer) ? <div style={{padding: '0 20px 20px', textAlign: 'center'}}>
        {props.footer}
    </div> : null;
};

export default Footer;
