"use strict";
exports.__esModule = true;
var react_1 = require("react");
exports.OpenIds = function (_a) {
    var children = _a.children, openIds = _a.openIds;
    var _b = react_1.useState(openIds), openIdsState = _b[0], setOpenIds = _b[1];
    return children(openIdsState, setOpenIds);
};
