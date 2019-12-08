import React from 'react';
//@ts-ignore
import StyleContext from 'isomorphic-style-loader/StyleContext';

//@ts-ignore
const insertCss = (...styles) => {
    const removeCss = styles.map(style => style && typeof style._insertCss === 'function' && style._insertCss());
    return () => removeCss.forEach(dispose => typeof dispose === 'function' && dispose());
};

//@ts-ignore
export default function ClientStyles({ children }) {
//@ts-ignore
    return !!global.USSR_IN_PRODUCTION ? children : <StyleContext.Provider value={{ insertCss }}>
        {children}
    </StyleContext.Provider>;
}
