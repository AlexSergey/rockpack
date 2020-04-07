import React from 'react';
import { createPortal } from 'react-dom';
import { isArray, isObject, isFunction } from 'valid-types';
import { isCritical, getCritical } from './errorHelpers';
const BSOD = props => {
    const actions = props.stackData.actions;
    const cError = actions[actions.length - 1][getCritical()];
    return createPortal(React.createElement("div", { style: {
            width: '100%',
            height: '100%',
            position: 'fixed',
            zIndex: 10000,
            background: '#00a',
            color: '#b3b3b3',
            fontSize: '14px',
            fontFamily: 'courier',
            top: 0,
            left: 0
        } },
        React.createElement("div", { style: {
                width: '100%',
                height: '100%',
                position: 'relative'
            } },
            isFunction(props.onClose) && (React.createElement("button", { type: "button", onClick: props.onClose, style: {
                    border: 0,
                    background: '#eee',
                    cursor: 'pointer',
                    width: '30px',
                    height: '30px',
                    textAlign: 'center',
                    WebkitAppearance: 'none',
                    position: 'absolute',
                    top: '25px',
                    right: '25px',
                    fontSize: '24px',
                    lineHeight: '25px',
                    zIndex: 1000
                } }, "X")),
            cError && (React.createElement("h2", { style: {
                    display: 'inline-block',
                    padding: '0.25em 0.5em',
                    margin: '0 auto',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    background: '#b3b3b3',
                    color: '#00a',
                    fontFamily: 'courier'
                } }, cError.stack[0] || cError.message || '')),
            React.createElement("div", { style: {
                    fontSize: '1rem',
                    textAlign: 'left',
                    margin: '2em'
                } },
                cError && isArray(cError.stack) && (React.createElement("pre", { style: {
                        margin: '0 0 10px',
                        font: '10px/13px Lucida Console, Monaco, monospace',
                        color: 'rgb(179, 179, 179)',
                        background: 'none',
                        border: 0
                    } },
                    "$",
                    cError.stack.join('\n'))),
                React.createElement("h4", null, "Actions:"),
                actions.length > 0 ? (React.createElement("ol", { reversed: true, style: {
                        listStyle: 'list-item',
                        fontSize: '13px'
                    }, start: props.count || actions.length - 1 }, (() => {
                    const listOfActions = actions
                        .filter(action => {
                        if (!isObject(action)) {
                            return false;
                        }
                        const type = Object.keys(action)[0];
                        if (!type) {
                            return false;
                        }
                        return !isCritical(type);
                    })
                        .map(action => {
                        if (!isObject(action)) {
                            return false;
                        }
                        const type = Object.keys(action)[0];
                        if (!type) {
                            return false;
                        }
                        const actionMessage = action[type];
                        return {
                            actionMessage,
                            type
                        };
                    })
                        .filter(Boolean)
                        .reverse();
                    return listOfActions.map(({ actionMessage, type }, index) => (React.createElement("li", { key: index },
                        React.createElement("p", null,
                            React.createElement("strong", null,
                                type,
                                ": ",
                                actionMessage)))));
                })())) :
                    React.createElement("div", null, "Nothing actions")))), document.body);
};
export default BSOD;
