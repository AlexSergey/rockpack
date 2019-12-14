import { isValidElement } from 'react';

const message = (field, type, required, message) => {
    if (message) {
        return message;
    }
    if (required) {
        return `${field} is required field`;
    }
    return `${field} field must be ${type}`;
};

const FIELDS = [
    { field: 'docgen', type: 'object', required: true },
    { field: 'localization', type: 'object', required: false },
    { field: 'logo', type: 'string', required: false },
    { field: 'logoAlt', type: 'string', required: false },
    { field: 'github', type: 'string', required: false },
    { field: 'footer', type: 'any', required: false },
    { field: 'components', type: 'object', required: false, message: 'components is a field with overriding react components to visualize in MDX files' },
];

const validate = (props) => {
    let isValid = true;

    FIELDS.forEach(f => {
        if (!isValid) {
            return false;
        }
        if (f.required) {
            if (!props[f.field]) {
                isValid = false;
                console.error(message(f.field, f.type, f.required, f.message));
                return false;
            }
        }
        if (f.type !== 'any') {
            if (typeof props[f.field] !== 'undefined' && typeof props[f.field] !== f.type) {
                isValid = false;
                console.error(message(f.field, f.type, f.required, f.message));
                return false;
            }
        }
        switch (f.field) {
            case 'components':
                if (props[f.field]) {
                    let keys = Object.keys(props[f.field]);
                    let validComponents = keys.map(c => {
                        let component = props[f.field][c];
                        return isValidElement(component);
                    });
                    if (keys.length !== validComponents.length) {
                        isValid = false;
                        console.error(message(f.field, f.type, f.required, f.message));
                        return false;
                    }
                }
                break;
        }
    });

    return isValid;
};

export default validate;
