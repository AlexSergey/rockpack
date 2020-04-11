"use strict";
exports.__esModule = true;
var react_1 = require("react");
var showMessage = function (field, type, required, message) {
    if (message) {
        return message;
    }
    if (required) {
        return field + " is required field";
    }
    return field + " field must be " + type;
};
var FIELDS = [
    { field: 'docgen', type: 'object', required: true },
    { field: 'localization', type: 'object', required: false },
    { field: 'logo', type: 'string', required: false },
    { field: 'logoAlt', type: 'string', required: false },
    { field: 'github', type: 'string', required: false },
    { field: 'footer', type: 'any', required: false },
    {
        field: 'components',
        type: 'object',
        required: false,
        message: 'components is a field with overriding react components to visualize in MDX files'
    },
];
var validate = function (props) {
    var isValid = true;
    FIELDS.forEach(function (f) {
        if (!isValid) {
            return false;
        }
        if (f.required) {
            if (!props[f.field]) {
                isValid = false;
                // eslint-disable-next-line no-console
                console.error(showMessage(f.field, f.type, f.required, f.message));
                return false;
            }
        }
        if (f.type !== 'any') {
            var type = typeof props[f.field];
            if (type !== 'undefined' && type !== f.type) {
                isValid = false;
                // eslint-disable-next-line no-console
                console.error(showMessage(f.field, f.type, f.required, f.message));
                return false;
            }
        }
        if (f.field === 'components') {
            if (props[f.field]) {
                var keys = Object.keys(props[f.field]);
                var validComponents = keys.map(function (c) {
                    var component = props[f.field][c];
                    return react_1.isValidElement(component);
                });
                if (keys.length !== validComponents.length) {
                    isValid = false;
                    // eslint-disable-next-line no-console
                    console.error(showMessage(f.field, f.type, f.required, f.message));
                    return false;
                }
            }
        }
    });
    return isValid;
};
exports["default"] = validate;
