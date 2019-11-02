import React from 'react';
import StyleContext from 'isomorphic-style-loader/StyleContext';
import isNotProduction from '../utils/isNotProduction';

const insertCss = (...styles) => {
    const removeCss = styles.map(style => style._insertCss());
    return () => removeCss.forEach(dispose => dispose());
};

export default function ClientStyles({ children }) {
    return isNotProduction() ? <StyleContext.Provider value={{ insertCss }}>
            {children}
        </StyleContext.Provider> :
        children;
}
