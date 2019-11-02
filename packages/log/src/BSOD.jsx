import React from 'react';
import { createPortal } from 'react-dom';
import { isArray, isObject, isFunction } from 'valid-types';
import { CRITICAL } from './errorHelpers';

const BSOD = props => {
    const actions = props.stackData.actions;
    let cError = actions[actions.length - 1][CRITICAL];

    return createPortal(
        <div style={{
            width: '100%',
            height: '100%',
            position: 'fixed',
            zIndex: '10000',
            background: '#00a',
            color: '#b3b3b3',
            fontSize: '14px',
            fontFamily: 'courier',
            top: 0,
            left: 0
        }}>
            <div style={{
                width: '100%',
                height: '100%',
                position: 'relative'
            }}>
                {isFunction(props.onClose) && <button onClick={props.onClose} style={{
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
                    zIndex: '1000'
                }}>
                    X
                </button>}
                {cError && <h2 style={{
                    display: 'inline-block',
                    padding: '0.25em 0.5em',
                    margin: '0 auto',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    background: '#b3b3b3',
                    color: '#00a',
                    fontFamily: 'courier'
                }}>{cError.stack[0] || cError.message || ''}</h2>}
                <div style={{
                    fontSize: '1rem',
                    textAlign: 'left',
                    margin: '2em'
                }}>
                    {cError && isArray(cError.stack) && <pre
                        style={{
                            margin: '0 0 10px',
                            font: '10px/13px Lucida Console, Monaco, monospace',
                            color: 'rgb(179, 179, 179)',
                            background: 'none',
                            border: 0
                        }}
                    >${cError.stack.join('\n')}</pre>}
                    <h4>Actions:</h4>
                    {
                        actions.length > 0 ?
                            <ol reversed style={{
                                listStyle: 'list-item',
                                fontSize: '13px'
                            }} start={props.count || actions.length - 1}>
                                {(() => {
                                    let listOfActions = actions
                                        .filter(action => {
                                            if (!isObject(action)) {
                                                return false;
                                            }

                                            let type = Object.keys(action)[0];

                                            if (!type) {
                                                return false;
                                            }

                                            return type !== CRITICAL;
                                        })
                                        .map(action => {
                                            if (!isObject(action)) {
                                                return false;
                                            }

                                            let type = Object.keys(action)[0];

                                            if (!type) {
                                                return false;
                                            }

                                            let actionMessage = action[type];

                                            return {
                                                actionMessage,
                                                type
                                            }
                                        })
                                        .filter(Boolean)
                                        .reverse();

                                    return listOfActions.map(({ actionMessage, type }, index) => {
                                        return <li key={index}>
                                            <p><strong>{type}: {actionMessage}</strong></p>
                                        </li>;
                                    });
                                })()}
                            </ol> :
                            <div>Nothing actions</div>
                    }
                </div>
            </div>
        </div>,
        document.body
    );
};

export default BSOD;
