"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var react_1 = __importDefault(require("react"));
var react_router_1 = require("react-router");
var react_router_dom_1 = require("react-router-dom");
var TreeView_1 = __importDefault(require("@material-ui/lab/TreeView"));
var TreeItem_1 = __importDefault(require("@material-ui/lab/TreeItem"));
var ExpandMore_1 = __importDefault(require("@material-ui/icons/ExpandMore"));
var ChevronRight_1 = __importDefault(require("@material-ui/icons/ChevronRight"));
var core_1 = require("@material-ui/core");
var useStylesTreeView = core_1.makeStyles({
    root: {
        height: 216,
        flexGrow: 1,
        maxWidth: 400
    }
});
var setActive = function (currentUrl, pth, activeLang) { return (react_router_1.matchPath(currentUrl, {
    path: typeof activeLang === 'string' ? "/" + activeLang + pth : pth,
    exact: true,
    strict: false
}) ? 'active' : ''); };
var MenuItems = react_router_dom_1.withRouter(function (props) {
    var classesTreeView = useStylesTreeView();
    var goTo = function (url, name) {
        if (url) {
            props.history.push(typeof props.activeLang === 'string' ?
                "/" + props.activeLang + url :
                url);
        }
        setTimeout(function () {
            if (document && name) {
                document.location.hash = name;
            }
        });
        if (typeof props.handleDrawerToggle === 'function') {
            props.handleDrawerToggle();
        }
    };
    var TreeRender = function (data) {
        if (!data) {
            return null;
        }
        if (Array.isArray(data)) {
            return data.map(function (s) { return TreeRender(s); });
        }
        if (!data.title) {
            return null;
        }
        var W = data.url ? function (Inner, url) { return (react_1["default"].createElement("span", __assign({}, data.nodeId ? { id: data.nodeId } : {}, { className: setActive(document.location.pathname, url, props.activeLang), onClick: function (e) {
                e.preventDefault();
                e.stopPropagation();
                goTo(url, null);
            }, key: data.uniqId }), Inner)); } : function (Inner, hash, extraClassName) { return (react_1["default"].createElement("span", __assign({}, data.nodeId ? { id: data.nodeId } : {}, { className: "#" + hash === document.location.hash ? "active " + extraClassName : extraClassName, onClick: function (e) {
                e.preventDefault();
                e.stopPropagation();
                goTo(null, data.name);
            }, key: data.uniqId }), Inner)); };
        return (data.children ? W((react_1["default"].createElement(TreeItem_1["default"], { key: data.uniqId, nodeId: data.nodeId, label: data.title }, (Array.isArray(data.children) ?
            data.children :
            [data.children]).map(function (node) { return TreeRender(node); }))), data.url, '') : (data.url ?
            W(react_1["default"].createElement(TreeItem_1["default"], { key: data.uniqId, nodeId: data.nodeId, label: data.title }), data.url, '') :
            (typeof data.name === 'string' ?
                W((react_1["default"].createElement("div", { style: { padding: '0 0 0 10px' } },
                    react_1["default"].createElement("span", { style: { cursor: 'pointer' } }, data.title))), data.name, 'tree-hash-item') : (react_1["default"].createElement("div", { key: data.uniqId, style: { padding: '0 0 0 10px' } },
                react_1["default"].createElement("span", { style: { cursor: 'pointer' } }, data.title))))));
    };
    return (react_1["default"].createElement(TreeView_1["default"], { expanded: props.openIds, className: classesTreeView.root, defaultCollapseIcon: react_1["default"].createElement(ExpandMore_1["default"], null), defaultExpandIcon: react_1["default"].createElement(ChevronRight_1["default"], null), onNodeToggle: function (e, nodeIds) { return props.toggleOpenId(nodeIds); } }, TreeRender(props.docgen)));
});
exports["default"] = MenuItems;
