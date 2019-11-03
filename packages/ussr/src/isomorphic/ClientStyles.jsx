import React from 'react';
import StyleContext from 'isomorphic-style-loader/StyleContext';

const insertCss = (...styles) => {
    const removeCss = styles.map(style => style._insertCss());
    return () => removeCss.forEach(dispose => dispose());
};

export default function ClientStyles({ children, isProduction = false }) {
    return isProduction ? children : <StyleContext.Provider value={{ insertCss }}>
        {children}
    </StyleContext.Provider>;
}
