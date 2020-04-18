import { __awaiter } from "tslib";
import React from 'react';
import { renderToString } from 'react-dom/server';
import createUssr from './Ussr';
export const serverRender = ({ render }) => __awaiter(void 0, void 0, void 0, function* () {
    const [runEffects, UssrRunEffects] = createUssr({});
    renderToString(React.createElement(UssrRunEffects, null, render()));
    const state = yield runEffects();
    const [, Ussr] = createUssr(state);
    const html = renderToString(React.createElement(Ussr, null, render()));
    return {
        html,
        state
    };
});
