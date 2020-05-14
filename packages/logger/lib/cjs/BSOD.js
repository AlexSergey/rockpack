"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var react_1 = __importDefault(require("react"));
var react_dom_1 = require("react-dom");
var valid_types_1 = require("valid-types");
var errorHelpers_1 = require("./errorHelpers");
var BSOD = function (props) {
    var actions = props.stackData.actions;
    var cError = actions[actions.length - 1][errorHelpers_1.getCritical()];
    return react_dom_1.createPortal(react_1["default"].createElement("div", { style: {
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
        react_1["default"].createElement("div", { style: {
                width: '100%',
                height: '100%',
                position: 'relative'
            } },
            valid_types_1.isFunction(props.onClose) && (react_1["default"].createElement("button", { type: "button", onClick: props.onClose, style: {
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
            cError && (react_1["default"].createElement("h2", { style: {
                    display: 'inline-block',
                    padding: '0.25em 0.5em',
                    margin: '0 auto',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    background: '#b3b3b3',
                    color: '#00a',
                    fontFamily: 'courier'
                } }, cError.stack[0] || cError.message || '')),
            react_1["default"].createElement("div", { style: {
                    fontSize: '1rem',
                    textAlign: 'left',
                    margin: '2em'
                } },
                cError && valid_types_1.isArray(cError.stack) && (react_1["default"].createElement("pre", { style: {
                        margin: '0 0 10px',
                        font: '10px/13px Lucida Console, Monaco, monospace',
                        color: 'rgb(179, 179, 179)',
                        background: 'none',
                        border: 0
                    } },
                    "$",
                    cError.stack.join('\n'))),
                react_1["default"].createElement("h4", null, "Actions:"),
                actions.length > 0 ? (react_1["default"].createElement("ol", { reversed: true, style: {
                        listStyle: 'list-item',
                        fontSize: '13px'
                    }, start: props.count || actions.length - 1 }, (function () {
                    var listOfActions = actions
                        .filter(function (action) {
                        if (!valid_types_1.isObject(action)) {
                            return false;
                        }
                        var type = Object.keys(action)[0];
                        if (!type) {
                            return false;
                        }
                        return !errorHelpers_1.isCritical(type);
                    })
                        .map(function (action) {
                        if (!valid_types_1.isObject(action)) {
                            return false;
                        }
                        var type = Object.keys(action)[0];
                        if (!type) {
                            return false;
                        }
                        var actionMessage = action[type];
                        return {
                            actionMessage: actionMessage,
                            type: type
                        };
                    })
                        .filter(Boolean)
                        .reverse();
                    return listOfActions.map(function (_a, index) {
                        var actionMessage = _a.actionMessage, type = _a.type;
                        return (
                        // eslint-disable-next-line react/no-array-index-key
                        react_1["default"].createElement("li", { key: index },
                            react_1["default"].createElement("p", null,
                                react_1["default"].createElement("strong", null,
                                    type,
                                    ": ",
                                    actionMessage))));
                    });
                })())) :
                    react_1["default"].createElement("div", null, "Nothing actions")))), document.body);
};
exports["default"] = BSOD;
