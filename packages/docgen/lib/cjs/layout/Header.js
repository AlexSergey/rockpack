"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var react_1 = __importStar(require("react"));
var Toolbar_1 = __importDefault(require("@material-ui/core/Toolbar"));
var Hidden_1 = __importDefault(require("@material-ui/core/Hidden"));
var IconButton_1 = __importDefault(require("@material-ui/core/IconButton"));
var AppBar_1 = __importDefault(require("@material-ui/core/AppBar/AppBar"));
var Menu_1 = __importDefault(require("@material-ui/icons/Menu"));
var GitHub_1 = __importDefault(require("@material-ui/icons/GitHub"));
var Select_1 = __importDefault(require("@material-ui/core/Select"));
var MenuItem_1 = __importDefault(require("@material-ui/core/MenuItem"));
var core_1 = require("@material-ui/core");
var classnames_1 = __importDefault(require("classnames"));
var headerStyle_1 = __importDefault(require("../assets/jss/material-dashboard-react/components/headerStyle"));
// @ts-ignore
var useStylesHeader = core_1.makeStyles(headerStyle_1["default"]);
var Header = function (props) {
    var _a;
    var classesHeader = useStylesHeader();
    var appBarClasses = classnames_1["default"]((_a = {},
        _a["" + classesHeader[props.color]] = props.color,
        _a));
    return (react_1["default"].createElement(AppBar_1["default"], { className: classesHeader.appBar + appBarClasses, style: { height: '75px' } },
        react_1["default"].createElement(Toolbar_1["default"], { className: classesHeader.container, style: { height: '100%' } },
            props.logo && (react_1["default"].createElement(Hidden_1["default"], { smDown: true, implementation: "css", 
                // @ts-ignore
                className: "wrapper-logo" },
                react_1["default"].createElement("div", { style: { height: '100%', padding: '0 20px 0' } }, typeof props.logo === 'string' && (react_1["default"].createElement("img", { src: props.logo, alt: typeof props.logoAlt || '', style: {
                        height: '100%',
                        width: 'auto',
                        maxWidth: '100px'
                    } }))))),
            react_1["default"].createElement("div", { className: classesHeader.flex }, props.title || 'Documentation'),
            props.isLocalized ? (react_1["default"].createElement("div", { style: { padding: '0 20px 0' } },
                react_1["default"].createElement(Select_1["default"], { labelId: "demo-simple-select-label", id: "demo-simple-select", value: props.activeLang, onChange: function (e) {
                        if (typeof e.target.value === 'string') {
                            props.changeLocal(e.target.value);
                        }
                    } }, Object.keys(props.localization)
                    .map(function (code) {
                    if (typeof props.localization[code] && react_1.isValidElement(props.localization[code].component)) {
                        return (react_1["default"].createElement(MenuItem_1["default"], { value: code, key: code }, props.localization[code].component));
                    }
                    return (react_1["default"].createElement(MenuItem_1["default"], { value: code, key: code }, code));
                })))) : null,
            props.github ? (react_1["default"].createElement("div", { style: { padding: '0 20px 0 0' } },
                react_1["default"].createElement("a", { href: props.github, target: "_blank", rel: "noopener noreferrer" },
                    react_1["default"].createElement(GitHub_1["default"], null)))) : null,
            react_1["default"].createElement(Hidden_1["default"], { mdUp: true, implementation: "css" },
                react_1["default"].createElement(IconButton_1["default"], { color: "inherit", "aria-label": "open drawer", onClick: props.handleDrawerToggle },
                    react_1["default"].createElement(Menu_1["default"], null))))));
};
exports["default"] = Header;
